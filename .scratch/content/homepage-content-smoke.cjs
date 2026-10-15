const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_PATH);
const publicRoot = path.resolve("public");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
const server = http.createServer(async (request, response) => {
  try {
    const requested = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const filename = path.join(publicRoot, requested.endsWith("/") ? requested + "index.html" : requested);
    const body = await fs.readFile(filename);
    response.writeHead(200, { "Content-Type": types[path.extname(filename)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});
(async () => {
  let browser;
  const results = [];
  try {
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
    for (const width of [360, 390, 768, 1024, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      await context.route("**/*", (route) => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
      const page = await context.newPage();
      const errors = [];
      const missing = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => { if (response.status() >= 400) missing.push(response.url()); });
      await page.goto(base, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const main = document.querySelector(".bcm-page");
        const overflowing = [...main.querySelectorAll(".bcm-btn, .bcm-price-flag, .bcm-svc-cta, .bcm-faq-list summary")].filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 2;
        }).map((element) => element.textContent.trim());
        const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
        const missingAnchors = [...main.querySelectorAll('a[href^="#"]')].map((element) => element.getAttribute("href").slice(1)).filter((id) => !document.getElementById(id));
        const booking = [...document.querySelectorAll('a[href*="calendly.com"]')].map((element) => element.href);
        return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, overflowing, missingAnchors,
          duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index), booking,
          h1Count: document.querySelectorAll("h1").length, faqCount: document.querySelectorAll(".bcm-faq-list details").length,
          canonical: document.querySelector('link[rel="canonical"]').href,
          robots: document.querySelector('meta[name="robots"]')?.content || "",
          structuredDataCount: document.querySelectorAll('script[type="application/ld+json"]').length,
          brokenImages: [...main.querySelectorAll("img")].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
          email: document.querySelector('#contact a[href^="mailto:"]')?.href };
      });
      assert.equal(layout.h1Count, 1);
      assert.equal(layout.faqCount, 6);
      assert.equal(layout.canonical, "https://bespokewebdesign.ca/");
      assert.ok(!layout.robots.includes("noindex"));
      assert.ok(layout.documentWidth <= width + 1, JSON.stringify(layout));
      assert.deepEqual(layout.overflowing, [], JSON.stringify(layout));
      assert.deepEqual(layout.missingAnchors, []);
      assert.deepEqual(layout.duplicateIds, []);
      assert.deepEqual(layout.brokenImages, []);
      assert.equal(layout.email, "mailto:bespokewd1@gmail.com");
      assert.ok(layout.booking.length >= 8);
      assert.ok(layout.booking.every((url) => url === "https://calendly.com/arjiv28/30min"));
      const firstQuestion = page.locator(".bcm-faq-list summary").first();
      await firstQuestion.focus();
      await page.keyboard.press("Enter");
      assert.equal(await page.locator(".bcm-faq-list details").first().evaluate((element) => element.open), true);
      await page.keyboard.press("Enter");
      assert.equal(await page.locator(".bcm-faq-list details").first().evaluate((element) => element.open), false);
      await page.locator('.bcm-hero-cta a[href="#pricing"]').click();
      const pricingTop = await page.locator("#pricing").evaluate((element) => element.getBoundingClientRect().top);
      const headerBottom = await page.locator(".bcm-masthead").evaluate((element) => element.getBoundingClientRect().bottom);
      assert.ok(pricingTop >= headerBottom - 2, `Pricing hidden by header at ${width}: ${pricingTop}/${headerBottom}`);
      assert.deepEqual(errors, []);
      assert.deepEqual(missing, []);
      results.push({ ...layout, keyboardFaq: "passed", pricingAnchor: "passed", pageErrors: errors, missingResources: missing });
      console.log(`PASS homepage layout, links, FAQ keyboard and pricing anchor at ${width}px`);
      await context.close();
    }
    await fs.writeFile(".scratch/content/homepage-content-browser-results.json", JSON.stringify(results, null, 2));
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
