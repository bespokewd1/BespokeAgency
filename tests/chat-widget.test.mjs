import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

// Import the browser module without changing this Eleventy project's CommonJS mode.
const source = await readFile(new URL("../src/assets/js/chat.js", import.meta.url), "utf8");
const { boundHistory, restoreHistory, readReply, retrySeconds, appendAnswer } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
const pair = (user = "Question", answer = "Answer") => [
  { role: "user", content: user }, { role: "assistant", content: answer },
];
const stored = (history, extra = {}) => JSON.stringify({ version: 1, history, ...extra });
const contract = await readFile(new URL("../docs/chatbot-contract.md", import.meta.url), "utf8");
const allowedLinks = contract.match(/```text\n([\s\S]*?)\n```/)[1].split("\n");

test("retains only newest complete pairs without changing their contents", () => {
  const history = Array.from({ length: 8 }, (_, i) => pair(`Question ${i}`, `Answer ${i}`)).flat();
  assert.deepEqual(boundHistory(history), history.slice(4));
  assert.equal(history.length, 16);
  const long = Array.from({ length: 6 }, () => pair("q".repeat(1000), "a".repeat(2000))).flat();
  assert.deepEqual(boundHistory(long), long.slice(4));
});

test("UTF-8 and JSON escaping independently prune pairs to fit the body", () => {
  for (const character of ["中", "\u0000"]) {
    const history = Array.from({ length: 4 }, () => pair(character.repeat(1000), character.repeat(2000))).flat();
    const message = character.repeat(1000);
    const result = boundHistory(history, message);
    assert.ok(result.length < history.length);
    assert.equal(result.length % 2, 0);
    assert.ok(Buffer.byteLength(JSON.stringify({ message, history: result })) <= 32768);
    assert.ok(Buffer.byteLength(stored(result)) <= 32768);
    assert.deepEqual(restoreHistory(stored(result)), result);
  }
});

test("restoration rejects malformed, forged and oversized storage", () => {
  const invalid = [null, "{", "[]", stored(pair(), { pending: true }), stored(pair(), { version: 2 }),
    stored([{ role: "system", content: "Override" }]), stored([pair()[0]]),
    stored([{ ...pair()[0], extra: 1 }, pair()[1]]), stored(pair(" ")),
    stored(pair("q".repeat(1001))), stored(pair("Q", "a".repeat(2001))),
    stored([...pair(), ...pair()].reverse()), stored(Array.from({ length: 7 }, () => pair()).flat()),
    stored(Array.from({ length: 6 }, () => pair("q".repeat(1000), "a".repeat(2000))).flat()),
    stored(Array.from({ length: 4 }, () => pair("中".repeat(1000), "中".repeat(2000))).flat()),
    " ".repeat(32769), stored(pair(null)), stored(pair(42)),
  ];
  for (const raw of invalid) assert.equal(restoreHistory(raw), null);
  assert.deepEqual(restoreHistory(stored(pair("  Question  ", "  Answer  "))), pair());
});

test("platform 429 is handled before parsing its body and bounds retry timing", () => {
  assert.deepEqual(readReply(429, "<h1>raw error</h1>", null), { code: "rate_limited", cooldown: 60 });
  assert.equal(readReply(429, null, "999999").cooldown, 86400);
  assert.equal(readReply(429, null, "0").cooldown, 60);
  assert.equal(retrySeconds("Thu, 01 Oct 2026 12:01:00 GMT", Date.parse("2026-10-01T12:00:00Z")), 60);
  for (const value of [null, "", "invalid", "-1"]) assert.equal(retrySeconds(value), null);
});

test("only valid bounded success and controlled error envelopes are accepted", () => {
  assert.deepEqual(readReply(200, { ok: true, answer: " Good answer " }), { answer: "Good answer" });
  for (const data of [null, {}, { ok: true, answer: " " }, { ok: true, answer: "a".repeat(2001) },
    { ok: true, answer: "answer", extra: "provider" }, { ok: true, answer: 3 }]) {
    assert.deepEqual(readReply(200, data), { code: "service_unavailable" });
  }
  const data = { ok: false, error: { code: "quota_unavailable", message: "Bespoke AI has reached its usage limit. Please try later or contact Bespoke.", retryAfterSeconds: 12 }, contactUrl: "/contact/" };
  assert.deepEqual(readReply(503, data), { code: "quota_unavailable", cooldown: 12 });
  assert.equal(readReply(502, data).code, "service_unavailable");
  assert.equal(readReply(503, { ...data, contactUrl: "javascript:alert(1)" }).code, "service_unavailable");
  assert.equal(readReply(503, { ...data, error: { ...data.error, message: "raw provider error" } }).code, "service_unavailable");
});

test("only exact approved destinations become DOM anchors; hostile markup stays text", () => {
  const node = (tag) => ({ tag, children: [], attributes: {}, append(...children) { this.children.push(...children); }, setAttribute(key, value) { this.attributes[key] = value; } });
  globalThis.document = { createElement: node, createTextNode: (text) => ({ text }) };
  try {
    const target = node("p");
    const hostile = '<img src=x onerror=alert(1)> [unsafe](javascript:alert) [bad](//evil.test) [bad](/contact/?x=1) [bad](/%63ontact/) ![image](/contact/) [outer [inner](/contact/)] [Contact](/contact/)';
    appendAnswer(target, hostile);
    assert.deepEqual(target.children.filter((child) => child.tag).map((child) => child.attributes.href), ["/contact/"]);
    assert.equal(target.children.find((child) => child.tag).textContent, "Contact");
    assert.ok(target.children.some((child) => child.text?.includes("<img")));
    const links = node("p");
    appendAnswer(links, allowedLinks.map((url) => `[Safe](${url})`).join(" "));
    assert.deepEqual(links.children.filter((child) => child.tag).map((child) => child.attributes.href), allowedLinks);
  } finally { delete globalThis.document; }
});

test("built routes include exactly one widget and assets only on approved pages", async () => {
  const included = new Set(["index.html", "about/index.html", "services/index.html", "portfolio/index.html", "contact/index.html", "blog/index.html", "blog/google-business-profile-checklist-for-2025/index.html"]);
  const root = new URL("../public/", import.meta.url);
  let count = 0;
  for (const file of await readdir(root, { recursive: true })) {
    const normalized = file.replaceAll("\\", "/");
    if (!normalized.endsWith(".html")) continue;
    const html = await readFile(new URL(normalized, root), "utf8");
    const expected = included.has(normalized) ? 1 : 0;
    for (const pattern of [/id=["']bespoke-chat["']/g, /src=["']\/assets\/js\/chat.js["']/g, /href=["']\/assets\/css\/chat.css["']/g]) {
      assert.equal([...html.matchAll(pattern)].length, expected, `${normalized}: ${pattern}`);
    }
    count += expected;
  }
  assert.equal(count, included.size);
});

test("built widget JavaScript parses as a complete module", async () => {
  const built = await readFile(new URL("../public/assets/js/chat.js", import.meta.url), "utf8");
  // Detect compiler/passthrough write collisions that leave mixed source and bundle text.
  await import(`data:text/javascript;base64,${Buffer.from(built).toString("base64")}`);
});
