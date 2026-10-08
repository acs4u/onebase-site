# onebasehealth.com — Claude Code guide

Single marketing + lead-gen site for OneBase Health (Waylen Allen Limited), replacing the Shopify store (onebasehealth.com) and the Lovable B2B site (business.onebasehealth.com). The site Vercel deploys is built from one prototype page: see "Site build" below before changing anything. The Astro project in `src/` is not what is deployed.

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build to `dist/` (must pass before any PR)
- `npm run check` — Astro/TypeScript check
- `npm run import:blog` — migrate 41 Shopify articles → `src/content/posts/` (needs network to onebasehealth.com)
- `npm run import:images` — pull current product/solution imagery → `public/images/`

## Where things live
- `src/lib/site.ts` — site config: phone, booking link, HubSpot IDs, GTM, social, nav, modality definitions, `precorAnnounced` flag.
- `src/content/products/*.json` — one file per product. Specs, electrical, FAQs, sizes, colours, channels. This is the source of truth for product pages.
- `src/content/solutions/*.json` — industry pages. `src/content/team/team.json`, `src/content/parts/parts.json`.
- `src/content/posts/*.md` — blog (markdown, frontmatter per `src/content.config.ts`).
- `src/pages/products/[category]/[slug].astro` — product template. `src/pages/solutions/[slug].astro` — solution template.
- `src/styles/global.css` — design tokens (see Brand) + component classes (`btn-primary`, `spec-table`, `key-message`, `eyebrow`, modality accent utilities).
- `astro.config.mjs` — all 301 redirects from Shopify and Lovable URLs. Add here when renaming a page.

## Brand (source: Canva "OneBase brand guide v.2", Nov 2025; "Brand Architecture & Product Naming Guidelines 1.4", Jun 2026)
- Voice: **The Knowledgeable Coach** — Smart (expert, never arrogant), Bold (motivating, strong verbs), Friendly (plain language, no jargon). Before publishing copy, run the voice test: expert? motivator? simplifier?
- Purpose line: "The world's easiest therapy system." Promises: push the boundaries of innovation; clean design & advanced technology; most efficient treatments through ongoing support.
- Type: Poppins Medium for headings, Poppins Light for body, Lato Light Italic for key messages (`.key-message`). Never use other typefaces.
- Colour: base OneBase Black `#1F1F1F`, white, grey `#E7E9EB`. Modality accents only: Air (HBOT) `#122232/#9AACBE/#E7F6FD`, Ice `#063944/#5C94AB/#C8E2E8`, Heat `#C4522E/#E6886A/#EAC488/#F0D48E`, Light `#8B2232/#EA7C8C/#E99999/#F7BFBF`. No bright primaries. Set `data-modality="air|ice|heat|light"` on a section to switch accents.
- Imagery: motivational, one thing in focus, human-centric; 30% black overlay + white text on photos (`.hero-overlay`). No cute icons, no scary medical props, no over-posed shots.
- Naming: **branded house**. "OneBase" + Category+Model + Size. Sizes: Mini · Solo · Plus · Duo · Quad · Hex · Octo. Saunas drop the category: "OneBase Yakisugi Quad", "OneBase Hemlock Quad" (not "Heat Yakisugi"). ATA goes last: "OneBase AirFit Mini 1.3 ATA". Use `productName()` from `src/lib/site.ts`. **On the website the "OneBase" prefix is dropped** (7 Oct 2026): product names read "IceVault", "LightBed", "Yakisugi Quad". The site is OneBase's own, so the prefix is not repeated; "OneBase OS" and "the OneBase app" keep it.
- Logo: never split One/Base, never shorten, dark logo on light and light logo on dark only. `src/components/Logo.astro` is a text placeholder — swap in the SVG wordmark.

## Positioning rules
- Software naming: the operator platform is **OneBase OS** on the website (renamed from "Salus" in Sep 2026; never use "Salus" in site copy). The member-facing app is "the OneBase app".
- Audience is operators (gyms, studios, spas, hotels, developers, teams, clinics, defence) and procurement. Consumer/app story lives under `/software`.
- Precor (from 6 Oct 2026): shown on the site as OneBase's exclusive commercial partner for sauna, dry cold therapy and red light therapy, on its own page (`/precor`) and on the Yakisugi, IceVault, LightBed and LightZone pages. One switch in the prototype, `S.precor`, removes every mention. Hyperbaric chambers, custom traditional saunas, equipment for private homes, and parts are sold directly by OneBase. Keep the wording plain, not salesy.
- Pricing: no prices on equipment, including "from" prices and structured data. Every product is quote-only; the ROI calculator uses the buyer's own budget figure. Parts and consumables are the exception: they show prices and check out through the Shopify store.
- Every page ends in a path to the enquiry form or booking link.
- Keep the HBOT medical disclaimer in the footer. HBOT chambers are Class II devices in the US.

## TODO before launch
1. `site.hubspot.formId` — paste the HubSpot form GUID (portal 20568937) so the embedded form replaces the native fallback.
2. `/api/enquiry` — only needed if the native form is kept; wire to HubSpot Forms API or Resend.
3. Stripe: create Payment Links per SKU and fill `stripePaymentLink` in `src/content/parts/parts.json`.
4. Run `import:blog`; replace placeholder hero photography (`/images/hero`, `/images/categories/*.jpg`, `og-default.jpg`) with approved brand images from Canva/Drive.
5. Real logo SVG in `Logo.astro`; partner logos in `/images/logos` wired into the Trusted-by strip.
6. Cookie consent banner (HubSpot's banner, ID 20568937, was used on the Lovable site).
7. Hosting: Vercel (recommended) or Cloudflare Pages. Point onebasehealth.com at the new site, redirect business.onebasehealth.com → onebasehealth.com, then close the Shopify store.
8. Regional: Shopify served en-au/en-ca/en-gb; decide whether AU pricing/contacts need a dedicated page.

## Contact capture (see scripts/proto/capture.js for the agreed UX)
- Four intent-matched entry points, all into HubSpot (portal 20568937): (1) Book a call — every sales CTA opens a 2-step modal (venue/sites/timeline + email → HubSpot Meetings calendar); (2) configurator "Get pricing for this build" and the ROI calculator "Send me this estimate" carry the build or estimate; (3) two-step enquiry (email + venue type, then details); (4) spec-sheet download on product pages (email + role → printable sheet generated from product JSON).
- Submit via HubSpot Forms API v3 from `scripts/proto/hubspot.js` (`hsSubmit`), into ONE form whose GUID goes in `HS.form`. Uses existing contact properties only: email, firstname, lastname, company, phone, country, message, industryleadmagnet (venue), other__facility_type_ (clinic), when_are_you_planning_install (timeline), how_many_locations_do_you_own_or_manage (sites), primary_equipment_type (from the product's modality). Capture type, product, configuration and role are written into `message`. The HubSpot form must include all of those fields (hidden is fine) or the API rejects them.
- Booking step 2 embeds HubSpot Meetings (`HS.meetings`); `meetingBookSucceeded` postMessage shows the confirmation. The HubSpot tracking script (js.hs-scripts.com/20568937.js) loads on every page.
- HubSpot workflow: score on venue_type + timeline + sites; route by region; when `precorAnnounced`, route US commercial-gym leads for IceVault/sauna/red light to Precor.

## Site build (what Vercel deploys)
- **Source of truth: `prototype/onebase-prototype.html`.** It is the page published as the Claude artifact "OneBase Site Prototype". Changes are made and agreed there first, then the file is copied here unchanged. Do not edit the site's copy or behaviour anywhere else.
- `node scripts/build-site.mjs` (what Vercel runs, no npm install) turns that one hash-routed page into `proto-dist/`: one `index.html` per page at its real path, each with its own title, description, canonical URL, Open Graph tags and the page's text in the HTML; scripts and styles in `/assets/app*.js`, `/assets/mv.js` and `/assets/app.css`; plus `sitemap.xml`, `robots.txt` and `404.html`. It changes nothing the page says. It fails if the page names a picture that is not in the repo.
- `node scripts/snapshot-routes.mjs` (run locally after every prototype update; needs `npm install` for playwright) opens every page in a headless browser, follows every internal link, and writes `prototype/routes.json`: the list of pages with each one's title, description and text. Commit the result. It fails on a page error, a link to a page that does not exist, a missing file or sideways scroll.
- `prototype/seo.json`: titles and descriptions that replace the recorded ones, plus `_noindex` (pages kept out of search engines and the sitemap) and `_unlinked` (pages no link leads to that should still be built).
- Files the page uses: pictures in `public/images/src` (served at `/assets/img`), blog pictures in `public/images/blog`, parts pictures in `public/images/parts`, article bodies in `prototype/posts`, 3D models in `public/models`, videos in `public/video`.
- The client router uses the History API on the site (`window.OB_SITE`) and hash routes in the preview. Code in the prototype should read the route with `obHash()` and navigate with `obGo('#/path')`, never `location.hash`.
- Old addresses (Shopify products, collections, pages, blogs, policies, locale prefixes, the business site, and pages renamed since) redirect in `vercel.json`. When a page's address changes, add a redirect there.
- `scripts/build-prototype.mjs` and `scripts/proto/*` are the generator used until 1 Oct 2026. Vercel no longer runs them and they no longer match the site; they are kept for reference only. The same goes for the Astro files under `src/` (`src/content/posts` is still where the 41 articles came from).
- Images: only OneBase's own (Drive renders, Canva, catalogues, own photos, and the blog, parts and product pictures carried over from OneBase's Shopify store; the `shop-*` files are the per-size and per-finish product shots the configurator uses), plus Precor's logo and the customer logos on the customer wall. Nothing is fetched at build time.

## Analytics (see analytics/README.md)
- `scripts/proto/analytics.js` loads GTM (`GTM-T433HTQJ`), sets Consent Mode v2 (denied by default in EEA/UK/CH, updated from the HubSpot banner), sends `virtual_page_view` on every hash route change (and `setPath`/`trackPageView` to HubSpot), and pushes lead and engagement events. It wraps `hsSubmit` and `bkOpen`, so new captures are tracked automatically.
- GA4, Google Ads, LinkedIn Insight, Meta Pixel and Microsoft Clarity are tags inside GTM: import `analytics/gtm-container.json` (generated by `analytics/build-gtm.py`). Never push email, name or phone into the dataLayer.

## Lead follow-up (see analytics/email-sequences.md)
- HubSpot workflows 1/A/B/M, 8 emails and the "Website – researching" list are built and off. ROI calculator at `/#/roi` (scripts/proto/roi.js); case studies at `/#/customers/<id>` (scripts/proto/cases.js): facts from closed deals only, no quotes or numbers unless a customer supplies them.

## Conventions
- Prefer editing content JSON/MD over templates. Templates should stay generic.
- Components take data from collections; no hard-coded product copy in pages except the home/category intros.
- Commit messages: imperative, one line, e.g. `Add AirSuite Quad size`.
