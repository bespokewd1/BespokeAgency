# Website content and page audit

Reviewed: 2026-10-01. Source: this repository, not a production crawl.
Status: audit complete; user approved V1 knowledge handling and page coverage on 2026-10-01. The original findings below remain as source evidence; the decisions in this section supersede their proposed treatments.

## User review decisions

- Use homepage pricing and inclusions: Starter $245/month, Growth $445/month, Dominate $797/month. Older base prices and unconfirmed add-ons are not chatbot offers.
- Use the published FAQ wording: month-to-month, cancellation after 90 days with no penalty. The user will seek further client details. Notice, ownership and post-cancellation arrangements remain contact-only.
- Treat the 20% promotion as active for now. Eligibility, discount basis/duration and expiry remain unconfirmed, so mention it without calculating discounted prices.
- Use `src/_data/client.js` for contact details, including `bespokewd1@gmail.com`, 780-263-8028, the listed Edmonton location and the booking URL without a month parameter.
- Approve the full widget page list below. Explicitly exclude plumbing and cleaning landing pages, along with the other campaign, alternate, backup and utility routes.
- Unconfirmed currency/taxes, ad spend, cross-platform post allocation, delivery terms, extended service coverage and additional service scope retain contact-only handling. Do not promote the free audit as approved chatbot knowledge.
- `netlify/ai/business-info.md` records these decisions for V1. Public business copy was not reconciled. Tasks 3 and 4 added the assistant contract and locally verified backend. Task 5 implemented the approved widget coverage and verified the generated route list.

## Findings that need a decision

The homepage has the clearest current package table, but older public pages contradict it. A built route is not proof that its offer is current. The knowledge file at `netlify/ai/business-info.md` now uses the user-selected homepage prices and reviewed terms. The comparison below preserves the contradictions found during the audit.

### Pricing and conditions

| Source | What is actually published | Proposed treatment |
| --- | --- | --- |
| `src/index.html:411-488`, `#pricing` | Starter $245/month, Growth $445/month, Dominate $797/month. Visible cards. No setup fees and no long-term contracts. | Use these three packages after approval. Confirm currency and taxes. |
| `src/index.html:3` | Metadata says cancel anytime. | Confirm against the 90-day wording below. |
| `src/content/pages/about.html:94-99,225-230` | Visible $0 down and $149/month. | Cannot dismiss this as stale metadata alone. Confirm whether a website-only offer still exists. |
| `src/content/pages/services.html:166-168,279-281,379-381` | Brand & Identity $200/month, Standard $149/month, Lump Sum $2,000 plus $20/month hosting are explicitly hidden with inline `opacity: 0; visibility: hidden`. | Do not quote hidden prices as current public offers. |
| `src/content/pages/services.html:225-252,312-352` | Visible additional pages from $150, CMS blog from $300, lump-sum hosting $20/month, optional unlimited edits +$75/month. | Confirm continued availability, applicable package, and whether the first two are one-time charges. Do not attach them to new plans without approval. |
| `src/content/pages/home-backup.html`, pricing section | Visible old $149/$200/$2,000 package table and older hosting offers. | Backup, excluded as authority. It still builds to a public route. |
| About, Services, Contact, Blog and landing-page front matter; `src/_data/client.js:14-15` | Repeated $149/month descriptions. | Older metadata, not independent confirmation of current pricing. |
| `src/content/pages/trades-home.html:365-428`, `trades-blueprint.html:364-432`, `trades-foundry-home.html:570-696` | Same $245/$445/$797 amounts, but highest plan is Pro rather than Dominate. Trades Home and Blueprint add priority same-week edits to Growth and a quarterly strategy call to Pro. | Prefer homepage names and inclusions if approved. Do not merge extras from variants. |
| `src/content/pages/trades-home.html:622-645`, `trades-blueprint.html:618-633`, `trades-foundry-home.html:847-885` | Month-to-month, cancellation after 90 days with no penalty; usual launch in 2 to 3 weeks after signup and questionnaire. | Confirm minimum term, notice period, cancellation costs and timeline. Do not promise immediate cancellation or a launch deadline. |
| `src/index.html:204-208` | Website described as owned by the customer. | Confirm ownership, source files, domain transfer and hosting after cancellation before explaining exit rights. |

Homepage package details proposed for approval:

| Package | Monthly price as written | Included on homepage |
| --- | --- | --- |
| Starter | $245 | Custom 5-page trades website, hosting, unlimited edits, 5 social posts/month, mobile-first design and SEO, no setup fee |
| Growth | $445 | Everything in Starter, 12 social posts/month, Google Business Profile updates, Google review responses, monthly performance report |
| Dominate | $797 | Everything in Growth, 20 social posts/month, monthly SEO blog post, Google Ads management, priority support |

Treat 12 and 20 as the plan's stated monthly post counts, not additions to the previous tier. Confirm whether counts are shared across Facebook and Instagram or per platform. Google Ads management does not establish that advertising spend is included. Branding, automation and content strategy are advertised services but are not itemized inclusions in these cards.

### Promotions and other uncertain facts

| Topic | Evidence | Proposed treatment |
| --- | --- | --- |
| 20% discount | `about.html:133-160`, `contact.html:49-75`, `portfolio.html:49-74`, `blog.html:55-73,156-184`, industry landing-page offers. Some say first project, some first website, with `NEWBUSINESS` and no expiry date. | Ask whether it is active, eligible plans, discount basis/duration, expiry and stacking rules. Do not calculate discounted prices. |
| Free audit | `src/get-more-leads.html:151-434` advertises a free, no-obligation lead-generation audit covering website, Google, SEO, lead capture, reputation, social media and comparison with 3 local competitors. | Campaign is excluded from widget placement. Ask whether its offer should be answerable from the main-site chatbot. No turnaround is stated. |
| Service area | Homepage focuses on Edmonton but says clients across North America at lines 127-139. | Use Edmonton focus; confirm remote service boundaries rather than promise all regions. |
| Industries | Homepage lines 514-516 includes clinics and local businesses. Trades variants say no restaurants or retail. Portfolio includes Waffle House Bar & Grill. | Prefer homepage's broader scope, subject to approval. Do not say trades-only. |
| Email | `src/_data/client.js:3` and active footer use `bespokewd1@gmail.com`; 2025 GBP article line 120 says `info@bespokewebdesign.ca`. | Propose shared-data Gmail address, ask which should be public in chat. |
| Phone and location | `src/_data/client.js:4-13`: 780-263-8028, Ellerslie RD, SW Edmonton, Alberta, Canada. Homepage supports text and WhatsApp. | Phone can be drafted; do not imply a walk-in office or invent a street number. |
| Booking | Shared data uses `https://calendly.com/arjiv28/30min`; many visible links force `?month=2026-05`; trades variants describe a 20-minute call. | Keep `/contact/` as agreed. Do not promise a call length or reuse a stale month parameter. |
| Opening hours | Monday-Friday 9am-6pm appears only in a commented-out block of `components/cta.html:138-173`. | No approved hours or response-time commitment. |
| AI search visibility | No AI-search/GEO/ChatGPT visibility service text found in source pages. Plumbing page mentions AI-powered Q&A, which is a different service. | No confirmed AI search service or package. Ask owner for scope or refer enquiries to contact. |
| Automation and integrations | Homepage lists automation and content strategy without specifications. Plumbing landing page advertises booking, payments, financing banners and live chat. Cleaning page has a commented-out copy of the plumbing feature section. Funnel form offers CRM / Lead Management as an interest option. | Confirm actual available services and scope. A dropdown option, commented block or broad heading does not establish a deliverable or price. |
| Copywriting and delivery | Services page labels Advanced Copywriting as Coming Soon. Trades variants promise all content written, stock photos, same-week edits and usual 2 to 3 week launch. | Ask which content, photos, approval process and turnaround apply to current plans. |
| Portfolio | Homepage `#portfolio` names KMS Plumbing YEG, Montano Plumbing & Contracting, Squad V Plumbing and Rod's Electric. `/portfolio/` also lists cleaning, directory, restaurant and media projects. | Draft named examples with internal links. Do not infer conversion results, current client counts or endorsements. |
| Rankings, reviews and history | Homepage has #1/leading claims, ratings and an anonymous trades testimonial. Footer says since 2022. 2025 GBP article includes ranking claims, statistics and product instructions. | Omit superlatives, quantitative outcomes and unverified ratings. Do not treat the dated article as current platform documentation or a service contract. Founding date can remain omitted. |
| Affiliate promotions | Shopify ads in `layouts/post.html` and Portfolio; YEG Business promotion on About. | Not evidence of an included ecommerce service or a free listing entitlement. |

## Approved widget page list

All routes below were checked against source and the successful local build. The user approved all inclusions and exclusions, including the plumbing and cleaning pages. Task 5 implemented visibility flags and checked that exactly the seven current included routes contain one widget and its assets.

### Include

| Route | Source |
| --- | --- |
| `/` | `src/index.html` |
| `/about/` | `src/content/pages/about.html` |
| `/services/` | `src/content/pages/services.html` |
| `/portfolio/` | `src/content/pages/portfolio.html` |
| `/contact/` | `src/content/pages/contact.html` |
| `/blog/` | `src/content/pages/blog.html` |
| `/blog/google-business-profile-checklist-for-2025/` | `src/content/blog/google-business-profile-checklist-for-2025-–-get-found-on-google.md` |

Include future blog posts and generated blog pagination. Only one post exists, so no `/blog/2/` is generated currently. Main navigation now points at homepage anchors, but the listed standalone business routes still build and fit the user's main/business/blog scope.

### Exclude

| Route | Source | Reason |
| --- | --- | --- |
| `/get-more-leads/` | `src/get-more-leads.html` | Campaign funnel, `funnelPage: true` |
| `/get-more-leads/thank-you/` | `src/get-more-leads-thank-you.html` | Thank-you page, funnel flag and noindex |
| `/get-more-leads/og-preview/` | `src/get-more-leads-og-preview.html` | Standalone social-image preview utility |
| `/landing/` | `src/content/pages/landing.html` | Older landing variant duplicating About, despite Industries title |
| `/plumbing-website/` | `src/content/pages/landing-plumbing.html` | Proposed campaign exclusion, industry-specific promotion and enquiry form |
| `/cleaning-website/` | `src/content/pages/landing-cleaning.html` | Proposed campaign exclusion, industry-specific promotion and enquiry form |
| `/trades-home/` | `src/content/pages/trades-home.html` | Proposed alternate-home exclusion, duplicates homepage offer in another design |
| `/trades-blueprint/` | `src/content/pages/trades-blueprint.html` | Proposed alternate-home exclusion |
| `/trades-foundry-home/` | `src/content/pages/trades-foundry-home.html` | Archived alternate, explicit noindex/nofollow and comment about reuse |
| `/trades-foundry/` | `src/content/pages/trades-foundry.html` | Standalone HTML meta-refresh redirect to `/` |
| `/home-backup/` | `src/content/pages/home-backup.html` | Explicit previous homepage |
| `/review/` | `src/content/pages/review.html` | Post-sale review/feedback utility |
| `/mycard/` | `src/content/pages/mycard.html` | Standalone digital contact-card utility |
| `/content/pages/biolink/` | `src/content/pages/biolink.html` | Empty source still emits an empty page at its default route |
| `/admin/` | `src/admin/index.html` | CMS utility |
| `/robots.txt`, `/sitemap.xml`, `/assets/**` | `src/robots.html`, `src/sitemap.html`, `src/assets` | Machine-readable files and static assets |

The user confirmed exclusion of the industry and trades variants. The repository does not explicitly label all of them retired. They are still generated and some appear in the sitemap. `eleventyExcludeFromCollections` does not by itself prevent output, as the Foundry files demonstrate. Do not use the sitemap or membership in a layout as the widget allowlist.

### Implemented visibility setting

- Use a boolean `chatEnabled`, default off when absent. Explicitly enable the six main/index pages above and set it in `src/content/blog/blog.json` for posts. Blog pagination inherits its index template setting.
- Include markup, CSS and JavaScript in `layouts/base.html` only when `chatEnabled` is true and `funnelPage` is not true. An explicit false must remain off; funnel pages remain off even if accidentally enabled.
- `layouts/post.html` extends `layouts/base.html`, so it receives one widget through the base layout. Do not include a second copy in the post layout.
- Keep `funnelPage` responsible for its existing header/footer and script choices. It is insufficient as the sole chat switch because most excluded pages do not set it.
- Standalone utilities and redirects do not extend the base layout. Do not add widget assets to them.
- Existing `components/chatbot.html` is an empty section with commented-out Tawk code. Its page includes are not an active chatbot or a reliable placement list.

## Enquiry destination and verification

- `/contact/` is the explicit permalink in `src/content/pages/contact.html:5` and includes `components/cta.html`.
- The included CTA contains the POST `CTA Form`, service choices, required name/email/phone/message fields, plus booking, text and WhatsApp links. `src/_redirects` is empty, so no repository redirect replaces this destination.
- `npm run build` passed during this audit. Build output confirmed all routes above, including the post slug and empty biolink route. Generated contact HTML contains the enquiry form and shared contact details. This establishes the local static destination; hosted form submission and external booking/contact delivery were not exercised.
- Build-generated CSS line-ending changes were inspected and restored. Existing setup work was preserved.

## Original review questions

1. Should chat quote only Starter $245, Growth $445 and Dominate $797 per month from the homepage? Are these CAD, and are taxes extra? Is the $149 website-only offer retired? Are the older add-ons and lump-sum option still available?
2. Is there a 90-day minimum or truly cancellation at any time? What happens to the site, source files, domain and hosting on cancellation? Does Google Ads management exclude ad spend, and are social-post counts total across platforms?
3. Is the 20% promotion active? If so, specify eligible packages, discount duration/basis and expiry. Should chat mention the free lead-generation audit?
4. Should chat use `bespokewd1@gmail.com` or `info@bespokewebdesign.ca`? What regions do you serve beyond Edmonton, and do you accept non-trades businesses?
5. Do you offer AI search visibility, automation, CRM, ecommerce or other integrations today? Which deliverables and prices, if any, may chat state? May it describe the questionnaire/content-writing process and a typical 2 to 3 week launch?
6. Approve the page list above, especially excluding plumbing/cleaning landing pages and trades design variants, and approve the remaining facts in `netlify/ai/business-info.md`.

The decisions at the top record the review outcome. Remaining unanswered details are contact-only. Website copy corrections are separate follow-up work; this audit has not changed the published pages. In particular, `src/_data/client.js` still contains the older $149 description despite being the selected contact-data source.
