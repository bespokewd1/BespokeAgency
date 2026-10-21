// Local artwork export only. No site build, dev server or network assets needed.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "scripts/artwork/home-og.html");
const output = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, "src/assets/images/og/home-og-v2.jpg");
const width = 1200;
const height = 630;
const quality = 94;
const maxBytes = 250_000;

assert.ok(process.argv.length <= 3, "Usage: node scripts/generate-home-og.mjs [output.jpg]");
assert.match(output, /\.jpe?g$/i, "The output must use a .jpg or .jpeg extension.");

let chromium;
try {
  ({ chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright"));
} catch (error) {
  throw new Error("Set PLAYWRIGHT_PATH to an external Playwright installation. See scripts/artwork/README.md.", { cause: error });
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
try {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  await context.route(/^https?:\/\//, (route) => route.abort());
  const page = await context.newPage();
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("requestfailed", (request) => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
  await page.goto(pathToFileURL(source).href, { waitUntil: "load" });

  const artwork = await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
    const text = (selector) => document.querySelector(selector).textContent.replace(/\s+/g, " ").trim();
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      fonts: [...document.fonts].map((font) => ({ family: font.family, status: font.status })),
      copy: {
        headline: text("h1"),
        support: text(".support"),
        price: text(".price"),
        brand: text(".brand-name"),
        domain: text(".domain"),
      },
      bounds: [...document.querySelectorAll("[data-safe], .headline-line")].map((element) => {
        const { left, top, right, bottom } = element.getBoundingClientRect();
        return { text: element.textContent.trim(), left, top, right, bottom };
      }),
    };
  });

  assert.deepEqual(failures, [], "Artwork assets must load without errors.");
  assert.equal(artwork.width, width, "Artwork must fit the 1200px canvas.");
  assert.equal(artwork.height, height, "Artwork must fit the 630px canvas.");
  assert.equal(artwork.fonts.length, 3, "Expected the local Work Sans and Poppins font faces.");
  assert.ok(artwork.fonts.every((font) => font.status === "loaded"), "All local fonts must load before export.");
  assert.deepEqual(artwork.copy, {
    headline: "Websites & marketing for Edmonton trades.",
    support: "Custom websites and social media management.",
    price: "Plans from $245/month",
    brand: "Bespoke Web Design",
    domain: "bespokewebdesign.ca",
  }, "Keep the artwork copy aligned with the approved homepage wording.");
  for (const bounds of artwork.bounds) {
    assert.ok(bounds.left >= 40 && bounds.top >= 40 && bounds.right <= width - 40 && bounds.bottom <= height - 28,
      `Text or branding leaves the safe area: ${JSON.stringify(bounds)}`);
  }

  const jpeg = await page.screenshot({ type: "jpeg", quality, fullPage: false });
  assert.equal(jpeg.readUInt16BE(0), 0xffd8, "Export must be a JPEG.");
  assert.ok(jpeg.length < maxBytes, `JPEG is ${jpeg.length} bytes. Keep it below ${maxBytes} bytes.`);
  const dimensions = await page.evaluate(async (dataUrl) => {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  }, `data:image/jpeg;base64,${jpeg.toString("base64")}`);
  assert.deepEqual(dimensions, { width, height }, "JPEG must be exactly 1200 x 630 pixels.");

  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, jpeg);
  console.log(`${path.relative(root, output)}: ${width} x ${height} JPEG, ${jpeg.length} bytes, quality ${quality}`);
} finally {
  await browser.close();
}
