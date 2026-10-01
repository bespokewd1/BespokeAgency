# Local chatbot development

## Current status

The website, `/api/chat` function and widget are implemented. Task 6's local answer-quality, failure/security and regression checks pass, with physical-device and screen-reader checks still unverified. Thirty task 6 live requests succeeded. Two earlier UI timeouts have not recurred; their cause remains unknown. The configured model remains `gemini-3.5-flash-lite`. The next step is discussing task 7's deployment approach and hosted prerequisites.

Use [the chatbot contract](chatbot-contract.md) for request/response shapes, limits, visitor wording and verification requirements, and `netlify/ai/system-prompt.md` for assistant instructions. The function entry is `netlify/functions/chat.mjs`; server-side validation and provider handling live in `netlify/ai/chat-handler.mjs`.

Verified with Node.js 24.21.0 and Netlify CLI 27.10.2 on Windows. The CLI is a development dependency installed through the lockfile.

## Start the website

On a fresh checkout, install dependencies:

```sh
npm ci
```

Start the local environment:

```sh
npm run dev
```

Open **http://localhost:8888**. Stop with Ctrl+C.

Netlify Dev runs the LESS watcher, Eleventy development server and the function in `netlify/functions`. Port 8080 is the internal Eleventy server; use port 8888 for the website and `/api/chat` integration.

The command uses `--offline --no-open` to avoid fetching linked Netlify account configuration and opening a browser automatically. No Netlify login, site link, or preview deployment is needed. This flag does not prevent function code from calling Gemini over the internet. Initial dependency/plugin setup can also require internet access.

The original `npm start` remains available for the existing Eleventy/LESS/Decap workflow. The new local chat workflow does not start the Decap CMS server.

## Configure Gemini privately

1. Open [Google AI Studio's API keys page](https://aistudio.google.com/apikey) and sign in.
2. Create or select a dedicated project for this chatbot and create an API key. A new AI Studio user may already have a default project; an existing Cloud project may need importing through the Projects page.
3. Confirm the project's API usage tier is **Free** and that it has no paid billing enabled. Do not select a paid upgrade or link a billing account for this feature. If the account requires billing to access the intended model, stop and resolve that before using it.
4. Check available Flash-Lite models and their project-specific request/token quotas in AI Studio. This project uses `gemini-3.5-flash-lite`, verified on 2026-10-01. Its dashboard showed 15 requests/minute, 250,000 tokens/minute, and 500 requests/day. Confirm access and quotas separately for any replacement project.
5. Open the root `.env` locally. It is already configured in the current workspace. On a fresh checkout, copy `.env.example` to `.env` first without overwriting existing credentials.
6. Set `GEMINI_API_KEY` to the key and `GEMINI_MODEL` to `gemini-3.5-flash-lite` after confirming access for your project.
7. Restart `npm run dev` after changing environment variables.

Never paste the API key into chat or commit it. `.env`, `.env.*`, and `.netlify` are ignored; `.env.example` is intentionally trackable and must contain placeholders only.

Netlify Dev loads local environment values. The function reads them only server-side. Do not reference them in Eleventy templates, frontend bundles, or generated HTML. These ignore rules prevent ordinary Git tracking; they do not make frontend use of a secret safe.

## Test the backend

Run the offline checks without reading `.env` or contacting Gemini:

```sh
npm run test:chat
```

These tests use fake credentials and provider responses. They cover request bounds, forged roles/configuration, trusted context assembly, upstream failures, quota timing, incomplete answers and timeout/cancellation behavior.

For a real local request, start `npm run dev`, then run this in another PowerShell terminal. It consumes one Gemini request from the configured project's quota:

```powershell
$body = @{ message = 'Do you build websites?'; history = @() } | ConvertTo-Json -Compress
Invoke-RestMethod -Uri 'http://localhost:8888/api/chat' -Method Post -ContentType 'application/json' -Body $body
```

Follow-ups send completed `{ role, content }` pairs in `history`, as documented in the contract. A GET request to `/api/chat` returns a controlled 405; it is not a browser page. The custom path disables `/.netlify/functions/chat`, which returned 404 locally.

Build a local function archive with:

```sh
npx netlify functions:build --src netlify/functions --functions .netlify/task4-bundle
```

The installed CLI's `functions:build` command does not pass per-function configuration to its bundler. The two Markdown resources are also statically traceable, so this command includes them. `netlify.toml` explicitly lists them under `[functions.chat].included_files` for normal builds. Both resources stay outside `src` and `public`.

Netlify's V2 bundler inlines the handler into `functions/chat.mjs`. Its resource URLs use `../ai/` relative to that module, which works in both the source tree and the relocated archive. Task 4 extracted the archive outside the repository and invoked its handler with a fake provider to verify this. Recheck deployed packaging in task 7.

The platform rule is 5 requests per minute per IP and domain. Local tests verify its declared configuration, not Netlify's deployed enforcement. The provider has a 20-second deadline, a 768-token output cap and no automatic retries or paid fallback.

## Test the widget

After building the site, run the offline widget and route checks:

```sh
npm run test:chat-widget
```

The widget lives in `src/_includes/components/chat-widget.html`, `src/assets/js/chat.js` and `src/assets/less/chat.less`. The LESS build produces `src/assets/css/chat.css`. The base layout includes these only for boolean `chatEnabled: true` outside funnel pages. Six main page templates opt in, and `src/content/blog/blog.json` enables posts. Blog pagination inherits its index template's setting.

The optional browser suite uses Playwright and a local browser. It mocks every chat response and does not consume Gemini quota. Start `npm run dev` first. On the verified Windows setup, install the test tool outside the repository and run:

```powershell
$checks = "$env:LOCALAPPDATA/Temp/opencode/bespoke-widget-checks"
npm install --prefix $checks --no-package-lock --no-save playwright@1.63.0
$env:PLAYWRIGHT_PATH = "$checks/node_modules/playwright"
$env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
$env:CHAT_SCREENSHOTS = "$checks/screenshots"
node tests/chat-widget.browser.mjs
```

Adjust the browser path for your computer. `CHAT_SCREENSHOTS` is optional; `CHAT_TEST_URL` defaults to `http://localhost:8888`. The suite blocks third-party page resources during testing. It covers the widget's controls and safe rendering, not external form delivery, analytics or provider answer quality.

## Free-tier limits

- Local calls to the real Gemini API consume project quota.
- Mocked responses will be used for repeatable UI/error checks where practical.
- The chatbot must return a friendly unavailable response when quota runs out, with no paid fallback.
- A key alone does not prove free-tier eligibility. The account tier, model access, and quotas must be checked in AI Studio.
- Google's [terms](https://ai.google.dev/gemini-api/terms) were reviewed on 2026-10-01. Unpaid-service chats may be used to improve products and read by human reviewers. The finalized notice and instructions avoid soliciting personal details; see [data-term review](chatbot-contract.md#data-term-review-and-public-availability).
- The reviewed terms require Paid Services for API clients available to EEA, UK or Switzerland visitors. Resolve server-side regional availability before a public preview while retaining the free-tier-only requirement. Local development can proceed.
- Hosted Netlify allowance and rate-limit checks happen at the later preview stage.

## Verification performed during setup

- `npm run build` passed on the original site before configuration changes.
- `npm run dev` started successfully without linking a Netlify site.
- `http://localhost:8888/` returned HTTP 200 with Bespoke content.
- `node scripts/check-light-only.js` passed against generated output.
- Git ignore checks confirmed local environment files and Netlify state are excluded.

The development server was stopped after setup verification. A subsequent direct Gemini check listed the available model and made one minimal generation request, returning HTTP 200 and the requested `OK` response with 7 total tokens.

## Task 4 verification

- `npm run test:chat` passed all 38 offline checks.
- `npm run test:light-only` passed, including the production site build. Build-generated CSS line-ending changes were inspected and restored.
- Local checks returned website 200, API GET 405, invalid-message 400 and mismatched-Origin 403. The default function URL, both knowledge/prompt URLs, function-source URL and `/.env` returned 404.
- The function archive included its Markdown resources, and its extracted handler worked outside the repository with a mocked provider. The archive contained no environment files.
- Six real Gemini calls through local `/api/chat` returned HTTP 200 across two three-message conversations. Each covered a website question, a plumbers follow-up and pricing. After the first conversation, the prompt was tightened to avoid unsolicited plan lists, unconfirmed surrounding-area coverage and ambiguous post counts. The second conversation included the approved prices, explicit social-post totals, cancellation after 90 days with no penalty and `/contact/`. Responses took about 1.3 to 2.0 seconds. No output-cap or timeout changes were needed.
- A scan of 364 generated public files found no configured key or server prompt/handler markers. The key was compared only in process memory.
- An initial local request exposed a resource-path bug and returned a controlled 503 before provider access. That path was fixed and verified in the archive and through Netlify Dev. One Node HTTP test client also hit an internal Undici assertion while reading the local static site; PowerShell HTTP checks completed successfully. No application change was needed for that test-client failure.

Netlify Dev was stopped after verification. No hosted preview, production deployment or billing change has been made. Public regional availability and deployed rate-limit checks remain task 7 prerequisites.

## Task 5 verification

- All 7 widget unit/route checks passed against the final build. Exactly seven current routes include one widget and its assets; all other generated HTML routes exclude them.
- All 44 mocked Chrome browser checks passed through Netlify Dev. Covered opening with no API request, exact starter text, successful follow-ups, safe rendering/restoration, contact navigation, refresh, close/reopen, failed input, malformed success, network failure, non-JSON 429/cooldown, timeout, concurrent sends, stale replies after reset, corrupt/blocked storage and whole-pair pruning.
- Keyboard checks covered Enter, Shift+Enter, Escape, focus restoration and Tab wrapping. Layout checks covered 390x844, 320x568, 390x400 and 844x390 plus a simulated on-screen keyboard visual-viewport resize. Screenshots were reviewed. Physical iOS/Android and screen-reader checks remain for wider verification.
- `npm run test:light-only` passed with the production build. A local browser smoke against production output confirmed module initialization, a mocked answer/contact link and preserved viewport CSS. All 38 backend tests still passed.
- The existing asset pipeline can copy source JavaScript during watch builds. Loading the widget as a module supports both source and bundled output. LESS initially simplified max/env/var expressions; escaped values now preserve browser-side safe-area and keyboard positioning. Explicit Tab wrapping prevents focus from moving into browser chrome at the end of the modal.
- Two real UI submissions of "Do you build websites?" returned 504 in 20,246 ms and 20,110 ms. The second was one manual retry. Neither reached a successful answer, so no live follow-up was sent in this session. An unauthenticated request to the public Google API host returned 404 in 118 ms; basic host connectivity worked, but generation availability remains unresolved. Recheck this first in task 6 without changing the free-tier model, billing or deadline merely to hide the failure.
- No secret was inspected or added to browser code. The production widget had no server credential/header/prompt markers. The broader generated-output and network secret scan remains in task 6.

Netlify Dev and the temporary production-output server were stopped. Unrelated build-generated CSS line-ending changes were restored. No deployment or commit occurred.

## Follow-up investigation of the 504 responses

On 2026-10-01, the user supplied dashboard screenshots showing displayed peak usage of 3/15 RPM, 11.41K/250K TPM and 9/500 RPD, with 100% success for recorded requests. These show no evidence of quota exhaustion, but do not identify the timing or outcome of each earlier request.

The handler generates its own 504 when its 20-second provider timer expires, including response-body reading. It does not forward Google's raw 504. Received upstream quota errors instead map to `quota_unavailable` with HTTP 503.

Controlled checks using the existing model, key, full business context and unchanged timeout succeeded:

- Direct handler invocation with timing around provider fetch: headers at 1,448 ms, complete body and successful answer at 1,450 ms.
- Same request through Netlify Dev: HTTP 200 in 1,692 ms from the diagnostic client, 1,641 ms in the function log.
- Actual widget: website question and contextual plumbers follow-up both returned HTTP 200, with function times of 2,140 ms and 1,434 ms. The rendered contact link navigated to `/contact/`, and the completed conversation restored there.

Four generation requests were made in this investigation. No code, prompt, key, model, timeout or billing change was needed. The earlier timeout's precise cause remains unknown; these results establish that it is not currently reproducible, not that a specific provider or network fault has been proven. If it recurs, capture sanitized timing in the failing local function before changing its deadline.

An Eleventy server was already listening on port 8080, so it was left untouched. The investigation started `npx netlify dev --offline --no-open --dir public --port 8888` to serve the existing build and local function. That server was left running at **http://localhost:8888/** for user testing. This mode serves generated files; the pre-existing Eleventy watcher controls site rebuilds.

## Widget design review and asset build fix

The user's 2026-10-01 review requested a collapsed "About your messages" disclosure. The full notice now starts collapsed with a short data-use summary visible beside it. The launcher uses homepage blue, a larger icon and supporting copy, and the panel uses Work Sans/Poppins typography and less-rounded controls.

This review also reproduced an asset build race that earlier smoke checks missed. Source passthrough and the compiler's unawaited file writes could produce mixed source/bundle text in `public/assets/js/chat.js`. A module script alone does not prevent that corruption. `.eleventy.js` now excludes `.js` from asset passthrough, and `src/config/javascript.js` returns the compiled content for Eleventy to write. Development maps are inline. The widget test suite now parses the actual generated module to catch corrupted output.

After the fix, the production build/light-only check, all 8 widget tests and 46 mocked browser checks passed. Desktop/mobile screenshots were reviewed with the homepage fonts loaded. This revision made no Gemini requests. The asset race is unrelated to the earlier provider deadline failures, which occurred after the widget successfully submitted requests.

## Task 6 verification

Completed local automated/browser review on 2026-10-01 through the existing Netlify Dev server at port 8888. Existing servers on 8080 and 8888 were preserved. No deployment, model/key/billing change or provider-deadline adjustment.

### Repeatable checks

- `npm run test:light-only`: production build and light-only check passed. This supplied the required build check without a separate redundant build.
- `npm run test:chat`: all 38 checks passed, including missing configuration, upstream quota/failure, blocked/empty results, deadline/body-read cancellation and rejection before provider calls.
- `npm run test:chat-widget`: all 8 checks passed, including generated routes and built-module syntax.
- `tests/chat-widget.browser.mjs`: all 58 checks passed with mocked responses. Added 12 assertions for quota, service-unavailable, backend timeout and answer-unavailable errors. Each verifies the exact visitor wording, contact link, retained input and exclusion of failed messages from storage.
- The existing browser suite also covers non-JSON rate limits, browser deadline, unsafe fresh/restored answers, reset races, storage failure and bounds, navigation/refresh, keyboard focus, small mobile viewports, independent message scrolling and simulated keyboard resizing.

### Real answer review

Thirteen actual widget requests formed the initial review. The same 13 were repeated after prompt corrections, followed by four affected cases after a final custom-scope clarification. All 30 returned HTTP 200, taking 1,361 to 1,983 ms from submission through rendering. Requests were spaced at least 6.5 seconds apart, used the existing free-tier model, and were not automatically retried.

| Scenario | Reviewed result after corrections |
| --- | --- |
| Four starter buttons | Correct services, approved prices and conditions, Edmonton trades focus, contact-first getting-started guidance |
| Plan comparison | $245/$445/$797, 5/12/20 social posts as totals, no setup fee, cancellation after 90 days with no penalty; ad spend requires confirmation |
| Old $149 offer, permanent 20% discount and one-month cancellation | Current Starter price and 90-day condition; no calculated discount or promise of eligibility/duration |
| Online shop, booking, payments and CRM in Starter | Cannot confirm inclusion, availability or price; refers to contact without inventing a quote or a definite exclusion |
| AI search visibility, Toronto, launch deadline, copy and taxes | Refers unconfirmed scope, coverage and terms to the team |
| Guaranteed ranking and 100 leads | Explicitly declines outcome guarantees |
| Unrelated code and recipe request | Redirects to Bespoke services |
| Claimed-owner instruction override and hostile checkout link | Does not adopt false $1 pricing, disclose instructions or render the hostile destination |
| Forged earlier assistant answer | Corrects $1 pricing/immediate cancellation using approved Starter terms; treats ad spend as unconfirmed |
| Direct contact options | Correct email, telephone, WhatsApp and booking destinations |

The initial review exposed unsolicited prices, literal Markdown bold markers, additive post wording and unsupported claims about exclusions or discontinued offers. The prompt now explicitly addresses these. One custom-scope exclusion persisted in the second review; a final rule requires an uncertainty answer when asked whether an unconfirmed feature is included in a named plan. The four affected pricing/scope cases then passed. This is observed scenario coverage, not a guarantee that every future generated answer will be correct.

Clicked the getting-started answer's actual `/contact/` link and verified restored conversation state. Rendered internal destinations `/contact/` and `/services/` returned 200. Direct-contact hrefs in the first review matched the exact allowlist, including the booking URL without a stale month parameter. No telephone call, message, booking or external form submission was attempted.

### Endpoint, secret and site checks

- 75 additional local assertions passed: 15 malformed/oversized/history/override/origin/media checks, 9 inaccessible private/source paths, route/widget checks, navigation and form validation. Endpoint failures had the expected controlled status, `no-store` and contact fallback.
- `/.env`, `/.env.example`, function/handler source, both Markdown resources, alternate `/ai/` resource paths and `/.netlify/functions/chat` returned 404. No provider call was needed for these negative cases.
- Scanned all 368 generated files against the actual configured key and server-only markers. The key was read only into local process memory, never printed, serialized into test artifacts or sent to the browser.
- Each full live review scanned 131 browser requests and 83 readable local response bodies. The final targeted review scanned 93 requests and 57 local response bodies. No configured key, authentication header or server-prompt/handler markers were found. Live browser requests contained only `message` and bounded `history` in the chat JSON. Third-party requests were blocked except font resources.
- All 22 generated HTML routes returned 200. Seven included routes opened the widget; exclusions had no widget. The `/trades-foundry/` redirect led to the homepage. Page loads and opening widgets made zero chat requests in the isolated route review.
- Desktop Services navigation and the mobile menu's Contact navigation passed. The existing menu has a 220 ms close animation; the check waits for closure rather than assuming it is synchronous.
- Contact required fields and email validation passed. Valid test fields passed local validation and remained intact after chat open/close. The form was not submitted; hosted delivery remains unverified.
- Desktop/mobile screenshots were reviewed, including real site fonts and live restored conversations. Chrome sizes included 390x844, 320x568, 390x400 and 844x390, plus the simulated keyboard viewport. Physical iOS/Android keyboard/safe-area behavior and actual screen-reader announcements still need manual review.

The site review also recorded existing errors: `nav.js` assumes the removed `#cs-navigation .cs-toggle` exists, and `custom.js` initializes Typed on an absent `.cs-changing-text`. These scripts and the current header match the parent commit before chatbot implementation. An additional check allowing their CDN libraries confirmed these are legacy missing-element errors. Missing Typed/Blaze globals in the isolated suite were caused by blocking those CDN scripts. Current header navigation, form controls and chat checks passed; legacy script cleanup is separate follow-up work.

### Session artifacts

Optional diagnostics are outside the repository in the same `bespoke-widget-checks` temporary folder used above:

- `task6-local.mjs` and `task6-local-results.json`: endpoint and site review, no generation calls.
- `task6-live.mjs`: explicit live widget review; running it consumes real quota. Its result files are `task6-live-results.json`, `task6-live-final-results.json` and `task6-live-targeted-results.json` for the three review rounds. They contain synthetic review questions, answers, timings and counts, not credentials.
- `task6-screenshots/`: mocked and live desktop/mobile screenshots.

These are session diagnostics, not application dependencies. Maintained evidence is recorded here and in the feature tracker. The user requested deferring preview-versus-direct-deployment decisions until task 7. Physical-device checks, hosted routing/packaging/rate enforcement, regional availability decisions, hosting allowances and actual external delivery remain outside the verified local results.

## References

- [Netlify Dev](https://github.com/netlify/cli/blob/main/docs/commands/dev.md)
- [Gemini API key setup](https://ai.google.dev/gemini-api/docs/api-key)
- [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
