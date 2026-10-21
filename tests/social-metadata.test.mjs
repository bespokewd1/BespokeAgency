// Run against production output. BUILD_DIR can point to an isolated build instead of public/.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const buildRoot = resolve(process.env.BUILD_DIR || fileURLToPath(new URL("../public/", import.meta.url)));
const domain = "https://bespokewebdesign.ca";
const built = (file) => readFile(join(buildRoot, file), "utf8");
const articleFiles = (await readdir(join(buildRoot, "blog"), { recursive: true }))
  .map((file) => file.replaceAll("\\", "/"))
  .filter((file) => file.endsWith("/index.html"));

function decode(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (entity, name) => {
    if (name.toLowerCase().startsWith("#x")) return String.fromCodePoint(parseInt(name.slice(2), 16));
    if (name.startsWith("#")) return String.fromCodePoint(Number(name.slice(1)));
    return { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" }[name.toLowerCase()] || entity;
  });
}

function attribute(tag, name) {
  const value = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i"))?.[2];
  return value === undefined ? undefined : decode(value);
}

function pageMetadata(html) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, "generated page has a head");
  const tags = [...head.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => tag);
  const values = (name, kind = name.startsWith("og:") ? "property" : "name") => tags
    .filter((tag) => attribute(tag, kind)?.toLowerCase() === name)
    .map((tag) => attribute(tag, "content"));
  const one = (name) => {
    const matches = values(name);
    assert.equal(matches.length, 1, `${name}: exactly one authoritative value`);
    assert.ok(matches[0]?.trim(), `${name}: content is not empty`);
    return matches[0];
  };
  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  assert.equal(titles.length, 1, "exactly one page title");
  return { head, tags, values, one, title: decode(titles[0][1]) };
}

function absoluteHttpUrl(value, label) {
  const url = new URL(value);
  assert.ok(["http:", "https:"].includes(url.protocol), `${label}: absolute HTTP(S) URL`);
  assert.ok(url.hostname, `${label}: hostname is present`);
  assert.ok(!/^\/https?:\/\//i.test(url.pathname), `${label}: no double-prefixed domain`);
  return url;
}

function sharedMetadata(html, route) {
  const metadata = pageMetadata(html);
  const { one, values, tags } = metadata;
  one("description");
  assert.equal(one("og:site_name"), "Bespoke Web Design");
  assert.equal(one("og:type"), "website");
  assert.equal(one("og:url"), domain + route);
  assert.equal(one("twitter:card"), "summary_large_image");
  assert.equal(one("twitter:title"), one("og:title"));
  assert.equal(one("twitter:description"), one("og:description"));

  const image = one("og:image");
  absoluteHttpUrl(image, `${route}: og:image`);
  assert.equal(one("og:image:secure_url"), image);
  assert.equal(one("twitter:image"), image);
  const rootImageIndex = tags.findIndex((tag) => attribute(tag, "property") === "og:image");
  for (const name of ["og:image:secure_url", "og:image:width", "og:image:height", "og:image:type", "og:image:alt"]) {
    assert.ok(values(name).length <= 1, `${route}: no duplicate ${name}`);
    if (values(name).length) {
      assert.ok(tags.findIndex((tag) => attribute(tag, "property") === name) > rootImageIndex,
        `${route}: ${name} follows its root image`);
    }
  }
  if (values("og:image:alt").length) {
    assert.equal(one("twitter:image:alt"), one("og:image:alt"));
  } else {
    assert.deepEqual(values("twitter:image:alt"), [], `${route}: no invented image alt`);
  }
  return metadata;
}

function jpegDimensions(buffer) {
  assert.equal(buffer.readUInt16BE(0), 0xffd8, "homepage social image contains JPEG bytes");
  const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset < buffer.length) {
    assert.equal(buffer[offset], 0xff, "valid JPEG marker");
    while (buffer[offset] === 0xff) offset++;
    const marker = buffer[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = buffer.readUInt16BE(offset);
    assert.ok(length >= 2 && offset + length <= buffer.length, "valid JPEG segment length");
    if (frameMarkers.has(marker)) {
      return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  assert.fail("homepage JPEG includes a frame with real pixel dimensions");
}

test("homepage keeps concise search and social descriptions with one shared preview", async () => {
  const { one, title } = sharedMetadata(await built("index.html"), "/");
  assert.ok(one("description").length <= 160, "homepage search description is at most 160 characters");
  assert.ok(one("og:description").length <= 125, "homepage social description is at most 125 characters");
  assert.notEqual(one("og:description"), one("description"), "homepage keeps its short social override");
  assert.equal(one("og:title"), title, "homepage social title falls back to its page title");
});

test("homepage advertises the refreshed JPEG's real dimensions and image details", async () => {
  const { one } = sharedMetadata(await built("index.html"), "/");
  const image = one("og:image");
  assert.equal(image, `${domain}/assets/images/og/home-og-v2.jpg`);
  assert.equal(one("og:image:type"), "image/jpeg");
  assert.equal(one("og:image:width"), "1200");
  assert.equal(one("og:image:height"), "630");
  assert.match(one("og:image:alt"), /Bespoke/i);
  const bytes = await readFile(join(buildRoot, decodeURIComponent(new URL(image).pathname).replace(/^\/+/, "")));
  assert.deepEqual(jpegDimensions(bytes), { width: 1200, height: 630 });
});

test("audit funnel retains its approved search copy and custom social preview", async () => {
  const { one, title } = sharedMetadata(await built("get-more-leads/index.html"), "/get-more-leads/");
  assert.equal(title, "Get More Leads | Free Lead Generation Audit | Bespoke Web Design");
  assert.equal(one("description"), "Discover how your website, Google presence and online marketing can generate more calls, inquiries and customers. Get a free lead generation audit from Bespoke Web Design.");
  assert.equal(one("og:title"), "Are You Losing Leads Online?");
  assert.equal(one("og:description"), "Get a FREE Marketing & Lead Generation Audit. See what's working, what's not, and where you're missing opportunities. FREE • NO OBLIGATION.");
  assert.equal(one("og:image"), `${domain}/assets/images/og/lead-generation-audit-og.webp`, "absolute frontmatter URL is not prefixed again");
  assert.equal(one("og:image:width"), "1200");
  assert.equal(one("og:image:height"), "630");
  assert.equal(one("og:image:type"), "image/webp");
  assert.equal(one("og:image:alt"), "Are You Losing Leads Online? Free Marketing and Lead Generation Audit from Bespoke Web Design.");
});

test("blog articles share metadata without duplicate titles or invented image dimensions", async () => {
  assert.ok(articleFiles.length > 0, "existing blog articles are generated");
  for (const file of articleFiles) {
    const route = `/blog/${file.slice(0, -"index.html".length)}`;
    const html = await built(`blog/${file}`);
    const { one, values, title } = sharedMetadata(html, route);
    assert.equal(one("og:title"), title, `${route}: article title is preserved`);
    assert.equal(one("og:description"), one("description"), `${route}: article description is preserved`);
    const articleImage = html.match(/<picture\b[^>]*class=["'][^"']*\bblog-mainImage\b[^"']*["'][^>]*>[\s\S]*?(<img\b[^>]*>)/i)?.[1];
    assert.ok(articleImage, `${route}: article has its own image`);
    assert.equal(one("og:image"), new URL(attribute(articleImage, "src"), domain).href, `${route}: article image is absolute`);
    assert.equal(one("og:image:alt"), attribute(articleImage, "alt"), `${route}: article alt is preserved`);
    for (const name of ["og:image:width", "og:image:height", "og:image:type"]) {
      assert.deepEqual(values(name), [], `${route}: ${name} is omitted without page-specific data`);
    }
  }
});

test("blog listing uses shared title, description and absolute image fallbacks", async () => {
  const { one, title } = sharedMetadata(await built("blog/index.html"), "/blog/");
  assert.equal(one("og:title"), title);
  assert.equal(one("og:description"), one("description"));
  assert.equal(one("og:image"), `${domain}/assets/images/ogimage2.png`);
});
