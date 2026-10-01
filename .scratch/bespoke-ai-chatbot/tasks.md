# Bespoke AI chatbot: ordered implementation tracker

Last updated: 2026-10-01

## How to use this tracker

- Read `notes.md` first for the requirements, architecture, source brief, and confirmed decisions.
- Work in the order below. Account setup and business-content review can progress independently when one is waiting on the user.
- Check items only after completion. Record evidence, changed paths, decisions, and blockers in the session handoff section.
- Never put credentials in these documents.
- Tasks 1 through 5 are complete locally. The initial widget live requests timed out, but a follow-up investigation verified successful real answers, contextual follow-up and contact navigation. Task 6's wider checks remain pending. Resolve the reviewed regional availability restriction before public preview.

## 0. Planning and handoff

- [x] Read task #2 in `.scratch/emails/sept-28/Bespoke Music.pdf`.
- [x] Confirm this repository is the target despite the brief's Astro reference.
- [x] Clarify placement, content source, pricing behavior, contact destination, conversation lifetime, language, UI defaults, preview preference, and free-tier-only requirement.
- [x] Inspect the build configuration, shared layout, asset pipeline, contact permalink, and Git ignore rules.
- [x] Document decisions and ordered work in this feature folder.

## 1. Set up local development and free-tier access

### 1A. Local development

- [x] Inspect repository state and applicable instructions before making changes; preserve unrelated user work.
- [x] Verify the unmodified site builds locally; record pre-existing failures if any.
- [x] Configure Netlify Dev to run the Eleventy site and local Netlify Functions together, using current CLI documentation.
- [x] Document the local start command and browser address. The Eleventy-only server does not run functions.
- [x] Confirm the local website runs through Netlify Dev. Verify `/api/chat` locally when the function is implemented in task 4.
- [x] Keep local development independent of a hosted preview. Establish preview deployment only in task 7.

Evidence: `npm run dev` served Bespoke HTML at `http://localhost:8888/` with HTTP 200. Setup instructions are in `docs/chatbot-local-setup.md`. Task 4 subsequently verified the function and runtime environment loading. The test server was stopped after verification.

### 1B. Gemini setup

- [x] Provide instructions for creating a dedicated Gemini project and API key privately in `docs/chatbot-local-setup.md`; user account actions remain pending.
- [x] Verify free-tier eligibility and that paid billing is disabled. User dashboard screenshots show Free tier and Set up billing; no billing settings were changed by the agent.
- [x] Review current free-tier data terms and note the applicable visitor notice requirements. Task 3 records product-improvement use, human review and the regional/audience restrictions in `docs/chatbot-contract.md`.
- [x] Identify an available free-tier Flash-Lite model and its actual project quotas. Recorded `gemini-3.5-flash-lite`, with screenshot quotas of 15 RPM, 250,000 TPM, and 500 RPD in `notes.md`.
- [x] If no suitable free-tier model is available, resolve this with the user before continuing live integration. Not needed: the selected model is available and a generation request succeeded.
- [x] Configure a development key/project for local use; document that real local Gemini calls consume its free-tier quota. Mocked calls can test UI and failures without consuming quota.
- [x] Add appropriate environment-file exclusions to `.gitignore` before storing local secrets; keep a placeholder example file trackable if one is added.
- [x] Configure `GEMINI_API_KEY` and `GEMINI_MODEL` in an ignored local environment file, read only by server-side code. User entered the key privately; direct Node-side verification and task 4 Netlify runtime loading succeeded.

An ignored `.env` contains the user's key and verified model. `.env.example` contains the model ID and a blank key. Authenticated model discovery and one minimal generation request passed, with HTTP 200, reply `OK`, and 7 total tokens. No key was printed. Task 3 completed the applicable data-term/notice review. Public availability handling needs a decision before hosted exposure.

**Completion check:** working local Netlify Dev setup, confirmed free-tier configuration, model and quotas recorded, no committed secret. Account actions requiring user access are completed by or with the user. No hosted preview is required.

## 2. Audit pages and approve business knowledge

- [x] Audit active routes and both layouts. List the main/business/blog pages that receive the widget.
- [x] List excluded campaign, thank-you, utility, and backup pages. Define an explicit widget visibility setting compatible with existing `funnelPage` behavior.
- [x] Review active repository content for the business facts listed in `notes.md`.
- [x] Trace published pricing and conditions to their source paths; distinguish visible current offers from stale metadata and backup content.
- [x] Draft `netlify/ai/business-info.md` with concise facts and maintainable source references.
- [x] Present missing facts, contradictions, and uncertain promotions to the user.
- [x] Obtain approval of the knowledge file and record resolved decisions.
- [x] Confirm `/contact/` remains the working enquiry destination.

Evidence: `content-audit.md` records the route list, later visibility rules, source conflicts and user review decisions. `netlify/ai/business-info.md` now uses approved homepage pricing, month-to-month terms with cancellation after 90 days and no penalty, an active 20% promotion with unconfirmed details referred to contact, and contact data from `client.js`. The user approved page coverage, explicitly excluding plumbing and cleaning landing pages. Other unknowns remain contact-only. `npm run build` passed during the audit; 22 HTML routes and generated contact form/details were checked. Hosted submission delivery remains a later check. Task 2 is complete.

**Completion check:** approved business information and a concrete widget page list. Unresolved prices are handled by contact referral, not guessed.

## 3. Specify assistant instructions and request handling

- [x] Draft `netlify/ai/system-prompt.md` using the behavior requirements in `notes.md`.
- [x] Define request JSON for the new message and bounded user/assistant history.
- [x] Define success and error response shapes and how the widget displays them.
- [x] Finalize maximum message/history/body sizes, output-token cap, provider timeout, and platform rate limits against the selected model's quotas.
- [x] Define no-paid-fallback and quota-exhaustion behavior with `/contact/` available.
- [x] Define approved link handling and safe response formatting.
- [x] Finalize welcome wording, starter questions, brief AI identification, and relevant data-use notice.
- [x] Record finalized values and decisions in `notes.md`.

Evidence: `netlify/ai/system-prompt.md` and `docs/chatbot-contract.md`. Limits are 1,000-character user messages, 2,000-character answers, up to 6 completed pairs and 12,000 history characters, 32,768 body bytes, 768 output tokens, 20-second provider timeout, 25-second browser timeout and 5 requests/minute per IP/domain. Character counts use UTF-16 code units. The contract includes strict JSON validation, safe links, bounded storage, non-JSON platform errors, no retries/paid fallback and final visitor wording. Official terms review completed task 1B and identified a regional availability decision required before public preview. Runtime verification remains in subsequent tasks.

**Completion check:** backend and frontend have a shared contract, and the limits are explicit.

## 4. Implement the Netlify Function

Depends on setup and the API contract. Live answer verification depends on approved business content.

- [x] Recheck current Netlify and Gemini documentation for the selected integration approach.
- [x] Implement `netlify/functions/chat.mjs` and expose it as `/api/chat` using supported Netlify configuration.
- [x] Configure function packaging so the business file and prompt are available after deployment but absent from public assets. Verified an extracted local archive; confirm hosted deployment in task 7.
- [x] Read the key and model only inside the server-side runtime.
- [x] Reject unsupported methods, malformed JSON, invalid roles, invalid sizes, and excessive history/body lengths before provider calls.
- [x] Build provider requests from trusted instructions, approved knowledge, and validated bounded history.
- [x] Apply output limits and timeout/cancellation handling.
- [x] Configure platform-managed rate limiting for the exposed route. Verify deployed enforcement in task 7; local emulation is not proof of platform enforcement.
- [x] Return controlled errors for missing configuration, quota/rate limits, upstream failures, timeouts, and empty/blocked answers.
- [x] Prevent shared response caching and credential/raw-provider-error exposure.
- [x] Avoid deliberate transcript logging and quota-consuming retry loops.
- [x] Verify through local Netlify Dev: a business answer, a contextual follow-up, and relevant contact link.
- [x] Add focused automated checks for meaningful validation/error/security behavior using mocked provider calls where appropriate.

Evidence: `netlify/functions/chat.mjs`, `netlify/ai/chat-handler.mjs`, `tests/chat.test.mjs` and function resource configuration in `netlify.toml`. `npm run test:chat` passed 38 checks. `npm run test:light-only` passed including build. Local API validation/routing checks, an extracted-archive resource check and six live business/follow-up/pricing calls succeeded. Tightened prompt wording after the first live conversation; the second confirmed prices, explicit post totals, cancellation conditions and contact links. Scanned 364 public files for the actual key and server-only content without exposing the key. Details and the fixed resource-path issue are in `docs/chatbot-local-setup.md`. Server stopped; no deployment or paid usage configuration.

**Completion check:** local endpoint works independently of the widget, keeps secrets private, and fails gracefully.

## 5. Implement the widget and conversation state

- [x] Add `src/_includes/components/chat-widget.html` and conditional layout inclusion for the approved page list.
- [x] Add scoped styles in `src/assets/less/chat.less` using existing colors, fonts, and build conventions.
- [x] Add `src/assets/js/chat.js` using the existing asset pipeline.
- [x] Implement the floating trigger, welcome, starters, messages, typing state, input, Send, Close, and New conversation.
- [x] Implement Enter/Shift+Enter behavior, Escape, focus management, accessible labels, and announcements.
- [x] Connect to `/api/chat`; prevent duplicate concurrent submissions and show appropriate failure messages.
- [x] Render safe text/simple formatting and validated links without trusting generated HTML.
- [x] Keep bounded, validated history in session storage across navigation and refresh, with an in-memory fallback.
- [x] Clear conversation on reset and cancel/ignore stale in-flight replies.
- [x] Keep the widget closed until explicitly opened and make no provider request merely on load/open/prerender.
- [x] Verify mobile keyboard behavior, scrolling, safe-area spacing, and conflicts with existing fixed controls. Chrome emulation and a simulated visual-viewport keyboard resize passed; physical iOS/Android checks remain part of wider verification.

Evidence: 7 widget unit/route checks and 44 mocked Chrome browser checks passed. The latter ran through Netlify Dev and cover the visitor journey, navigation, failures, reset races, storage fallback, safe restored links and mobile viewport behavior. Production build/light-only checks and a production-output browser smoke passed; all 38 backend tests still pass. Exactly seven current routes include one widget and its assets. Two real UI requests for the opening website question returned 504 at about 20 seconds, before a successful answer or follow-up could be verified. No provider/model/deadline changes or additional retries were made. Task 6 must revisit this live check.

**Completion check:** the full visitor journey works locally on included pages; excluded pages do not load/display the widget.

Follow-up evidence: after the user supplied quota screenshots, direct full-context generation and the local function both succeeded. Two real widget exchanges then returned 200, including a plumbers follow-up and rendered contact link. Navigation restored the conversation. No code or configuration change was required. Earlier timeouts did not reproduce; their exact cause remains unknown. Task 5's live completion check now passes.

## 6. Verify the full experience locally

Use the Netlify Dev address for these checks. Use real Gemini calls for answer quality and mocked responses for repeatable failure cases where appropriate.

### Answers and conversation

- [ ] Ask the four starter questions and compare answers with approved facts.
- [x] Check a trades follow-up such as "What about for plumbers?" after a website question. Passed during the follow-up 504 investigation, with the real widget and Gemini.
- [ ] Check known pricing includes conditions and unknown/custom pricing directs to contact.
- [ ] Check unknown services/facts, unrelated requests, and attempts to override assistant instructions.
- [ ] Verify no guaranteed ranking/lead claims in the review scenarios.
- [ ] Verify actual response links resolve to the correct destinations.
- [ ] Check close/reopen, reset during a request, refresh, navigation, storage failure, and bounded-history behavior.

### Failure and security checks

- [ ] Exercise oversized/malformed requests and invalid history directly against the endpoint.
- [ ] Simulate rate-limit responses to verify widget handling. Actual Netlify enforcement is checked in task 7.
- [ ] Simulate quota exhaustion, missing configuration, timeout, provider failure, and empty/blocked results.
- [ ] Inspect generated `public/` files and browser network traffic for secret exposure.
- [ ] Verify function source/resources are not published as static downloads.
- [ ] Check malicious response text/URLs cannot inject scripts or unsafe links.
- [ ] Confirm no model selection or system-instruction override is accepted from the browser.

### Site regression checks

- [ ] Run `npm run build` and appropriate existing checks, including `npm run test:light-only` where applicable. Avoid redundant builds if the latter already provides the required build check.
- [ ] Test desktop and mobile widths, keyboard operation, focus, and readable message states.
- [ ] Check main pages, blog pages, excluded pages, navigation, and the existing contact form.

**Completion check:** locally, the visitor can open chat, receive a useful grounded answer, ask follow-ups, follow contact links, and use it comfortably on mobile. Secrets remain private and the existing site still works.

## 7. Deploy to a Netlify preview and verify hosting behavior

This is a pre-release check after local implementation and verification, not a prerequisite for development.

- [ ] Confirm the connected Netlify site, repository, production branch, build settings, and account plan.
- [ ] Before public preview exposure, resolve and implement supported-region access and unknown-location handling for the free-tier-only Gemini client. Current terms require Paid Services for EEA/UK/Switzerland visitors. Review account-holder location and intended age audience against the terms documented in `docs/chatbot-contract.md`; do not rely on a notice or browser-only check.
- [ ] Check current function allowances, usage charging/limits, and rate-limit feature availability before deploying.
- [ ] Establish a development branch or pull-request preview workflow without changing production.
- [ ] Decide preview/production key and project arrangements; document shared quota with local development where applicable.
- [ ] Configure `GEMINI_API_KEY` and `GEMINI_MODEL` privately for the preview. Use Functions scope where supported.
- [ ] Deploy and verify `/api/chat` routing, runtime environment variables, and inclusion of knowledge/prompt resources in the function bundle.
- [ ] Confirm function source/resources and credentials are absent from public downloads and browser responses.
- [ ] Verify configured platform rate limiting covers the exposed route without unnecessarily consuming Gemini quota.
- [ ] Smoke-test an answer, follow-up, contact link, and mobile widget on the preview; investigate any difference from local behavior.
- [ ] Verify preview packaging and environment configuration match production needs.
- [ ] Obtain user review of the working preview and record any changes requested.

**Completion check:** the locally verified chatbot also works on Netlify, including deployment-specific configuration and platform controls.

## 8. Documentation and production release

- [ ] Write a short maintenance README using the repository's documentation conventions.
- [ ] Document business-file updates, source review, prompt changes, and redeployment requirements.
- [ ] Document environment variables, selected model, local workflow, preview workflow, and secret handling.
- [ ] Document free-tier quotas, quota-unavailable behavior, and separate Netlify usage considerations.
- [ ] Document replacing the developer key with the owner's production key privately in Netlify and verifying the replacement.
- [ ] Document disabling the widget/endpoint and rolling back the deployment.
- [ ] Configure the owner's production project/key and confirm it remains free-tier-only.
- [ ] Release after preview review and user authorization for production deployment.
- [ ] Smoke-test the production endpoint, widget, contact link, and mobile experience.
- [ ] Update both feature documents with actual paths, final decisions, verification results, and remaining follow-ups.

**Completion check:** production works, the owner controls the credential, and another developer can maintain the feature using the documentation.

## Session handoff

### Latest session

- Date: 2026-10-01, user widget design review.
- Changes: collapsed full message disclosure with a visible short notice; larger homepage-blue launcher, clear icon/supporting copy, homepage Work Sans/Poppins typography and sharper panel/buttons.
- Build fix: caught mixed source/bundled JavaScript causing a hidden launcher. Excluded JS from asset passthrough and changed the compiler to return output through Eleventy, with inline development maps. Added a built-module parse regression check.
- Verification: production build/light-only, 8 widget tests and 46 mocked browser checks passed. Actual-font desktop/mobile screenshots reviewed. No provider calls or deployment.
- Next: user review at localhost:8888 and remaining task 6 checks.

### Follow-up timeout investigation

- Date: 2026-10-01, follow-up 504 investigation requested by the user.
- Outcome: no quota exhaustion shown in user screenshots; no currently reproducible failure. Direct full-context handler returned 200 in 1,450 ms; local endpoint returned 200 in 1,692 ms; two real widget exchanges returned 200 with function times of 2,140 and 1,434 ms. Contact-link navigation and session restoration passed. Four generation calls total.
- Changes: investigation notes only. No source, key, prompt, model, deadline or billing change. Temporary diagnostics outside the repository used injected fetch timing without logging credentials/provider bodies.
- Limitation: earlier 504s were application deadline expirations; their underlying cause remains unproven. Successful current tests do not establish whether the earlier delay was provider-side or in the local runtime/network.
- Server: pre-existing Eleventy on 8080 preserved. Investigation's Netlify Dev serves `public` and the function at `http://localhost:8888/`, left running for user testing.
- Next: task 6's remaining answer/security/regression checks. If 504 recurs, instrument the failing runtime before increasing deadlines. Public preview decisions remain task 7 prerequisites.

### Widget implementation session

- Date: 2026-10-01, task 5 widget implementation.
- Completed: all task 5 implementation items and mocked UI verification. Successful live widget answers remain unverified in this session because both attempts timed out.
- Added: `src/_includes/components/chat-widget.html`, `src/assets/js/chat.js`, `src/assets/less/chat.less`, generated `src/assets/css/chat.css`, `tests/chat-widget.test.mjs`, `tests/chat-widget.browser.mjs`, and `npm run test:chat-widget`.
- Updated: conditional base layout, six page front matters, blog directory data, contract/setup guide and maintained feature documents.
- Verification: 7 widget tests, 44 mocked browser checks, 38 backend tests, production build/light-only check and production-output browser smoke passed. Screenshots reviewed at desktop and mobile sizes. Real UI calls returned 504 in 20,246 ms and 20,110 ms. An unauthenticated public Google API host check returned 404 in 118 ms, which establishes basic connectivity but not generation availability. Cause of the live timeouts is unresolved.
- Fixes from verification: module script loading supports source JavaScript copied by the existing asset pipeline; explicit Tab wrapping keeps focus in the modal; LESS escaping preserves browser-side max/env/var expressions for safe areas and keyboard positioning.
- Browser tooling: desktop browser tool was disconnected. Used Playwright 1.63.0 installed outside the repository and local Chrome. Reproduction commands are in `docs/chatbot-local-setup.md`. All browser-suite provider responses are mocked; physical-device and screen-reader checks remain for wider verification.
- Repository state: earlier work preserved, unrelated build-generated CSS line-ending changes restored. Netlify Dev and the temporary production smoke server stopped. No deployment, commit, key/model/billing change or secret inspection.
- Next concrete step: task 6, first investigate/recheck live generation through Netlify Dev, then complete answer-quality, failure/security and site-regression checks. Task 7 regional availability decisions remain pending.

### Previous backend session

- Date: 2026-10-01, task 4 backend implementation.
- Completed: all task 4 items. Task 5 is next.
- Added: `netlify/functions/chat.mjs`, `netlify/ai/chat-handler.mjs`, `tests/chat.test.mjs`. Updated `netlify.toml`, `package.json`, the prompt, contract, setup guide and tracking documents.
- Verification: 38 offline checks passed; site build/light-only check passed; live Netlify Dev routing and validation passed; archive extracted outside repository and invoked successfully with mocked Gemini; six live Gemini answers succeeded; 364 public files scanned for private key/server content. No key was printed or placed in public output.
- Fixes from verification: module-relative Markdown paths must survive Netlify V2 inlining/relocation. Prompt now avoids unsolicited plan lists, unconfirmed surrounding-area coverage and ambiguous social-post counts. No business knowledge values changed.
- Runtime: 768-token cap, 20-second provider deadline and default model thinking/sampling settings worked. Local request response times were about 1.3 to 2.0 seconds. No automatic retries or model/billing changes.
- Repository state: preserved prior uncommitted setup/spec work; restored only build-generated CSS line-ending changes. Netlify Dev stopped after verification. No deployment.
- Outstanding before public preview: regional/audience applicability decision, account plan/allowances and deployed rate enforcement. Current documentation and local checks show the custom route disables the default function URL; verify this again when hosted.
- Next concrete step: task 5, implement the widget and conversation state using `docs/chatbot-contract.md` and approved page coverage.

### Previous specification session

- Date: 2026-10-01, task 3 specification.
- Completed: all task 3 items and task 1B data-term/notice review.
- Files added: `netlify/ai/system-prompt.md`, `docs/chatbot-contract.md`. Updated `notes.md`, this tracker, `content-audit.md` status and `docs/chatbot-local-setup.md` references.
- Decisions: strict bounded request/response contract; finalized numeric limits; plain text with allowlisted links; no partial answers, automatic retries or paid fallback; exact welcome/AI/data/storage wording.
- Documentation: Context7 Gemini lookup plus official generateContent reference, Gemini terms and Netlify rate-limit documentation. No live provider call or credential read.
- Verification: focused Node assertions passed for six Markdown files' whitespace/conflict-marker hygiene, three parsed JSON examples, 12 matching prompt/contract link destinations, history/body size arithmetic and all eight task 3 checkboxes. Reviewed the prompt against the approved business conditions. API/widget behavior is not implemented or verified yet. No site build was needed for these Markdown-only changes.
- Outstanding release decision: free-tier Gemini cannot be offered unrestricted to EEA/UK/Switzerland visitors under the reviewed terms. Resolve regional handling and audience applicability before public preview. Local backend work can proceed.
- Next concrete step: task 4, implement and test `netlify/functions/chat.mjs` against `docs/chatbot-contract.md`.

### Previous approval session

- Date: 2026-10-01, task 2 approval recorded.
- Completed: user-approved knowledge/pricing and page coverage; task 2 completion checkbox.
- Files updated: `netlify/ai/business-info.md`, `.scratch/bespoke-ai-chatbot/content-audit.md`, `notes.md`, `tasks.md`.
- Decisions: homepage plans and inclusions; published 90-day cancellation wording; active 20% promotion without invented discount terms; contact data from `client.js`; all proposed page exclusions, including plumbing and cleaning. Unknown details remain contact-only.
- Scope: documentation/knowledge changes only. API, widget and public website copy remain as before. Detailed cancellation terms await the client's clarification.
- Verification: reviewed documentation consistency and package values against the audited homepage. No rebuild needed for these Markdown-only edits; the prior route/build verification still applies.
- Next concrete step: task 3, assistant instructions and request handling. Task 1B's data-term/notice review also remains open.

### Previous audit session

- Date: 2026-10-01, task 2 content audit.
- Completed: route/layout audit, business-content review, source-traceable pricing/terms comparison, proposed page coverage and `chatEnabled` setting, knowledge draft, contact destination verification.
- Files added: `.scratch/bespoke-ai-chatbot/content-audit.md`, `netlify/ai/business-info.md`. Updated this tracker and `notes.md`.
- Verification: `npm run build` passed. Checked 22 generated HTML routes, enquiry form/contact data and explicit source paths in both new documents. Build-generated CSS line-ending changes were inspected and restored. No secret access, Gemini request, source-page edit or deployment.
- Blocker: user approval. Homepage prices conflict with About and older Services content. Promotions, cancellation, currency/taxes/ad budget, email, service scope and selected page classifications need review. Full questions are in `content-audit.md`.
- Next concrete step: resolve the six approval questions, update the business knowledge file with approved facts/prices or explicit contact-only decisions, record approval and finish task 2. Do not start API/widget work yet.

### Previous setup session

- Date: 2026-10-01.
- Completed: task 1A local setup, secret-file ignore rules/templates, and Gemini setup guidance. Added Netlify CLI 27.10.2, `npm run dev`, `npm run dev:site`, and `[dev]` settings in `netlify.toml`.
- Implementation status: local setup and direct Gemini access work; API and widget not implemented. Root `.env` contains the user's private key and verified `gemini-3.5-flash-lite` model.
- Files changed: `.gitignore`, `package.json`, `package-lock.json`, `netlify.toml`, `.env.example`, local ignored `.env`, `README.md`, `docs/chatbot-local-setup.md`, and feature tracking documents.
- Verification: baseline `npm run build` passed; local Netlify Dev returned HTTP 200 with Bespoke HTML; `node scripts/check-light-only.js` passed; Git ignore rules verified. Server was stopped after verification. Later, authenticated Gemini model discovery and one generation request passed with HTTP 200, expected `OK`, and 7 total tokens. No deployment performed.
- Install observations: npm reported 23 dependency vulnerabilities on the original install and 27 after adding the CLI. No broad dependency audit fixes were applied. No tracked CSS content changes remain from the build.
- Accounts: Gemini free-tier status and quota screenshots reviewed; API access tested using the user's local key without printing it. No billing changes or Netlify login/site link performed.
- Immediate next step: task 2, repository page/content audit and business knowledge preparation. Final data-term/notice review remains open. Hosted preview remains deferred to task 7.
- Outstanding inputs: approved business facts/pricing, exact page coverage, and final request/output/rate-limit settings based on recorded model quotas. Netlify account details/access are needed for the later preview and release stages.

### Future session update template

```text
Date:
Completed task IDs/checkboxes:
Files changed:
Decisions and their reasons:
Verification performed and results:
Blockers or user inputs needed:
Next concrete step:
```
