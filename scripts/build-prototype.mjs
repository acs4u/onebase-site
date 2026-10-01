// Builds a single-file, responsive, clickable prototype of the whole site from the content collections.
// Output: prototype/onebase-prototype.html (publish as an artifact, or open locally).
import fs from 'node:fs';
import path from 'node:path';

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const dir = (d) => fs.readdirSync(d).filter(f => f.endsWith('.json')).map(f => ({ id: f.replace('.json', ''), ...read(path.join(d, f)) }));
const products = dir('src/content/products').sort((a, b) => a.order - b.order);
// Distribution-partner details stay out of the page source: the client only sees a neutral dealer flag.
for (const p of products) { p.channels = { direct: !!(p.channels && p.channels.direct), dealer: !!(p.channels && p.channels.precor) }; }
const solutions = dir('src/content/solutions').sort((a, b) => a.order - b.order);
for (const s of solutions) { s.dealer = !!s.precorChannel; delete s.precorChannel; }
const team = read('src/content/team/team.json').people;
const parts = read('src/content/parts/parts.json').items;

const modalities = {
  air:   { key: 'air',   label: 'Air',   category: 'hbot',         name: 'HBOT Chambers',     blurb: 'Hyperbaric oxygen therapy from 1.3 to 2.0 ATA. Soft-shell, hard-shell and walk-in rooms.', h: 'Hyperbaric oxygen, from a soft-shell you can move to a room you walk into.', p: 'Four chambers from 1.3 to 2.0 ATA. Soft-shell AirFit and AirFlex for flexibility and accessibility, steel AirForm for clinic pressures, and the modular AirSuite room with medical-grade BIBS.' },
  ice:   { key: 'ice',   label: 'Ice',   category: 'cold-therapy', name: 'Cold Therapy',      blurb: 'Dry, electric cold rooms for 2 to 8 people. No water, no ice, no nitrogen.', h: 'Cold therapy without the water, the ice or the gas.', p: 'The IceVault is a dry, electric cold room for two to eight people. Longer, more tolerable sessions, no wet floors, no cryogenic risk, and a self-cleaning cycle that keeps staff time low.' },
  heat:  { key: 'heat',  label: 'Heat',  category: 'sauna',        name: 'Saunas',             blurb: 'Full-spectrum, low-EMF infrared in Yakisugi cedar or Hemlock. Plug-and-play.', h: 'Full-spectrum infrared, built to run all day.', p: 'Low-EMF near, mid and far infrared at a restorative 135–149°F. Choose Yakisugi-charred cedar for the statement piece, or light Hemlock for a clean, contemporary suite.' },
  light: { key: 'light', label: 'Light', category: 'red-light',    name: 'Red Light Therapy', blurb: 'Modular panels, a full-body bed and a stand-up booth. 633 to 940 nm.', h: 'Red and near-infrared light, sized to your floor.', p: 'Start with a single LightPanel, stack to a Quad, or go full-body in the LightBed or the stand-up LightZone, with minimal operator time.' },
};
const policies = {
  warranty: ['Warranty Policy', ['## Standard warranty coverage', 'We offer a 2-year standard warranty on our products, covering defects in materials and workmanship under normal use and maintenance. The specific warranty period for each purchase is confirmed by the sales representative at the time of sale and stated on the invoice.', '## Exclusions', 'Normal wear and tear from regular use; improper use, misuse or mishandling; exposure to extreme or unsuitable environmental conditions; unauthorised modifications or repairs.', '## Filing a claim', 'Contact customerservice@onebasehealth.com with proof of purchase and a description of the issue. Approved claims are resolved through repair or replacement at the company’s discretion.', '## Your rights under consumer law', 'This warranty is in addition to any rights you have under consumer protection laws that cannot be excluded, including the Australian Consumer Law.']],
  returns: ['Refunds and Returns', ['## No returns or refunds', 'We maintain a strict policy of no returns or refunds. Exceptions are considered at our discretion, including incorrect items received due to our error.', '## Defective or damaged items', 'If your product arrives defective or damaged through no fault of your own, we will repair or replace it. Report within 7 days of receipt with proof of purchase and photos or video.', '## Second-hand and third-party purchases', 'Only products purchased directly from Waylen Allen Limited or its brands via our official websites are eligible.', '## Your rights under consumer law', 'Nothing in this policy limits rights you have under consumer protection laws that cannot be excluded, including the Australian Consumer Law.']],
  privacy: ["Privacy Policy", ["Last updated: 27 September 2026.", "This policy explains what personal information OneBase Health collects through onebasehealth.com, how we use it and the choices you have. OneBase Health is a trading name of Waylen Allen Limited, a company registered in Hong Kong, and its subsidiary OneBase Health Australia Pty Ltd. In this policy \"we\" means those companies.", "## What we collect", "Information you give us: your name, email address, phone number, company, country, venue type, number of sites, installation timeline and anything you write in a message, when you send an enquiry, book a call, download a spec sheet or request a part. If you buy from us we also keep order, delivery and invoice details.", "Information collected automatically: pages you visit, links you click, the device and browser you use, your approximate location from your IP address, and how you arrived at the site. This comes from cookies and similar tools described in our Cookie Policy. With your consent, Microsoft Clarity records how pages are used (clicks, scrolling and mouse movement) so we can fix problems; it masks text you type into forms.", "Information from others: meeting details when you book through our scheduling tool, and information from our authorised dealers if you ask them to put you in touch with us.", "## How we use it", "To answer your enquiry, prepare quotes, plan installations, deliver and support equipment, process payments and meet legal and tax obligations. To send follow-up emails about the products you asked about; every email has an unsubscribe link. To understand how the site is used and improve it. With your consent, to measure and show advertising on Google, Meta and LinkedIn.", "Where the GDPR or UK GDPR applies, our legal bases are: taking steps at your request before a contract, and performing that contract; our legitimate interest in running and improving our business and responding to enquiries; your consent (analytics and advertising cookies, marketing emails where consent is required); and legal obligations.", "We do not sell your personal information, and we do not use it to make automated decisions that have legal or similarly significant effects on you.", "## Who we share it with", "Service providers who process data for us under contract: HubSpot (customer relationship management, forms, email and scheduling), Google (Tag Manager, Analytics, Ads and Workspace), Meta, LinkedIn, Microsoft (Clarity), Vercel (website hosting), Stripe (card payments) and our freight and installation partners. Our authorised dealers, only when you ask to buy through a dealer or your enquiry is for a region a dealer covers. Professional advisers, and authorities when the law requires it.", "## International transfers", "We work across Hong Kong, the United States, Australia and Europe, and our service providers store data in the United States and elsewhere. When we transfer personal information out of the country where it was collected, we rely on contractual safeguards such as the European Commission’s standard contractual clauses or other protections required by the law that applies.", "## How long we keep it", "Enquiries and sales records: for as long as we have a business relationship with you and up to seven years afterwards for accounting and warranty purposes. Marketing contacts: until you unsubscribe or ask us to delete your details. Analytics data: up to 14 months.", "## Your rights", "Depending on where you live, you can ask to access, correct or delete your personal information, object to or restrict how we use it, receive a copy in a portable format, and withdraw consent at any time (this does not affect processing that already happened). You can change cookie choices through the cookie banner on the site. Residents of California and other US states with privacy laws can also ask what we collect and opt out of targeted advertising. We will not treat you differently for using these rights.", "To make a request, email customerservice@onebasehealth.com. We may need to confirm your identity first. You can also complain to your local regulator: the Office of the Privacy Commissioner for Personal Data in Hong Kong, the Office of the Australian Information Commissioner, or your data protection authority in the UK or EU.", "## Security", "We use access controls, encryption in transit and reputable service providers to protect personal information. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.", "## Children", "This site is for businesses and adults. We do not knowingly collect personal information from children under 16.", "## Changes", "We will post any changes on this page and update the date at the top. If a change is significant we will tell you more prominently.", "## Contact", "Questions about this policy: customerservice@onebasehealth.com."]],
  cookies: ["Cookie Policy", ["Last updated: 27 September 2026.", "Cookies are small files a website stores in your browser. We use them, and similar tools such as pixels and local storage, as described below. Where the law requires it, including for visitors in the UK, EU and Switzerland, analytics and advertising cookies are only set after you agree to them in the cookie banner.", "## Strictly necessary", "Keep the site working and remember your cookie choices. These are always on. Provider: HubSpot (cookie consent).", "## Analytics", "Tell us which pages are visited, how people move through the site and where forms or pages cause problems. Providers: Google Analytics (via Google Tag Manager), HubSpot analytics and Microsoft Clarity (session replay and heatmaps, with form text masked).", "## Advertising", "Measure the results of our ads and show relevant ads on other sites. Providers: Google Ads, Meta Pixel and LinkedIn Insight Tag.", "## Your choices", "Use the cookie banner to accept, reject or change your preferences at any time. You can also block or delete cookies in your browser settings, though some parts of the site may not work as well. Google offers an opt-out for Analytics at tools.google.com/dlpage/gaoptout.", "## More information", "See our Privacy Policy for how we handle personal information, or email customerservice@onebasehealth.com."]],
  terms: ["Terms of Use", ["Last updated: 27 September 2026.", "These terms apply to your use of onebasehealth.com, operated by Waylen Allen Limited (trading as OneBase Health). By using the site you agree to them.", "## Information on this site", "Content is for general information and education. It is not medical advice and is not a substitute for advice from a qualified health professional. Hyperbaric chambers are regulated as medical devices in some countries, including as Class II devices in the United States; their use may require a prescription and must follow local rules. Product descriptions, specifications and images are indicative and may change without notice.", "## Quotes and orders", "The site does not form a contract of sale. Prices, lead times and delivery are confirmed in a written quotation, and each sale is governed by that quotation and our terms of sale. Estimates from the ROI calculator are illustrative only and are not a promise of revenue or results.", "## Using the site", "Do not misuse the site: no attempts to gain unauthorised access, interfere with its operation, scrape it at scale or use it for unlawful purposes.", "## Intellectual property", "OneBase, the OneBase logo, product names, text, images, 3D models and software on this site belong to us or our licensors. You may view and print pages for your own business use. Other use needs our written permission. Customer names and logos belong to their owners and are shown to identify businesses that use our equipment.", "## Links", "Links to other websites are provided for convenience. We are not responsible for their content or privacy practices.", "## Liability", "We provide the site \"as is\". To the extent the law allows, we exclude liability for loss arising from use of the site or reliance on its content. Nothing in these terms limits liability that cannot be limited by law, or rights you have under consumer protection laws such as the Australian Consumer Law.", "## Governing law", "These terms are governed by the laws of the Hong Kong Special Administrative Region, without affecting any mandatory consumer rights in the country where you live.", "## Contact", "customerservice@onebasehealth.com"]],
};
// Blog: markdown posts in src/content/posts (imported from the Shopify blog). Bodies are written as separate
// HTML files (assets/posts/<slug>.html) and fetched when a post is opened, so the page stays small.
const POST_CAT = { education: 'Education', news: 'News', 'contrast-therapy': 'Contrast therapy', 'red-light': 'Red light', 'science-research': 'Science & research' };
const fmParse = (src) => { const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/); const fm = {}; if (!m) return { fm, body: src };
  for (const line of m[1].split('\n')) { const k = line.match(/^(\w+):\s*(.*)$/); if (!k) continue; let v = k[2].trim(); if (v.startsWith('"')) { try { v = JSON.parse(v); } catch {} } fm[k[1]] = v; } return { fm, body: m[2] }; };
const fmtDate = (d) => { const t = new Date(d + 'T00:00:00Z'); return isNaN(t) ? '' : t.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }); };
const postSrc = fs.readdirSync('src/content/posts').filter(f => f.endsWith('.md')).map(f => { const { fm, body } = fmParse(fs.readFileSync('src/content/posts/' + f, 'utf8')); return { id: f.slice(0, -3), fm, body }; })
  .filter(p => p.fm.draft !== 'true').sort((a, b) => String(b.fm.pubDate).localeCompare(String(a.fm.pubDate)));
const posts = postSrc.map(p => ({ id: p.id, title: p.fm.title, cat: POST_CAT[p.fm.category] || 'Education', catKey: p.fm.category || 'education', date: fmtDate(p.fm.pubDate), iso: p.fm.pubDate, updated: p.fm.updatedDate || p.fm.pubDate, author: p.fm.author || 'OneBase Health', desc: p.fm.description || '', hero: p.fm.heroImage ? p.fm.heroImage.replace(/^\/images\/blog\//, '') : null }));
// Small markdown renderer (headings, paragraphs, lists, quotes, links, images, bold, italic): the build needs no npm install.
function mdInline(t){ const e = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return e.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, '<img src="$2" alt="$1">').replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (m, x, u) => `<a href="${u}"${/^https?:/.test(u) && !u.includes('onebasehealth.com') ? ' target="_blank" rel="noopener"' : ''}>${x}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])_([^_]+)_(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>').replace(/(^|[\s(])\*([^*]+)\*(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>').replace(/\\([\\`*_{}\[\]()#+\-.!>])/g, '$1'); }
function mdToHtml(md){ const lines = md.replace(/\r/g, '').split('\n'); let out = '', i = 0;
  const isLi = (l) => /^\s*([-*+]|\d+\.)\s+/.test(l);
  while (i < lines.length) { const l = lines[i];
    if (!l.trim()) { i++; continue; }
    const h = l.match(/^(#{1,6})\s+(.*)$/); if (h) { const n = Math.min(4, Math.max(2, h[1].length + (h[1].length === 1 ? 1 : 0))); out += `<h${n}>${mdInline(h[2].replace(/\s*#+$/, ''))}</h${n}>`; i++; continue; }
    if (/^\s*>/.test(l)) { const q = []; while (i < lines.length && /^\s*>/.test(lines[i])) q.push(lines[i++].replace(/^\s*>\s?/, '')); out += `<blockquote>${mdToHtml(q.join('\n'))}</blockquote>`; continue; }
    if (isLi(l)) { const ordered = /^\s*\d+\./.test(l); const items = []; while (i < lines.length && (isLi(lines[i]) || (lines[i].trim() && /^\s{2,}/.test(lines[i])) || (!lines[i].trim() && i + 1 < lines.length && isLi(lines[i + 1])))) { const x = lines[i++]; if (isLi(x)) items.push(x.replace(/^\s*([-*+]|\d+\.)\s+/, '')); else if (x.trim() && items.length) items[items.length - 1] += ' ' + x.trim(); }
      out += (ordered ? '<ol>' : '<ul>') + items.map(x => `<li>${mdInline(x)}</li>`).join('') + (ordered ? '</ol>' : '</ul>'); continue; }
    const para = []; while (i < lines.length && lines[i].trim() && !/^(#{1,6})\s/.test(lines[i]) && !isLi(lines[i]) && !/^\s*>/.test(lines[i])) para.push(lines[i++].trim());
    out += `<p>${mdInline(para.join(' '))}</p>`; }
  return out; }
const postHTML = Object.fromEntries(postSrc.map(p => [p.id, mdToHtml(p.body)]));

const imgDir = 'public/images/src';
// Images and 3D models are written next to the page as separate files (prototype/assets/…) and loaded on demand,
// so the page itself stays small. Vercel copies prototype/assets to the site root; the preview publishes them as supporting files.
const ASSETS = process.env.SITE ? 'proto-dist/assets' : 'prototype/assets';
// SITE=1 (the Vercel build) serves every page at its own path, so asset URLs must be absolute.
const SITE = !!process.env.SITE; const AB = SITE ? '/assets/' : 'assets/';
fs.rmSync(ASSETS, { recursive: true, force: true }); fs.mkdirSync(ASSETS + '/img', { recursive: true }); fs.mkdirSync(ASSETS + '/models', { recursive: true });
const img = Object.fromEntries(fs.readdirSync(imgDir).filter(f => /\.(jpg|png|webp)$/.test(f)).map(f => { fs.copyFileSync(path.join(imgDir, f), `${ASSETS}/img/${f}`); return [f.replace(/\.(jpg|png|webp)$/,''), AB + 'img/' + f]; }));
const prodImg = { airfit:'airfit', airflex:'airflex', airform:'airform-plus-black', airsuite:null, icevault:'gdr-ice', yakisugi:'gdr-heat', hemlock:'hemlock', lightpanel:'lightpanel-quad', lightbed:'gdr-light', lightzone:'lzr-closed-f' };
const solImg = { 'fitness-centers':'rs-yakisugi','luxury-hospitality':'tenx-airform','pro-sports-performance':'as-man','multi-family-housing':'rs-yakisugi-inside','military-first-responders':'as-duo-seats','high-end-real-estate':'yk-duo-towels','recovery-wellness-studios':'tenx-redlight','corporate-wellness':'as-install' };
// Customer wall — companies with closed-won deals in HubSpot (lifecycle = customer), grouped by segment. For review: remove any without permission.
const customers = [
  { seg: 'Pro sports & performance', names: ['Las Vegas Raiders', 'Los Angeles FC', 'New England Revolution', 'Portland Timbers', 'TB12', 'EXOS', 'SPORTFIVE', 'Hong Kong Sports Institute', 'Judo Association of Hong Kong', 'Flow Research Collective', 'Sports Performance Physical Therapy', 'Novum Performance & Longevity', 'Variant Training Lab', 'High Octane'] },
  { seg: 'Fitness clubs', names: ['The Edge Fitness Clubs', 'VIDA Fitness', 'PURE Family Fitness', 'Harbor Square Athletic Club', 'Razor Sharp Fitness', 'Balance Gym', 'Soluna Fitness', 'The Rising Zone', 'Wellness Solutions Inc.'] },
  { seg: 'Recovery & wellness studios', names: ['The Covery', '10X Longevity', 'Hume', 'Hype Wellness Studio', 'Collagen Lab', 'V2 Wellness Group', 'Patient Zero', 'Prairie Health & Wellness', 'Alive and Well', 'SB Wellness Group', 'Hopson Health Wellness Center', 'Northport Wellness Center', 'Wellness NOLA', 'Viridian Experience', 'Evolve Health Labs', 'Elixir', 'Time to Bloom', 'The Center for Connection and Wellness', 'Bang Salon'] },
  { seg: 'Clinics & medical', names: ['HealthFit', 'Hyperbaric Associates of America', 'Infinity IV & Wellness', 'Revital Health', 'Belo Medical Group', 'Makena Health Maui', 'Life Clinics', 'Genesis Surgery', 'IHASA', 'North Shore Hyperbarics', 'Inspire Chiropractic & Wellness', 'Horst Chiropractic', 'Restore Sports Medicine', 'Doylestown Sports Medicine Center', 'Penrose Physical Therapy', 'Fick PT & Performance', 'Morgain Physical Therapy', 'Warrior Restoration', 'de Musculatuur', 'Dr. Michael Ruscio, DC', 'Jason Alexander Med Spa'] },
  { seg: 'Brands & creators', names: ['Jake Paul', 'Kayla Barnes', 'The Fox Tan', 'FuzzYard', 'Pretty Farm Girl'] },
];
const EXTRA_CSS = fs.readFileSync('scripts/proto/extra.css','utf8');
const EXTRA_JS = fs.readFileSync('scripts/proto/extra.js','utf8') + '\n' + fs.readFileSync('scripts/proto/software.js','utf8') + '\n' + fs.readFileSync('scripts/proto/tablet.js','utf8') + '\n' + fs.readFileSync('scripts/proto/hubspot.js','utf8') + '\n' + fs.readFileSync('scripts/proto/capture.js','utf8') + '\n' + fs.readFileSync('scripts/proto/products.js','utf8') + '\n' + fs.readFileSync('scripts/proto/tesla.js','utf8') + '\n' + fs.readFileSync('scripts/proto/figma.js','utf8') + '\n' + fs.readFileSync('scripts/proto/appetize.js','utf8') + '\n' + fs.readFileSync('scripts/proto/cleanup.js','utf8') + '\n' + fs.readFileSync('scripts/proto/guide.js','utf8') + '\n' + fs.readFileSync('scripts/proto/trad.js','utf8') + '\n' + fs.readFileSync('scripts/proto/lightzone.js','utf8') + '\n' + fs.readFileSync('scripts/proto/analytics.js','utf8') + '\n' + fs.readFileSync('scripts/proto/roi.js','utf8') + '\n' + fs.readFileSync('scripts/proto/cases.js','utf8') + '\n' + fs.readFileSync('scripts/proto/site.js','utf8');
const glbDir = 'public/models';
const glb = fs.existsSync(glbDir) ? Object.fromEntries(fs.readdirSync(glbDir).filter(f => f.endsWith('.glb')).map(f => { fs.copyFileSync(path.join(glbDir, f), `${ASSETS}/models/${f}`); return [f.replace('.glb',''), process.env.INLINE_MODELS ? 'data:model/gltf-binary;base64,' + fs.readFileSync(path.join(glbDir, f)).toString('base64') : AB + 'models/' + f]; })) : {};
for (const d of ['blog', 'parts', 'posts']) fs.mkdirSync(`${ASSETS}/${d}`, { recursive: true });
for (const d of ['blog', 'parts']) if (fs.existsSync('public/images/' + d)) for (const f of fs.readdirSync('public/images/' + d)) fs.copyFileSync(`public/images/${d}/${f}`, `${ASSETS}/${d}/${f}`);
for (const [id, h] of Object.entries(postHTML)) fs.writeFileSync(`${ASSETS}/posts/${id}.html`, h.replace(/src="\/images\/blog\//g, `src="${AB}blog/`).replace(/<img /g, '<img loading="lazy" decoding="async" '));
for (const it of parts) if (it.image) it.image = it.image.replace(/^\/images\/parts\//, AB + 'parts/');
for (const p of posts) if (p.hero) p.hero = AB + 'blog/' + p.hero;
// INLINE_MODELS=1 embeds the 3D models in the page, for the Claude preview only (it does not serve .glb files).
const MV = fs.readFileSync('scripts/proto/vendor-model-viewer.min.js','utf8');
// Logo aspect ratios (from the PNG header) so every logo on the wall gets roughly the same visual area.
const logoAR = Object.fromEntries(fs.readdirSync(imgDir).filter(f => /^logo-.*\.png$/.test(f)).map(f => { const b = fs.readFileSync(path.join(imgDir, f)); return [f.slice(5,-4), +(b.readUInt32BE(16) / b.readUInt32BE(20)).toFixed(2)]; }));
const data = { logoAR, products, solutions, team, parts, modalities, policies, posts, img, prodImg, solImg, customers, glb };

const html = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">__HEAD__
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&family=Lato:ital,wght@0,300;0,400;1,300;1,400&display=swap">
<style>
:root{
  --black:#1f1f1f;--ink:#1f1f1f;--white:#fff;--grey:#e7e9eb;--g50:#f6f7f8;--g300:#c9cdd2;--g500:#6b6873;--g700:#4a4a4f;
  --bg:#fff;--fg:#1f1f1f;--muted:#4a4a4f;--faint:#6b6873;--line:#e7e9eb;--surf:#f6f7f8;--card:#fff;--soft-fallback:#f6f7f8;
  --air-900:#122232;--air-400:#9aacbe;--air-100:#e7f6fd;--ice-900:#063944;--ice-500:#5c94ab;--ice-100:#c8e2e8;
  --heat-700:#c4522e;--heat-400:#e6886a;--heat-100:#f0d48e;--light-800:#8b2232;--light-500:#ea7c8c;--light-100:#f7bfbf;
  --r:6px;--gutter:20px;--max:1200px;
  --display:"Poppins",ui-sans-serif,system-ui,sans-serif;--key:"Lato",ui-sans-serif,system-ui,sans-serif;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#2a2a2d;--fg:#f2f2f2;--muted:#cfcfd3;--faint:#a3a3a9;--line:#3a3a3e;--surf:#313134;--card:#2f2f32;--black:#1f1f1f;--ink:#1f1f1f;--white:#f2f2f2;--soft-fallback:#1c1c1e}}
:root[data-theme="dark"]{--bg:#2a2a2d;--fg:#f2f2f2;--muted:#cfcfd3;--faint:#a3a3a9;--line:#3a3a3e;--surf:#313134;--card:#2f2f32;--black:#1f1f1f;--ink:#1f1f1f;--white:#f2f2f2;--soft-fallback:#1c1c1e}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--display);font-weight:300;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{margin:0;font-weight:500;letter-spacing:-.02em;line-height:1.1;text-wrap:balance}
h1{font-size:clamp(34px,5.4vw,62px)}h2{font-size:clamp(26px,3.6vw,44px)}h3{font-size:clamp(17px,1.5vw,22px)}
p{margin:0}a{color:inherit;text-decoration:none}img{max-width:100%}
.wrap{max-width:var(--max);margin:0 auto;padding-inline:var(--gutter)}
.sec{padding-block:56px}@media(min-width:900px){.sec{padding-block:96px}}
.eyebrow{font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--faint)}
.key{font-family:var(--key);font-style:italic;font-weight:300;font-size:clamp(19px,2.2vw,28px);line-height:1.35;color:var(--muted)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 22px;border-radius:var(--r);font-size:14px;font-weight:500;border:1px solid transparent;cursor:pointer;font-family:inherit;line-height:1}
.btn-p{background:var(--fg);color:var(--bg)}.btn-g{border-color:var(--fg);color:var(--fg)}
.dark{background:var(--black);color:#fff}.dark .eyebrow{color:rgba(255,255,255,.6)}.dark h1,.dark h2,.dark h3{color:#fff}.dark .key{color:rgba(255,255,255,.78)}.dark .muted{color:rgba(255,255,255,.7)}
.dark .btn-p{background:#fff;color:#1f1f1f}.dark .btn-g{border-color:rgba(255,255,255,.4);color:#fff}
.muted{color:var(--muted)}.small{font-size:14px}.faint{color:var(--faint)}
.grid{display:grid;gap:20px}.g2{grid-template-columns:repeat(2,minmax(0,1fr))}.g3{grid-template-columns:repeat(3,minmax(0,1fr))}.g4{grid-template-columns:repeat(4,minmax(0,1fr))}
@media(max-width:900px){.g3,.g4{grid-template-columns:repeat(2,minmax(0,1fr))}.grid[style*="grid-template-columns"]{grid-template-columns:1fr!important}}@media(max-width:560px){.g2,.g3,.g4{grid-template-columns:1fr}.g4.keep2,.g2.keep2{grid-template-columns:repeat(2,minmax(0,1fr))}}
.stack{display:flex;flex-direction:column;gap:14px}.row{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.ph{display:flex;align-items:center;justify-content:center;text-align:center;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--faint);background:var(--surf);padding:16px;border-radius:var(--r)}
.hero{position:relative;background:var(--ink);color:#fff;display:flex;flex-direction:column;justify-content:flex-end;min-height:min(78vh,720px)}
.hero .ph{position:absolute;inset:0;border-radius:0;background:var(--ink);color:rgba(255,255,255,.28);align-items:flex-start;padding-top:48px}.hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:0!important}.hero .veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.30) 0%,rgba(0,0,0,.35) 55%,rgba(0,0,0,.65) 100%)}
.wall{display:grid;gap:28px 40px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}.wall .names{display:flex;flex-wrap:wrap;gap:8px 18px;font-weight:500;font-size:15px;letter-spacing:-.01em}.wall .names span{white-space:nowrap}
.logos{display:flex;flex-wrap:wrap;gap:10px 28px;align-items:center}.logos img{height:34px;width:auto;mix-blend-mode:multiply;opacity:.85}.logos img.crest{height:44px}
.mq{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}.mq-t{display:flex;width:max-content;animation:mq 110s linear infinite}.mq.rev .mq-t{animation-direction:reverse;animation-duration:130s}.mq:hover .mq-t{animation-play-state:paused}@keyframes mq{to{transform:translateX(-50%)}}
.ct{display:inline-flex;align-items:center;justify-content:center;height:56px;padding:0 26px;white-space:nowrap}.ct.wm{font-weight:500;font-size:17px;letter-spacing:-.02em;color:var(--muted)}.ct.nm{font-weight:700;font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:var(--fg);opacity:.62;transition:opacity .2s}.ct.nm:hover,.cg:hover .ct.nm{opacity:1}.ct.lg img{height:40px;width:auto;max-width:100%;object-fit:contain;mix-blend-mode:multiply;opacity:.88;filter:grayscale(1) brightness(.5) contrast(1.2);transition:filter .2s,opacity .2s}.ct.lg img.crest{height:54px}.ct.lg:hover img,.cg:hover .ct.lg img{filter:none;opacity:1}
@media(prefers-reduced-motion:reduce){.mq-t{animation:none;flex-wrap:wrap;width:auto}.mq [aria-hidden="true"]{display:none}}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{font:inherit;font-size:13px;font-weight:500;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--fg);cursor:pointer}.chip[aria-pressed="true"]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.cgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:24px}.cg{background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:128px;padding:18px 12px;gap:8px}.cg[hidden]{display:none}.cg .ct{height:48px;padding:0;white-space:normal}.cg .ct.wm{font-size:16px;color:var(--fg);line-height:1.25}.cg small{font-size:11px;color:var(--faint);letter-spacing:.02em}
@media(max-width:600px){.cgrid{grid-template-columns:repeat(2,1fr)}.ct{padding:0 18px}.ct.wm{font-size:15px}}
:root[data-theme="dark"] .ct.lg img{mix-blend-mode:normal;background:#fff;padding:4px 8px;border-radius:4px}@media(prefers-color-scheme:dark){:root:not([data-theme="light"]) .ct.lg img{mix-blend-mode:normal;background:#fff;padding:4px 8px;border-radius:4px}}
.cmp{width:100%;border-collapse:collapse;font-size:14px}.cmp th,.cmp td{padding:12px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.cmp th{font-weight:500}.cmp thead th{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--faint)}.cmp td.y{color:var(--ice-900);font-weight:500}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]) .logos img{mix-blend-mode:normal;background:#fff;padding:4px 8px;border-radius:4px}:root:not([data-theme="light"]) .cmp td.y{color:var(--ice-100)}}:root[data-theme="dark"] .logos img{mix-blend-mode:normal;background:#fff;padding:4px 8px;border-radius:4px}:root[data-theme="dark"] .cmp td.y{color:var(--ice-100)}
.hero .inner{position:relative;padding-block:120px 48px}
.hero h1{color:#fff;max-width:18ch}.hero .key{color:rgba(255,255,255,.85);max-width:48ch}
.card{border:1px solid var(--line);border-radius:var(--r);background:var(--card);overflow:hidden;display:flex;flex-direction:column}
.card .body{padding:18px;display:flex;flex-direction:column;gap:6px;flex-grow:1}
.bar{height:3px;background:var(--acc,var(--line))}
.mod-air{--acc:var(--air-400);--deep:var(--air-900);--soft:var(--air-100)}.mod-ice{--acc:var(--ice-500);--deep:var(--ice-900);--soft:var(--ice-100)}
.mod-heat{--acc:var(--heat-400);--deep:var(--heat-700);--soft:var(--heat-100)}.mod-light{--acc:var(--light-500);--deep:var(--light-800);--soft:var(--light-100)}
.acc{color:var(--deep,var(--fg))}.softbg{background:var(--soft,var(--soft-fallback));color:#1f1f1f}
.accgrad{background:linear-gradient(135deg,var(--deep,#1f1f1f),var(--acc,#4a4a4f));color:#fff}
.spec{width:100%;border-collapse:collapse;font-size:14px}.spec th{text-align:left;font-weight:500;color:var(--muted);padding:10px 12px 10px 0;border-bottom:1px solid var(--line);vertical-align:top;width:38%}.spec td{padding:10px 0;border-bottom:1px solid var(--line);vertical-align:top;white-space:pre-line}
.tip{border-top:1px solid var(--g300);padding-top:12px}
details{border-bottom:1px solid var(--g300);padding:12px 0}summary{cursor:pointer;font-weight:500;list-style:none;display:flex;justify-content:space-between;gap:12px}summary::after{content:"+";color:var(--faint)}details[open] summary::after{content:"–"}
header.site{position:sticky;top:env(safe-area-inset-top,0px);z-index:30;background:var(--bg);border-bottom:1px solid var(--line)}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:66px;gap:16px}
.logo{font-weight:500;font-size:20px;letter-spacing:-.02em;display:inline-flex;align-items:center}.logo img.lg{height:30px;width:auto;display:block}.lg-light{display:none!important}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]) .lg-dark{display:none!important}:root:not([data-theme="light"]) .lg-light{display:block!important}}:root[data-theme="dark"] .lg-dark{display:none!important}:root[data-theme="dark"] .lg-light{display:block!important}
nav.main{display:none;gap:26px;font-size:14px;font-weight:500}nav.main a.on{text-decoration:underline;text-underline-offset:8px}
@media(min-width:900px){nav.main{display:flex}.menu-btn{display:none}}
.menu-btn{background:none;border:0;color:inherit;padding:8px;cursor:pointer}
.drawer{display:none;background:var(--black);color:#fff;padding:20px var(--gutter) 28px;flex-direction:column;gap:2px;font-size:18px;font-weight:500}
.drawer.open{display:flex}.drawer a{padding:10px 0;border-bottom:1px solid rgba(255,255,255,.1)}.drawer a.sub{font-size:15px;font-weight:300;color:rgba(255,255,255,.7);padding-left:14px;border:0}
footer.site{background:var(--black);color:#fff;font-size:14px}footer.site .cols{display:grid;gap:32px;grid-template-columns:1.4fr repeat(4,1fr)}@media(max-width:900px){footer.site .cols{grid-template-columns:1fr 1fr}}@media(max-width:560px){footer.site .cols{grid-template-columns:1fr}}
footer.site .cols a{display:block;color:rgba(255,255,255,.8);padding:3px 0}footer.site .cols a:hover{color:#fff}
.legal{border-top:1px solid rgba(255,255,255,.12);margin-top:40px;padding-top:24px;font-size:12px;color:rgba(255,255,255,.5);line-height:1.6}
form.enq{display:grid;gap:14px;grid-template-columns:repeat(2,minmax(0,1fr));background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:22px}
form.enq label{display:flex;flex-direction:column;gap:5px;font-size:13px}form.enq input,form.enq select,form.enq textarea{font:inherit;font-size:14px;padding:10px 12px;border:1px solid var(--line);border-radius:var(--r);background:var(--bg);color:var(--fg)}
form.enq .full{grid-column:1/-1}@media(max-width:560px){form.enq{grid-template-columns:1fr}}
.pill{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:999px;padding:4px 10px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.pill i{width:5px;height:5px;border-radius:50%;background:currentColor}
.dark .pill{border-color:rgba(255,255,255,.35);color:rgba(255,255,255,.85)}
.crumb{font-size:12px;color:var(--faint)}.crumb a:hover{color:var(--fg)}
.review{position:fixed;left:0;right:0;bottom:0;z-index:40;background:rgba(31,31,31,.94);color:#fff;font-size:12px;padding:8px var(--gutter);padding-bottom:calc(8px + env(safe-area-inset-bottom,0px));display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap;backdrop-filter:blur(6px)}
.review label{display:flex;gap:6px;align-items:center;cursor:pointer}.review .x{margin-left:auto;background:none;border:0;color:#fff;cursor:pointer;font-size:16px}
main{padding-bottom:56px}
:focus-visible{outline:2px solid var(--ice-500);outline-offset:2px}
@media(prefers-reduced-motion:no-preference){main{animation:fade .25s ease}}@keyframes fade{from{opacity:.6}to{opacity:1}}
.prose p{margin-bottom:16px;max-width:68ch;color:var(--muted)}.prose h2{font-size:22px;margin:26px 0 8px}
${EXTRA_CSS}
</style>

<header class="site"><div class="wrap">
  <a href="#/" class="logo" aria-label="OneBase home" id="hdrLogo">OneBase</a>
  <nav class="main" id="nav"></nav>
  <div class="row" style="gap:10px">
    <a href="tel:+12084081801" class="small" style="font-weight:500;display:none" id="phone">(208) 408-1801</a>
    <a href="#/contact" class="btn btn-p" style="padding:10px 16px;font-size:13px">Talk to sales</a>
    <button class="menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
  </div>
</div><div class="drawer" id="drawer"></div></header>

<main id="app">__PRE__</main>

<footer class="site"><div class="wrap sec" id="foot"></div></footer>


<script>
window.OB_SITE = ${SITE}; const OB_ROOT = '${SITE ? '/' : ''}';
const D = ${JSON.stringify(data)};
const S = { dealer: true };
const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const pn = (p, size) => 'OneBase ' + p.name + (size ? ' ' + size : '');
const mod = (k) => D.modalities[k];
const catMod = { 'hbot':'air','cold-therapy':'ice','sauna':'heat','red-light':'light' };
const pic = (key, label, h, extra='', fit='cover') => D.img[key] ? \`<img src="\${D.img[key]}" alt="\${esc(label)}" style="display:block;width:100%;height:\${h?h+'px':'100%'};object-fit:\${fit};border-radius:var(--r);\${extra}" loading="lazy">\` : ph(label, h, extra);
const ph = (label, h, extra='') => \`<div class="ph" style="min-height:\${h}px;\${extra}">\${esc(label)}</div>\`;
const LOGO = {'Los Angeles FC':'lafc','New England Revolution':'nerevolution','HealthFit':'healthfit','10X Longevity':'10x','The Covery':'covery','Hype Wellness Studio':'hype','Hume':'hume','Infinity IV & Wellness':'infinity','Revital Health':'revital','Portland Timbers':'timbers','PURE Family Fitness':'pure','Razor Sharp Fitness':'razorsharp','Balance Gym':'balancegym','Time to Bloom':'bloom','Belo Medical Group':'belo','Fick PT & Performance':'fick','Las Vegas Raiders':'raiders','EXOS':'exos','SPORTFIVE':'sportfive','Hong Kong Sports Institute':'hksi','Judo Association of Hong Kong':'hkjudo','Flow Research Collective':'flow','Sports Performance Physical Therapy':'sppt','Novum Performance & Longevity':'novum','The Rising Zone':'risingzone','Alive and Well':'aliveandwell','SB Wellness Group':'sbwellness','Northport Wellness Center':'northport','Viridian Experience':'viridian','The Center for Connection and Wellness':'ccw','Makena Health Maui':'makena','Genesis Surgery':'genesis','IHASA':'ihasa','Inspire Chiropractic & Wellness':'inspire','Restore Sports Medicine':'restore','Doylestown Sports Medicine Center':'doylestown','Penrose Physical Therapy':'penrose','Dr. Michael Ruscio, DC':'ruscio','The Fox Tan':'foxtan','FuzzYard':'fuzzyard','Pretty Farm Girl':'prettyfarmgirl','TB12':'tb12','Soluna Fitness':'soluna','Horst Chiropractic':'horst','de Musculatuur':'musculatuur','Morgain Physical Therapy':'morgain'};
// People without a brand mark: their name set as a bold wordmark, not a borrowed logo.
const NAMEMARK = ['Jake Paul','Kayla Barnes'];
const CREST = ['lafc','nerevolution','timbers','raiders','foxtan','northport','musculatuur'];
const FEATURED = ['Los Angeles FC','New England Revolution','Las Vegas Raiders','Portland Timbers','TB12','EXOS','Jake Paul','Kayla Barnes','The Covery','10X Longevity','Hume','HealthFit','Hong Kong Sports Institute'];
const custCount = () => D.customers.reduce((a,c)=>a+c.names.length,0);
function allCust(){ const a=[]; D.customers.forEach(c=>c.names.forEach(n=>a.push({n,seg:c.seg}))); return FEATURED.map(n=>a.find(x=>x.n===n)).filter(Boolean).concat(a.filter(x=>!FEATURED.includes(x.n))); }
// Equal-area sizing: wide wordmarks get shorter, capped at 200px wide; crests keep their CSS height.
function lsz(k){ const ar=D.logoAR[k]; if(!ar||CREST.includes(k)) return ''; const h=Math.min(40, Math.sqrt(5200/ar), 168/ar); return h<40 ? \` style="height:\${h.toFixed(1)}px"\` : ''; }
function ctile(n, hid){ const k=LOGO[n]; const h=hid?' aria-hidden="true"':''; if(NAMEMARK.includes(n)) return \`<span class="ct nm"\${h}>\${esc(n)}</span>\`; return k&&D.img['logo-'+k]?\`<span class="ct lg"\${h}><img src="\${D.img['logo-'+k]}" alt="\${esc(n)}" class="\${CREST.includes(k)?'crest':''}"\${lsz(k)}></span>\`:\`<span class="ct wm"\${h}>\${esc(n)}</span>\`; }
function marquee(){ const a=allCust(); const isLg=x=>NAMEMARK.includes(x.n)||(LOGO[x.n]&&D.img['logo-'+LOGO[x.n]]);
  // Two rows with the same number of logos and the same number of plain names, dealt alternately so each row keeps the featured names near the start.
  const r=[[],[]]; let li=0, ti=0; a.forEach(x=>{ if(isLg(x)) r[(li++)%2].push(x); else r[(ti++)%2].push(x); });
  const mix=row=>{ const L=row.filter(isLg), T=row.filter(x=>!isLg(x)), out=[]; const step=T.length?L.length/T.length:0; let t=0; L.forEach((x,k)=>{ out.push(x); while(t<T.length && (k+1)>=step*(t+1)) out.push(T[t++]); }); while(t<T.length) out.push(T[t++]); return out; };
  const row=(r,rev)=>\`<div class="mq\${rev?' rev':''}"><div class="mq-t">\${r.map(x=>ctile(x.n)).join('')}\${r.map(x=>ctile(x.n,1)).join('')}</div></div>\`; return row(mix(r[0]))+row(mix(r[1]),1); }
// Same scroll speed on both rows whatever their width (px per second).
function mqSpeed(){ document.querySelectorAll('.mq-t').forEach(t=>{ const w=t.scrollWidth/2; if(w) t.style.animationDuration=(w/55).toFixed(1)+'s'; }); }
const eyebrow = (t, cls='') => \`<p class="eyebrow \${cls}">\${t}</p>\`;
const dealerPill = (small) => S.dealer ? \`<span class="pill"><i></i>Available through authorized dealers</span>\` : '';
const cta = (h='Ready to build your recovery space?', b='Speak with our team about products, facility planning and pricing for your business.', m='') => \`
<section class="accgrad \${m?'mod-'+m:''}"><div class="wrap" style="padding-block:56px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:24px">
 <div class="stack" style="max-width:600px"><h2 style="color:#fff">\${h}</h2><p style="color:rgba(255,255,255,.82)">\${b}</p></div>
 <div class="row"><a href="#/contact" class="btn" style="background:#fff;color:#1f1f1f">Talk to sales</a><a href="#/contact" class="btn" style="border-color:rgba(255,255,255,.45);color:#fff">Schedule a call</a></div></div></section>\`;
const enquiry = (h='Tell us about your facility', product='') => \`
<section class="sec" style="background:var(--surf)" id="enquiry"><div class="wrap grid" style="grid-template-columns:1fr 1.2fr;gap:40px">
 <div class="stack"><p class="eyebrow">Get in touch</p><h2>\${h}</h2><p class="muted">Our team will walk you through product specs, facility planning and pricing tailored to your business. Fill out the form or give us a call.</p>
  <p class="small">Sales: <strong style="font-weight:500">(208) 408-1801</strong></p><div><a class="btn btn-g" href="#/contact">Schedule a call</a></div>
  <ul class="small muted" style="padding-left:18px;margin:8px 0 0"><li>Facility planning and electrical guidance</li><li>Installation service and staff training</li><li>US and North America-based support</li></ul></div>
 <form class="enq" onsubmit="event.preventDefault();this.querySelector('button').textContent='Sent — thanks, we\\'ll be in touch';">
  <label>First name *<input id="fn" required></label><label>Last name *<input id="ln" required></label><label>Email *<input id="em" type="email" required></label><label>Phone<input id="phn"></label>
  <label>Company<input id="co"></label><label>Country / state<input id="st"></label>
  <label>Industry<select id="ind"><option>Select</option><option>Fitness facilities</option><option>Spa / wellness centers</option><option>Recovery studios</option><option>Pro sports</option><option>Hospitality</option><option>Real estate</option><option>Corporate wellness</option><option>Military &amp; first responders</option><option>Medical / clinical</option><option>Other</option></select></label>
  <label>Install timeline<select id="tl"><option>Select</option><option>Ready now (0–30 days)</option><option>1–3 months</option><option>3–6 months</option><option>6+ months</option><option>Just researching</option></select></label>
  <fieldset class="full" style="border:0;padding:0;margin:0;font-size:13px"><legend style="margin-bottom:6px">Products you’re considering *</legend><div class="grid g3 keep2" style="gap:6px">\${['HBOT AirFit','HBOT AirFlex','HBOT AirForm','HBOT AirSuite','LightPanel','LightBed','Yakisugi sauna','Hemlock sauna','IceVault'].map(p=>\`<label style="flex-direction:row;align-items:center"><input type="checkbox" id="p-\${p.replace(/\\W/g,'')}" \${p.toLowerCase().includes(product.toLowerCase())&&product?'checked':''}>\${p}</label>\`).join('')}</div></fieldset>
  <label class="full">Message<textarea id="msg" rows="4"></textarea></label>
  <div class="full row"><button class="btn btn-p" type="submit">Get started</button><span class="faint" style="font-size:12px">By submitting, you agree to receive communications from OneBase. Unsubscribe anytime.</span></div>
 </form></div></section>\`;

const prodCard = (p) => { const m = p.modality; return \`
<a href="#/products/\${p.category}/\${p.id}" class="card mod-\${m}"><div class="bar"></div>\${pic(D.prodImg[p.id], p.images[0]?.alt || pn(p), 190, 'border-radius:0;background:var(--surf);padding:10px', 'contain')}
 <div class="body"><div class="row" style="justify-content:space-between"><h3>\${pn(p)}</h3>\${p.status==='coming-soon'?'<span class="pill">Coming soon</span>':''}</div>
 <p class="faint" style="font-size:12px">\${p.sizes.map(s=>s.label).join(' · ')||p.colours.join(' · ')}</p>
 <div class="row" style="margin-top:auto;padding-top:8px"><span class="small" style="font-weight:500">View product →</span></div></div></a>\`; };

const pages = {
 home: () => \`
<section class="hero">\${D.img['hero-bg']?\`<img src="\${D.img['hero-bg']}" alt="OneBase Yakisugi sauna and IceVault installed in a recovery suite"><div class="veil"></div>\`:ph('OneBase Yakisugi sauna and IceVault installed in a recovery suite',0)}<div class="wrap inner stack" style="gap:18px">
 \${eyebrow('Air · Ice · Heat · Light')}<h1>Recovery equipment engineered for the facilities people come back to.</h1>
 <p class="key">Hyperbaric, cold, heat and light. Built in-house, medically led, connected by one platform.</p>
 <div class="row"><a href="#/contact" class="btn" style="background:#fff;color:#1f1f1f">Talk to sales</a><a href="#/products" class="btn" style="border-color:rgba(255,255,255,.45);color:#fff">See the products</a></div></div></section>
<section style="border-bottom:1px solid var(--line);padding-block:24px 20px"><div class="wrap row" style="justify-content:space-between;align-items:baseline;margin-bottom:10px">\${eyebrow('Installed at '+custCount()+'+ venues')}<a href="#/customers" class="small" style="font-weight:500;text-decoration:underline;text-underline-offset:4px">See more</a></div><div class="stack" style="gap:2px">\${marquee()}</div></section>
<section class="sec"><div class="wrap stack" style="gap:32px"><div class="stack" style="max-width:680px">\${eyebrow('Four modalities, one system')}<h2>Air, Ice, Heat and Light. Each one commercial-grade. All of them connected.</h2></div>
 <div class="grid g4">\${Object.values(D.modalities).map(m=>\`<a href="#/products/\${m.category}" class="card mod-\${m.key}" style="padding:22px;gap:8px"><div class="bar" style="width:44px;border-radius:2px"></div><p class="eyebrow acc" style="margin-top:8px">\${m.label}</p><h3>\${m.name}</h3><p class="small muted">\${m.blurb}</p><span class="small" style="font-weight:500;margin-top:8px">Explore →</span></a>\`).join('')}</div></div></section>
<section class="sec" style="background:var(--surf)"><div class="wrap stack" style="gap:32px"><div class="row" style="justify-content:space-between"><div class="stack" style="max-width:680px">\${eyebrow('Built for business')}<h2>The equipment operators ask for by name.</h2></div><a href="#/products" class="btn btn-g">All products</a></div>
 <div class="grid g4">\${['icevault','yakisugi','airform','lightbed'].map(id=>prodCard(D.products.find(p=>p.id===id))).join('')}</div></div></section>
<section class="sec dark"><div class="wrap grid" style="grid-template-columns:1fr 1.4fr;gap:48px">
 <div class="stack">\${eyebrow('Why OneBase')}<h2>We push the boundaries of what recovery equipment can do, then make it easy to run.</h2><p class="key">Clean design and advanced technology, so every session is effective and enjoyable.</p></div>
 <div class="grid g2">\${[['Engineered in-house','Mechanical, electrical, embedded, software and security under one roof. Products are designed, tested and validated by our own engineers for commercial duty cycles.'],['Medically led','Protocols built with Dr Scott Sherr and delivered in the OneBase app, so every session is consistent across staff, sites and shifts.'],['Clean design, easy operation','Equipment that improves a space instead of cluttering it. Plug-and-play installs, self-cleaning cycles, interfaces anyone can run.'],['Support that stays','North America and Australia-based support, local parts, trained technicians and remote diagnostics. We’re with you after the sale.']].map(([t,b])=>\`<div style="border-top:1px solid rgba(255,255,255,.15);padding-top:12px"><h3>\${t}</h3><p class="small muted" style="margin-top:8px">\${b}</p></div>\`).join('')}</div></div></section>
<section class="sec"><div class="wrap grid g2" style="align-items:center;gap:48px"><div class="stack">\${eyebrow('OneBase OS · coming late 2026')}<h2>Every device on one screen. Every protocol in one app.</h2><p class="muted">Track usage, monitor temperature and pressure, schedule maintenance and manage every location from one place. Members follow doctor-built protocols in the OneBase app, so results are consistent and easy to sell.</p><div><a href="#/software" class="btn btn-p">See the software</a></div></div>\${pic('app-interface','OneBase OS dashboard', 360)}</div></section>
<section class="sec"><div class="wrap grid" style="grid-template-columns:1fr 1.4fr;gap:48px;align-items:center"><div>\${pic('dr-sherr','Dr Scott Sherr, Co-Founder and Chief Medical Officer', 420)}</div><div class="stack" style="gap:16px">\${eyebrow('Medically led')}<h2>Protocols by Dr Scott Sherr, built into every session.</h2><p class="muted">Evidence-informed protocols in the OneBase app, delivered the same way across staff, sites and shifts. Services become easier to sell, simpler to train and easier to scale, with less operator variability and better client confidence.</p><ul class="small muted" style="padding-left:18px;margin:0"><li>Co-Founder and Chief Medical Officer, practising hyperbaric physician</li><li>Protocols for recovery, performance, sleep and longevity</li><li>Operator education and staff training included with every install</li></ul></div></div></section>
<section class="sec" style="background:var(--surf)"><div class="wrap grid" style="grid-template-columns:1.4fr 1fr;gap:48px;align-items:center"><div class="stack" style="gap:16px">\${eyebrow('Support that stays')}<h2>Local support in North America and Australia.</h2><p class="muted">Trained technicians, local parts and remote diagnostics through OneBase OS. Every install includes facility planning, electrical guidance and staff training, and a 2-year standard warranty.</p><div class="grid g3 keep2" style="gap:14px"><div><p style="font-weight:500;font-size:22px">2 years</p><p class="small faint">Standard warranty</p></div><div><p style="font-weight:500;font-size:22px">CE · ISO 13485</p><p class="small faint">On applicable lines</p></div><div><p style="font-weight:500;font-size:22px">ADA-aligned</p><p class="small faint">Design choices</p></div></div></div><div>\${pic('us-support','OneBase support technician', 420)}</div></div></section>
<section class="sec" style="background:var(--surf)"><div class="wrap" style="max-width:900px"><p class="key">“What stood out wasn’t just the technology, which is excellent, but the pride they take in doing things the right way, from product quality to support after the sale.”</p><p class="small" style="font-weight:500;margin-top:16px">Dr Jason Han <span class="faint" style="font-weight:300">· Owner, HealthFit</span></p></div></section>
\${enquiry()}\`,

 products: () => \`
<section class="wrap stack" style="padding-block:56px 24px;max-width:760px">\${eyebrow('Products')}<h1>Commercial-grade, by design.</h1><p class="muted">Every product is engineered for daily commercial use: durable builds, plug-and-play installs, self-cleaning where it matters, and connection to OneBase OS.</p></section>
\${Object.values(D.modalities).map(m=>\`<section class="wrap mod-\${m.key}" style="padding-block:36px;border-top:1px solid var(--line)"><div class="row" style="justify-content:space-between"><div>\${eyebrow(m.label,'acc')}<h2 style="font-size:28px">\${m.name}</h2></div><a href="#/products/\${m.category}" class="small" style="font-weight:500;text-decoration:underline;text-underline-offset:4px">Overview</a></div><div class="grid g4" style="margin-top:22px">\${D.products.filter(p=>p.category===m.category).map(prodCard).join('')}</div></section>\`).join('')}
\${cta()}\`,

 category: (cat) => { const m = mod(catMod[cat]); return \`
<section class="hero accgrad mod-\${m.key}" style="min-height:min(60vh,520px)">\${D.img[{hbot:'airform-plus-black','cold-therapy':'icevault-octo',sauna:'yakisugi','red-light':'lightbed-black'}[cat]]?\`<img src="\${D.img[{hbot:'airform-plus-black','cold-therapy':'icevault-octo',sauna:'yakisugi','red-light':'lightbed-black'}[cat]]}" alt="\${m.name}" style="object-fit:contain;object-position:right center;opacity:.5"><div class="veil"></div>\`:ph('Photo: '+m.name+' installed', 0)}<div class="wrap inner stack" style="gap:16px">\${eyebrow(m.label)}<h1>\${m.h}</h1><p class="key" style="max-width:60ch">\${m.p}</p></div></section>
<section class="sec"><div class="wrap grid g4">\${D.products.filter(p=>p.category===cat).map(prodCard).join('')}</div></section>
\${cta('Planning a '+m.name.toLowerCase()+' install?','We’ll help with sizing, electrical requirements, floor plans and pricing.', m.key)}\`; },

 product: (cat, id) => { const p = D.products.find(x=>x.id===id&&x.category===cat); if(!p) return pages.notfound(); const m = mod(p.modality); const name = pn(p);
  const related = D.products.filter(x=>x.category===cat&&x.id!==id); return \`
<div class="mod-\${p.modality}">
<section class="wrap" style="padding-block:28px 40px"><p class="crumb"><a href="#/products">Products</a> / <a href="#/products/\${cat}">\${m.name}</a> / <span style="color:var(--fg)">\${name}</span></p>
 <div class="grid" style="grid-template-columns:1.2fr 1fr;gap:40px;margin-top:24px;align-items:start">
  <div class="softbg" style="border-radius:var(--r);padding:24px">\${pic(D.prodImg[p.id], p.images[0]?.alt||name, 420, 'background:transparent', 'contain')}</div>
  <div class="stack" style="gap:14px">\${eyebrow(m.label+' · '+m.name,'acc')}<h1 style="font-size:clamp(32px,4vw,48px)">\${name}</h1><p class="key">\${esc(p.tagline)}</p><p class="muted">\${esc(p.description)}</p>
   <dl class="grid g2 keep2" style="gap:12px;margin:6px 0 0;font-size:14px">\${p.sizes.length?\`<div><dt class="eyebrow">Sizes</dt><dd style="margin:3px 0 0;font-weight:500">\${p.sizes.map(s=>s.label).join(' · ')}</dd></div>\`:''}\${p.colours.length?\`<div><dt class="eyebrow">Finishes</dt><dd style="margin:3px 0 0;font-weight:500">\${p.colours.join(' · ')}</dd></div>\`:''}\${p.pressures.length?\`<div><dt class="eyebrow">Pressure</dt><dd style="margin:3px 0 0;font-weight:500">\${p.pressures.join(' · ')}</dd></div>\`:''}\${p.certifications.length?\`<div><dt class="eyebrow">Certifications</dt><dd style="margin:3px 0 0;font-weight:500">\${p.certifications.join(' · ')}</dd></div>\`:''}</dl>
   <div class="row" style="margin-top:6px"><a href="#enquiry" class="btn btn-p" onclick="setTimeout(()=>document.getElementById('enquiry')?.scrollIntoView({behavior:'smooth'}),0);return false;">Talk to our team</a><a href="#/contact" class="btn btn-g">Schedule a call</a></div>
   <div class="row faint" style="font-size:12px">\${p.status==='coming-soon'?'<span>Taking pre-orders</span>':'<span>Installation service · US-based support · 2-year warranty</span>'}\${p.channels.dealer?dealerPill():''}</div></div></div></section>
\${p.sizes.length>1?\`<section class="wrap" style="padding-block:28px;border-top:1px solid var(--line)">\${eyebrow('Configurations')}<div class="grid g3" style="margin-top:14px">\${p.sizes.map(s=>\`<div class="card" style="padding:18px;gap:4px"><h3>\${pn(p,s.label)}</h3><p class="small muted">\${esc(s.note||'')}</p></div>\`).join('')}</div></section>\`:''}
<section class="sec" style="background:var(--surf)"><div class="wrap">\${eyebrow('Product highlights')}<div class="grid g3" style="margin-top:20px;gap:28px">\${p.highlights.map(h=>\`<div class="tip"><h3>\${esc(h.title)}</h3><p class="small muted" style="margin-top:6px">\${esc(h.body)}</p></div>\`).join('')}</div></div></section>
\${p.id==='icevault'?\`<section class="sec"><div class="wrap" style="max-width:960px"><p class="eyebrow">How it compares</p><h2 style="margin-top:8px;max-width:640px">Cold therapy, without the trade-offs.</h2><div style="overflow-x:auto;margin-top:24px"><table class="cmp"><thead><tr><th></th><th>OneBase IceVault</th><th>Cold plunge</th><th>Cryotherapy chamber</th></tr></thead><tbody>
<tr><th>Medium</th><td class="y">Dry, refrigerated air</td><td>Water and ice</td><td>Nitrogen or electric, −110°C+</td></tr>
<tr><th>Users per session</th><td class="y">2 to 8</td><td>1</td><td>1</td></tr>
<tr><th>Session length</th><td class="y">3–15 min at 32–40°F</td><td>2–5 min</td><td>2–3 min</td></tr>
<tr><th>Plumbing / drainage</th><td class="y">None</td><td>Required</td><td>None (gas supply if nitrogen)</td></tr>
<tr><th>Floor</th><td class="y">Dry, anti-slip</td><td>Wet</td><td>Dry</td></tr>
<tr><th>Cleaning</th><td class="y">Automated self-clean</td><td>Water treatment and changes</td><td>Wipe-down</td></tr>
<tr><th>Consumables</th><td class="y">Electricity only</td><td>Water, chemicals, ice</td><td>Nitrogen refills (gas units)</td></tr>
<tr><th>Accessibility</th><td class="y">Walk-in; ADA-compliant Octo</td><td>Step-in</td><td>Step-in</td></tr>
</tbody></table></div><p class="faint" style="font-size:12px;margin-top:10px">Comparison based on typical commercial plunge and cryotherapy equipment; verify specifics with your supplier.</p></div></section>\`:''}
<section class="sec"><div class="wrap grid g2" style="gap:48px"><div><h3 style="font-size:24px;margin-bottom:12px">Specifications</h3><table class="spec">\${p.specs.map(r=>\`<tr><th>\${esc(r.label)}</th><td>\${esc(r.value)}</td></tr>\`).join('')}</table></div>
 <div class="stack" style="gap:28px">\${p.electrical.length?\`<div><h3 style="font-size:24px;margin-bottom:12px">Electrical requirements</h3><table class="spec">\${p.electrical.map(r=>\`<tr><th>\${esc(r.label)}</th><td>\${esc(r.value)}</td></tr>\`).join('')}</table></div>\`:''}
 <div class="softbg small" style="padding:20px;border-radius:var(--r)"><p style="font-weight:500">Need a spec sheet or CAD?</p><p style="opacity:.8;margin-top:4px">Our engineering team can supply drawings, electrical single-lines and floor-plan guidance for your fit-out.</p><a href="#/contact" style="display:inline-block;margin-top:8px;font-weight:500;text-decoration:underline;text-underline-offset:4px">Request documents</a></div></div></div></section>
\${p.faqs.length?\`<section class="sec" style="background:var(--surf)"><div class="wrap" style="max-width:860px">\${eyebrow('Questions')}<div style="margin-top:10px">\${p.faqs.map(f=>\`<details><summary>\${esc(f.q)}</summary><p class="small muted" style="margin-top:8px;max-width:68ch">\${esc(f.a)}</p></details>\`).join('')}</div></div></section>\`:''}
\${enquiry('Ready to add the '+name+'?', p.name)}
\${related.length?\`<section class="sec"><div class="wrap">\${eyebrow('More in '+m.name)}<div class="grid g4" style="margin-top:18px">\${related.map(prodCard).join('')}</div></div></section>\`:''}
</div>\`; },

 solutions: () => \`
<section class="wrap stack" style="padding-block:56px 24px;max-width:760px">\${eyebrow('Solutions')}<h1>Recovery, built for the way your facility runs.</h1><p class="muted">Hyperbaric, cold, heat and light from one manufacturer, built for commercial duty and run from one app. Pick your kind of venue and we’ll show you what operators like you install, and what it takes to run it.</p></section>
<section class="wrap grid g3" style="padding-block:24px 64px">\${D.solutions.map(s=>\`<a href="#/solutions/\${s.id}" class="card dark" style="min-height:240px;justify-content:flex-end;padding:22px;position:relative">\${D.img[D.solImg[s.id]]?\`<img src="\${D.img[D.solImg[s.id]]}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><div class="veil" style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.75))"></div>\`:\`<span class="ph" style="position:absolute;inset:0;background:var(--ink);color:rgba(255,255,255,.25);border-radius:0">Photo: \${esc(s.label)}</span>\`}<div style="position:relative"><h2 style="font-size:24px">\${esc(s.label)}</h2><p class="small muted" style="margin-top:4px">\${esc(s.heroHeading)}</p></div></a>\`).join('')}</section>
\${cta()}\`,

 solution: (id) => { const s = D.solutions.find(x=>x.id===id); if(!s) return pages.notfound(); const feat = ['icevault','yakisugi','lightbed','airform'].map(i=>D.products.find(p=>p.id===i)).filter(p=>s.modalities.includes(p.modality)); return \`
<section class="hero" style="min-height:min(62vh,560px)">\${D.img[D.solImg[s.id]]?\`<img src="\${D.img[D.solImg[s.id]]}" alt="\${esc(s.label)}"><div class="veil"></div>\`:ph('Photo: '+s.label+' in use', 0)}<div class="wrap inner stack" style="gap:16px">\${eyebrow(s.label)}<h1>\${esc(s.heroHeading)}</h1><div class="row"><a href="#enquiry" class="btn" style="background:#fff;color:#1f1f1f" onclick="setTimeout(()=>document.getElementById('enquiry')?.scrollIntoView({behavior:'smooth'}),0);return false;">Contact sales</a>\${s.dealer?dealerPill():''}</div></div></section>
<section class="dark"><div class="wrap grid g4" style="padding-block:48px;gap:28px">\${s.valueProps.map(v=>\`<div style="border-top:1px solid rgba(255,255,255,.15);padding-top:12px"><h3>\${esc(v.title)}</h3><p class="small muted" style="margin-top:8px">\${esc(v.body)}</p></div>\`).join('')}</div></section>
\${s.features.map((f,i)=>\`<section class="sec"><div class="wrap grid g2" style="gap:48px;align-items:center"><div style="\${i%2?'order:2':''}">\${(k=>pic(k, f.title, 360, '', k==='gdr-ice'?'contain':'cover'))(i===0?D.solImg[s.id]:['yk-duo-towels','gdr-ice','tenx-redlight','as-install'][(i-1)%4])}</div><div class="stack"><h2>\${esc(f.title)}</h2><p class="muted">\${esc(f.body)}</p></div></div></section>\`).join('')}
<section class="sec" style="background:var(--surf)"><div class="wrap">\${eyebrow('Recommended for '+s.label.toLowerCase())}<div class="grid g4" style="margin-top:18px">\${feat.map(prodCard).join('')}</div></div></section>
\${enquiry('Let’s plan your '+s.label.toLowerCase()+' install')}\`; },

 software: () => \`
<section class="dark"><div class="wrap grid g2" style="padding-block:64px;gap:48px;align-items:center"><div class="stack">\${eyebrow('OneBase OS')}<h1>The engine behind smart recovery.</h1><p class="key">Hardware you can see. Software that makes it work together.</p><p class="muted">Two layers. OneBase OS for the operator: fleet monitoring, analytics and maintenance. The OneBase app for the client: protocols, scheduling and progress. Both talk to the same devices.</p></div>\${pic('app-interface','OneBase OS dashboard', 360)}</div></section>
<section class="sec"><div class="wrap stack" style="gap:28px">\${eyebrow('For operators · coming late 2026')}<h2 style="max-width:680px">Manage your fleet from anywhere.</h2><div class="grid g4" style="gap:28px">\${[['Real-time monitoring','Temperature, pressure, session state and faults for every device, every site.'],['Usage analytics','Sessions per day, peak hours, utilisation by modality. The numbers that justify the next unit.'],['Automated alerts','Maintenance due, out-of-range readings and consumables running low, before staff notice.'],['Multi-location management','One login for the whole estate. Roles for owners, managers and technicians.']].map(([t,b])=>\`<div class="tip"><h3>\${t}</h3><p class="small muted" style="margin-top:6px">\${b}</p></div>\`).join('')}</div></div></section>
<section class="sec" style="background:var(--surf)"><div class="wrap grid" style="grid-template-columns:1fr 1.3fr;gap:48px;align-items:center"><div>\${ph('OneBase app: protocol screen', 420, 'max-width:280px')}</div><div class="stack" style="gap:20px">\${eyebrow('OneBase app · for members and clients')}<h2>Your wellness. Connected. Personalised.</h2>\${[['All devices, one app','HBOT, sauna, red light and cold therapy, with OneBase and other devices inside a single protocol.'],['Doctor-built protocols','Created by physicians and researchers for recovery, performance and longevity, tuned to goals, equipment and session preferences.'],['Progress you can see','Sessions logged and history in one place, so patterns and improvements are obvious.']].map(([t,b])=>\`<div><h3>\${t}</h3><p class="small muted" style="margin-top:4px">\${b}</p></div>\`).join('')}<div class="row"><a class="btn btn-p" href="#/software">Download for iOS</a><a class="btn btn-g" href="#/software">Download for Android</a></div><p class="faint" style="font-size:12px">Coming soon: wearable sync, protocols that adapt to your biometrics, daily recommendations.</p></div></div></section>
\${cta('Want to see the software on your equipment?','Book a demo and we’ll walk through OneBase OS monitoring and app protocols for your facility.','air')}\`,

 customers: () => \`
<section class="wrap stack" style="padding-block:56px 8px;max-width:800px">\${eyebrow('Installed at')}<h1>\${custCount()}+ venues run on OneBase.</h1><p class="muted">Pro teams, fitness clubs, recovery studios and clinics across North America, Australia, Asia and Europe. Filter to find operators like you.</p></section>
<section class="wrap" style="padding-block:24px 72px"><div class="chips" id="cf">\${['All',...D.customers.map(c=>c.seg)].map((sg,i)=>\`<button class="chip" aria-pressed="\${i===0}" data-seg="\${esc(sg)}">\${esc(sg)}\${i?\` <span style="opacity:.6">\${D.customers[i-1].names.length}</span>\`:''}</button>\`).join('')}</div><div class="cgrid" id="cg">\${allCust().map(x=>\`<div class="cg" data-seg="\${esc(x.seg)}">\${ctile(x.n)}<small>\${esc(x.seg)}</small></div>\`).join('')}</div></section>
<section class="sec" style="background:var(--surf)"><div class="wrap row" style="justify-content:space-between;align-items:center;gap:24px"><div class="stack" style="gap:8px;max-width:620px"><h2>Want your venue on this wall?</h2><p class="muted">We plan the space, handle install and train your team.</p></div><a href="#/contact" class="btn btn-p">Talk to sales</a></div></section>\`,
 partners: () => \`
<section class="wrap stack" style="padding-block:56px 32px;max-width:760px">\${eyebrow('Partners')}<h1>Buy direct, or through a partner you already trust.</h1><p class="muted">OneBase sells and supports direct across North America, Australia and Asia-Pacific. In selected markets our equipment is also available through distribution partners, with the same engineering, warranty and support behind it.</p></section>
\${S.dealer?\`<section class="wrap" style="padding-bottom:40px"><div class="dark" style="border-radius:var(--r);padding:32px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:24px"><div class="stack" style="max-width:640px"><h2>Available through authorized dealers.</h2></div><a href="#/contact" class="btn" style="background:#fff;color:#1f1f1f">Find a dealer</a></div></section>\`:''}
<section class="sec" style="background:var(--surf)"><div class="wrap grid g3" style="gap:36px">\${[['Direct sales','HBOT chambers, hospitality, real estate, sports, corporate and clinical projects are handled by the OneBase team. Facility planning, electrical guidance, installation and training included.'],['Dealers and integrators','Architects, wellness consultants and fit-out contractors can specify OneBase for their projects. Ask us for CAD, spec sheets and a partner price list.'],['Service partners','Trained technicians and local parts in North America and Australia. Remote diagnostics through OneBase OS for everything else.']].map(([t,b])=>\`<div><h3>\${t}</h3><p class="small muted" style="margin-top:8px">\${b}</p></div>\`).join('')}</div></section>
<section class="sec" style="background:var(--surf)"><div class="stack" style="gap:24px"><div class="wrap row" style="justify-content:space-between;align-items:flex-end"><div class="stack" style="gap:10px;max-width:720px">\${eyebrow('Customers')}<h2>\${custCount()}+ businesses across North America, Australia, Asia and Europe.</h2></div><a href="#/customers" class="small" style="font-weight:500;text-decoration:underline;text-underline-offset:4px">See more</a></div><div class="stack" style="gap:2px">\${marquee()}</div></div></section>
\${cta('Interested in partnering with OneBase?','Tell us about your market and we’ll come back with a partner pack.')}\`,

 contact: () => \`
<section class="wrap stack" style="padding-block:56px 8px;max-width:800px">\${eyebrow('Contact')}<h1>Let’s plan your recovery space.</h1><div class="grid g3 small" style="margin-top:12px">\${[['North America','<strong style="font-weight:500">(208) 408-1801</strong><br><a style="text-decoration:underline;text-underline-offset:3px" href="#/contact">Schedule a call</a>'],['Australia & APAC','Perth, Western Australia<br><a style="text-decoration:underline;text-underline-offset:3px" href="#/contact">sales@onebasehealth.com</a>'],['Customer service','<a style="text-decoration:underline;text-underline-offset:3px" href="#/contact">customerservice@onebasehealth.com</a><br>Warranty, parts and support']].map(([t,b])=>\`<div><p class="eyebrow">\${t}</p><p style="margin-top:6px">\${b}</p></div>\`).join('')}</div></section>
\${enquiry()}\`,

 blog: () => { const cats=[...new Set(D.posts.map(p=>p.cat))]; return \`
<section class="wrap stack" style="padding-block:56px 16px;max-width:760px">\${eyebrow('Blog')}<h1>Learn the science. Skip the jargon.</h1><p class="muted">Research, protocols and operator guides on hyperbaric oxygen, cold, heat and red light.</p></section>
<section class="wrap" style="padding-block:8px 8px"><div class="chips" id="bf"><button class="chip" aria-pressed="true" data-bc="All">All</button>\${cats.map(c=>\`<button class="chip" aria-pressed="false" data-bc="\${esc(c)}">\${esc(c)}</button>\`).join('')}</div></section>
<section class="wrap grid g3 bl-grid" style="padding-block:24px 72px;gap:32px 28px">\${D.posts.map(p=>\`<a href="#/blog/\${p.id}" class="stack bl-card" data-bc="\${esc(p.cat)}" style="gap:10px">\${p.hero?\`<img src="\${p.hero}" alt="" class="bl-img">\`:\`<div class="bl-img"></div>\`}<p class="eyebrow">\${esc(p.cat)} · \${p.date}</p><h2 style="font-size:19px;line-height:1.3">\${esc(p.title)}</h2><p class="small muted">\${esc(p.desc)}</p></a>\`).join('')}</section>\`; },

 post: (id) => { const p = D.posts.find(x=>x.id===id); if (!p) return pages.notfound(); const i = D.posts.indexOf(p); const more = D.posts.filter(x=>x!==p && x.cat===p.cat).slice(0,3); return \`
<article class="wrap" style="padding-block:48px 24px;max-width:760px"><p class="crumb"><a href="#/blog">Blog</a> / <span>\${esc(p.cat)}</span></p><h1 style="margin-top:14px">\${esc(p.title)}</h1><p class="small muted" style="margin-top:12px">\${esc(p.author)} · \${p.date}</p>\${p.hero?\`<img src="\${p.hero}" alt="" class="bl-hero">\`:''}<div class="prose bl-body" id="postBody" data-post="\${p.id}"><p class="muted">Loading…</p></div>
<p class="small faint" style="margin-top:40px;padding-top:20px;border-top:1px solid var(--line)">This article is for information and education only and is not medical advice. Talk to your doctor about whether a therapy is right for you.</p></article>
\${more.length?\`<section class="wrap" style="padding-block:24px 56px;max-width:1100px"><p class="eyebrow" style="margin-bottom:16px">More in \${esc(p.cat)}</p><div class="grid g3" style="gap:28px">\${more.map(x=>\`<a href="#/blog/\${x.id}" class="stack" style="gap:10px">\${x.hero?\`<img src="\${x.hero}" alt="" class="bl-img">\`:''}<h3 style="font-size:17px;line-height:1.3">\${esc(x.title)}</h3></a>\`).join('')}</div></section>\`:''}
\${cta('Want this in your facility?','Talk to our team about the equipment behind the research.')}\`; },

 parts: () => \`
<section class="wrap stack" style="padding-block:56px 24px;max-width:760px">\${eyebrow('Parts & consumables')}<h1>Keep every session running.</h1><p class="muted">Genuine parts and consumables for OneBase chambers. Tell us what you need and where it's going, and we'll confirm price and delivery.</p></section>
<section class="wrap grid g4 pt-grid" style="padding-block:16px 64px">\${D.parts.map(i=>\`<div class="card pt-card">\${i.image?\`<img src="\${i.image}" alt="\${esc(i.name)}" class="pt-img">\`:ph(i.name, 160)}<h3 style="font-size:15px">\${esc(i.name)}</h3>\${i.fits?\`<p class="faint" style="font-size:12px">Fits: \${esc(i.fits)}</p>\`:''}\${i.description?\`<p class="small muted">\${esc(i.description)}</p>\`:''}<a href="#/contact" class="btn pt-req" data-part="\${esc(i.name)}">Request</a></div>\`).join('')}</section>\`,


 policy: (id) => { const [t, paras] = D.policies[id] || D.policies.terms; return \`<section class="wrap" style="padding-block:56px 64px;max-width:760px">\${eyebrow('Policies')}<h1 style="margin-top:8px">\${t}</h1><div class="prose" style="margin-top:28px">\${paras.map(x=>x.startsWith('## ')?\`<h2>\${x.slice(3)}</h2>\`:\`<p>\${x}</p>\`).join('')}</div></section>\`; },

 notfound: () => \`<section class="wrap" style="padding-block:96px"><h1>Page not found</h1><p class="muted" style="margin-top:12px"><a href="#/" style="text-decoration:underline">Back to home</a></p></section>\`,
};

const NAV = [['Products','#/products',Object.values(D.modalities).map(m=>[m.name,'#/products/'+m.category])],['Solutions','#/solutions'],['Software','#/software'],['Partners','#/partners'],['Blog','#/blog']];
function renderChrome(){
  const h = obHash();
  document.getElementById('nav').innerHTML = NAV.map(([l,href])=>\`<a href="\${href}" class="\${h.startsWith(href)?'on':''}">\${l}</a>\`).join('');
  document.getElementById('drawer').innerHTML = NAV.map(([l,href,sub])=>\`<a href="\${href}">\${l}</a>\${(sub||[]).map(([sl,sh])=>\`<a href="\${sh}" class="sub">\${sl}</a>\`).join('')}\`).join('') + '<a href="#/parts" class="sub">Parts &amp; consumables</a>' + \`<img src="\${D.img['onebase-logo-white']}" alt="OneBase" style="height:22px;width:auto;margin-top:22px;align-self:flex-start">\` + '<a href="#/contact" class="btn" style="background:#fff;color:#1f1f1f;align-self:flex-start;margin-top:16px;border:0">Talk to sales</a>';
  document.getElementById('hdrLogo').innerHTML = D.img['onebase-logo-black'] ? \`<img src="\${D.img['onebase-logo-black']}" alt="OneBase" class="lg lg-dark"><img src="\${D.img['onebase-logo-white']}" alt="" class="lg lg-light">\` : 'OneBase';
  document.getElementById('foot').innerHTML = \`<div class="cols"><div class="stack"><span class="logo"><img src="\${D.img['onebase-logo-white']}" alt="OneBase" style="height:20px;width:auto"></span><p class="key" style="color:rgba(255,255,255,.8);font-size:20px">The world’s easiest therapy system.</p><p style="color:rgba(255,255,255,.6)">Sales: (208) 408-1801<br>or <a href="#/contact" style="text-decoration:underline">schedule a call</a></p></div>
  <div><p class="eyebrow">Products</p>\${Object.values(D.modalities).map(m=>\`<a href="#/products/\${m.category}">\${m.name}</a>\`).join('')}<a href="#/parts">Parts &amp; consumables</a></div>
  <div><p class="eyebrow">Solutions</p>\${D.solutions.map(s=>\`<a href="#/solutions/\${s.id}">\${s.label}</a>\`).join('')}</div>
  <div><p class="eyebrow">Company</p><a href="#/software">Software</a><a href="#/partners">Partners</a><a href="#/customers">Customers</a><a href="#/blog">Blog</a><a href="#/contact">Contact</a></div>
  <div><p class="eyebrow">Support</p><a href="#/policies/warranty">Warranty policy</a><a href="#/policies/returns">Refunds &amp; returns</a><a href="#/policies/privacy">Privacy policy</a><a href="#/policies/cookies">Cookie policy</a><a href="#/policies/terms">Terms of use</a></div></div>
  <div class="legal"><p style="max-width:900px">The recommendations made by Waylen Allen Limited do not constitute a medical recommendation and are intended for information and educational purposes only; no claims (real or implied) are being made. While studies support the effectiveness of hyperbaric oxygen therapy for various conditions, individual results vary. Always ask your doctor about all treatment options; only a doctor can assess whether hyperbaric oxygen therapy is appropriate for your situation. In the United States, hyperbaric chambers are a Class II medical device and require a medical prescription for use.</p><p style="margin-top:12px">© 2026 OneBase Health · Waylen Allen Limited. All rights reserved.</p></div>\`;
}
function route(){
  const h = obHash().slice(1); const parts = h.split('/').filter(Boolean); let out;
  if (!parts.length) out = pages.home();
  else if (parts[0]==='products') out = parts.length===1?pages.products():parts.length===2?(D.modalities[catMod[parts[1]]]?pages.category(parts[1]):pages.notfound()):pages.product(parts[1],parts[2]);
  else if (parts[0]==='solutions') out = parts[1]?pages.solution(parts[1]):pages.solutions();
  else if (parts[0]==='blog') out = parts[1]?pages.post(parts[1]):pages.blog();
  else if (parts[0]==='policies') out = pages.policy(parts[1]);
  else if (parts[0]==='customers' && parts[1]) out = pages.customers(parts[1]);
  else if (pages[parts[0]]) out = pages[parts[0]]();
  else out = pages.notfound();
  document.getElementById('app').innerHTML = out.replace(/<img(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"');
  document.getElementById('drawer').classList.remove('open'); document.getElementById('menuBtn').setAttribute('aria-expanded','false');
  renderChrome(); window.scrollTo({ top: 0 }); if (typeof afterRender === 'function') afterRender(); mqSpeed(); document.querySelectorAll('.mq img').forEach(i=>i.complete||i.addEventListener('load',mqSpeed,{once:true}));
}
document.getElementById('menuBtn').addEventListener('click', () => { const d = document.getElementById('drawer'); const o = d.classList.toggle('open'); document.getElementById('menuBtn').setAttribute('aria-expanded', String(o)); });
if (matchMedia('(min-width:900px)').matches) document.getElementById('phone').style.display = 'inline';
document.addEventListener('click', e => { const b = e.target.closest('#cf .chip'); if (!b) return; const sg = b.dataset.seg; document.querySelectorAll('#cf .chip').forEach(x => x.setAttribute('aria-pressed', String(x === b))); document.querySelectorAll('#cg .cg').forEach(t => { t.hidden = !(sg === 'All' || t.dataset.seg === sg); }); });
${EXTRA_JS}
obInit();
</script>
<script type="module">${MV}</script>
`;

/* ---------- Output ----------
   Preview (default): one file, prototype/onebase-prototype.html, hash routes.
   Site (SITE=1, run by Vercel): proto-dist/<path>/index.html for every page, each with its own title, description,
   canonical URL, Open Graph tags and the page's text in the HTML (the app then renders over it), plus sitemap.xml,
   robots.txt and 404.html. */
const ORIGIN = 'https://onebasehealth.com';
const escH = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (t, n = 158) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, t.lastIndexOf(' ', n - 1)) + '…' : t; };
const catName = { hbot: 'HBOT Chambers', 'cold-therapy': 'Cold Therapy', sauna: 'Saunas', 'red-light': 'Red Light Therapy' };
const HOME_DESC = 'Commercial hyperbaric chambers, cold rooms, infrared saunas and red light therapy for gyms, studios, clinics, teams and hotels. Planned, installed and supported by OneBase.';
const routes = [];
const addR = (path, title, desc, pre = '', extra = {}) => routes.push({ path, title, desc: clip(desc), pre, ...extra });
const list = (items) => '<ul>' + items.map(([h, t]) => `<li><a href="${h}">${escH(t)}</a></li>`).join('') + '</ul>';
addR('/', 'OneBase Health · Commercial recovery equipment', HOME_DESC, `<h1>Commercial recovery equipment</h1><p>${escH(HOME_DESC)}</p>` + list(Object.values(modalities).map(m => ['/products/' + m.category, m.name])), { home: true });
addR('/products', 'Products · OneBase Health', 'Hyperbaric chambers, dry cold rooms, infrared saunas and red light therapy for commercial facilities. Compare every OneBase product.', '<h1>Products</h1>' + list(products.map(p => [`/products/${p.category}/${p.id}`, 'OneBase ' + p.name])));
for (const m of Object.values(modalities)) { const ps = products.filter(p => p.category === m.category);
  addR('/products/' + m.category, `${m.name} · OneBase Health`, `${m.h} ${m.blurb}`, `<h1>${escH(m.name)}</h1><p>${escH(m.h)}</p><p>${escH(m.blurb)}</p>` + list(ps.map(p => [`/products/${p.category}/${p.id}`, 'OneBase ' + p.name]))); }
for (const p of products) addR(`/products/${p.category}/${p.id}`, `${p.seoTitle || 'OneBase ' + p.name} · OneBase Health`.replace(/ · OneBase Health · OneBase Health$/, ' · OneBase Health'), p.seoDescription || p.tagline + ' ' + p.description,
  `<h1>OneBase ${escH(p.name)}</h1><p>${escH(p.tagline)}</p><p>${escH(p.description)}</p>` + ((p.highlights || []).length ? '<ul>' + p.highlights.map(h => `<li>${escH(typeof h === 'string' ? h : (h.title || '') + (h.body ? ': ' + h.body : ''))}</li>`).join('') + '</ul>' : '') + ((p.faqs || []).length ? '<h2>FAQs</h2>' + p.faqs.map(f => `<h3>${escH(f.q || f.question)}</h3><p>${escH(f.a || f.answer)}</p>`).join('') : ''));
addR('/solutions', 'Solutions · OneBase Health', 'Recovery equipment for gyms, studios, hotels, pro teams, clinics, residential developments and first responders.', '<h1>Solutions</h1>' + list(solutions.map(x => ['/solutions/' + x.id, x.label])));
for (const x of solutions) addR('/solutions/' + x.id, `${x.label} · OneBase Health`, x.seoDescription || x.heroHeading, `<h1>${escH(x.heroHeading || x.label)}</h1><p>${escH(x.seoDescription || '')}</p>` + ((x.valueProps || []).length ? '<ul>' + x.valueProps.map(v => `<li>${escH(typeof v === 'string' ? v : (v.title || '') + (v.body ? ': ' + v.body : ''))}</li>`).join('') + '</ul>' : ''));
addR('/guide', 'Where it fits · OneBase Health', 'See which recovery modalities fit your venue: gyms, studios, clinics, hotels and teams.', '<h1>Where it fits</h1>');
{ const src = fs.readFileSync('scripts/proto/guide.js', 'utf8'); const GD = (0, eval)('(' + src.match(/const GD = (\{[\s\S]*?\n\});/)[1] + ')');
  const VN = { gym: 'gyms', studio: 'recovery studios', team: 'pro teams', hotel: 'hotels and spas', clinic: 'clinics', home: 'homes' };
  const MN = { air: 'hyperbaric oxygen', ice: 'cold therapy', heat: 'sauna', light: 'red light therapy' };
  for (const [v, g] of Object.entries(GD)) { addR('/guide/' + v, `Recovery for ${VN[v] || v} · OneBase Health`, g.lead, `<h1>Recovery for ${escH(VN[v] || v)}</h1><p>${escH(g.lead)}</p>`);
    for (const m of ['air', 'ice', 'heat', 'light']) if (Array.isArray(g[m])) addR(`/guide/${v}/${m}`, `${MN[m][0].toUpperCase() + MN[m].slice(1)} for ${VN[v] || v} · OneBase Health`, g[m][1], `<h1>${escH(g[m][0])}</h1><p>${escH(g[m][1])}</p>`); } }
addR('/roi', 'ROI calculator · OneBase Health', 'Estimate sessions a day, monthly revenue and payback for OneBase recovery equipment in your facility.', '<h1>What could it earn?</h1>');
addR('/software', 'OneBase OS · Software', 'OneBase OS runs bookings, sessions and equipment for recovery facilities, with the OneBase app for members.', '<h1>OneBase OS</h1>');
addR('/partners', 'Partners · OneBase Health', 'Work with OneBase: distributors, dealers, designers and developers.', '<h1>Partners</h1>');
addR('/customers', 'Customers · OneBase Health', 'Pro teams, gym chains, recovery studios, clinics and brands running OneBase equipment.', '<h1>Customers</h1>' + list([['/customers/the-covery', 'The Covery'], ['/customers/gym-chains', 'Gym chains'], ['/customers/razor-sharp', 'Razor Sharp Fitness'], ['/customers/pro-teams', 'Pro teams']]));
for (const [id, t, d] of [['the-covery', 'The Covery', 'How a recovery studio franchise fits out every studio with OneBase hyperbaric, red light, sauna and cold.'], ['gym-chains', 'The Edge Fitness Clubs and PURE Family Fitness', 'Multi-club gym operators adding dry IceVault cold rooms as a member benefit.'], ['razor-sharp', 'Razor Sharp Fitness', 'A club that built recovery into the membership, with OneBase heat and cold in its contrast suite.'], ['pro-teams', 'Los Angeles FC and the Las Vegas Raiders', 'Professional teams using OneBase hyperbaric chambers in their performance programmes.']])
  addR('/customers/' + id, `${t} · OneBase Health`, d, `<h1>${escH(t)}</h1><p>${escH(d)}</p>`);
addR('/blog', 'Blog · OneBase Health', 'Research, protocols and operator guides on hyperbaric oxygen, cold, heat and red light.', '<h1>Blog</h1>' + list(posts.map(p => ['/blog/' + p.id, p.title])));
for (const p of posts) addR('/blog/' + p.id, `${p.title} · OneBase Health`, p.desc, `<article><h1>${escH(p.title)}</h1><p>${escH(p.author)} · ${escH(p.date)}</p><div id="obPrerender">${postHTML[p.id].replace(/src="\/images\/blog\//g, 'src="/assets/blog/')}</div></article>`, { post: p });
addR('/contact', 'Contact · OneBase Health', 'Talk to OneBase about equipment, facility planning, pricing and delivery. Sales: (208) 408-1801.', '<h1>Contact</h1>');
addR('/parts', 'Parts & consumables · OneBase Health', 'Genuine masks, filters, gauges, valves and seals for OneBase hyperbaric chambers.', '<h1>Parts &amp; consumables</h1>' + '<ul>' + parts.map(i => `<li>${escH(i.name)}</li>`).join('') + '</ul>');
for (const [k, [t]] of Object.entries(policies)) addR('/policies/' + k, `${t} · OneBase Health`, `OneBase Health ${t.toLowerCase()}.`, `<h1>${escH(t)}</h1>`);

function headFor(r) {
  const url = ORIGIN + (r.path === '/' ? '/' : r.path);
  const img = ORIGIN + (r.post && r.post.hero ? r.post.hero : '/assets/img/hero-bg.jpg');
  const ld = r.home ? { '@context': 'https://schema.org', '@type': 'Organization', name: 'OneBase Health', url: ORIGIN, logo: ORIGIN + '/assets/img/onebase-logo-black.png', telephone: '+1-208-408-1801' }
    : r.post ? { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: r.post.title, description: r.desc, datePublished: r.post.iso, dateModified: r.post.updated, author: { '@type': 'Person', name: r.post.author }, publisher: { '@type': 'Organization', name: 'OneBase Health' }, image: img, mainEntityOfPage: url } : null;
  return `<title>${escH(r.title)}</title><meta name="description" content="${escH(r.desc)}"><link rel="canonical" href="${url}">`
    + `<meta property="og:type" content="${r.post ? 'article' : 'website'}"><meta property="og:site_name" content="OneBase Health"><meta property="og:title" content="${escH(r.title)}"><meta property="og:description" content="${escH(r.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${img}"><meta name="twitter:card" content="summary_large_image">`
    + `<link rel="icon" href="/assets/img/onebase-logo-black.png">` + (ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : '');
}
if (SITE) {
  // Scripts and styles are shared by every page, so they go in cached files rather than inline in 84 pages.
  let page = html; const ver = Date.now().toString(36);
  page = page.replace(/<script>\n([\s\S]*?)\n<\/script>\n<script type="module">([\s\S]*?)<\/script>/, (m, app, mv) => { fs.writeFileSync(ASSETS + '/app.js', app); fs.writeFileSync(ASSETS + '/mv.js', mv); return `<script src="/assets/app.js?v=${ver}"></script>\n<script type="module" src="/assets/mv.js?v=${ver}"></script>`; });
  page = page.replace(/<style>([\s\S]*?)<\/style>/, (m, css) => { fs.writeFileSync(ASSETS + '/app.css', css); return `<link rel="stylesheet" href="/assets/app.css?v=${ver}">`; });
  const shell = (r) => '<!doctype html><html lang="en"><head>' + page.replace('__HEAD__', headFor(r)).replace('__PRE__', `<div class="wrap" style="padding-block:48px">${r.pre}</div>`).replace('<header class="site">', '</head><body><header class="site">') + '</body></html>';
  for (const r of routes) { const f = 'proto-dist' + (r.path === '/' ? '' : r.path) + '/index.html'; fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, shell(r)); }
  fs.writeFileSync('proto-dist/404.html', shell({ path: '/404', title: 'Page not found · OneBase Health', desc: 'This page does not exist.', pre: '<h1>Page not found</h1><p><a href="/">Go to the home page</a></p>' }).replace(/<link rel="canonical"[^>]*>/, '<meta name="robots" content="noindex">'));
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync('proto-dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + routes.map(r => `  <url><loc>${ORIGIN}${r.path === '/' ? '/' : r.path}</loc><lastmod>${r.post ? r.post.updated : today}</lastmod></url>`).join('\n') + '\n</urlset>\n');
  fs.writeFileSync('proto-dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
  if (fs.existsSync('public/video')) fs.cpSync('public/video', 'proto-dist/video', { recursive: true });
  console.log('wrote proto-dist:', routes.length, 'pages + sitemap.xml, robots.txt, 404.html');
} else {
fs.mkdirSync('prototype', { recursive: true });
fs.writeFileSync('prototype/onebase-prototype.html', html.replace('__HEAD__', '<meta name="robots" content="noindex, nofollow"><title>OneBase Site Prototype</title>').replace('__PRE__', ''));
console.log('wrote prototype/onebase-prototype.html', (html.length / 1024).toFixed(0), 'KB');
}
