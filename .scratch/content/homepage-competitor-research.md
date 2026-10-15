# Homepage competitor research

Research date: 2026-10-15 UTC. Researcher read `.scratch/content/quality-content.md` and applied the `unslop` writing guidance. This task did not edit `src/index.html` or any existing file.

## Customer and decision to support

The customer is an Edmonton trades business owner, not a homeowner buying a repair. They may have an old website, an inactive social account, weak local visibility, or no time to manage marketing. They want a credible business presence, a practical route for enquiries, and a clear account of what a managed service will handle.

Assumed urgency is a planned business purchase, not an emergency. The customer needs to know the workload, monthly commitment, and fit before booking a call. There were no enquiry records, analytics, search-volume data, or conversion data in this research. The question order below is an estimate.

1. Do you work with my trade in Edmonton, and can you handle the website and marketing work I cannot keep up with?
2. What does the monthly fee include, and what costs extra?
3. What do I have to supply or approve, and what happens after I enquire?
4. Can I see relevant completed work and genuine client evidence?
5. How will you maintain the site and report on the work after launch?
6. What do I own, what happens if I cancel, and are there limits or minimum terms?
7. Is the problem my website, my visibility, or both? Which service should I start with?
8. How long can setup take, and what affects that schedule?

Main query: `Edmonton contractor marketing web design`.

Useful variations tested included `"Edmonton" "contractor" "web design"`, `"Edmonton" "trades" "marketing"`, `"Edmonton" "contractor marketing"`, `Edmonton contractor marketing agency`, and `Edmonton trades web design marketing`.

The homepage should answer audience, offer, scope, key limits, proof, and next step. Detailed website specifications, ongoing SEO, advertising, social media deliverables, and contract terms can use relevant service or policy pages where those pages exist. Do not force homeowners' repair/replacement questions into this business-to-business page. The relevant distinction is a new website, a rebuild, or marketing help for an existing site.

## Search record and missing evidence

Ten live search requests were made in this task. Direct HTTP requests used `httpx`, followed normal redirects, and read returned HTML. No captcha was solved and no access block was bypassed. Serper was not configured, as reported by the parent agent. The parent's earlier Google, Bing and DuckDuckGo attempts are background information, not additional requests made or inspected in this task.

No successful search returned a suitable provider page. It would be false to describe the selected providers as the Google top three, or even as three suitable pages from the returned results. The comparison instead uses three suitable provider service pages discovered by direct navigation after search access failed. This is the main evidence gap.

All searches below were made on 2026-10-15. Query text supplied Edmonton as the location. The actual searcher's Edmonton location was not verified. The first Bing responses showed a Filipino interface, so their locale cannot be treated as Edmonton search results. Google used `hl=en&gl=ca`, which requests English and Canada, not an Edmonton location. The final Bing attempts used `mkt=en-CA` with the same limitation.

| Attempt | Provider and query | Result and decision |
| --- | --- | --- |
| 1 | [Bing](https://www.bing.com/search?q=Edmonton+contractor+marketing+web+design), `Edmonton contractor marketing web design` | HTTP 200. Seven visible organic result blocks were city, reference, or travel pages. None offered contractor websites or marketing. All skipped. |
| 2 | [Yahoo](https://search.yahoo.com/search?p=Edmonton+contractor+marketing+web+design), same main query | HTTP 500 with an empty body. No results to inspect. |
| 3 | [Brave](https://search.brave.com/search?q=Edmonton+contractor+marketing+web+design), same main query | HTTP 429. The page said the request was suspicious and scheduled a captcha. Stopped without attempting the challenge. |
| 4 | [Bing](https://www.bing.com/search?q=%22Edmonton%22+%22contractor%22+%22web+design%22), `"Edmonton" "contractor" "web design"` | HTTP 200. The same irrelevant Edmonton result set appeared. No suitable provider. |
| 5 | [Bing](https://www.bing.com/search?q=%22Edmonton%22+%22trades%22+%22marketing%22), `"Edmonton" "trades" "marketing"` | HTTP 200. The same irrelevant result set appeared. No suitable provider. |
| 6 | [Bing](https://www.bing.com/search?q=%22Edmonton%22+%22contractor+marketing%22), `"Edmonton" "contractor marketing"` | HTTP 200. The same irrelevant result set appeared. No suitable provider. |
| 7 | [Google](https://www.google.com/search?q=Edmonton+contractor+marketing+agency&hl=en&gl=ca), `Edmonton contractor marketing agency` | HTTP 200 but readable content was only a redirect/help stub. No usable results or confirmed positions. |
| 8 | [Mojeek](https://www.mojeek.com/search?q=Edmonton+trades+web+design+marketing), `Edmonton trades web design marketing` | HTTP 403. The page said the network appeared to send automated queries. Stopped. |
| 9 | [Bing RSS](https://www.bing.com/search?q=Edmonton+contractor+marketing+agency&format=rss&mkt=en-CA), `Edmonton contractor marketing agency` | HTTP 200. Feed metadata but no result items. No provider selected. |
| 10 | [Bing](https://www.bing.com/search?q=YEG+Digital+contractor+web+design+Edmonton&mkt=en-CA), `YEG Digital contractor web design Edmonton` | HTTP 200. Explicitly reported no results. Stopped at the request bound. |

The main Bing page exposed this order in its organic result blocks. These are positions within that returned page, not confirmed Google positions or representative local rankings.

| Returned order | Skipped URL | Reason |
| --- | --- | --- |
| 1 | https://en.wikipedia.org/wiki/Edmonton | Reference article, not a provider. |
| 2 | https://www.edmonton.ca/ | Municipal website, not a provider. |
| 3 | https://www.travelalberta.com/places-to-go/cities-towns/edmonton | Tourism page, not a provider. |
| 4 | https://exploreedmonton.com/ | Tourism page, not a provider. |
| 5 | https://www.mustdocanada.com/things-to-do-in-edmonton/ | Travel article, not a service offer. |
| 6 | https://www.tripadvisor.com/Attractions-g154914-Activities-Edmonton_Alberta.html | Travel marketplace/directory, not a provider. |
| 7 | https://www.britannica.com/place/Edmonton-Alberta | Reference article, not a provider. |

### Direct selection after the search limit

Known local provider domains were candidate starting points from general familiarity, not discovered in these search results. The live content established their relevance. Four homepages were fetched. Their own navigation led to the three selected service pages below. All three service pages returned HTTP 200 and were read in full, including the FAQ text and footer present in their HTML.

| Provider | Initial page and selection | Selected source | Query/result order |
| --- | --- | --- | --- |
| YEG Digital | https://yegdigital.com/ explicitly offered Edmonton websites and service-business marketing. Its web-design link led to a service page naming roofers, HVAC, plumbers, electricians and landscapers. | https://yegdigital.com/web-design/ | Direct navigation. No successful query or search position. First candidate checked, not first ranked result. |
| CreoLogic | https://www.creologic.ca/ redirected to https://creologic.ca/. The homepage offered Edmonton website design/SEO and linked its new-web-design service. The selected page includes fence, paving, electrical, glass and other contractor examples. | https://creologic.ca/services/websites/edmonton-website-design/ | Direct navigation. No successful query or search position. Second candidate checked. |
| Pixel Army | https://www.pixelarmy.ca/ offered Edmonton website design and marketing. Its website-design page includes a King Coatings testimonial and lists Kamwin Electric among client names. | https://www.pixelarmy.ca/website-design/ | Direct navigation. No successful query or search position. Third candidate checked. Requested `/website-design` normally redirected to `/website-design/`. |
| SOS Media Corp | https://www.sosmediacorp.com/ redirected to https://sosmediacorp.com/. Homepage read, including Trane Alberta HVAC work. | Not selected for a full service-page comparison. | Fourth candidate. Skipped after three suitable service pages were available. The comparison below does not treat the SOS homepage as a fourth full review. |

This was an HTML/text and link-structure review, not a rendered-browser audit. It covered all available page text rather than search snippets. Images, videos, loaded carousels, hidden/interactive states, mobile layout, form submission and accessibility behaviour were not visually tested. Responsive claims belong to the providers. A viewport meta tag appeared on all three pages, but that does not prove good mobile usability.

## 1. YEG Digital web design

Source: https://yegdigital.com/web-design/. Accessed 2026-10-15 UTC. The full extracted page contained about 18,400 characters after scripts, styles and SVG content were removed.

### Intro and customer fit

The first substantive paragraph offers custom WordPress websites for service businesses that need more than a brochure site. It immediately names SEO, mobile usability and content management. A later Edmonton audience section names individual trades and discusses a fast site, reachable phone number and broad service coverage. This is much more specific than a general promise of a better online presence.

The page also covers industrial buyers, clinics and retailers. That widens its market, but makes the page longer for a trades owner who already knows the fit.

### Answers, scope, cost, process and timing

- The inclusion list names design, forms, CRM/inbox integration, copywriting, keyword research, analytics, hosting, backups and monitoring. Those are concrete work items a business owner can compare.
- The page says projects start around $4,500 and most fall between $7,500 and $15,000. It says enterprise projects cost more. These are the provider's published dollar figures, not verified quotes or Bespoke pricing.
- Hosting and support are explicitly a separate monthly cost. No monthly amount appears on this service page. The site links to a cost calculator.
- A five-stage process covers discovery, design approval, staging and content review, launch preparation, then care and possible SEO/ads work. Copy is written by the agency and approved by the customer.
- It plans six weeks for most builds, or eight to twelve for larger work. It names content, photos and approvals as client-side dependencies. The wording places almost all delay responsibility on the client, which may feel defensive.
- It distinguishes maintenance from additional growth services. It also says a client with a sound but invisible site may need SEO rather than a rebuild.
- Edmonton and surrounding communities are listed. The page says it also works further away. It describes month-to-month hosting/support, no lock-in, and taking the site/data when leaving.

### Evidence and usability

The page names Apollo Plumbing, Modern Air & Water, Darren Does That and other projects, with the work performed. It embeds reviews labelled as Google-verified by Trustindex. Several reviews discuss a university presentation rather than a delivered website or marketing engagement. Those may be genuine reviews, but they answer a contractor's buying question less well than a comparable client project.

Headings separate audience, deliverables, work, process, pricing, support, area and FAQ. Quote links and a phone link provide a clear route to contact. A long review block interrupts the route from process to price. Price, timing and ownership answers are partly repeated in the FAQ.

### Weaknesses and lessons

Published claims about preserving or recovering rankings, appearing in language models, security and performance were not independently checked. For example, the launch wording that existing rankings travel with the client reads more certainly than the migration FAQ's acknowledgement of a possible dip. Do not borrow that certainty.

For Bespoke, the useful lesson is to say who writes the content, who approves it, what happens at launch, and what the monthly service does afterward. Separate ongoing maintenance from a growth promise. Show fewer, more relevant pieces of proof. Explain a monthly offer in its own terms rather than comparing it directly with a project build price.

## 2. CreoLogic new website design

Source: https://creologic.ca/services/websites/edmonton-website-design/. Accessed 2026-10-15 UTC. The full extracted page contained about 15,000 characters.

### Intro and customer fit

The opening asks whether the reader wants a local Edmonton website-design company. It quickly offers visibility, credibility and lead generation, with both a quote action and a pricing action. This answers location and next step. The introduction is general business copy rather than trades-specific problem solving.

### Answers, scope, cost, process and timing

- An early question section answers price, timeline, inclusions, editing, hosting and what the customer supplies. It reduces the need to contact sales for basic facts.
- Standard websites are described as taking four to eight weeks. More complex work can take longer. A separate rapid option promises seven days, but the conditions are not explained in this service-page section. Its detail link would need a separate read before relying on that offer.
- The process names discovery, planning, user experience, design/development, testing and launch. It states that training and performance-measuring tools follow launch.
- New design and redesign are separated. Redesign lists migration and testing work. Other sections cover rapid builds, e-commerce and optimization.
- Package starting prices are $4,499, $6,999 and $9,999+. The comparison gives up to eight pages, up to fifteen pages, and a custom sitemap. It also distinguishes client-supplied content with light editing, partial copywriting, and more extensive copywriting.
- The package table lists tracking, CMS training, launch checks and SEO setup. This makes differences more tangible than outcome labels alone.
- Hosting and maintenance are available, but recurring prices and their detailed boundaries are not supplied on this page. There is a no-contracts badge, not a full cancellation/ownership explanation.
- The page clearly identifies Edmonton and gives an Edmonton street address and phone number. It does not provide a neat service-area list on this page.

### Evidence and usability

The page includes a testimonial attributed to Atlantic Fence and project descriptions for O'Hanlon Paving, Beacon Glass, CMN Electrical, Forbes Bros and other businesses. The descriptions usually state the work done, not measured business results. Awards, top-rated language and Google Partner claims appear, but this research did not check the underlying records.

Useful questions appear near the top, and pricing is available through an early link. The actual page is long. Repeated platform lists and many portfolio captions compete with the offer. Some copy is dated, including a reference to a site coming in 2024 and a footer ending in 2022. The HTML contains two H1 headings. None of these observations proves a ranking or conversion effect.

### Weaknesses and lessons

Catchphrases about being a huckleberry, zero to hero, and good/quick/cheap replace detail. They do not help a contractor know what they are buying. The long mix of new design, e-commerce, optimization and project captions makes the service harder to scan.

For Bespoke, keep the early answers and explain plan differences through actual deliverables and owner responsibilities. Do not copy a large package table if a short list answers the same question. Keep detailed redesign, SEO and other service information on relevant pages rather than repeating it throughout the homepage. Avoid stale project descriptions and unsupported superlatives.

## 3. Pixel Army website design

Source: https://www.pixelarmy.ca/website-design/. Accessed 2026-10-15 UTC. The full extracted page contained about 13,600 characters.

### Intro and customer fit

The page identifies Edmonton website design, describes custom and themed options, and invites the reader to explore packages. The first paragraph explains collaboration between agency expertise and the customer's business knowledge. It serves a broad business market. It takes longer to identify a trades owner's particular workload or marketing problem.

### Answers, scope, cost, process and timing

- Three options have plain scope distinctions. Quick Launch is for a faster turnaround, Semi Custom modifies a theme, and From Scratch is an entirely custom build.
- The FAQ gives starting prices of $4,500, $6,500 and $11,500, with complexity and functionality affecting the quote. These are published provider claims, not a like-for-like comparison with Bespoke's subscription.
- Published windows are three to six weeks, two to three months, and three to four months respectively. The page explicitly says timing depends on how promptly the client supplies required materials.
- It describes discovery and scope, sitemaps/wireframes, approval, design/build, testing and launch. It names content integration, CMS setup and basic on-page SEO, with extra work available on request.
- It explains the Honeycomb CMS and client training. It answers redesign and ongoing support questions. The page says software updates, troubleshooting and maintenance are available, but gives no recurring support price or service limits.
- Ownership has a qualification. Files and content belong to the client, while Pixel Army retains some intellectual property. That is an important buying question, not a detail to hide behind a blanket ownership statement.
- Edmonton and nearby businesses are named as the market. An Edmonton address and phone appear at the end. No detailed service-area list appears in this page's text.

### Evidence and usability

A King Coatings testimonial describes the process and communication. Client names include Kamwin Electric, and the page links a project portfolio. The testimonial excerpt is cut off in the fetched content. Client names alone do not establish service scope or results. Claims about 20 years of experience, performance and a mobile abandonment statistic were not verified in this task.

The package labels and cost/timing questions support comparison. Multiple phone, pricing and project actions make contact available. The page repeats several ideas, including easy editing and search visibility. FAQ questions use H6 headings beneath H4 content, and there is an empty heading. Some long paragraphs repeat Edmonton search phrases awkwardly. A late prompt asks whether the reader wants an awesome website; this adds less than a concrete next-step explanation. Interactive behaviour was not tested.

### Weaknesses and lessons

Generic lead-generation language and repetitive search/AI claims take space from practical detail. The page gives good project-price and time distinctions, but monthly care costs and responsibilities remain unclear.

For Bespoke, connect every plan difference to work the owner receives. Explain who makes updates and what the owner must review, especially if Bespoke's offer is managed rather than self-service. State ownership and cancellation accurately, with conditions if needed. Keep repeated editing, SEO and mobile claims out of the FAQ when an earlier section already answers them.

## Findings to apply to the current homepage

These gaps refer to the `src/index.html` snapshot read during this task. Existing homepage statements are not business records and do not prove their own accuracy. The parent agent must check Bespoke's records before preserving or expanding prices, plan limits, ownership, reviews, timing or other promises.

| Customer need | Gap in the current page | Proposed answer or section | Evidence and limit |
| --- | --- | --- | --- |
| Confirm fit quickly | The page names Edmonton trades and a monthly starting price, but its opening also makes unsupported leadership claims and uses domination language. | Name contractor websites and managed marketing, the Edmonton audience, the practical work handled, and one next action. | Current offer is visible in the page. YEG shows the value of naming trades and their site needs. No source here proves Bespoke is number one, leading, or the top choice. |
| Understand a subscription | Monthly plans are visible, but the boundary between website setup, monthly updates, social content and optional marketing needs a clearer explanation. | Give a short included-work summary. Explain differences between tiers with checked deliverables, not larger outcome promises. | All three providers explain scope. YEG separates build and monthly care. Competitor prices do not verify Bespoke prices or make this a valid cheaper-than-agencies comparison. |
| Know total commitment | No setup fee, no hidden costs, no long-term contract and ownership claims appear without much detail. | State only confirmed fees and terms. Clarify separate ad spend, domain or third-party charges only if Bespoke's records establish them. Link detailed terms where available. | YEG identifies separate recurring support; Pixel Army qualifies ownership. These show customer questions, not Bespoke's answers. |
| Know what happens next | The founder call section explains fit, but there is no concise delivery process or account of owner input. | Explain enquiry, scope confirmation, supplying business details/photos, review, launch, and ongoing work. Include only actual steps. | Each competitor explains a process. Bespoke's process and approval needs still need internal support. |
| Know timing without a promise | No clear setup explanation or dependencies. | Explain how timing is agreed and which inputs affect it. Publish a number only if supported. | All three competitors qualify time by scope/client inputs. None establishes Bespoke's schedule. |
| Trust relevant work | Trade projects are named, but a project name is not a measured result. Several review/rating statements need verification. | Show verified projects with accurate descriptions of work. Use only traceable reviews. Do not turn portfolio examples into lead-growth claims. | Competitor project descriptions are more useful than general praise. Their testimonials are not Bespoke evidence. |
| Understand managed work after launch | Hosting/unlimited edits and monthly content appear, but the workflow and limits are not explained. | Explain how an owner requests an update, provides job photos and approves content if those are actual service steps. Avoid inventing response times or unlimited scope. | YEG describes a support channel. Pixel Army describes self-service training. Bespoke must describe its own model, not borrow either one. |
| Choose the right service | Website, local search, social content, ads and automation appear together. This can imply that every plan includes every service or guarantees lead flow. | Distinguish what the homepage sells, what each plan covers, and when linked SEO, social or paid-marketing services apply. | YEG explicitly distinguishes a rebuild from a visibility problem and maintenance from growth work. Use existing working service links. |

### Priority and cautions

The most useful addition is not more promotional copy. It is a short explanation of the monthly arrangement and the work that remains with the business owner. Put that near the offer, then show relevant proof and a clear process. Keep detailed FAQs for unresolved questions, not repeated service claims.

Do not copy wording, layout, imagery, branding, provider prices, provider timeframes or provider promises. Do not infer why a page ranks, how much traffic it gets, whether it converts, or whether the provider does good work. This task established none of those things.

No technical claims from competitor pages were adopted as facts. Claims about SEO, AI visibility, mobile behaviour, rankings, speed, migrations and security would need suitable primary documentation before use. Bespoke's own promises need its records. Search-result selection remains incomplete, but three suitable live provider pages were fully read and compared through direct navigation.
