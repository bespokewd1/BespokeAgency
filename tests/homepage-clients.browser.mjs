// Optional browser checks. Serves BUILD_DIR, or checks HOME_TEST_URL if provided.
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
let base = process.env.HOME_TEST_URL;
let server;
if (!base) {
  const buildRoot = path.resolve(process.env.BUILD_DIR || fileURLToPath(new URL("../public/", import.meta.url)));
  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".avif": "image/avif" };
  server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      const file = path.resolve(buildRoot, `.${pathname}`, pathname.endsWith("/") ? "index.html" : "");
      const relative = path.relative(buildRoot, file);
      if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Outside build directory");
      const body = await readFile(file);
      response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
}
const screenshots = process.env.CLIENT_SCREENSHOTS;
if (screenshots) await mkdir(screenshots, { recursive: true });
let checks = 0;
function check(condition, label) {
  assert.ok(condition, label);
  checks++;
  console.log(`PASS ${label}`);
}

try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    await context.route("**/*", (route) => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // The live header already overflows by 6px at 320px. Check the changed sections,
    // not that unrelated header, so this suite does not hide a new component overflow.
    const overflow = await page.locator(".bcm-seo-media, .bcm-svc-grid, .bcm-portfolio-grid, .bcm-logo-ticker").evaluateAll((elements) => elements
      .filter((element) => {
        const box = element.getBoundingClientRect();
        return box.left < -1 || box.right > innerWidth + 1;
      })
      .map((element) => element.className));
    check(overflow.length === 0, `${width}px: changed sections fit the viewport ${JSON.stringify(overflow)}`);

    const sections = {
      overview: page.locator(".bcm-seo-media"),
      service: page.locator(".bcm-svc-card").filter({ has: page.locator("#service-search") }),
      portfolio: page.locator(".bcm-portfolio-card-ironfist"),
      carousel: page.locator(".bcm-logo-ticker"),
    };
    for (const [name, section] of Object.entries(sections)) {
      await section.scrollIntoViewIfNeeded();
      // Offscreen carousel copies intentionally stay lazy when reduced motion is on.
      const loaded = await section.locator("img").evaluateAll(async (images) => {
        const visible = images.filter((image) => {
          const box = image.getBoundingClientRect();
          let left = Math.max(0, box.left);
          let right = Math.min(innerWidth, box.right);
          let top = Math.max(0, box.top);
          let bottom = Math.min(innerHeight, box.bottom);
          for (let parent = image.parentElement; parent; parent = parent.parentElement) {
            const clip = parent.getBoundingClientRect();
            const style = getComputedStyle(parent);
            if (["hidden", "clip", "scroll", "auto"].includes(style.overflowX)) {
              left = Math.max(left, clip.left);
              right = Math.min(right, clip.right);
            }
            if (["hidden", "clip", "scroll", "auto"].includes(style.overflowY)) {
              top = Math.max(top, clip.top);
              bottom = Math.min(bottom, clip.bottom);
            }
          }
          return right - left > 1 && bottom - top > 1;
        });
        await Promise.all(visible.map((image) => new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error(`Visible image did not decode: ${image.getAttribute("src")}, complete=${image.complete}, currentSrc=${image.currentSrc}`)), 10000);
          image.decode().then(() => { clearTimeout(timer); resolve(); }, (error) => { clearTimeout(timer); reject(error); });
        })));
        return visible.length > 0 && visible.every((image) => image.complete && image.naturalWidth > 0);
      });
      check(loaded, `${width}px: ${name} visible images load`);
      if (screenshots) await section.screenshot({ path: path.join(screenshots, `${width}-${name}.png`), animations: "disabled" });
    }

    const link = page.getByRole("link", { name: "View website for Iron Fist Transport, opens in a new tab" });
    await link.scrollIntoViewIfNeeded();
    await link.focus();
    check(await link.isVisible(), `${width}px: live-site link is visible`);
    check(await link.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
      return hit && element.contains(hit);
    }), `${width}px: link is not covered by a gradient or caption`);
    check(await link.evaluate((element) => document.activeElement === element && getComputedStyle(element).outlineStyle !== "none"), `${width}px: keyboard focus is visible`);
    const rows = await page.locator(".bcm-logo-row").evaluateAll((elements) => elements.map((element) => ({
      width: element.getBoundingClientRect().width,
      images: [...element.querySelectorAll("img")].map((image) => image.getAttribute("src")),
    })));
    check(rows.length === 2 && rows[0].width === rows[1].width && JSON.stringify(rows[0].images) === JSON.stringify(rows[1].images), `${width}px: carousel repeats identical rows`);
    check(await page.locator(".bcm-logo-track").evaluate((element) => getComputedStyle(element).animationName === "none"), `${width}px: reduced motion disables the carousel`);
    if (screenshots) await sections.portfolio.screenshot({ path: path.join(screenshots, `${width}-portfolio-focused.png`), animations: "disabled" });
    await context.close();
  }
  const motionContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  await motionContext.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return url.origin === new URL(base).origin && !url.pathname.startsWith("/assets/videos/") ? route.continue() : route.abort();
  });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(base, { waitUntil: "networkidle" });
  const seam = await motionPage.locator(".bcm-logo-track").evaluate((track) => {
    const animation = track.getAnimations()[0];
    if (!animation) return null;
    animation.pause();
    animation.currentTime = 0;
    const start = track.children[0].getBoundingClientRect().left;
    animation.currentTime = animation.effect.getTiming().duration - 0.001;
    return Math.abs(track.children[1].getBoundingClientRect().left - start);
  });
  check(seam !== null, "normal motion enables the carousel animation");
  check(seam < 0.1, "the second carousel row meets the first without a visible seam");
  await motionContext.close();
  console.log(`${checks} homepage client browser checks passed.`);
} finally {
  await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
}
