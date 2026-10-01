# Chatbot contract

Task 3 specification, 2026-10-01. Tasks 4 and 5 implemented the endpoint and widget against this contract. Task 6's local answer, failure/security and regression checks pass, with physical-device and screen-reader limits recorded in the tracker. Hosted verification remains pending. Two earlier UI timeouts have not recurred and their cause remains unknown. These are finalized V1 implementation defaults, not additional user-approved business claims.

The assistant uses `netlify/ai/system-prompt.md` and the approved `netlify/ai/business-info.md`. This document is the shared backend/frontend contract. Do not send the content audit, repository pages or browser-supplied configuration to Gemini.

## Limits

| Item | V1 value |
| --- | --- |
| New message | 1 to 1,000 UTF-16 code units after trimming |
| History | Latest 6 completed user/assistant pairs, at most 12 entries |
| Each historical user message | 1 to 1,000 UTF-16 code units after trimming |
| Each historical assistant answer | 1 to 2,000 UTF-16 code units after trimming |
| Total history text | At most 12,000 UTF-16 code units, summed after trimming |
| Entire incoming JSON body | At most 32,768 UTF-8 bytes, including JSON syntax |
| Successful answer | 1 to 2,000 UTF-16 code units after trimming |
| Gemini output cap | `maxOutputTokens: 768`, one candidate |
| Provider deadline | 20,000 ms, including reading the response body |
| Browser request deadline | 25,000 ms |
| Concurrent requests | One per widget |
| Netlify rate limit | 5 requests per 60 seconds per IP and domain |
| Automatic retries | Zero, in both browser and function |

Use JavaScript string `.length` for text limits, including the input counter. UTF-8 body size is a separate limit. Enforce each limit independently. Six exchanges is a ceiling, not a promise to retain all six when their text or encoded body is too large.

The verified `gemini-3.5-flash-lite` project has screenshot quotas of 15 RPM, 250,000 TPM and 500 RPD. Five requests per minute gives one IP at most one third of the nominal RPM allowance before platform enforcement delay. Multiple visitors, domains and environments can still exhaust the shared quota. The text/history/output caps keep ordinary business chats short; they are not a token quota calculation or a daily quota reservation.

Netlify's code-based rule is implemented as `config.path: "/api/chat"` with `rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ["ip", "domain"] }`. Code-based rules are available on all plans. Enforcement can lag by up to 10 seconds. Do not add a per-instance in-memory counter as a substitute. A custom path disables the default function URL under current Netlify documentation; task 4 confirmed `/.netlify/functions/chat` returns 404 locally. Verify the deployed rule and route coverage again in task 7. The current account's rule allowance and existing usage remain to be checked.

## Request

Same-origin `POST /api/chat`, `Content-Type: application/json`, optionally with a UTF-8 charset parameter. No streaming or attachments.

```json
{
  "message": "What about for plumbers?",
  "history": [
    { "role": "user", "content": "Do you build websites?" },
    { "role": "assistant", "content": "Yes, Bespoke builds custom business websites." }
  ]
}
```

- Require a JSON object with exactly `message` and `history`. History is required and can be `[]`. Each entry has exactly `role` and `content`.
- Reject nulls, arrays in place of objects, non-string text, whitespace-only text, unknown keys and invalid roles. Do not coerce values. Only `user` and `assistant` roles are accepted.
- History must contain complete alternating pairs, starting with `user` and ending with `assistant`. Do not include the new message in history. Reject odd counts, consecutive same-role entries and all limit violations before any Gemini request.
- Bound actual body bytes while reading, before parsing. A Content-Length check alone is insufficient. Reject a declared oversized body early too. Accept only uncompressed JSON bodies; unsupported content encoding returns 415.
- The browser trims text, takes the newest completed pairs, then removes oldest whole pairs until count, total text and serialized UTF-8 body limits all fit. Never truncate a message. The function rejects oversized history rather than silently changing it.
- Welcome text, notices, errors, typing indicators and failed or pending exchanges are not history. Keep the failed message available for manual editing/resubmission. Add a pair only after a successful response.
- Browser-supplied assistant messages can be forged. Validation does not make them trusted instructions or verified business facts.
- Accept only same-origin browser requests. Reject a present mismatched Origin with 403 and send no permissive CORS headers. Permit an absent Origin for local endpoint checks. Origin checks are not authentication or an abuse quota.

## Provider request and result

Use a single server-side REST `generateContent` call to the fixed Google API host with `x-goog-api-key` authentication. Load `GEMINI_API_KEY` and `GEMINI_MODEL` only at runtime. Missing configuration produces a controlled unavailable response. Validate the configured model as a model ID before using it in the URL; the browser cannot select it.

Build `systemInstruction.parts` from the system prompt followed by the approved business knowledge, clearly labelled as approved business context. Build `contents` from validated history, mapping `assistant` to Gemini's `model` role, and append the new `user` message. Each content entry has one text part. Set `generationConfig.maxOutputTokens` to 768 and `candidateCount` to 1. Leave other sampling/thinking settings at provider defaults. The selected model's documented output limit is 65,536 tokens; six local task 4 answers completed with the 768-token application cap and default thinking settings. Do not disable safety filters.

Do not enable tools, search grounding, URL fetching, explicit caching, background tasks, paid fallback or automatic model changes. A documentation example using a newer model is not permission to replace the verified model. Changing the configured model requires another free-tier/access review.

Only return a non-empty textual candidate with `finishReason: "STOP"`. Ignore thought parts and do not expose thought signatures or provider metadata. Blocked prompts, blocked candidates, non-text tool responses, missing candidates and whitespace-only text produce `answer_unavailable`. Treat `MAX_TOKENS` or an answer over 2,000 characters as `answer_unavailable`; do not show a cut-off answer that may omit pricing conditions. Do not retry it automatically. If citation metadata requires attribution, fail closed with `answer_unavailable` until attribution rendering is implemented rather than silently discarding it.

Abort the provider request on its deadline, covering both fetch and body consumption. A client disconnect should abort upstream work where supported, but cancellation cannot guarantee that quota was not consumed. Never log request/response bodies, the prompt, credentials or raw provider errors. Operational diagnostics may include only a controlled error code, status and elapsed time.

## Success response

HTTP 200:

```json
{
  "ok": true,
  "answer": "Yes. Plumbing is one of Bespoke's main trades markets. [Contact Bespoke](/contact/) to discuss your website."
}
```

The function supplies the envelope; Gemini supplies only answer text. The widget validates the envelope and answer size, stops the typing indicator, renders the complete answer and stores the completed pair. A malformed 200 response is an unavailable response, never a successful empty message.

## Error response

Function-generated errors use this envelope, with `retryAfterSeconds` always a positive integer or null:

```json
{
  "ok": false,
  "error": {
    "code": "quota_unavailable",
    "message": "Bespoke AI has reached its usage limit. Please try later or contact Bespoke.",
    "retryAfterSeconds": null
  },
  "contactUrl": "/contact/"
}
```

| HTTP | Code | Visitor message |
| --- | --- | --- |
| 400 | `invalid_request` | Please send a question of up to 1,000 characters. If the problem continues, start a new conversation. |
| 403 | `forbidden` | Please use Bespoke AI on the Bespoke website. |
| 405 | `method_not_allowed` | Please send your question using the chat window. |
| 413 | `request_too_large` | This conversation is too long to send. Start a new conversation and try a shorter question. |
| 415 | `unsupported_media_type` | Please send your question using the chat window. |
| 429 | `rate_limited` | You're sending messages too quickly. Please wait a minute and try again, or contact Bespoke. |
| 503 | `quota_unavailable` | Bespoke AI has reached its usage limit. Please try later or contact Bespoke. |
| 503 | `service_unavailable` | Bespoke AI is unavailable right now. Please try later or contact Bespoke. |
| 504 | `timeout` | Bespoke AI took too long to respond. Please try again or contact Bespoke. |
| 502 | `answer_unavailable` | Bespoke AI couldn't provide an answer. Try a shorter service question or contact Bespoke. |

Validation failures in parsed text/history use 400; an oversized raw body uses 413. Set `Allow: POST` for 405. Missing configuration, upstream authentication/model errors, upstream 5xx, invalid provider JSON and unexpected internal failures all use the generic `service_unavailable` response. Map upstream 429 to `quota_unavailable`; do not pretend to distinguish a daily exhaustion from an RPM limit without reliable provider evidence or promise a reset time.

Use null retry timing except for `rate_limited`, which uses 60 seconds. If reliable provider Retry-After timing exists, the function may supply a sanitized whole number from 1 to 86,400 seconds for `quota_unavailable`. Never relay a raw provider message. A non-null value should also be sent as an integer `Retry-After` header. Retry timing controls when a manual attempt is allowed, not an automatic retry.

Netlify may return 429 before the function runs, with non-JSON or empty content. The widget must check HTTP status before assuming JSON. For every 429, show the local `rate_limited` wording and a 60-second send cooldown, or a valid Retry-After value capped at 86,400 seconds. For network errors, invalid envelopes and other non-JSON failures, show the local `service_unavailable` wording. Browser deadline expiry uses the local timeout wording. Never render raw HTML/error bodies. Always offer a locally defined [Contact Bespoke](/contact/) link with failures and keep a contact link available in the chat footer.

All function responses use `Cache-Control: no-store` and `Content-Type: application/json; charset=utf-8`. Do not return credentials, provider URLs, prompts, model configuration, stack traces or usage metadata. No shared response cache or deliberate server-side transcript storage.

## Formatting and link handling

Render user text as text only. Render assistant text as text nodes with preserved paragraph breaks. Hyphen bullets can remain plain text. The only parsed syntax is a simple, non-nested `[label](destination)` link. No HTML or full Markdown renderer, images, automatic bare-URL linking or `innerHTML`.

Use this exact destination allowlist in both response rendering and restored-history rendering:

```text
/contact/
/services/
/about/
/portfolio/
/blog/
/#services
/#portfolio
https://bespokewebdesign.ca
https://wa.me/17802638028
https://calendly.com/arjiv28/30min
mailto:bespokewd1@gmail.com
tel:+17802638028
```

Require exact destination string equality. Do not decode, normalize or accept extra query strings, protocol-relative URLs, fragments on other paths, arbitrary same-site paths or subdomains. Use text nodes for link labels and DOM APIs to create anchors. Disallowed or malformed links stay inert text. Links open in the same tab. This rule also applies to cached/restored model answers. Error contact links come from local code, not an unvalidated response field. Model instructions are not a substitute for safe rendering.

## Conversation state

Use session storage key `bespoke-chat-v1` with `{ "version": 1, "history": [...] }`. Persist only the bounded completed pairs using the same history and body-fit rules as requests. Read at most 32,768 UTF-8 bytes of stored JSON, validate its version/schema and each entry before use, and discard invalid state. Revalidate links when rendering. Catch all storage read/write/remove failures and continue with in-memory history.

The transcript shows only retained pairs. When pruning older pairs, show "Showing the most recent messages." Do not send this message to Gemini. Pending/error UI is transient and not stored. New conversation aborts the current browser request, advances a local request-generation ID, clears history/storage/errors and returns to the welcome. Ignore responses from an older generation even if abort arrives too late. Close hides the widget and restores trigger focus; it does not reset the conversation. Keep the widget closed after navigation or refresh until the visitor opens it.

## Visitor wording

- Trigger: `Ask Bespoke AI`
- Trigger supporting text: `Services, pricing & getting started`
- Header: `Bespoke AI`
- Identification: `AI assistant · Answers may be inaccurate.`
- Welcome: `Hi! I'm Bespoke's AI assistant. I can help with questions about websites, SEO, Google Business Profile and social media services. What would you like to know?`
- Input label: `Your question about Bespoke`
- Input placeholder: `Ask about Bespoke's services`
- Typing indicator: `Bespoke AI is replying...`
- Controls: `Send`, `Close`, `New conversation`

Starter buttons send these exact questions only when clicked:

1. What services do you offer?
2. How much does a website cost?
3. Do you work with trades businesses?
4. I need a website. Where do I start?

Following the user's design review on 2026-10-01, "About your messages" starts collapsed. Keep this short notice visible beside it before the first message can be sent:

> Chats go to Google Gemini and may be used for product improvement or human review. Don't share private information.

Keep the full notice below, its links and storage explanation accessible throughout the conversation inside that disclosure:

> Messages and recent chat history are sent to Google Gemini. Google may use chats to improve its products, and human reviewers may read them. Please don't share personal, sensitive or confidential information. Use our contact form for private enquiries.

Link "contact form" to `/contact/` with a local anchor. Link a local "Google data terms" label to `https://ai.google.dev/gemini-api/terms` beside the notice. That static disclosure link is separate from the model-answer allowlist.

Provide this short storage explanation in the same notice area:

> Recent messages are saved in this tab for follow-up questions. New conversation clears this tab's chat history, but does not delete data already sent to Google.

Do not promise deletion on tab close, no provider retention, confidentiality or exemption from product-improvement use. Browser session restoration can retain session storage. No Gemini request occurs on page load, opening, navigation, prerender or reset.

## Data-term review and public availability

Reviewed Google's official Gemini API Additional Terms on 2026-10-01. The retrieved terms have an effective date of March 23, 2026, and a page update of April 28, 2026.

- Unpaid-service inputs and outputs can be used to provide, improve and develop Google products and machine learning technologies. Human reviewers may read them. Google says not to submit sensitive, confidential or personal information. The notice and prompt above reflect this; they do not guarantee visitors will avoid such submissions.
- Paid-service data-use terms can also apply to unpaid quota for developers in the EEA, Switzerland or UK. The current Canadian business context does not establish the API account holder's location. The notice uses "may" and makes no stronger privacy promise.
- Separately, the terms require Paid Services when making API clients available to users in the EEA, Switzerland or UK. Since this project must stay free-tier-only, unrestricted worldwide public chat cannot be assumed permissible. Before any public preview, settle and implement supported-region access handling, including what happens when location is unknown. Keep the ordinary contact page available. A browser-only check is insufficient.
- The terms also say API clients must not be directed towards or likely to be accessed by under-18s, and clients must operate within supported regions. Review the intended business audience and public availability before release. An AI/data notice alone does not resolve those requirements.

The data-use review is complete for task 1B. Public availability handling remains an explicit task 7 prerequisite and needs a user decision before hosted exposure. Local prompt/contract/backend work can proceed. No account settings or provider requests were used for this review.

## Verification for implementation

Task 4 checks cover boundary sizes, whole-pair history validation, malformed/extra fields, provider timeouts, 429 mapping, blocked/empty/truncated results and no secret/raw-error exposure with mocked provider responses. Task 5 should test inert hostile HTML/URLs, non-JSON platform errors, storage validation and reset during a request. Task 6 should check the four starters, a plumbers follow-up, stale-price claims, cancellation/promotion conditions, unsupported services, unrelated questions and instruction-override attempts against real answers.

Task 4 evidence is in `docs/chatbot-local-setup.md`. All 38 offline checks passed, along with the site build, extracted-bundle resource check and live business/follow-up/pricing smoke checks. Prompt refinements from those answers restrict unsolicited pricing/promotion detail, reinforce Edmonton-only confirmed coverage and require explicit social-post totals in plan comparisons. No business knowledge values changed.

Task 5 added 7 passing widget unit/route checks and 44 passing mocked Chrome browser checks through Netlify Dev. These cover safe links in new/restored answers, request/storage bounds, non-JSON platform errors, corrupt/blocked storage, reset races, keyboard controls and mobile visual-viewport sizing. Production-output smoke and build/light-only checks also passed. Two real UI requests returned 504 at the existing 20-second backend deadline; task 6 must investigate/recheck live generation. Physical-device keyboard and screen-reader verification remain pending.

The subsequent 504 investigation verified direct full-context generation, the local endpoint and a real two-message widget conversation without changing implementation or configuration. Contact navigation and transcript restoration passed. The initial timeout cause remains unproven; details and timings are in the setup guide.

Task 6 verification on 2026-10-01: 38 backend, 8 widget and 58 mocked browser checks passed, alongside the production build/light-only check and 75 local endpoint/site assertions. Thirty real widget requests succeeded across the initial review and prompt rechecks. Prompt corrections reinforce plain formatting and contact referral for unknowns without asserting exclusion or discontinued offers. No request/response, storage or limit changes were needed. Generated-output and browser-traffic scans found no configured credential or server-only markers. See `chatbot-local-setup.md` for evidence and limitations.

## Documentation checked

- [Gemini generateContent reference](https://ai.google.dev/api/generate-content), including system instructions, conversation roles, generation limits and finish reasons. Context7 lookup completed; the direct reference supplied details the indexed results omitted.
- [Gemini API terms](https://ai.google.dev/gemini-api/terms), unpaid-service data use and availability restrictions.
- [Netlify rate limiting](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/), code-based config, plan availability, platform response and delayed enforcement.
- [Netlify function configuration](https://docs.netlify.com/build/functions/optional-configuration/), rechecked in task 4 for V2 routing, default URL removal and resource packaging, alongside Context7 results.
- [Gemini 3.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite), rechecked in task 4 for the exact model ID, output limit and supported capabilities.
