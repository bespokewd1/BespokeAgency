// Run after a production Eleventy build. BUILD_DIR can point at an isolated build.
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.resolve(process.env.BUILD_DIR || path.join(root, "public"));
const home = await readFile(path.join(publicRoot, "index.html"), "utf8");
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
const imageTags = (html) => [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => tag);

test("Iron Fist replaces the three homepage website mockups, not the MPC branding", () => {
  const images = imageTags(home);
  assert.equal(images.filter((tag) => attribute(tag, "src") === "/assets/images/mockup-ironfist-laptop-only.webp").length, 1);
  const paired = images.filter((tag) => attribute(tag, "src") === "/assets/images/mockup-ironfist-webp-1000.webp");
  assert.equal(paired.length, 2, "service and portfolio use the paired mockup");
  for (const tag of paired) {
    assert.equal(attribute(tag, "srcset"), "/assets/images/mockup-ironfist-webp-500.webp 500w, /assets/images/mockup-ironfist-webp-1000.webp 1000w");
    assert.match(attribute(tag, "alt"), /Iron Fist Transport/);
    assert.equal(attribute(tag, "loading"), "lazy");
    assert.equal(attribute(tag, "width"), "1000");
    assert.equal(attribute(tag, "height"), "1000");
  }
  assert.doesNotMatch(home, /mockup-mpc/);
  assert.equal(images.filter((tag) => attribute(tag, "src") === "/assets/images/mpc-logo-with-bg.webp").length, 1);
});

test("both carousel rows retain MPC and include the same Iron Fist logo", () => {
  const rows = [...home.matchAll(/<div\b([^>]*\bclass="bcm-logo-row"[^>]*)>([\s\S]*?)<\/div>/g)];
  assert.equal(rows.length, 2);
  const sources = rows.map(([, , body]) => imageTags(body).map((tag) => attribute(tag, "src")));
  assert.deepEqual(sources[0], sources[1], "the repeated rows must have identical logo ordering");
  assert.equal(sources[0].length, 5);
  assert.ok(sources[0].includes("/assets/images/client-logos/mpc-ticker-webp.webp"));
  assert.ok(sources[0].includes("/assets/images/client-logos/ironfist-ticker-webp.webp"));
  assert.equal(attribute(rows[1][1], "aria-hidden"), "true");
  for (const tag of imageTags(rows[1][2])) assert.equal(attribute(tag, "alt"), "");
  const ironFist = imageTags(rows[0][2]).find((tag) => attribute(tag, "src").includes("ironfist"));
  assert.equal(attribute(ironFist, "alt"), "Iron Fist Transport");
});

test("only the Iron Fist portfolio entry gets an accessible live-site link", () => {
  const portfolio = home.match(/<section\b[^>]*\bid="portfolio"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(portfolio);
  const links = [...portfolio.matchAll(/<a\b[^>]*>/g)].map(([tag]) => tag);
  assert.equal(links.length, 1);
  assert.equal(attribute(links[0], "href"), "https://ironfisttransport.ca/");
  assert.equal(attribute(links[0], "target"), "_blank");
  assert.equal(attribute(links[0], "rel"), "noopener noreferrer");
  assert.match(attribute(links[0], "aria-label"), /Iron Fist Transport.*new tab/);
  assert.ok(attribute(links[0], "aria-label").includes("View website"), "the accessible name contains the visible link label");
  assert.match(portfolio, /Transport &(?:amp;)? logistics website/);
});

test("the audit page keeps its existing MPC small logo", async () => {
  const audit = await readFile(path.join(publicRoot, "get-more-leads", "index.html"), "utf8");
  assert.match(audit, /src="\/assets\/images\/client-logos\/mpc\.avif"/);
});

test("generated client assets have accurate dimensions, transparency and small payloads", async () => {
  const assets = [
    ["mockup-ironfist-webp-1000.webp", 1000, 1000, 150_000],
    ["mockup-ironfist-webp-500.webp", 500, 500, 60_000],
    ["mockup-ironfist-laptop-only.webp", 699, 414, 80_000],
    ["client-logos/ironfist-ticker-webp.webp", 320, 103, 10_000],
  ];
  for (const [name, width, height, maxBytes] of assets) {
    const file = path.join(publicRoot, "assets", "images", name);
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.format, "webp", name);
    assert.equal(metadata.width, width, name);
    assert.equal(metadata.height, height, name);
    assert.equal(metadata.hasAlpha, true, `${name}: keep transparent backgrounds`);
    assert.ok((await stat(file)).size < maxBytes, `${name}: avoid oversized published images`);
  }
});

test("the paired devices stay within the service card's central 16:9 crop", async () => {
  const file = path.join(publicRoot, "assets", "images", "mockup-ironfist-webp-1000.webp");
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const firstSafeRow = Math.floor((info.height - info.width * 9 / 16) / 2);
  const lastSafeRow = info.height - firstSafeRow;
  for (let row = 0; row < info.height; row++) {
    if (row >= firstSafeRow && row < lastSafeRow) continue;
    for (let column = 0; column < info.width; column++) {
      assert.equal(data[(row * info.width + column) * info.channels + 3], 0,
        `device content at row ${row} would be cropped by the service card`);
    }
  }
});
