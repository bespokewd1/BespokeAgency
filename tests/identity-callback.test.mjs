import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const layout = await readFile(new URL("../src/_includes/layouts/base.html", import.meta.url), "utf8");
const scripts = [...layout.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([, attributes]) => !/\bsrc=|\btype=/i.test(attributes))
  .map(([, , code]) => code);

function visit(hash) {
  const downloads = [];
  const replacements = [];
  const document = {
    createElement: () => ({}),
    head: { appendChild: (script) => downloads.push(script.src) },
    getElementsByTagName: () => [{ parentNode: { insertBefore: (script) => downloads.push(script.src) } }],
  };
  const window = { location: { hash, replace: (url) => replacements.push(url) } };
  window.window = window;
  window.document = document;
  const context = vm.createContext(window);
  for (const code of scripts) vm.runInContext(code, context);
  window.gtag = context.gtag;
  return { window, downloads, replacements };
}

const callbacks = [
  "#confirmation_token=synthetic-confirmation",
  "#invite_token=synthetic-invite&next=%2Fadmin%2F",
  "#recovery_token=synthetic-recovery",
  "#/email_change_token=synthetic-email-change",
  "#state=synthetic-state&access_token=synthetic-provider&refresh_token=synthetic-refresh&token_type=bearer",
  "#access_token=synthetic%2Bprovider%3D&state=%7B%22auth_type%22%3A%22implicit%22%7D",
  "#error=access_denied&error_description=403",
];

test("ordinary public visits and anchors keep tracking but never load Identity", () => {
  for (const hash of ["", "#contact", "#about", "#services", "#main", "#invite_token", "#invite_token=", "#not_invite_token=anchor", "#token=anchor", "#error=unrelated"]) {
    const result = visit(hash);
    assert.deepEqual(result.replacements, [], hash);
    assert.equal(result.window.netlifyIdentityCallback, false, hash);
    assert.equal(result.downloads.length, 2, hash);
    assert.ok(result.downloads.every((url) => url.startsWith("https://www.googletagmanager.com/")), hash);
    assert.equal(typeof result.window.gtag, "function", hash);
    result.window.gtag("event", "lead_audit_form_start", { funnel_name: "free_lead_generation_audit" });
    assert.equal(result.window.dataLayer.at(-1)[1], "lead_audit_form_start", hash);
  }
});

test("supported callbacks replace the current visit with admin and the unchanged complete fragment", () => {
  for (const hash of callbacks) {
    const result = visit(hash);
    assert.deepEqual(result.replacements, ["/admin/" + hash]);
    assert.equal(result.window.netlifyIdentityCallback, true);
    assert.deepEqual(result.downloads, [], "callbacks must not start public tracking");
    assert.equal(result.window.dataLayer.length, 0, "callbacks must not enqueue a public page view");
    assert.equal(result.window.location.hash, hash, "only admin's widget may consume the fragment");
  }
});

test("Identity stays in the existing admin document rather than the public layout", async () => {
  const admin = await readFile(new URL("../src/admin/index.html", import.meta.url), "utf8");
  const config = await readFile(new URL("../src/admin/config.yml", import.meta.url), "utf8");
  assert.ok(!layout.includes("https://identity.netlify.com/v1/netlify-identity-widget.js"));
  assert.ok(admin.includes("https://identity.netlify.com/v1/netlify-identity-widget.js"));
  assert.ok(admin.includes("https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"));
  assert.match(config, /name:\s*git-gateway/);
  assert.match(config, /folder:\s*["']?src\/content\/blog/);
  assert.match(config, /src\/_data\/digital_card\.json/);
});
