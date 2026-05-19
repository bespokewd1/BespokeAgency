# Bespoke Client Update Tasks

Track status with:
- `[ ]` not done
- `[x]` done

## Tasks

1. [x] Remove non-trades examples from homepage.
   - Remove iMassage.
   - Remove YEG Carpet Cleaning.
   - Remove Merit Embroidery.
   - Main file: `src/index.html`

2. [x] Update trusted/client logo carousel.
   - Remove iMassage logo.
   - Consider removing massage/non-trades logos too: Kabayan Massage, Stone Massage.
   - Keep trades/service clients only.
   - Main file: `src/index.html`

3. [x] Update "We specialize in 6 key services" section images and labels.
   - Branding & Logo Design: use MPC updated logo.
   - Web Design: use Rod's Electric mock image.
   - Social Media Management: use SquadV laptop/mobile mockup.
   - Hosting & Unlimited Edits: use KMS mobile mockup.
   - Main file: `src/index.html`
   - Asset note: Rod's Electric mock image may be missing; only logo found at `src/assets/images/client-logos/rods-electric.webp`.

4. [x] Replace/add SEO landing section copy.
   - Heading: `Edmonton's Top Choice for Trades Digital Marketing`
   - Body: client-provided copy about setup, improvement, growth, autopilot marketing, affordability, and results.
   - Include 6 key areas:
     - Branding & Logo Design
     - Website Development
     - Social Media Support & Management
     - SEO
     - Automation
     - Content Strategy
   - Main file: `src/index.html`

5. [ ] Update pricing tier names and short descriptions.
   - `STARTER`: `Get online professionally. Website + Social media`
   - `GROWTH`: `Full online presence managed`
   - `DOMINATE`: `Automation, authority, and serious scaling.`
   - Main file: `src/index.html`

6. [ ] Replace CTA section with Charles founder CTA.
   - Heading: `Ready to strategize your business?`
   - Add client-provided Charles intro copy.
   - Add placeholder image area for future Charles laptop/office photo.
   - Main file: `src/index.html`
   - CSS file: `src/assets/css/blue-collar-home.css`

7. [ ] Replace all CTA/call buttons on homepage.
   - No call button.
   - No visible phone number.
   - Button 1: Text, link `sms:+17802638028`
   - Button 2: WhatsApp, link `https://wa.me/17802638028`
   - Button 3: Book, link `https://calendly.com/arjiv28/30min?month=2026-05`
   - Main file: `src/index.html`

8. [ ] Update global header call buttons.
   - Remove/replace desktop `Book a call` tel link.
   - Remove/replace mobile menu phone display.
   - File: `src/_includes/components/blue-collar-header.html`

9. [ ] Update footer phone/contact links.
   - Remove visible phone number.
   - Replace with SMS/WhatsApp/booking or simplified contact links.
   - File: `src/_includes/components/blue-collar-footer.html`

10. [ ] Simplify navigation for one-page landing.
    - Hide/remove extra nav items from header.
    - Use section anchors instead, for example `#services`, `#pricing`, `#contact`.
    - Files:
      - `src/_includes/components/blue-collar-header.html`
      - `src/content/pages/*.html` frontmatter with `eleventyNavigation`

11. [ ] Decide how to handle "Delete other pages".
    - Safer option: keep files but remove from nav.
    - Risky option: delete page files and set redirects.
    - Files likely involved:
      - `src/content/pages/about.html`
      - `src/content/pages/services.html`
      - `src/content/pages/portfolio.html`
      - `src/content/pages/contact.html`
      - `src/content/pages/blog.html`
      - `src/content/pages/landing.html`
      - `src/content/pages/landing-plumbing.html`
      - `src/content/pages/landing-cleaning.html`

12. [ ] Keep visual style white background + Bespoke blue.
    - Confirm sections are mostly white/light.
    - Reduce dark-heavy sections if needed.
    - Main CSS file: `src/assets/css/blue-collar-home.css`

13. [ ] Build and review after changes.
    - Run `npm run build`.
    - Check homepage visually.
    - Confirm no iMassage/YEG Carpet/Merit remain on final landing page.
    - Confirm no call button or phone number remains visible.
