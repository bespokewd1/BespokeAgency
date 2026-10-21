# Iron Fist portfolio assets

The screenshots show the real landing page at https://ironfisttransport.ca/.
The source logo is the site's original transparent `/_astro/ironfist-logo.ycsiDIYx.webp`.
The captures and logo were checked against the live site on October 21, 2026.

- `desktop.webp`: 1440 by 900 desktop viewport.
- `mobile.webp`: 390 by 844 mobile viewport.
- `logo.webp`: original 2048 by 661 transparent logo.

The screenshots are not AI-generated or reconstructed page designs. The generator
puts them into editable vector device frames, without stretching either viewport.
The square composition keeps the devices inside the central 16:9 crop used by the
homepage service card. The separate laptop export has a transparent background.

Regenerate the four published WebP assets from the repository root:

```sh
node scripts/build-ironfist-assets.cjs
```

The script uses Sharp, available in the current development installation. If it is
not installed in a future environment, provide it with the development tooling.
The site serves the generated images and does not run the generator during builds.

To refresh the captures, open the live homepage at the viewport sizes above, wait
for fonts and visible images to load, and capture the viewport rather than the full
page. Replace only these source files, regenerate, and review the overview, service
and portfolio crops at desktop and mobile sizes. Keep the original MPC assets,
branding example and carousel logo unchanged.

After building the site, check the published assets and markup with:

```sh
node --test tests/homepage-clients.test.mjs tests/social-metadata.test.mjs
```

For responsive browser checks, set `PLAYWRIGHT_PATH` and `CHROME_PATH` as described
in `docs/chatbot-local-setup.md`, then run `node tests/homepage-clients.browser.mjs`.
It serves the production `public` directory locally and closes the server when done.
`BUILD_DIR` can select a separate build directory for either check. Set
`CLIENT_SCREENSHOTS` to a directory to save desktop, tablet and mobile previews.
