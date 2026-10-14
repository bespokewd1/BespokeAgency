// No account or deployed endpoint is used. The optional widget snapshot is public source.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
const base = process.env.IDENTITY_TEST_URL || "http://identity.test";
const layout = await readFile(new URL("../src/_includes/layouts/base.html", import.meta.url), "utf8");
const admin = await readFile(new URL("../src/admin/index.html", import.meta.url), "utf8");
const publicScripts = [...layout.matchAll(/<script\b([^>]*)>[\s\S]*?<\/script>/gi)]
  .filter(([, attributes]) => !/\btype=/i.test(attributes))
  .map(([tag]) => tag).join("\n");
const widget = process.env.IDENTITY_WIDGET_PATH ? await readFile(process.env.IDENTITY_WIDGET_PATH, "utf8") : null;
let checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; console.log(`PASS ${label}`); };

async function setup() {
  const context = await browser.newContext();
  const requests = [];
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    requests.push(url.href);
    if (url.href.startsWith("https://identity.netlify.com/")) {
      return route.fulfill({ contentType: "text/javascript", body: widget || "window.adminCallbackHash = location.hash;" });
    }
    if (url.origin === base && url.pathname.startsWith("/.netlify/identity/")) {
      return route.fulfill({ json: { external: {}, autoconfirm: false } });
    }
    if (url.origin === base && request.isNavigationRequest()) {
      if (process.env.IDENTITY_TEST_URL) return route.continue();
      return route.fulfill({ contentType: "text/html", body: url.pathname === "/admin/" ? admin : `<!doctype html><html><head>${publicScripts}</head><body><main id="contact">Contact</main></body></html>` });
    }
    // Third-party analytics, CMS and media never reach the network in these checks.
    return route.fulfill({ contentType: request.resourceType() === "script" ? "text/javascript" : "text/plain", body: "" });
  });
  // Observe the official widget's automatic callback dispatch, not live authentication.
  if (widget) await context.addInitScript(() => {
    window.identityDispatches = [];
    let identity;
    Object.defineProperty(window, "netlifyIdentity", {
      configurable: true,
      get: () => identity,
      set: (value) => {
        identity = value;
        const store = value.store;
        for (const name of ["verifyToken", "openModal", "completeExternalLogin"]) {
          store[name] = (...args) => window.identityDispatches.push({ name, args });
        }
      },
    });
  });
  return { context, page: await context.newPage(), requests };
}

try {
  for (const path of ["/", "/#contact", "/blog/#main", "/get-more-leads/#main"]) {
    const { context, page, requests } = await setup();
    await page.goto(base + path);
    check(!requests.some((url) => url.startsWith("https://identity.netlify.com/")), `${path} does not download Identity`);
    check(!new URL(page.url()).pathname.startsWith("/admin/"), `${path} stays public`);
    check(await page.evaluate(() => typeof window.gtag === "function"), `${path} keeps global gtag`);
    check(requests.some((url) => url.includes("googletagmanager.com/gtm.js")) && requests.some((url) => url.includes("googletagmanager.com/gtag/js")), `${path} keeps both existing tracking loaders`);
    await context.close();
  }

  const flows = [
    ["/", "#confirmation_token=synthetic-confirmation&next=%2Fblog%2F", "verifyToken", "confirmation"],
    ["/blog/", "#invite_token=synthetic-invite", "verifyToken", "invite"],
    ["/get-more-leads/", "#recovery_token=synthetic-recovery", "verifyToken", "recovery"],
    ["/", "#/email_change_token=synthetic-email-change", "verifyToken", "email_change"],
    ["/", "#access_token=synthetic-provider&refresh_token=synthetic-refresh&token_type=bearer&state=synthetic-state", "completeExternalLogin"],
    ["/", "#error=access_denied&error_description=403", "openModal", "signup"],
  ];
  for (const [path, hash, dispatchName, action] of flows) {
    const { context, page, requests } = await setup();
    await context.addInitScript(() => {
      if (location.pathname === "/admin/") window.adminCallbackHash = location.hash;
    });
    await page.goto(base + path + hash);
    await page.waitForURL((url) => url.pathname === "/admin/");
    check(await page.evaluate(() => window.adminCallbackHash) === hash, "admin receives the complete unchanged callback fragment");
    check(!requests.some((url) => url.includes("googletagmanager.com") || url.includes("google-analytics.com")), "callback navigation never requests public analytics");
    check(!requests.some((url) => url.includes("synthetic")), "synthetic fragment is absent from all resource request URLs");
    check(requests.some((url) => url.startsWith("https://identity.netlify.com/")), "admin retains its Identity dependency");
    check(requests.some((url) => url.startsWith("https://unpkg.com/decap-cms@")), "admin retains its Decap dependency");
    if (widget) {
      await page.waitForFunction((name) => window.identityDispatches.some((call) => call.name === name), dispatchName);
      check(await page.evaluate(({ dispatchName, action }) => window.identityDispatches.some((call) => call.name === dispatchName && (!action || call.args[0] === action)), { dispatchName, action }), "official widget automatically dispatches the expected callback branch");
    }
    await context.close();
  }
  console.log(`${checks} Identity browser checks passed. Callback dispatch is mocked before authentication.`);
} finally {
  await browser.close();
}
