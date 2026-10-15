# Homepage final QA

Date: 2026-10-15.

## Result

No blockers found in the revised homepage or shared booking links. No concrete regression found in the reviewed changes. The final generated homepage includes the shortened logo-strip introduction and agrees with the source.

This was a read-only source and generated-output review. I created only this report. I did not edit sources, build, install dependencies or deploy.

## Scope and evidence

Read `.scratch/content/quality-content.md` and the installed `unslop/SKILL.md`. Reviewed:

- `src/index.html`
- `src/assets/css/blue-collar-home.css`
- `src/_includes/components/blue-collar-header.html`
- `public/index.html` and its generated homepage CSS
- Shared contact data, base layout, redirects, generated robots.txt and sitemap
- The content task record, evidence audit and `homepage-content-browser-results.json`

The existing build, tests and browser smoke were reported as passing. I inspected the saved browser results rather than rerunning them. Those results cover 360, 390, 768, 1024 and 1440px widths. Every recorded width has no overflow, missing fragment targets, duplicate IDs, broken images, page errors or missing resources. FAQ keyboard toggling and the pricing anchor passed at each width.

## Checks

| Area | Result |
| --- | --- |
| Metadata and main heading | Pass. Title, description, Open Graph title/description and the single H1 consistently describe websites and marketing for Edmonton trades and contractors. The $245 starting price agrees with Starter. The generated title and description match the source front matter. |
| Heading structure | Pass. The homepage has one H1, followed by section H2s and appropriate service, plan and preparation H3s. Section labels reference existing IDs. |
| Anchors and IDs | Pass. All homepage fragment links resolve. IDs are unique. Retained targets include `#main`, `#services`, `#portfolio`, `#pricing`, `#proof`, `#about` and `#contact`. The six service links resolve to their headings. New FAQ and service targets have sticky-header scroll offsets in the generated CSS. |
| Shared navigation | Pass. Desktop and mobile links use the retained homepage targets. Existing retired-route redirects still point to those targets. No new retired service-page links were introduced in the edited homepage. |
| Booking | Pass. All eight generated booking links, including desktop and mobile header CTAs, use `https://calendly.com/arjiv28/30min` without the stale fixed-month parameter. New-tab links include `noopener noreferrer`. No call-duration promise was inferred from the URL. |
| Direct contact | Pass. Email is `mailto:bespokewd1@gmail.com`; SMS is `sms:+17802638028`; WhatsApp is `https://wa.me/17802638028`. These agree with the shared contact record. Contact section links resolve. External booking and message delivery were not exercised. |
| Canonical and indexing | Pass. Canonical and `og:url` are `https://bespokewebdesign.ca/`. No robots or bot-specific noindex directive appears in the output. Generated robots.txt allows the homepage and disallows only `/admin/`. The canonical homepage is present in the sitemap. No indexing controls were changed. |
| Structured data | Pass. The generated homepage has no JSON-LD, microdata or RDFa markup to reconcile. No FAQ, review, rating or offer schema was added, and the page makes no rich-result promise. |
| FAQ semantics | Pass. Six native `details` elements each begin with a direct `summary` followed by answer text. The section has a valid H2 label. No conflicting disclosure roles, custom keyboard handling or unnecessary ARIA were added. Visible focus styles exist for summaries and links. Saved browser results confirm Enter-key open/close behavior. |
| Generated output | Pass. Homepage visible text matches source after whitespace normalization, including the final logo-strip trim. Generated homepage CSS matches source after comment/whitespace normalization. Referenced local assets exist. |
| Content and claims | Pass against the recorded evidence. Prices and plan totals remain $245/$445/$797 and 5/12/20 posts. Cancellation retains the after-90-days condition. No unsupported rankings, lead guarantees, unverified ratings, North America coverage, ownership promise or most-popular claim remains in homepage copy. Portfolio images are labelled as mockups, not measured results. |

## Non-blocking existing issue

The shared chat privacy notice still calls `/contact/` a "contact form". That route redirects to `/#contact`, where the visitor gets email, SMS, WhatsApp and booking choices rather than a form. The link resolves, so this is not a broken contact path or a regression from these edits. A separate shared-widget copy change should call it "contact options" unless a form returns. The existing footer and chat `/contact/` links also retain that redirect hop.

## Limits and assumptions

- Assumed the latest recorded user-approved business facts, dated 2026-10-01, remain current. This review did not re-confirm them with the owner.
- Currency/taxes, post allocation, detailed scope, ad-spend arrangements, delivery responsibilities, ownership/handover and full cancellation mechanics still need owner confirmation before stronger promises are added. The page does not invent those terms.
- Saved browser measurements are not a visual design review, a physical-device test or a screen-reader audit. Third-party requests were blocked in that run. No live booking, message delivery, search visibility or conversion result was verified.
- No business constants or source files were changed by this QA.
