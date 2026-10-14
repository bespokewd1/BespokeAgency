# Retired pages and search indexing

The current homepage remains the one-page marketing site. Its content, pricing, design and navigation are unchanged.

## Routing

`src/_redirects` uses forced permanent `301!` redirects so generated legacy HTML cannot override the routing policy. Every retired slug has exact bare-path, trailing-slash, `.html` and `/index.html` rules. There is no catch-all redirect.

| Retired URL | Destination |
| --- | --- |
| `/about/` | `/#about` |
| `/services/` | `/#services` |
| `/portfolio/` | `/#portfolio` |
| `/contact/` | `/#contact` |
| `/plumbing-website/` | `/#services` |
| `/cleaning-website/` | `/#services` |
| `/landing/` | `/#services` |
| `/home-backup/` | `/` |
| `/trades-home/` | `/` |
| `/trades-blueprint/` | `/` |
| `/trades-foundry-home/` | `/` |
| `/trades-foundry/` | `/` |

Netlify carries query parameters through these redirects. Hashes scroll visitors to existing homepage sections; they are not separate indexable pages. The homepage canonical remains `https://bespokewebdesign.ca/`.

Legacy templates remain in source for reference. Netlify redirects requests before serving their generated content. The empty `src/content/pages/biolink.html` was removed, and its former URL returns 404. Unknown URLs also return 404.

## Searchable pages

The sitemap includes only:

- `/`
- `/get-more-leads/`
- `/blog/`
- Published blog articles.

Sitemap inclusion is opt-in through the `sitemap` tag. New blog articles inherit it from `src/content/blog/blog.json`. Other new pages need an explicit sitemap decision.

`/mycard/` and `/review/` stay accessible with `noindex, follow`. The audit thank-you and OG preview pages retain their existing noindex rules. These URLs are excluded from the sitemap.

`robots.txt` continues to block `/admin/`. The OG preview is no longer blocked, so crawlers can read its noindex rule. Do not block other noindexed pages in robots.txt.

The audit form and thank-you flow, blog content, CMS/authentication, review behavior and contact options were not changed. Placeholder review links and older blog metadata were not part of this routing change.

## Build and checks

`npm run build` cleans the generated `public/` directory first. This prevents removed pages from surviving a later production build. Only generated output is deleted; source and assets remain.

```text
npm run test:pages
npm run test:chat
npm run test:chat-widget
node scripts/check-light-only.js
```

The optional `tests/chat-widget.browser.mjs` suite now expects `/contact/` to redirect to `/#contact`. Its excluded-widget check uses the retained audit funnel instead of the retired plumbing page. Browser setup is documented in `docs/chatbot-local-setup.md`.

Before deploying, verify actual HTTP status and Location headers through Netlify Dev. A plain Eleventy server does not apply Netlify redirect rules. Confirm bare, slash, .html and /index.html aliases; query-string preservation; utility 200 responses; and genuine 404 responses for removed and unknown routes. Check desktop/mobile anchor scrolling. Existing sticky-header and anchor behavior is preserved; no scroll-offset styling was added.

## After deployment

1. Inspect representative old URLs and their 301 Location headers on the live domain.
2. Verify the live homepage, audit, blog and article still return 200 and do not contain noindex.
3. Verify digital card/review robots tags and the live sitemap.
4. Resubmit `https://bespokewebdesign.ca/sitemap.xml` in Google Search Console and inspect representative URLs.
5. Keep permanent redirects in place. Search results change after Google recrawls; no immediate removal or ranking outcome is guaranteed.

No deployment or Search Console submission is performed by these repository changes.
