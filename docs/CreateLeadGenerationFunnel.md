# Lead Generation Funnel — Source of Truth

> **Status:** Landing and thank-you pages built / Frappe integration pending
> **Source:** `CreateLeadGenerationFunnel.pdf` plus confirmed project decisions
> **Last updated:** 2026-03-17

This document is the implementation source of truth for the Bespoke Web Design lead-generation funnel. Update the requirements, decisions, progress checklists, and acceptance results here as the project changes.

## 1. Goal

Build a focused, high-converting landing page that Bespoke Web Design can share with contractors and other business owners to generate qualified leads.

The primary conversion is a request for a **Free Lead Generation Audit**.

### Core positioning

**Need More Calls & Customers?**

Get a Free Lead Generation Audit and discover where your business could be generating more leads online.

## 2. Confirmed Decisions

- [x] Create a dedicated landing page at `/get-more-leads/`.
- [x] Keep the existing homepage at `/` available and unchanged.
- [x] Do **not** automatically redirect the homepage to the landing page.
- [x] Use Frappe CRM for lead submissions instead of Netlify Forms.
- [x] Prefer an embedded Frappe Web Form, as requested by the client.
- [x] Keep the landing page focused on one primary action: **Get My Free Lead Audit**.
- [x] Use minimal navigation so the main website navigation does not compete with the CTA.

## 3. Scope

### Included

- Dedicated `/get-more-leads/` landing page
- Responsive, mobile-first layout
- Free Lead Generation Audit offer and supporting content
- Embedded Frappe lead form
- Thank-you state or page after submission
- Frappe lead creation and attribution
- Internal new-lead notification
- Funnel analytics and conversion tracking
- SEO metadata
- Open Graph and social-sharing metadata
- End-to-end acceptance testing

### Future or currently out of scope

These should not be implemented unless they are separately approved:

- Automatic homepage redirect
- Industry-specific funnels such as `/plumber-leads/`, `/electrician-leads/`, or `/contractor-leads/`
- Advanced email or SMS automation
- Complex CRM workflows beyond the initial pipeline
- Provisioning a new Frappe CRM instance, unless confirmed as part of the project scope

## 4. Target User Journey

1. A visitor opens `/get-more-leads/` from Facebook, Messenger, Instagram, SMS, email, search, or another campaign.
2. The hero communicates the problem, offer, and action immediately.
3. The visitor reviews the benefits, audit coverage, and competitor-comparison value.
4. The visitor selects a CTA and reaches the lead form.
5. The visitor completes and submits the embedded Frappe form.
6. Frappe creates a new lead with all submitted and attribution fields.
7. The visitor sees the thank-you confirmation and can call or book a consultation.
8. Bespoke receives an internal notification.
9. Analytics records the relevant funnel events and conversion.
10. The lead can be moved through the agreed sales pipeline.

## 5. Landing Page Content

### 5.1 Hero

**Headline**

> NEED MORE CALLS & CUSTOMERS?

**Subheadline**

> Get a Free Lead Generation Audit and discover how your website, Google presence and online marketing can generate more leads for your business.

**Primary CTA**

> GET MY FREE LEAD AUDIT

**Supporting text**

> No obligation. We'll identify opportunities you can act on.

The hero must communicate: **Problem → Offer → Action**.

### 5.2 Trust and positioning

**Heading**

> Your Online Presence Should Be Generating Business

**Copy**

> Your customers are searching for businesses like yours every day. We look at how your business appears online and identify opportunities to turn more searches, website visitors and inquiries into real customers.

**Benefits**

- **Get Found:** Improve visibility where customers are searching.
- **Build Trust:** Make the business look professional and credible online.
- **Generate Leads:** Turn visitors into calls, quote requests, and inquiries.
- **Follow Up:** Capture and manage leads so opportunities do not get lost.

### 5.3 Audit coverage

**Heading**

> What's Included in Your Free Lead Generation Audit?

| Area | Review items |
|---|---|
| Website | Mobile friendliness, offer clarity, CTA strength, inquiry generation |
| Google | Google Business Profile, local visibility, search presence, reviews |
| SEO | Search opportunities, local keywords, competitor visibility, website optimization |
| Lead Capture | Contact forms, calls, quote requests, conversion opportunities |
| Reputation | Google reviews, trust signals, social proof, customer experience |
| Social Media | Facebook, Instagram, content, brand consistency |

### 5.4 Competitor comparison

**Heading**

> See How You Compare With Your Competition

**Copy**

> We'll look at your online presence and identify opportunities to stand out from competing businesses in your market.

Compare the visitor's business with three local competitors across:

- Website
- Google visibility
- Reviews
- Calls to action
- Branding
- Social presence
- Lead capture

This section should create curiosity and increase the perceived value of the audit. It must not imply that the comparison has already been completed before the visitor submits the form.

### 5.5 Offer

**Heading**

> Get Your Free Lead Generation Audit

**Copy**

> We'll identify the biggest opportunities to improve your online presence and generate more calls, inquiries and customers.

**Deliverables**

- Website review
- Google visibility review
- Lead-generation opportunities
- Competitor comparison
- Recommended next steps

**CTA**

> GET MY FREE AUDIT

## 6. Lead Form

### 6.1 Form heading

> Tell Us About Your Business

### 6.2 Required fields

- Name
- Business Name
- Phone
- Email
- Business Type
- Website

### 6.3 Optional fields

- Service Interest
- Biggest Challenge

### 6.4 Business Type options

- Plumbing
- HVAC
- Electrical
- Roofing
- Construction
- Renovation
- Landscaping
- Automotive
- Professional Services
- Other

### 6.5 Service Interest options

- Website
- SEO / Google
- Lead Generation
- Social Media
- Branding
- CRM / Lead Management
- Full Marketing System
- Not Sure

### 6.6 Biggest Challenge options

- Not getting enough calls
- Website isn't generating leads
- Poor Google visibility
- Need a new website
- Need more reviews
- Need better social media
- Don't know
- Other

### 6.7 Form CTA

> GET MY FREE LEAD AUDIT

### 6.8 Form experience requirements

- Keep the form as short and simple as practical.
- Make all fields easy to complete on a mobile device with one thumb.
- Use appropriate input types and browser autofill attributes.
- Show clear field validation and submission errors.
- Prevent accidental duplicate submissions.
- Provide an accessible label for every field.
- Do not mark the optional fields as required in Frappe.

## 7. Frappe CRM Integration

### 7.1 Required flow

`Landing Page → Embedded Frappe Form → Frappe CRM → New Lead → Notification → Sales Pipeline`

The client requested an embedded Frappe form. Direct custom API integration is not the current implementation choice unless embedding proves unable to satisfy the required design, field mapping, tracking, or thank-you experience.

### 7.2 Lead data

Frappe must receive:

- Name
- Business Name
- Phone
- Email
- Website
- Business Type
- Service Interest
- Biggest Challenge
- Lead Source
- Campaign
- Message, if the final form includes one

### 7.3 Automatic attribution

| Field | Required value |
|---|---|
| Lead Source | `Bespoke Website Funnel` |
| Campaign | `Free Lead Generation Audit` |

These values should be set automatically rather than entered by the visitor.

### 7.4 Initial pipeline

1. New Lead
2. Contacted
3. Qualified
4. Consultation / Demo
5. Proposal Sent
6. Won or Lost

Do not add unnecessary stages during the initial implementation.

### 7.5 Internal notification

A successful submission should create an internal notification containing at least:

- Business
- Contact name
- Phone
- Service interest
- Biggest challenge
- Source
- A direct link to view the lead in Frappe

Suggested notification heading: **New Bespoke Lead**.

## 8. Thank-You Experience

After a successful submission, show:

**Heading**

> You're In!

**Message**

> Thanks for requesting your Free Lead Generation Audit. We'll review your online presence and contact you with our findings.

**Secondary action**

> Want to talk now?

Provide one or both of these actions when their destinations are confirmed:

- **Call Bespoke** — clickable phone link
- **Book a Consultation** — scheduling link

The thank-you experience must only appear after a confirmed successful submission.

## 9. Design Requirements

The page should feel like a focused lead-generation product rather than a generic agency website.

### Direction

- Professional
- Clean
- High contrast
- Strong typography
- Generous whitespace
- Mobile-first
- Contractor and business focused
- Clear, repeated CTAs
- Minimal navigation

### Conversion requirements

- Avoid the standard `Home | About | Services | Portfolio | Contact` navigation on this page.
- Keep the primary CTA wording consistent.
- CTA interactions should move the visitor to the lead form or open/focus the embedded form.
- Avoid unrelated links or content that distracts from the conversion.

## 10. Mobile Requirements

- Provide a sticky bottom CTA: **GET MY FREE AUDIT**.
- Make the phone number clickable with a `tel:` link.
- Ensure the form is comfortable to complete with one thumb.
- Avoid horizontal scrolling.
- Ensure the sticky CTA does not obscure form controls, validation messages, or page content.
- Test common mobile viewport sizes and the embedded form's responsive behavior.

## 11. Tracking Requirements

Configure, subject to available accounts and access:

- Google Analytics 4
- Google Search Console
- Meta Pixel
- Conversion event
- Form submission tracking
- CTA click tracking

Track the funnel:

`Visitors → CTA Clicks → Form Starts → Form Submissions → Qualified Leads`

### Proposed event names

Final names must follow any existing analytics convention in the project.

- `lead_audit_cta_click`
- `lead_audit_form_start`
- `lead_audit_form_submit`
- `lead_audit_form_error`
- `lead_audit_phone_click`
- `lead_audit_consultation_click`

A form conversion must be recorded only after a successful Frappe submission, not merely when the submit button is clicked.

## 12. SEO Requirements

### Page title

> Get More Leads | Free Lead Generation Audit | Bespoke Web Design

### Meta description

> Discover how your website, Google presence and online marketing can generate more calls, inquiries and customers. Get a free lead generation audit from Bespoke Web Design.

### Canonical URL

`https://bespokewebdesign.ca/get-more-leads/`

### Natural keyword themes

- contractor lead generation
- lead generation
- get more leads
- get more customers
- get more calls
- contractor marketing
- website lead generation
- local SEO
- Google Business Profile

Use these naturally. Do not keyword-stuff the page.

## 13. Open Graph and Social Sharing

### Required metadata

| Property | Value |
|---|---|
| OG URL | `https://bespokewebdesign.ca/get-more-leads/` |
| OG Title | `Need More Calls & Customers?` |
| OG Description | `Get a Free Lead Generation Audit and discover opportunities to generate more leads online.` |
| Twitter/X card | Large image summary card |
| Canonical URL | `https://bespokewebdesign.ca/get-more-leads/` |

Also configure `og:title`, `og:description`, `og:image`, `og:url`, page title, and favicon.

### OG image

- Size: `1200 × 630 px`
- Suggested text:
  - `NEED MORE CALLS & CUSTOMERS?`
  - `FREE LEAD GENERATION AUDIT`
  - `Bespoke Web Design`

The final image must be tested in social-link preview tools or live sharing previews.

## 14. Dependencies and Open Questions

Implementation is blocked or partially blocked until the following are supplied or confirmed:

- [ ] Is the client's Frappe CRM instance already installed and operational?
- [ ] What is the Frappe CRM base URL?
- [ ] What is the Frappe Web Form URL or embed code?
- [ ] Who will provide the required Frappe access and permissions?
- [ ] Does the Frappe Lead schema already contain every required field?
- [ ] What are the exact internal Frappe field names for the form-to-lead mapping?
- [ ] Can attribution values be set as hidden/default fields in the embedded form?
- [ ] Are the proposed pipeline stages already configured, or are they in project scope?
- [ ] What notification channel and recipients should be configured?
- [x] Public phone number confirmed from the shared client config: `780-263-8028`.
- [x] Consultation booking URL confirmed: `https://calendly.com/arjiv28/30min`.
- [ ] What are the GA4 measurement ID, Meta Pixel ID, and required access details?
- [ ] Does the site already use a consent mechanism that must cover analytics and Meta tracking?
- [x] The dedicated `1200 × 630 px` OG image has been created and approved.
- [x] Use the dedicated `/get-more-leads/thank-you/` URL after a confirmed Frappe submission.

## 15. Progress Tracker

### Phase 1 — Requirements and access

- [x] Review the source PDF.
- [x] Confirm the landing-page URL.
- [x] Confirm that the homepage will not redirect.
- [x] Confirm Frappe CRM instead of Netlify Forms.
- [x] Confirm embedded Frappe form as the preferred approach.
- [ ] Resolve all blocking Frappe questions.
- [ ] Confirm analytics and tracking access.
- [x] Confirm phone and booking destinations.
- [x] Confirm final copy and visual direction.

### Phase 2 — Frappe preparation

- [ ] Verify or create the required lead fields.
- [ ] Verify or create the Web Form.
- [ ] Configure field mapping.
- [ ] Configure hidden/default Lead Source and Campaign values.
- [ ] Verify or configure the initial pipeline.
- [ ] Configure the internal notification.
- [ ] Confirm successful test lead creation directly through Frappe.

### Phase 3 — Landing-page implementation

- [x] Create the `/get-more-leads/` route.
- [x] Build the hero section.
- [x] Build the trust and benefits section.
- [x] Build the audit coverage section.
- [x] Build the competitor comparison section.
- [x] Build the offer section.
- [x] Build the form-ready visual shell and required field layout.
- [ ] Embed and style the Frappe form.
- [ ] Add form loading, success, validation, and error behavior.
- [x] Build the thank-you experience.
- [x] Add the call and consultation actions.
- [x] Add the mobile sticky CTA.
- [ ] Verify accessibility and keyboard behavior.

### Phase 4 — SEO, social, and tracking

- [x] Add the page title and meta description.
- [x] Add the canonical URL.
- [x] Add the initial Open Graph metadata.
- [x] Add the Twitter/X card metadata.
- [x] Create and configure the OG image.
- [ ] Configure GA4.
- [ ] Configure Meta Pixel.
- [ ] Track CTA clicks.
- [ ] Track form starts.
- [ ] Track successful form submissions as conversions.
- [ ] Track form errors.
- [ ] Track phone and consultation clicks.
- [ ] Confirm Google Search Console coverage.

### Phase 5 — Quality assurance and release

- [x] Test desktop layouts with a production build and headless browser screenshots.
- [x] Test mobile layouts with a production build and headless browser screenshots.
- [ ] Test the embedded form across supported browsers.
- [ ] Test validation and error recovery.
- [ ] Test duplicate-submission prevention.
- [ ] Test Frappe lead creation and all field values.
- [ ] Test Lead Source and Campaign attribution.
- [ ] Test internal notifications.
- [ ] Test analytics events and conversion recording.
- [ ] Test Facebook and LinkedIn sharing previews.
- [ ] Test the complete production journey.
- [ ] Obtain final approval.
- [ ] Release `/get-more-leads/`.

## 16. Final Acceptance Test

The implementation is complete only when the following journey is demonstrated successfully:

- [ ] 1. Open `/get-more-leads/` directly.
- [ ] 2. Confirm the homepage remains available and does not redirect.
- [ ] 3. Share the landing-page URL on Facebook and LinkedIn and verify the preview.
- [ ] 4. Open the landing page on mobile.
- [ ] 5. Use the primary CTA to reach the form.
- [ ] 6. Complete and submit the form.
- [ ] 7. See the thank-you experience.
- [ ] 8. Receive the internal new-lead notification.
- [ ] 9. Log into Frappe CRM.
- [ ] 10. Confirm that the lead was created automatically.
- [ ] 11. Confirm that every submitted field is populated correctly.
- [ ] 12. Confirm `Lead Source = Bespoke Website Funnel`.
- [ ] 13. Confirm `Campaign = Free Lead Generation Audit`.
- [ ] 14. Move the lead through the configured pipeline.
- [ ] 15. Confirm analytics recorded the CTA, form, and conversion events correctly.

## 17. Change Log

| Date | Change | Status |
|---|---|---|
| 2026-03-17 | Created the Markdown source of truth from the PDF and confirmed project decisions. | Complete |
| 2026-03-17 | Built the responsive `/get-more-leads/` page, minimal funnel header/footer, visual form shell, and mobile sticky CTA. | Complete |
| 2026-03-17 | Corrected narrow-mobile hero text overflow and balanced the audit preview spacing with its offset shadow. | Complete |
| 2026-03-17 | Added the dedicated thank-you page with call and consultation actions. | Complete |
| 2026-03-17 | Updated the funnel Open Graph and Twitter/X copy, assigned the dedicated `1200 × 630 px` image, and retained the crawler-blocked OG preview page as a future design guide. | Complete |

---

When a requirement changes or a task is completed, update this document in the same change so it remains the authoritative record of scope and progress.
