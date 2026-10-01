const STORAGE_KEY = "bespoke-chat-v1";
const MAX_BYTES = 32768;
const encoder = new TextEncoder();
const LINKS = new Set([
  "/contact/", "/services/", "/about/", "/portfolio/", "/blog/",
  "/#services", "/#portfolio", "https://bespokewebdesign.ca",
  "https://wa.me/17802638028", "https://calendly.com/arjiv28/30min",
  "mailto:bespokewd1@gmail.com", "tel:+17802638028",
]);
const ERRORS = {
  invalid_request: [400, "Please send a question of up to 1,000 characters. If the problem continues, start a new conversation."],
  forbidden: [403, "Please use Bespoke AI on the Bespoke website."],
  method_not_allowed: [405, "Please send your question using the chat window."],
  request_too_large: [413, "This conversation is too long to send. Start a new conversation and try a shorter question."],
  unsupported_media_type: [415, "Please send your question using the chat window."],
  rate_limited: [429, "You're sending messages too quickly. Please wait a minute and try again, or contact Bespoke."],
  quota_unavailable: [503, "Bespoke AI has reached its usage limit. Please try later or contact Bespoke."],
  service_unavailable: [503, "Bespoke AI is unavailable right now. Please try later or contact Bespoke."],
  timeout: [504, "Bespoke AI took too long to respond. Please try again or contact Bespoke."],
  answer_unavailable: [502, "Bespoke AI couldn't provide an answer. Try a shorter service question or contact Bespoke."],
};
const bytes = (value) => encoder.encode(JSON.stringify(value)).length;
const exactKeys = (value, keys) => value && typeof value === "object" && !Array.isArray(value)
  && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));

export function boundHistory(history, message = "") {
  const kept = history.slice(-12);
  while (kept.length && (kept.reduce((sum, entry) => sum + entry.content.length, 0) > 12000
    || bytes({ message, history: kept }) > MAX_BYTES
    || bytes({ version: 1, history: kept }) > MAX_BYTES)) kept.splice(0, 2);
  return kept;
}

export function restoreHistory(raw) {
  try {
    if (typeof raw !== "string" || raw.length > MAX_BYTES || encoder.encode(raw).length > MAX_BYTES) return null;
    const data = JSON.parse(raw);
    if (!exactKeys(data, ["version", "history"]) || data.version !== 1
      || !Array.isArray(data.history) || data.history.length > 12 || data.history.length % 2) return null;
    const history = data.history;
    for (let i = 0; i < history.length; i++) {
      const entry = history[i];
      if (!exactKeys(entry, ["role", "content"]) || entry.role !== (i % 2 ? "assistant" : "user")
        || typeof entry.content !== "string") return null;
      entry.content = entry.content.trim();
      if (!entry.content || entry.content.length > (i % 2 ? 2000 : 1000)) return null;
    }
    return boundHistory(history).length === history.length ? history : null;
  } catch { return null; }
}

export function appendAnswer(element, text) {
  // Parse only standalone, non-nested links. Everything else remains text.
  const pattern = /!?\[[^\[\]\n]*\]\([^()\s]*\)/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const token = match[0];
    const parts = /^\[([^\[\]\n]+)\]\(([^()\s]+)\)$/.exec(token);
    element.append(document.createTextNode(text.slice(cursor, match.index)));
    const before = text.slice(0, match.index);
    const nested = before.lastIndexOf("[") > before.lastIndexOf("]");
    if (parts && !nested && LINKS.has(parts[2])) {
      const link = document.createElement("a");
      link.textContent = parts[1];
      link.setAttribute("href", parts[2]);
      element.append(link);
    } else element.append(document.createTextNode(token));
    cursor = match.index + token.length;
  }
  element.append(document.createTextNode(text.slice(cursor)));
}

export function retrySeconds(value, now = Date.now()) {
  if (typeof value !== "string" || !value.trim()) return null;
  const seconds = /^\d+$/.test(value) ? Number(value) : Math.ceil((Date.parse(value) - now) / 1000);
  return Number.isFinite(seconds) && seconds > 0 ? Math.min(Math.ceil(seconds), 86400) : null;
}

export function readReply(status, data, retryAfter) {
  if (status === 429) return { code: "rate_limited", cooldown: retrySeconds(retryAfter) || 60 };
  if (status === 200 && exactKeys(data, ["ok", "answer"]) && data.ok === true
    && typeof data.answer === "string" && data.answer.trim().length > 0 && data.answer.trim().length <= 2000) {
    return { answer: data.answer.trim() };
  }
  if (exactKeys(data, ["ok", "error", "contactUrl"]) && data.ok === false && data.contactUrl === "/contact/"
    && exactKeys(data.error, ["code", "message", "retryAfterSeconds"])) {
    const { code, message, retryAfterSeconds: seconds } = data.error;
    if (Object.hasOwn(ERRORS, code) && ERRORS[code][0] === status && message === ERRORS[code][1]
      && (seconds === null || (Number.isInteger(seconds) && seconds > 0 && seconds <= 86400))) {
      return { code, cooldown: code === "quota_unavailable" ? seconds : null };
    }
  }
  return { code: "service_unavailable" };
}

export function initChat(root) {
  const find = (selector) => root.querySelector(selector);
  const panel = find("#chat-panel");
  if (typeof panel.showModal !== "function") return;
  const trigger = find(".chat-trigger");
  const input = find("textarea");
  const send = find(".chat-send");
  const starters = find(".chat-starters");
  const messages = find(".chat-messages");
  const scroll = find(".chat-scroll");
  const error = find(".chat-error");
  const typing = find(".chat-typing");
  const announcement = find(".chat-announcement");
  let history = [];
  let pending = null;
  let generation = 0;
  let pruned = false;
  let cooldownUntil = 0;
  let cooldownTimer;
  // Once storage fails, use memory for the remainder of this page's lifetime.
  let storage;
  try {
    storage = window.sessionStorage;
    const raw = storage.getItem(STORAGE_KEY);
    const restored = restoreHistory(raw);
    history = restored || [];
    if (raw !== null && !restored) storage.removeItem(STORAGE_KEY);
  } catch { storage = null; }

  function persist(remove = false) {
    try {
      if (remove) storage?.removeItem(STORAGE_KEY);
      else storage?.setItem(STORAGE_KEY, JSON.stringify({ version: 1, history }));
    } catch {
      try { storage?.removeItem(STORAGE_KEY); } catch { /* Memory remains usable. */ }
      storage = null;
    }
  }

  function controls() {
    const seconds = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
    send.disabled = !!pending || seconds > 0 || !input.value.trim() || input.value.trim().length > 1000;
    input.readOnly = !!pending;
    starters.querySelectorAll("button").forEach((button) => { button.disabled = !!pending || seconds > 0; });
    find("#chat-count").textContent = `${input.value.length} / 1,000`;
    find(".chat-cooldown").hidden = !seconds;
    find(".chat-cooldown").textContent = seconds ? `You can send another question in ${seconds} seconds.` : "";
    if (!seconds) clearInterval(cooldownTimer);
  }

  function message(entry) {
    const item = document.createElement("div");
    item.className = `chat-message chat-message-${entry.role}`;
    item.setAttribute("role", "listitem");
    const label = document.createElement("span");
    label.className = "chat-message-label";
    label.textContent = entry.role === "user" ? "You" : "Bespoke AI";
    const text = document.createElement("p");
    text.className = "chat-message-text";
    if (entry.role === "assistant") appendAnswer(text, entry.content);
    else text.textContent = entry.content;
    item.append(label, text);
    messages.append(item);
  }

  function render() {
    messages.replaceChildren();
    history.forEach(message);
    if (pending) message({ role: "user", content: pending.message });
    typing.hidden = !pending;
    starters.hidden = history.length > 0 || !!pending;
    find(".chat-pruned").hidden = !pruned;
    controls();
  }

  function showError(code) {
    error.hidden = false;
    error.querySelector("p").textContent = ERRORS[code][1];
    announcement.textContent = ERRORS[code][1];
  }

  async function submit(question) {
    const text = question.trim();
    if (pending || Date.now() < cooldownUntil || document.prerendering) return;
    if (!text || text.length > 1000) { showError("invalid_request"); return; }
    input.value = text;
    const kept = boundHistory(history, text);
    pruned ||= kept.length < history.length;
    history = kept;
    persist();
    const request = { id: ++generation, message: text, controller: new AbortController() };
    pending = request;
    error.hidden = true;
    announcement.textContent = "Bespoke AI is replying...";
    render();
    scroll.scrollTop = scroll.scrollHeight;
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; request.controller.abort(); }, 25000);
    try {
      const response = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }), signal: request.controller.signal,
        credentials: "same-origin", cache: "no-store",
      });
      // Platform 429 responses need not be JSON. Never display raw response bodies.
      const data = response.status === 429 ? null : await response.json().catch(() => null);
      if (request.id !== generation) return;
      if (timedOut) { showError("timeout"); return; }
      const reply = readReply(response.status, data, response.headers.get("Retry-After"));
      if (reply.answer) {
        const completed = [...history, { role: "user", content: text }, { role: "assistant", content: reply.answer }];
        history = boundHistory(completed);
        pruned ||= history.length < completed.length;
        persist();
        input.value = "";
        announcement.textContent = `Bespoke AI: ${reply.answer}`;
      } else {
        showError(reply.code);
        if (reply.cooldown) {
          cooldownUntil = Date.now() + reply.cooldown * 1000;
          clearInterval(cooldownTimer);
          cooldownTimer = setInterval(controls, 1000);
        }
      }
    } catch {
      if (request.id === generation) showError(timedOut ? "timeout" : "service_unavailable");
    } finally {
      clearTimeout(timer);
      if (request.id === generation) {
        pending = null;
        render();
        scroll.scrollTop = scroll.scrollHeight;
      }
    }
  }

  function viewport() {
    const view = window.visualViewport;
    if (!view) return;
    root.style.setProperty("--chat-viewport-height", `${view.height}px`);
    root.style.setProperty("--chat-viewport-bottom", `${Math.max(0, window.innerHeight - view.height - view.offsetTop) + 12}px`);
  }

  function close() {
    panel.close();
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener("click", () => {
    viewport();
    panel.showModal();
    trigger.setAttribute("aria-expanded", "true");
    // Read the disclosure first, without opening the mobile keyboard.
    find("#chat-title").focus({ preventScroll: true });
  });
  find(".chat-close").addEventListener("click", close);
  panel.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
  panel.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...panel.querySelectorAll('button:not(:disabled), a[href], textarea, summary, [tabindex="0"]')]
      .filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === find("#chat-title"))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  find(".chat-reset").addEventListener("click", () => {
    ++generation;
    pending?.controller.abort();
    pending = null;
    history = [];
    pruned = false;
    input.value = "";
    error.hidden = true;
    persist(true);
    render();
    scroll.scrollTop = 0;
    announcement.textContent = "New conversation started.";
    input.focus({ preventScroll: true });
  });
  find(".chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    submit(input.value);
    input.focus({ preventScroll: true });
  });
  input.addEventListener("input", controls);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
      event.preventDefault();
      submit(input.value);
    }
  });
  starters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => { submit(button.textContent); input.focus({ preventScroll: true }); });
  });
  window.visualViewport?.addEventListener("resize", viewport);
  window.visualViewport?.addEventListener("scroll", viewport);
  window.addEventListener("pagehide", () => {
    ++generation;
    pending?.controller.abort();
    pending = null;
    panel.close();
    trigger.setAttribute("aria-expanded", "false");
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    try { if (storage) history = restoreHistory(storage.getItem(STORAGE_KEY)) || []; }
    catch { storage = null; }
    error.hidden = true;
    input.value = "";
    render();
  });
  render();
  root.hidden = false;
}

if (typeof document !== "undefined") {
  const root = document.querySelector("#bespoke-chat");
  if (root) initChat(root);
}
