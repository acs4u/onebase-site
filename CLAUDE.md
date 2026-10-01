# onebasehealth.com — Claude Code guide

Single marketing + lead-gen site for OneBase Health (Waylen Allen Limited), replacing the Shopify store (onebasehealth.com) and the Lovable B2B site (business.onebasehealth.com). Astro 5 + Tailwind 4, static output. Lead-gen first; Stripe Payment Links for parts.

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
- Naming: **branded house**. "OneBase" + Category+Model + Size. Sizes: Mini · Solo · Plus · Duo · Quad · Hex · Octo. Saunas drop the category: "OneBase Yakisugi Quad", "OneBase Hemlock Quad" (not "Heat Yakisugi"). ATA goes last: "OneBase AirFit Mini 1.3 ATA". Use `productName()` from `src/lib/site.ts`.
- Logo: never split One/Base, never shorten, dark logo on light and light logo on dark only. `src/components/Logo.astro` is a text placeholder — swap in the SVG wordmark.

## Positioning rules
- Software naming: the operator platform is **OneBase OS** on the website (renamed from "Salus" in Sep 2026; never use "Salus" in site copy). The member-facing app is "the OneBase app".
- Audience is operators (gyms, studios, spas, hotels, developers, teams, clinics, defence) and procurement. Consumer/app story lives under `/software`.
- Precor: `site.precorAnnounced` gates every Precor mention (`PrecorBadge`, `/partners` block). Keep `false` until the partnership is public and the wording is agreed with Precor. Precor carries IceVault, saunas and red light only (US commercial fitness); HBOT is always direct.
- Pricing: no prices anywhere on the site, including "from" prices and structured data. Every product is quote-only; the ROI calculator uses the buyer's own budget figure.
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

## Prototype build (what Vercel deploys)
- `node scripts/build-prototype.mjs` (preview) writes `prototype/onebase-prototype.html` plus `prototype/assets/*`. Pages use `#/` hash routes so the single file works anywhere.
- `SITE=1 node scripts/build-prototype.mjs` (what Vercel runs) writes `proto-dist/`: one `index.html` per page at its real path (`/products/hbot/airform`, `/blog/<slug>` …), each with its own title, meta description, canonical, Open Graph tags, JSON-LD and the page text in the HTML; shared JS/CSS in `/assets/app.js|css`; plus `sitemap.xml`, `robots.txt` and `404.html`. The client router (`scripts/proto/site.js`) uses the History API in this mode and redirects old `#/` links. Code should read the route with `obHash()` and navigate with `obGo('#/path')`, never `location.hash`. New pages must be added to the route list near the end of the build script so they get a static file and a sitemap entry.
- Shopify URLs (products, collections, pages, blogs, policies, locale prefixes) redirect in `vercel.json`.
- Blog: `src/content/posts/*.md` (41 articles imported from the Shopify blog; images in `public/images/blog`). The build renders markdown itself (no npm install on Vercel) and writes bodies to `assets/posts/<slug>.html`.
- Parts: images in `public/images/parts`, one per SKU in `parts.json`. No prices on the page; "Request" opens the enquiry form with the part named.
- Images: only OneBase's own (Drive renders, Canva, catalogues, own photos, and the blog/parts images carried over from the old Shopify store). Nothing fetched at build time. The home page opens on the four-tile hero (`hero-air/ice/heat/light`, cut once from the old Shopify home page image and committed). If any tile is missing, the single `hero-bg` hero shows instead.
- Claude preview only: build with `INLINE_MODELS=1` (the artifact host does not serve .glb) and publish the images as supporting files under `assets/`.

## Analytics (see analytics/README.md)
- `scripts/proto/analytics.js` loads GTM (`GTM-T433HTQJ`), sets Consent Mode v2 (denied by default in EEA/UK/CH, updated from the HubSpot banner), sends `virtual_page_view` on every hash route change (and `setPath`/`trackPageView` to HubSpot), and pushes lead and engagement events. It wraps `hsSubmit` and `bkOpen`, so new captures are tracked automatically.
- GA4, Google Ads, LinkedIn Insight, Meta Pixel and Microsoft Clarity are tags inside GTM: import `analytics/gtm-container.json` (generated by `analytics/build-gtm.py`). Never push email, name or phone into the dataLayer.

## Lead follow-up (see analytics/email-sequences.md)
- HubSpot workflows 1/A/B/M, 8 emails and the "Website – researching" list are built and off. ROI calculator at `/#/roi` (scripts/proto/roi.js); case studies at `/#/customers/<id>` (scripts/proto/cases.js): facts from closed deals only, no quotes or numbers unless a customer supplies them.

## Conventions
- Prefer editing content JSON/MD over templates. Templates should stay generic.
- Components take data from collections; no hard-coded product copy in pages except the home/category intros.
- Commit messages: imperative, one line, e.g. `Add AirSuite Quad size`.
