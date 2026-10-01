import { readFile } from "node:fs/promises";

const MAX_BODY_BYTES = 32_768;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_ANSWER_LENGTH = 2_000;
const MAX_HISTORY_ENTRIES = 12;
const MAX_HISTORY_LENGTH = 12_000;
const PROVIDER_TIMEOUT_MS = 20_000;

const ERRORS = {
    invalid_request: [400, "Please send a question of up to 1,000 characters. If the problem continues, start a new conversation."],
    forbidden: [403, "Please use Bespoke AI on the Bespoke website."],
    method_not_allowed: [405, "Please send your question using the chat window."],
    request_too_large: [413, "This conversation is too long to send. Start a new conversation and try a shorter question."],
    unsupported_media_type: [415, "Please send your question using the chat window."],
    quota_unavailable: [503, "Bespoke AI has reached its usage limit. Please try later or contact Bespoke."],
    service_unavailable: [503, "Bespoke AI is unavailable right now. Please try later or contact Bespoke."],
    timeout: [504, "Bespoke AI took too long to respond. Please try again or contact Bespoke."],
    answer_unavailable: [502, "Bespoke AI couldn't provide an answer. Try a shorter service question or contact Bespoke."],
};

class ChatError extends Error {
    constructor(code, retryAfterSeconds = null) {
        super(code);
        this.code = code;
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            ...extraHeaders,
        },
    });
}

function errorResponse(error) {
    const code = error instanceof ChatError ? error.code : "service_unavailable";
    const [status, message] = ERRORS[code];
    const retryAfterSeconds = error instanceof ChatError ? error.retryAfterSeconds : null;
    const headers = {};
    if (code === "method_not_allowed") headers.Allow = "POST";
    if (retryAfterSeconds !== null) headers["Retry-After"] = String(retryAfterSeconds);

    return jsonResponse({
        ok: false,
        error: { code, message, retryAfterSeconds },
        contactUrl: "/contact/",
    }, status, headers);
}

function hasExactKeys(value, keys) {
    return value !== null && typeof value === "object" && !Array.isArray(value)
        && Object.keys(value).length === keys.length
        && keys.every((key) => Object.hasOwn(value, key));
}

function validateText(value, maxLength) {
    if (typeof value !== "string") throw new ChatError("invalid_request");
    const text = value.trim();
    if (!text || text.length > maxLength) throw new ChatError("invalid_request");
    return text;
}

function validatePayload(payload) {
    if (!hasExactKeys(payload, ["message", "history"]) || !Array.isArray(payload.history)
        || payload.history.length > MAX_HISTORY_ENTRIES || payload.history.length % 2 !== 0) {
        throw new ChatError("invalid_request");
    }

    const message = validateText(payload.message, MAX_MESSAGE_LENGTH);
    let totalLength = 0;
    const history = payload.history.map((entry, index) => {
        const role = index % 2 === 0 ? "user" : "assistant";
        if (!hasExactKeys(entry, ["role", "content"]) || entry.role !== role) {
            throw new ChatError("invalid_request");
        }
        const content = validateText(entry.content, role === "user" ? MAX_MESSAGE_LENGTH : MAX_ANSWER_LENGTH);
        totalLength += content.length;
        return { role, content };
    });
    if (totalLength > MAX_HISTORY_LENGTH) throw new ChatError("invalid_request");
    return { message, history };
}

async function readPayload(request) {
    const contentLength = request.headers.get("content-length");
    if (contentLength !== null && /^\d+$/.test(contentLength) && Number(contentLength) > MAX_BODY_BYTES) {
        throw new ChatError("request_too_large");
    }
    if (!request.body) throw new ChatError("invalid_request");

    const reader = request.body.getReader();
    const chunks = [];
    let byteLength = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            byteLength += value.byteLength;
            if (byteLength > MAX_BODY_BYTES) {
                // Do not wait on a sender that keeps its stream open after rejection.
                void reader.cancel().catch(() => {});
                throw new ChatError("request_too_large");
            }
            chunks.push(value);
        }
    } catch (error) {
        if (error instanceof ChatError) throw error;
        throw new ChatError("invalid_request");
    } finally {
        reader.releaseLock();
    }

    try {
        const bytes = Buffer.concat(chunks, byteLength);
        return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    } catch {
        throw new ChatError("invalid_request");
    }
}

async function readInstructions() {
    // Netlify inlines this module into functions/chat.mjs. Resolve from that
    // directory's parent, which also works from this source module in ai/.
    const [prompt, knowledge] = await Promise.all([
        readFile(new URL("../ai/system-prompt.md", import.meta.url), "utf8"),
        readFile(new URL("../ai/business-info.md", import.meta.url), "utf8"),
    ]);
    if (!prompt.trim() || !knowledge.trim()) throw new ChatError("service_unavailable");
    return [{ text: prompt }, { text: `Approved business context:\n\n${knowledge}` }];
}

function retryAfterSeconds(value) {
    // Only delta-seconds are forwarded. Unknown timing stays null.
    if (value === null || !/^\d+$/.test(value)) return null;
    const seconds = Number(value);
    return Number.isSafeInteger(seconds) && seconds >= 1 && seconds <= 86_400 ? seconds : null;
}

function extractAnswer(result) {
    const candidate = result?.candidates?.[0];
    if (result?.promptFeedback?.blockReason || !candidate || candidate.finishReason !== "STOP"
        || candidate.safetyRatings?.some((rating) => rating.blocked)
        || candidate.citationMetadata?.citationSources?.length
        || !Array.isArray(candidate.content?.parts)) {
        throw new ChatError("answer_unavailable");
    }

    const parts = candidate.content.parts;
    if (parts.some((part) => !part || typeof part !== "object"
        || Object.keys(part).some((key) => !["text", "thought", "thoughtSignature"].includes(key))
        || typeof part.text !== "string")) {
        throw new ChatError("answer_unavailable");
    }
    const answer = parts.filter((part) => part.thought !== true).map((part) => part.text).join("").trim();
    if (!answer || answer.length > MAX_ANSWER_LENGTH) throw new ChatError("answer_unavailable");
    return answer;
}

async function generateAnswer({ request, payload, apiKey, model, instructions, fetchImpl, timeoutMs }) {
    const controller = new AbortController();
    let timedOut = false;
    const onDisconnect = () => controller.abort();
    request.signal.addEventListener("abort", onDisconnect, { once: true });
    const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, timeoutMs);

    let onAbort;
    const aborted = new Promise((resolve, reject) => {
        onAbort = () => reject(new ChatError(timedOut ? "timeout" : "service_unavailable"));
        controller.signal.addEventListener("abort", onAbort, { once: true });
    });

    try {
        if (request.signal.aborted) throw new ChatError("service_unavailable");
        const operation = async () => {
            const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
                redirect: "error",
                signal: controller.signal,
                body: JSON.stringify({
                    systemInstruction: { parts: instructions },
                    contents: [
                        ...payload.history.map(({ role, content }) => ({
                            role: role === "assistant" ? "model" : "user",
                            parts: [{ text: content }],
                        })),
                        { role: "user", parts: [{ text: payload.message }] },
                    ],
                    generationConfig: { maxOutputTokens: 768, candidateCount: 1 },
                }),
            });
            if (!response.ok) {
                void response.body?.cancel().catch(() => {});
                if (response.status === 429) {
                    throw new ChatError("quota_unavailable", retryAfterSeconds(response.headers.get("retry-after")));
                }
                throw new ChatError("service_unavailable");
            }
            const result = await response.json();
            return extractAnswer(result);
        };
        return await Promise.race([operation(), aborted]);
    } catch (error) {
        if (timedOut) throw new ChatError("timeout");
        throw error;
    } finally {
        clearTimeout(timer);
        request.signal.removeEventListener("abort", onDisconnect);
        controller.signal.removeEventListener("abort", onAbort);
    }
}

// Dependencies are injectable for offline tests, never from a visitor's request.
export function createChatHandler({
    fetchImpl = globalThis.fetch,
    getEnvironment = () => process.env,
    loadInstructions = readInstructions,
    timeoutMs = PROVIDER_TIMEOUT_MS,
} = {}) {
    return async function chat(request) {
        try {
            if (request.method !== "POST") throw new ChatError("method_not_allowed");
            const origin = request.headers.get("origin");
            if (origin !== null && origin !== new URL(request.url).origin) throw new ChatError("forbidden");

            const contentType = request.headers.get("content-type") ?? "";
            const encoding = request.headers.get("content-encoding");
            if (!/^application\/json(?:\s*;\s*charset\s*=\s*(?:utf-8|"utf-8"))?\s*$/i.test(contentType)
                || (encoding !== null && encoding.toLowerCase() !== "identity")) {
                throw new ChatError("unsupported_media_type");
            }

            const payload = validatePayload(await readPayload(request));
            const environment = getEnvironment();
            const apiKey = environment.GEMINI_API_KEY?.trim();
            const model = environment.GEMINI_MODEL?.trim();
            if (!apiKey || !model || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(model)) {
                throw new ChatError("service_unavailable");
            }
            if (request.signal.aborted) throw new ChatError("service_unavailable");
            const instructions = await loadInstructions();
            const answer = await generateAnswer({ request, payload, apiKey, model, instructions, fetchImpl, timeoutMs });
            return jsonResponse({ ok: true, answer });
        } catch (error) {
            // Never log or relay raw errors: upstream messages may contain credentials or chat text.
            return errorResponse(error);
        }
    };
}
