// Run after npm run build so these checks use the generated production output.
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const publicRoot = new URL("../public/", import.meta.url);
const domain = "https://bespokewebdesign.ca";
const built = (file) => readFile(new URL(file, publicRoot), "utf8");
const articleFiles = (await readdir(new URL("blog/", publicRoot), { recursive: true }))
  .map((file) => file.replaceAll("\\", "/"))
  .filter((file) => file.endsWith("/index.html"));
const articleRoutes = articleFiles.map((file) => `/blog/${file.slice(0, -"index.html".length)}`);
const retired = {
  about: "/#about",
  services: "/#services",
  portfolio: "/#portfolio",
  contact: "/#contact",
  "cleaning-website": "/#services",
  "plumbing-website": "/#services",
  landing: "/#services",
  "home-backup": "/",
  "trades-home": "/",
  "trades-blueprint": "/",
  "trades-foundry-home": "/",
  "trades-foundry": "/",
};

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
}

function robots(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .filter(([tag]) => attribute(tag, "name")?.toLowerCase() === "robots")
    .flatMap(([tag]) => (attribute(tag, "content") || "").toLowerCase().split(/[\s,]+/))
    .filter(Boolean);
}

test("sitemap contains only homepage, audit, blog and generated articles", async () => {
  assert.ok(articleRoutes.length > 0, "the existing blog article must be generated");
  const sitemap = await built("sitemap.xml");
  const actual = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url).sort();
  const expected = ["/", "/get-more-leads/", "/blog/", ...articleRoutes].map((route) => domain + route).sort();
  assert.deepEqual(actual, expected);
});

test("indexable pages keep their own canonical and do not request noindex", async () => {
  for (const route of ["/", "/get-more-leads/", "/blog/", ...articleRoutes]) {
    const html = await built(`${route.slice(1)}index.html`);
    const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)]
      .filter(([tag]) => attribute(tag, "rel")?.toLowerCase() === "canonical")
      .map(([tag]) => attribute(tag, "href"));
    assert.deepEqual(canonicals, [domain + route], `${route}: canonical`);
    assert.ok(!robots(html).includes("noindex"), `${route}: must remain indexable`);
  }
});

test("utility pages stay available without entering search results", async () => {
  for (const route of ["review", "mycard"]) {
    assert.deepEqual(robots(await built(`${route}/index.html`)).sort(), ["follow", "noindex"], `/${route}/: robots`);
  }
  for (const route of ["get-more-leads/thank-you", "get-more-leads/og-preview"]) {
    assert.ok(robots(await built(`${route}/index.html`)).includes("noindex"), `/${route}/: robots`);
  }
});

test("robots blocks only admin and leaves the audit OG preview crawlable", async () => {
  const robotsTxt = await built("robots.txt");
  const disallowed = [...robotsTxt.matchAll(/^[ \t]*Disallow:[ \t]*(\S*)[ \t]*$/gim)].map(([, route]) => route);
  assert.deepEqual(disallowed, ["/admin/"], "no broad or OG-preview disallow rule");
});

test("clean production output omits empty biolink and stale home OG preview", async () => {
  for (const file of ["content/pages/biolink/index.html", "home-og-preview/index.html"]) {
    await assert.rejects(access(new URL(file, publicRoot)), { code: "ENOENT" }, file);
  }
});

test("retired URLs have exact forced permanent redirects to existing homepage targets", async () => {
  const rules = (await built("_redirects")).split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/));
  for (const [slug, target] of Object.entries(retired)) {
    for (const from of [`/${slug}`, `/${slug}/`, `/${slug}.html`, `/${slug}/index.html`]) {
      assert.deepEqual(rules.filter(([source]) => source === from), [[from, target, "301!"]], from);
    }
  }
  const home = await built("index.html");
  const ids = new Set([...home.matchAll(/\bid=["']([^"']+)["']/g)].map(([, id]) => id));
  for (const target of new Set(Object.values(retired))) {
    if (target.startsWith("/#")) assert.ok(ids.has(target.slice(2)), `${target}: homepage anchor`);
  }
  assert.ok(!rules.some(([from, target]) => from === "/*" && /^\/(?:index\.html)?(?:#.*)?$/.test(target)),
    "unknown routes must not be redirected to the homepage by a blanket wildcard");
});
