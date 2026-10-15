# Homepage content improvement record

Date: 2026-10-15.
Scope: `src/index.html`, with small supporting styles in `src/assets/css/blue-collar-home.css` and the shared booking links in `src/_includes/components/blue-collar-header.html`. Preserve the current visual design, media loading, homepage URL, navigation anchors, canonical and indexing controls. No deployment.

## Customer situation and intent

An Edmonton trades business owner needs a first website or has an outdated site and inconsistent social posts. They want customers to understand their services and contact them, without maintaining the website and social accounts themselves. They are comparing monthly scope, cost and commitment before speaking to an agency. This is a considered purchase, not an emergency service request.

Main query: `Edmonton contractor marketing web design`.
Useful variations: `contractor web design Edmonton`, `Edmonton trades website design monthly plans`, `Edmonton contractor social media management`, `replace contractor website Edmonton`.

The order below is an editorial estimate. No enquiry, analytics, conversion or search-demand data was supplied.

1. Is this for my trade, location and website problem?
2. What work is included, and what changes with each plan?
3. Can I see relevant website projects?
4. What does it cost and when can I cancel?
5. Can you work with an existing website? What about delivery, ownership and extra work?
6. What should I share, and how do I contact the team?

Homepage coverage: concise service overview, current plan comparison, named project examples, agreed cancellation wording, scope boundaries, useful FAQ and contact choices. Do not imply Google rankings, leads or a launch date are guaranteed.

Related needs: use section anchors because former service/about/contact pages redirect here, per `docs/page-retirement.md`. Do not link to retired pages or invent new service/location pages. Branding and work beyond listed plan scope require a discussion. Leave the separate audit campaign and existing blog distinct; no need to repeat them on the homepage.

## Business evidence

Primary authority for this edit: `netlify/ai/business-info.md`, marked user-approved 2026-10-01, checked against user decisions in `.scratch/bespoke-ai-chatbot/content-audit.md`. Current homepage prices and package names remain unchanged.

- Prices: Starter $245, Growth $445, Dominate $797 per month. No setup fee. Currency and tax treatment unconfirmed, so do not add CAD or tax-inclusive claims.
- Cancellation: month-to-month, cancellation after 90 days with no penalty. Notice, ownership and hosting/domain arrangements on cancellation remain unconfirmed.
- Post counts: 5, 12, 20 as monthly plan totals, not additions. Per-platform allocation unconfirmed.
- Google Ads management is a Dominate inclusion, but advertising spend is not confirmed. Do not say it is included or excluded; ask visitors to confirm budget and campaign scope before booking work.
- Delivery, content supply and approval requirements have no approved timeframe or fixed process. Give preparation advice, not a new promise.
- Named homepage project mockups may remain as examples, not as measured results or endorsements.
- Edmonton focus confirmed. North America-wide coverage, number-one/leading status, comparative affordability/effectiveness, most-popular plan, exact ratings and review outcomes lack supporting records.
- Shared booking/contact data: `src/_data/client.js`. Use bookingUrl without the stale May 2026 query. No promised call length or reply hours.

Additional audit: `homepage-evidence-audit.md`.

## Search research and evidence limits

The configured websearch skill returned no Serper API key. Google direct search returned a redirect stub; DuckDuckGo returned a bot challenge. The first Bing request for the main query returned unrelated Edmonton city/travel pages, which were excluded. Direct HTTP requests used no location emulation. There are no verified Google positions. Further searches and direct provider reviews are recorded in `homepage-competitor-research.md`; distinguish search results from directly selected pages. Do not attribute rankings or business results to page content.

## Content plan before editing

| Customer need | Gap in the current page | Proposed answer or section | Evidence |
| --- | --- | --- | --- |
| Recognize the service and fit | Hero uses a slogan and unsupported number-one claim | State Edmonton contractor web design, website/social work, entry price and call action | Approved business knowledge, business and services |
| Understand what the team handles | Overview list differs from six service cards; automation is undefined | Explain customer tasks and align the overview with the listed service scope | Approved service list and package table |
| Assess relevant work | Portfolio calls mockups real results; logo intro claims North America-wide reach | Keep named website mockups and identify them as project examples, with descriptive captions | Existing assets and approved portfolio list |
| Compare monthly costs and commitment | Cancel-anytime/no-long-term-contract wording conflicts with approved terms; most-popular claim has no demand data | Retain prices and totals, state cancellation after 90 days, distinguish higher-tier work and confirm custom scope | Approved user decisions and current package table |
| Trust evidence | Three testimonials and two 5.0 ratings have no review-source verification; anonymous result claim | Remove unsupported review/ratings blocks, not rewrite or invent endorsements | Audit evidence limits |
| Prepare an enquiry | Founder section repeats general promises | Replace the old testimonial cards with practical call-preparation guidance, not an invented delivery process | Approved getting-started advice; no schedule claim |
| Resolve remaining questions | No FAQ, unqualified ownership and lead claims | Short FAQ for redesign, timing, extra scope/ad budgets, cancellation handover and local fit. No new warranty, availability or timing promises | Approved common questions and unresolved limits |
| Reach the right contact | Stale fixed-month booking parameters | Use existing shared bookingUrl and phone variables; preserve text and WhatsApp channels | Approved shared contact source |

Design: retain typography, colors, hero/video, logo strip, services, project gallery and pricing-card layout. Reuse the three-card visual pattern for call preparation. Add a compact FAQ using native details/summary and scoped styles. No new assets, JavaScript, structured data, routes or dependencies.

## Research applied

Three live provider service pages were read in full through direct navigation after searches failed to yield relevant providers. No Google or local result positions are claimed. Full observations and selection limits are in `homepage-competitor-research.md`.

| Provider source | Useful approach for the customer | Applied here without borrowing their promises |
| --- | --- | --- |
| [YEG Digital web design](https://yegdigital.com/web-design/) | Makes trades fit clear and separates build/care scope from additional marketing | Hero names the customer and work. Monthly services and higher-tier inclusions are distinct. Do not borrow their prices, timing, ownership or ranking claims. |
| [CreoLogic website design](https://creologic.ca/services/websites/edmonton-website-design/) | Makes packages comparable by page count, content and concrete deliverables; answers early buying questions | Keep Bespoke's approved 5-page scope, exact price/post totals and Google differences. Add FAQ answers for redesign, delivery and extra scope. Avoid the long repetitive service catalogue. |
| [Pixel Army website design](https://www.pixelarmy.ca/website-design/) | Connects scope to price/timing and qualifies ownership rather than making a blanket promise | Explain that a project schedule and handover need discussion. Provide preparation guidance instead of borrowing a fixed build process. Avoid adding unverified launch windows or recurring-care terms. |

Technical explanation checked against [Google Search Central SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), accessed 2026-10-15, HTTP 200. Its introduction defines SEO as helping search engines understand content and says there is no automatic first ranking. No technical ranking, security, speed or migration guarantee was added. No framework, platform or API code changed.

## Implementation decisions

- Replaced generic domination/number-one claims with a clear service, Edmonton audience, customer problem, practical aim and action.
- Aligned the early service list with the actual six service cards and linked it to their headings.
- Kept the current prices, plan names, no setup fee, 5-page scope and 5/12/20 post totals. Clarified that higher-tier totals replace rather than add posts.
- Corrected unrestricted cancellation copy to the latest recorded user-approved wording, month-to-month with cancellation after 90 days and no penalty. This assumes the 2026-10-01 approval remains current. No notice, buyout or ownership terms invented.
- Removed unsupported comparative affordability/effectiveness, North America reach, most-popular badge, blanket ownership promise and automation deliverable implication.
- Removed three unverified testimonial cards, hard-coded 5.0 aggregates and repeated five-star claims. Audit found copied quotes and a Michelle/Maria attribution conflict, not traceable review evidence. Reviews can return after exact wording, attribution and source are verified.
- Kept the four named website examples and existing images, with mockup descriptions instead of measured-result claims. Reused Squad V images now have one consistent website-mockup label. The founder photo is decorative rather than asserted to be a verified portrait of Charles. Existing stock-video source/license comment remains.
- Moved pricing ahead of the new preparation guidance. Used the former three-card visual pattern for helpful first-call preparation, not a claimed delivery process. Retained `#proof` so existing deep links still resolve.
- Added six native FAQ disclosures for redesign, timing, extra scope, handover, result limits and customer fit. No FAQ structured data added. No existing JSON-LD exists on the built homepage, so there is no review/offer schema to reconcile.
- Shortened the founder copy, added a visible email option alongside SMS, WhatsApp and booking, and used the existing shared bookingUrl without the stale May 2026 parameter. The same small URL fix applies to desktop/mobile shared-header CTAs so every booking link on the homepage agrees.
- No price amounts, contact numbers, published hours, availability, currency, tax rules, response times, launch deadlines or service regions were added or changed. No dependencies, routes, tracking, index controls or canonical settings changed. Small CSS additions support FAQ focus styles, preparation headings and anchor offsets under the sticky header.

## Completion and validation

- `npm run build`: passed after final source changes.
- `node --test tests/page-retirement.test.mjs tests/chat-widget.test.mjs tests/home-hero.test.mjs`: 18 tests passed. Canonical, indexability, sitemap, redirects/anchors, widget and hero behavior retained.
- `node scripts/check-light-only.js`: passed.
- Existing cached Playwright and installed Chrome ran `.scratch/content/homepage-content-smoke.cjs` against production output. Widths 360, 390, 768, 1024 and 1440px passed checks for document/button/badge overflow, one H1, six FAQs, unique IDs, working fragment targets, correct canonical/indexability, shared booking destinations, contact email, FAQ Enter-key open/close, pricing scroll position below the sticky header, and no page errors or missing resources during the run. Results: `homepage-content-browser-results.json`.
- Browser checks are DOM/layout measurements, not a visual design review or a physical-device/screen-reader test. Third-party requests were blocked. No external booking, email/SMS/WhatsApp delivery, live search performance or form delivery was exercised.
- Build did not alter any unrelated CSS file compared with the pre-build byte snapshots. Existing working changes were left intact.
- Independent evidence and customer-focused editorial reviews found no blockers after revisions. The final editorial pass shortened the logo-strip introduction so it does not repeat the portfolio names. An additional generated-page review was requested; automated production-output checks passed as listed above.

Before publication, the owner still needs to confirm currency/taxes, posting allocation, detailed editing/SEO/support scope, ad-spend arrangements, delivery/content responsibilities, ownership/handover and full cancellation mechanics. The page does not invent answers or publish fact-to-confirm placeholders. Exact reviews and broader service coverage remain omitted until verified.

No deployment performed.
