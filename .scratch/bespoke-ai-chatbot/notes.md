# Bespoke AI chatbot: context and decisions

Last updated: 2026-10-01

## Purpose and current status

Add a small V1 AI assistant to BespokeWebDesign.ca. It answers visitor questions about Bespoke using approved business information and directs interested visitors to `/contact/`.

Tasks 1 through 5 are complete locally. The widget's mocked checks and a subsequent live conversation pass. Two initial UI requests timed out, but the follow-up investigation could not reproduce the failure. Task 6 remains the wider verification stage. Task 2's business knowledge and widget coverage are user-approved. Unknown business details remain contact-only. Google's reviewed regional restrictions require an availability decision before public preview. These documents support work across sessions.

## Gemini access verified on 2026-10-01

- The user created the Bespoke Web Design Chatbot project, supplied screenshots showing Free tier and Set up billing, and privately populated root `.env` with its key.
- The first quota screenshot was for Bespoke Music. The user then switched to the chatbot project; use the corrected screenshot's quotas.
- Selected exact API ID: `gemini-3.5-flash-lite`. Confirmed through an authenticated models-list request that it supports `generateContent`.
- User's chatbot-project screenshot shows 15 requests/minute, 250,000 tokens/minute, and 500 requests/day for Gemini 3.5 Flash Lite. These are project-wide limits, shared by local/testing/production use of that project. They were read from the dashboard screenshot, not independently retrieved via a quota API.
- One minimal generation request returned HTTP 200 and the requested `OK` reply. Reported usage: 6 prompt tokens, 1 output token, 7 total tokens, finish reason STOP.
- Configured `GEMINI_MODEL=gemini-3.5-flash-lite` in local `.env` and `.env.example`. The key was loaded in process memory and sent only to Google's Gemini endpoint via the authentication header; it was not printed or copied into documentation.
- No billing settings were changed. Free-tier status is evidenced by the user's dashboard screenshots; the generation response alone does not establish billing status.
- The initial check verified provider access directly. Task 4 subsequently verified six successful real calls through the local Netlify Function, with runtime-only credentials.
- Next work: task 6. Live widget generation passed in the follow-up investigation; capture sanitized timings if the earlier timeout recurs. Data-use terms and notice were reviewed in task 3; public availability restrictions remain to be resolved before hosted exposure.

Read this file and `tasks.md` before continuing. Update both as decisions change or tasks finish. Do not assume an unchecked task has been completed.

## Original brief

- Source: `.scratch/emails/sept-28/Bespoke Music.pdf`, task #2, pages 5–10.
- Only task #2 is in scope. Task #1 is a separate music website.
- The brief calls the site Astro, but this repository is Eleventy. The user explicitly confirmed this repository is the target and accepted adding Netlify Functions without a framework migration.
- Original deliverables: working widget, Netlify Function, Gemini integration, business knowledge file, system prompt, environment setup, short maintenance README, and instructions to replace the developer key with the owner's production key.

## Confirmed user decisions

| Topic | Decision |
| --- | --- |
| Repository | Current BespokeAgency repository |
| Hosting | Netlify |
| Site framework | Retain Eleventy and LESS |
| Placement | Main business pages and blog pages |
| Excluded pages | Campaign landing pages, thank-you pages, utility pages |
| Business source | Repository content, then user review |
| Pricing | State approved prices published on the website, including conditions. If no applicable price is published, direct visitors to contact. |
| Quote destination | Existing contact page, verified permalink `/contact/` |
| Topic boundaries | Bespoke and relevant service questions; politely redirect unrelated requests |
| Language | English interface and responses |
| Conversation lifetime | Same-tab session storage across navigation and refresh; New conversation clears it |
| Widget opening | Click only; no automatic greeting popup |
| Design | Existing site colors and typography; clean, friendly, professional |
| AI identification | Brief AI label |
| Answer delivery | Typing indicator followed by the complete response; no streaming required |
| Links | Contact links within relevant replies |
| Development and testing | Local-first using Netlify Dev; hosted preview is not a prerequisite |
| Test deployment | Netlify preview after local verification, before production |
| Existing deployment workflow | User currently uses production deployments only |
| Gemini access | User needs setup guidance |
| Gemini budget | Free tier only; no paid usage or paid fallback |

The user approved the local-first plan and requested starting task 1, completing setup that can be done locally and then explaining their required account steps. No hosted deployment or account changes have been performed.

## Local setup completed

- Installed repository dependencies and added `netlify-cli` 27.10.2 as a development dependency, with the lockfile updated.
- Added `npm run dev`, which runs `netlify dev --offline --no-open`.
- Added `npm run dev:site`, which runs the existing LESS and Eleventy watchers without the Decap CMS server.
- Added `[dev]` configuration in `netlify.toml`: custom framework, command `npm run dev:site`, internal port 8080, browser port 8888.
- Netlify Dev offline mode avoids linked account configuration; it does not prevent future function code from calling Gemini. Initial tool/plugin setup can require internet access.
- Added `.env`, `.env.*`, and `.netlify` ignore rules, with `.env.example` allowed for tracking.
- Created a local ignored `.env` and a trackable `.env.example`. The user subsequently entered the key privately, and the verified model is now configured.
- Added `docs/chatbot-local-setup.md` and a link from the root README.
- Verified Node.js 24.21.0, baseline production build, local HTTP 200 at `http://localhost:8888/`, and existing light-only check.
- Stopped the test server after verification. Start it again with `npm run dev`.
- Task 4 added the function and verified `/api/chat`, local function packaging and server-side credential loading. See the task 4 section below.
- User account/key setup and model-access verification are complete; see the Gemini verification section above.
- npm reported dependency audit findings during installation: 23 before adding the CLI, 27 afterward. No broad dependency upgrades were performed.

## Build order and local testing

The earlier plan placed Netlify preview setup first. The user questioned this, and the order was corrected. Follow the local-first order in `tasks.md`:

1. Set up local Netlify Dev and free-tier Gemini access.
2. Gather and approve business information and page coverage.
3. Define assistant instructions and API behavior.
4. Build and test the backend locally.
5. Build and test the widget locally.
6. Verify the full experience locally.
7. Deploy to a Netlify preview and verify hosting-specific behavior.
8. Document and release to production.

Netlify Dev runs the Eleventy website and Netlify Functions on the developer's computer. Browser requests to local `/api/chat` reach a local server-side function, which can call the real Gemini API. The existing Eleventy server alone does not execute functions; use the Netlify Dev browser address for full integration testing.

- Local runtime credentials stay server-side in an ignored environment file.
- Real Gemini calls require internet access and consume free-tier quota, even during local testing.
- Mocked provider responses support UI and failure testing without consuming Gemini quota.
- A hosted preview is not required to implement or test the local chatbot.
- Preview verification remains necessary before production for deployed routing, environment settings, function packaging, and actual platform rate-limit enforcement. Local emulation does not prove all hosted behavior.
- Netlify account/preview preparation is deferred to task 7, rather than blocking local development.

## Required visitor experience

- Floating bottom-right button labeled `Ask Bespoke AI`.
- Modern chat window with welcome message, user and AI messages, typing indicator, text input, Send, Enter-to-send, Close, and New conversation.
- Mobile-friendly layout and usable response links/buttons.
- Final V1 welcome: "Hi! I'm Bespoke's AI assistant. I can help with questions about websites, SEO, Google Business Profile and social media services. What would you like to know?"
- Header identification: "AI assistant · Answers may be inaccurate." Full data-use and storage wording is in `docs/chatbot-contract.md`.
- Starter questions:
  - What services do you offer?
  - How much does a website cost?
  - Do you work with trades businesses?
  - I need a website. Where do I start?
- Follow-up questions use bounded current conversation history.
- Do not call Gemini on page load or merely opening the widget.

## Architecture and secret handling

```text
Browser widget
  POST /api/chat with message and bounded history
    -> Netlify Function
       reads GEMINI_API_KEY and GEMINI_MODEL at runtime
       adds server-side instructions and approved business information
       calls Gemini
    <- controlled answer or friendly error
```

The website remains static. Netlify deploys the function separately from the public site. Astro is not needed.

The user's main concern was that environment variables can leak when referenced in public pages. This is correct. An environment variable alone is not a security boundary. The key must only be used by server-side code, never injected into templates, browser bundles, generated HTML, response bodies, or logs.

- Set secrets through Netlify's environment settings, not committed configuration.
- Use the Functions environment scope where the account plan supports it. Documentation checked during planning indicated granular scopes require Pro or above; confirm current account behavior.
- The frontend knows `/api/chat`, not the Gemini credential.
- Keep local secrets in ignored environment files.
- Verify generated public output and browser traffic for accidental exposure.
- Business knowledge and prompts live outside public assets. They are not a place to store secrets, and model instructions cannot guarantee that their contents will never be repeated.

Proposed structure, subject to implementation needs:

```text
netlify/functions/chat.mjs
netlify/ai/business-info.md
netlify/ai/system-prompt.md
src/_includes/components/chat-widget.html
src/assets/js/chat.js
src/assets/less/chat.less
```

Ensure Markdown resources are included in the deployed function bundle. Do not assume local file reads automatically work after deployment.

## Repository findings

- `package.json`: Eleventy `^2.0.1`, LESS, esbuild, and npm-run-all. No Astro dependency.
- `npm run build` runs the existing `build:*` scripts for LESS and Eleventy.
- Existing check: `npm run test:light-only`, which builds and runs `scripts/check-light-only.js`.
- `netlify.toml`: publishes `public/`, builds with `npm run build`, includes the Lighthouse plugin. No function configuration was present when inspected.
- `.eleventy.js`: input `src`, output `public`, Nunjucks HTML templates.
- `.eleventy.js` copies `src/assets`, `src/admin`, and `src/_redirects` into public output. Never place secrets or server modules in these copied assets.
- `src/config/javascript.js` bundles asset JavaScript with esbuild. Production minifies it; development includes source maps.
- Shared layout: `src/_includes/layouts/base.html`.
- Blog layout: `src/_includes/layouts/post.html` extends base. A conditional base-layout inclusion will cover posts without adding a second widget.
- The base layout already uses `funnelPage` to distinguish some campaign behavior. Audit page coverage before relying on that flag.
- Base layout contains Google analytics/tag manager and prerender speculation rules. Do not add chat-content tracking or trigger API requests during prerendering.
- Contact source: `src/content/pages/contact.html`, front matter `permalink: "contact/"`.
- Contact metadata mentions $149/month and the body starts with a 20% promotion. These are examples requiring review, not approved chatbot pricing.
- Other likely content sources: `src/index.html`, `src/content/pages/services.html`, `about.html`, `portfolio.html`, and active trades pages.
- Backup and alternate campaign pages exist. Do not treat all repository text as current business truth.
- `.gitignore` originally contained only `.vscode`, `.cache`, `node_modules`, and `public`. Environment-file exclusions are needed before local secret setup.
- No repository `AGENTS.md` was found in the initial glob. Future sessions must still follow applicable harness/global instructions and check for new repository instructions.

## Business knowledge and assistant behavior

### Task 2 audit and user approval on 2026-10-01

- Detailed evidence, source references, pricing comparison, full generated-route inventory and approval questions: `.scratch/bespoke-ai-chatbot/content-audit.md`.
- Approved V1 business knowledge: `netlify/ai/business-info.md`. Use homepage packages: Starter $245/month, Growth $445/month and Dominate $797/month, with their homepage inclusions. Older base prices and unconfirmed add-ons are not chatbot offers.
- Approved coverage: `/`, `/about/`, `/services/`, `/portfolio/`, `/contact/`, `/blog/`, the current GBP blog post and future posts/pagination. Exclude campaign, thank-you, utility, backup and alternate-home routes. The user explicitly confirmed excluding plumbing and cleaning landing pages as well.
- Task 5 implemented `chatEnabled`, off by default, explicitly true on included pages and blog directory data. Base layout includes widget markup/assets only when the value is boolean true and not `funnelPage`.
- Homepage visible prices are Starter $245/month, Growth $445/month and Dominate $797/month. About visibly says $149/month; Services hides $149/$200/$2,000 base prices but exposes older add-on fees. Do not assume every $149 occurrence is metadata-only.
- User selected the published cancellation wording: month-to-month, cancellation after 90 days with no penalty. Further client clarification is pending. Do not promise unrestricted cancellation, notice requirements or post-cancellation ownership/hosting arrangements.
- User confirmed the 20% promotion is active for now. Mention it without calculating discounted prices or guaranteeing package eligibility; duration, basis and expiry remain unconfirmed.
- Use `src/_data/client.js` for contact details, including Gmail, phone, listed Edmonton location and the booking URL without the stale month parameter. Its $149 description is not an approved pricing source.
- Currency/taxes/ad spend, cross-platform post allocation, detailed cancellation terms, broader service coverage, delivery/content-writing requirements and additional service scope remain contact-only. The separate free-audit campaign is not approved for chatbot promotion.
- No repository support found for an AI search visibility service. Automation and content strategy lack detailed scope. CRM appears as a campaign-form interest option. AI Q&A, booking and payments appear on an industry landing page, not as confirmed current-plan inclusions.
- The existing `components/chatbot.html` contains only a commented-out Tawk script and an empty section. No active chatbot was discovered.
- `/contact/` builds with its enquiry form, email, text and WhatsApp details. Current shared navigation uses homepage anchors, but does not redirect or remove `/contact/`.
- Verification: `npm run build` passed; checked 22 generated HTML routes, contact form/details and explicit source paths in both new documents. Hosted form delivery was not tested. Inspected/restored build-generated CSS line-ending changes; no public page edits, deployment or Gemini calls in this audit.
- Task 2 approval changed no API/widget code or public website content. Task 3 subsequently specified the system prompt and API contract below.

Prepare a compact file containing approved facts about:

- Bespoke Web Design and Edmonton/service coverage.
- Services, packages, prices, conditions, and contact details.
- SEO, Google Business Profile, social media, and AI search visibility where supported by current content.
- Trades businesses, portfolio, and FAQs.

Track source paths and flag contradictions, missing details, and expired promotions. Obtain user review before treating the draft as approved.

System instructions should require concise, friendly, natural, professional answers; no invented services or prices; no guaranteed rankings/leads; honest handling of missing facts; and relevant links to `/contact/`. Visitor messages must not override the trusted instructions. Prompt rules reduce errors but do not guarantee factual answers, so verify realistic conversations.

## Free-tier requirement and availability

- Use a dedicated Gemini project verified to be on the free tier, with paid billing disabled.
- Selected model: `gemini-3.5-flash-lite`, verified against the project's key and dashboard quotas on 2026-10-01.
- If no suitable free-tier Flash-Lite model is available, discuss the mismatch with the user rather than silently selecting a paid model.
- Do not enable paid fallback, paid tools, or automatic upgrades.
- Quota exhaustion means temporary chatbot unavailability, with a friendly message and contact link.
- Avoid automatic retries that consume more quota.
- Gemini quotas apply beyond an individual visitor. Check whether local development, preview, and production share the same project quota.
- Provider billing settings enforce the no-paid-usage requirement; a browser counter or in-memory function counter cannot guarantee it.
- Netlify functions have separate usage allowances and billing behavior. Inspect the current plan before promising the feature has no additional hosting cost.
- Google's terms reviewed in task 3 allow product-improvement use and human review of unpaid-service chats. Final implementation notice wording is in `docs/chatbot-contract.md`; it is not a claim of separate user approval. Do not solicit personal details.
- The reviewed terms require Paid Services for API clients offered to visitors in the EEA, UK or Switzerland. Free-tier-only remains the requirement. Resolve server-side regional availability and unknown-location handling before public preview; a notice or browser-only restriction does not resolve this. Also review supported regions and the terms' under-18 audience restriction before hosted exposure.

## Task 3 contract and finalized defaults

Completed 2026-10-01. `netlify/ai/system-prompt.md` contains assistant instructions. `docs/chatbot-contract.md` is authoritative for request validation, provider behavior, response shapes, rendering, storage and visitor wording. These are implementation decisions, not additional approved business facts. Runtime checks remain in tasks 4 through 7.

- Message and historical user text: 1 to 1,000 UTF-16 code units after trimming. Historical assistant text and successful answers: 1 to 2,000.
- Send at most the last 6 completed exchanges, 12 alternating user/assistant entries, plus the new message. Total history text is at most 12,000 UTF-16 code units.
- Maximum API request body: 32,768 UTF-8 bytes, enforced while reading server-side. Browser removes oldest whole pairs until all bounds fit; server rejects violations.
- Exact request shape: `{ message, history: [{ role, content }] }`. Require both top-level fields, no unknown keys, no model/system/config overrides, only complete user/assistant pairs.
- Success: `{ ok: true, answer }`. Controlled failure: `{ ok: false, error: { code, message, retryAfterSeconds }, contactUrl: "/contact/" }`. HTTP status mapping and exact wording are in the contract. The widget also handles non-JSON platform 429 and network errors locally.
- One in-flight request per widget.
- One Gemini candidate, output cap 768 tokens, provider deadline 20 seconds including body read, browser deadline 25 seconds. Only complete, non-empty STOP answers within 2,000 characters succeed. No automatic retries or paid/model fallback.
- Netlify platform limit: 5 requests per 60 seconds per IP and domain. This is one third of the recorded 15 RPM project quota for a single IP, not a global quota guarantee. Enforcement can lag up to 10 seconds. Verify deployed rule and alternate function URL coverage in task 7.
- Only accept expected user/assistant roles from the browser; server supplies trusted system instructions and model configuration.
- Use timeouts and controlled errors for validation, rate limits, quota exhaustion, provider failures, missing configuration, and empty/blocked responses.
- Do not cache chat responses in a shared cache or deliberately log conversation contents.
- Render text nodes and simple inline links to an exact destination allowlist. No generated HTML, full Markdown, images or automatic bare-URL linking. The prompt and contract share the same 12 approved destinations. Keep a local contact link available with every failure and in the footer.
- Enter sends; Shift+Enter inserts a newline; Escape closes; restore focus to the trigger.
- Session storage key `bespoke-chat-v1` stores version 1 and bounded completed pairs only. Validate restored data and ignore pending/failed exchanges. Browser restoration may retain it beyond tab close; do not promise deletion on close or deletion of data already sent to Google.
- Fall back to in-memory history if session storage is unavailable.
- Reset cancels or ignores in-flight responses so old replies cannot reappear.
- Scope CSS to the widget and check existing floating controls, mobile keyboard behavior, and accessibility.

Task 3 verification: reviewed prompt against approved pricing/conditions/contact-only limits; checked contract examples, matching prompt/link allowlists, size arithmetic and Markdown hygiene. No live provider calls, secret access, build or deployment was needed for this specification. Exact focused check results are recorded in `tasks.md`.

## Task 4 backend implementation and verification

Completed 2026-10-01. The user requested implementation after task 3.

- `netlify/functions/chat.mjs` exports the V2 handler, custom `/api/chat` route and 5/minute per-IP/domain platform rule. Do not add a redirect to the default function URL; current Netlify routing disables it when a custom path is set. It returned 404 locally.
- `netlify/ai/chat-handler.mjs` validates exact JSON shape, actual UTF-8 body size, bounded alternating history, method, content type and present Origin before provider access. It loads trusted Markdown and runtime environment values server-side, then sends one Gemini REST request. No new SDK dependency was added.
- Controlled failures cover missing config/resources, invalid requests, upstream quota/failure, deadline, blocked/empty/truncated/cited/non-text answers and client cancellation. No raw-error or transcript logging, paid fallback, retry loop or shared caching. Responses are JSON with `Cache-Control: no-store`.
- `netlify.toml` sets the functions directory and explicitly includes the two Markdown resources for `chat`. Netlify's V2 bundler inlines the helper into `functions/chat.mjs`; resource URLs use `../ai/` relative to the module so they also work in the relocated archive. An initial path failure was caught and fixed before successful live verification.
- `npm run test:chat` runs `tests/chat.test.mjs` with Node's test runner, fake credentials and mocked provider calls. All 38 checks passed, including input boundaries, provider errors, result handling, timeout/body-read coverage and cancellation.
- `npm run test:light-only` passed including the production site build. Build-generated CSS changes were line-ending-only and restored. No public page content changed.
- Local HTTP checks passed for the website, 405/400/403 API responses, the disabled default function URL and inaccessible prompt/knowledge/source/`.env` paths. A scan of 364 generated public files found no actual configured key or server prompt/handler markers; the key was checked only in memory.
- A local function archive was built, extracted outside the repository and invoked with a mocked provider. Its handler loaded both context files successfully, and no environment file was packaged. Hosted verification remains task 7.
- Six real Gemini calls through local `/api/chat` returned HTTP 200 in two three-message conversations: website question, plumbers follow-up and pricing. Observed response times were about 1.3 to 2.0 seconds. Output and timeout defaults worked without adjustment. Live calls consume the same free-tier quota as other project use; no billing/model changes occurred.
- The first conversation added unconfirmed surrounding-area language and ambiguous social-post wording. The prompt now limits unsolicited package/promotion detail, reinforces the approved service-area limit and asks for explicit social-post totals. The second conversation included the correct prices, totals, 90-day cancellation condition and contact link. Full answer-quality and adversarial checks remain task 6.
- Netlify Dev was stopped after verification. No deployment occurred. `docs/chatbot-local-setup.md` contains test commands, packaging details and verification history.

## Task 5 widget implementation and verification

Implemented 2026-10-01. All implementation checklist items and mocked checks pass. Successful live answers through the widget remain a task 6 check because two attempts timed out.

- `src/_includes/components/chat-widget.html` provides the click-only trigger, native modal dialog, welcome, expanded data/storage disclosure, four starters, transcript, composer, reset and contact links. Scoped LESS compiles to `src/assets/css/chat.css`.
- `src/assets/js/chat.js` sends same-origin requests to `/api/chat`, validates responses and exact links, preserves failed input, prevents concurrent submissions and applies the 25-second deadline. Platform non-JSON 429s use local wording and a manual-send cooldown. Reset retains an active cooldown and never retries automatically.
- Only bounded, completed pairs enter `bespoke-chat-v1`. Invalid stored state is discarded; blocked storage uses memory. Oldest pairs are removed together for text/count/UTF-8 limits. Reset aborts and advances a generation ID so late replies cannot enter a new conversation. Page lifecycle handling also closes the panel and refreshes state on back-forward cache restoration.
- Keyboard handling covers Enter, Shift+Enter, IME composition, Escape, focus restoration and Tab wrapping. A polite status region announces answers/errors without repeating the entire transcript. Visual viewport sizing supports the on-screen keyboard; the middle region scrolls while controls remain available.
- Seven generated routes include exactly one widget and one copy of each asset. Main pages explicitly opt in; blog directory data covers current/future posts and the blog template covers pagination. All other generated HTML routes omit the widget/assets, including plumbing and cleaning campaigns.
- `npm run test:chat-widget` passed 7 checks covering storage schemas, text/UTF-8 bounds, envelope/cooldown handling, hostile links and generated routes. `tests/chat-widget.browser.mjs` passed 44 checks through Netlify Dev with mocked responses. `npm run test:chat` passed 38 checks. Production build/light-only and a browser smoke against production output passed.
- Browser coverage included 390x844, 320x568, 390x400 and 844x390 viewports plus a simulated keyboard visual viewport. Desktop/mobile screenshots were reviewed. Physical iOS/Android keyboards and screen readers were not tested. The current shared footer does not include the legacy fixed CTA.
- Verification caught and fixed classic-script loading of exported source, Tab focus escaping to browser chrome, and LESS evaluating away max/env/var expressions. The widget uses a module script and escaped CSS expressions. Existing asset-pipeline code was not changed.
- Two real browser submissions of "Do you build websites?" returned HTTP 504 after about 20 seconds. The live smoke could not advance to a successful answer/follow-up. Basic unauthenticated Google API host connectivity worked, but the generation timeout cause is unresolved. Provider/model/deadline/billing configuration was not changed. Avoid repeated quota-consuming probes; investigate this in task 6.
- Netlify Dev stopped after verification. Restored only unrelated generated CSS line-ending changes. No deployment or commit. The setup guide contains repeatable checks and optional browser tooling instructions.

### Follow-up 504 investigation

After the user supplied rate/usage screenshots, four controlled generation requests succeeded with the existing configuration. Direct full-context generation completed in 1.45 seconds, the local function in 1.69 seconds, and two actual widget exchanges returned 200 with function times of 2.14 and 1.43 seconds. The plumbers follow-up used the previous exchange; its contact link navigated correctly and restored the transcript. Task 5's live visitor journey is now verified.

The screenshots show usage below displayed limits. The earlier 504s came from the application's provider deadline, not a received Google quota response. Their precise cause remains unknown because the failure did not reproduce. No implementation/configuration changes were necessary. The temporary diagnostic script logs status/timings without credentials or provider bodies. Full details are in `docs/chatbot-local-setup.md`.

An existing Eleventy server on 8080 was preserved. Netlify Dev was started with `--dir public --port 8888 --offline --no-open` and left running for user testing. No deployment or commit occurred. Wider task 6 answer-quality/security/regression checks remain pending.

## Widget design review on 2026-10-01

The user requested a collapsed message disclosure and questioned whether the chat matched the homepage or was noticeable against its dark hero. The widget now uses the homepage's Poppins body and bold italic Work Sans headings, smaller corner radii and blue accents. Its larger blue launcher has a high-contrast chat icon, white outline and the supporting text "Services, pricing & getting started". It remains click-only. "About your messages" starts collapsed with a short data-use notice visible beside it; full wording and links remain available on expansion. The contract records this change.

Visual refresh verification exposed a reproducible build race: passthrough copying and unawaited compiler writes could mix source and bundled JavaScript in one file, hiding the trigger with a syntax error. `.eleventy.js` now excludes JavaScript from passthrough copying, and `src/config/javascript.js` returns compiled text for Eleventy to write. Development source maps are inline. A new generated-module parse check covers this failure. This is separate from the earlier Gemini timeout.

The build/light-only check, 8 widget tests and 46 mocked browser checks passed after the changes. Desktop/mobile screenshots were reviewed with the actual homepage fonts loaded. No Gemini requests were needed for this revision. Local testing remains available on port 8888.

## Out of scope

No framework migration, accounts, permanent server-side chat history, database, vector database, RAG, fine-tuning, voice, phone calls, CRM, booking, payments, or complex analytics. No streaming requirement.

## Unresolved items

1. Netlify plan, connected repository/production branch, preview settings, and function allowance.
2. Before public preview, decide and implement regional availability consistent with free-tier-only and Google's EEA/UK/Switzerland restriction, supported regions and intended age audience. Data-term review and notice wording are complete in `docs/chatbot-contract.md`. Account-holder location has not been established.
3. Complete task 6's wider checks. Live widget answers now pass; capture failing-runtime timing if the intermittent 504 recurs. Its earlier root cause is not established.
4. Client clarification of detailed cancellation terms and other contact-only business details in `netlify/ai/business-info.md`. V1 pricing, promotion status, contact source and page coverage are user-approved.
5. Verify the finalized 5/minute platform rule and alternate endpoint coverage on deployed Netlify. The 768-token cap and 20-second provider deadline worked for the task 4 smoke conversations; broader answer checks remain task 6.
6. User review of the working widget and its notice in task 7. Task 3's final implementation wording is recorded, not presented as separate user-approved copy.

## Documentation references

Current Netlify documentation was checked through Context7 during planning:

- https://docs.netlify.com/build/functions/configuration
- https://docs.netlify.com/build/functions/environment-variables
- https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting
- https://github.com/netlify/cli/blob/main/docs/commands/dev.md

The documentation supports standalone functions, custom `config.path` routes, runtime environment variables, function `config.rateLimit`, and running the website/functions locally through Netlify Dev. Recheck the exact API and plan availability when implementing.

Gemini sources reviewed:

- https://ai.google.dev/gemini-api/docs/billing
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/terms, reviewed 2026-10-01; retrieved effective date March 23, 2026
- https://ai.google.dev/api/generate-content, rechecked in task 3 along with Context7 results

The Gemini models-list and generateContent REST APIs were checked against current documentation and used for direct and task 4 integration checks. Backend and widget integration are now implemented. Follow applicable documentation-lookup instructions before further API or configuration work.
