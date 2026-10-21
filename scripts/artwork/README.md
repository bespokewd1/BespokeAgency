# Homepage share graphic

- Editable source: `scripts/artwork/home-og.html`.
- Export: `src/assets/images/og/home-og-v2.jpg`, exactly 1200 x 630 pixels.
- Local inputs: `cta-bg.webp`, `bespokelogonotexttt.png`, Work Sans italic variable and Poppins 400/700 under `src/assets/`.

The artwork keeps the previous graphic's navy, blue and white palette, photograph and heavy italic headline. It uses only the approved Bespoke copy. The older OG files remain unchanged.

## Regenerate

Use Node.js 20 or newer, Playwright 1.63.0 and a Chromium browser. Reuse the external installation from `docs/chatbot-local-setup.md`, or install it outside the repository:

```powershell
$checks = "$env:LOCALAPPDATA/Temp/opencode/bespoke-widget-checks"
npm install --prefix $checks --no-package-lock --no-save playwright@1.63.0
$env:PLAYWRIGHT_PATH = "$checks/node_modules/playwright"
$env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
node scripts/generate-home-og.mjs
```

Run from the repository root. Change `CHROME_PATH` for your browser, or omit it to use Playwright's installed Chromium. If Playwright resolves normally, `PLAYWRIGHT_PATH` is optional. No package changes, dev server or site build are needed.

Open `scripts/artwork/home-og.html` directly in a browser to edit and preview it locally. The source sits outside Eleventy's `src` directory, so it creates no public preview route. To export a review copy without replacing the final JPEG:

```powershell
node scripts/generate-home-og.mjs "$env:LOCALAPPDATA/Temp/opencode/home-og-v2-review-unique.jpg"
```

The generator blocks HTTP assets, waits for every local image and font, checks approved copy and safe margins, then captures at 1x with JPEG quality 94. It checks the decoded dimensions and a 250,000-byte limit before writing. Browser rasterization can produce small byte differences between runs. Compare the rendered artwork, not file hashes.

After edits, inspect the JPEG at full size and at roughly 600 x 315. Check headline legibility, photo contrast, price, logo and domain. If approved wording changes, update the generator's copy assertions too.
