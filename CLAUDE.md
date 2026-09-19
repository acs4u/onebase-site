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
- Audience is operators (gyms, studios, spas, hotels, developers, teams, clinics, defence) and procurement. Consumer/app story lives under `/software`.
- Precor: `site.precorAnnounced` gates every Precor mention (`PrecorBadge`, `/partners` block). Keep `false` until the partnership is public and the wording is agreed with Precor. Precor carries IceVault, saunas and red light only (US commercial fitness); HBOT is always direct.
- Pricing: show "from" USD only where the old store published it (AirFit, AirFlex, AirForm, Hemlock). Everything else is quote-only.
- Every page ends in a path to the enquiry form or booking link.
- Keep the HBOT medical disclaimer in the footer. HBOT chambers are Class II devices in the US.

## TODO before launch
1. `site.hubspot.formId` — paste the HubSpot form GUID (portal 20568937) so the embedded form replaces the native fallback.
2. `/api/enquiry` — only needed if the native form is kept; wire to HubSpot Forms API or Resend.
3. Stripe: create Payment Links per SKU and fill `stripePaymentLink` in `src/content/parts/parts.json`.
4. Run `import:blog` and `import:images`; replace placeholder hero photography (`/images/hero`, `/images/categories/*.jpg`, `og-default.jpg`) with approved brand images from Canva/Drive.
5. Real logo SVG in `Logo.astro`; partner logos in `/images/logos` wired into the Trusted-by strip.
6. Cookie consent banner (HubSpot's banner, ID 20568937, was used on the Lovable site).
7. Hosting: Vercel (recommended) or Cloudflare Pages. Point onebasehealth.com at the new site, redirect business.onebasehealth.com → onebasehealth.com, then close the Shopify store.
8. Regional: Shopify served en-au/en-ca/en-gb; decide whether AU pricing/contacts need a dedicated page.

## Contact capture (see scripts/proto/capture.js for the agreed UX)
- Four intent-matched entry points, all into HubSpot (portal 20568937): (1) Book a call — every sales CTA opens a 3-step modal (venue/sites/timeline → HubSpot Meetings slot → details); (2) planner "Send me this plan" and configurator "Get pricing for this build" carry the plan/config; (3) two-step enquiry (email + venue type, then details); (4) spec-sheet download on product pages (email + role → printable sheet generated from product JSON).
- Submit via HubSpot Forms API (not the iframe embed) with hidden fields: source_page, capture_type, venue_type, sites, timeline, country, product, configuration. Needs custom contact properties for venue_type, sites, timeline, capture_type, configuration.
- HubSpot workflow: score on venue_type + timeline + sites; route by region; when `precorAnnounced`, route US commercial-gym leads for IceVault/sauna/red light to Precor.

## Conventions
- Prefer editing content JSON/MD over templates. Templates should stay generic.
- Components take data from collections; no hard-coded product copy in pages except the home/category intros.
- Commit messages: imperative, one line, e.g. `Add AirSuite Quad size`.
