// Builds a single-file, responsive, clickable prototype of the whole site from the content collections.
// Output: prototype/onebase-prototype.html (publish as an artifact, or open locally).
import fs from 'node:fs';
import path from 'node:path';

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const dir = (d) => fs.readdirSync(d).filter(f => f.endsWith('.json')).map(f => ({ id: f.replace('.json', ''), ...read(path.join(d, f)) }));
const products = dir('src/content/products').sort((a, b) => a.order - b.order);
const solutions = dir('src/content/solutions').sort((a, b) => a.order - b.order);
const team = read('src/content/team/team.json').people;
const parts = read('src/content/parts/parts.json').items;

const modalities = {
  air:   { key: 'air',   label: 'Air',   category: 'hbot',         name: 'HBOT Chambers',     blurb: 'Hyperbaric oxygen therapy from 1.3 to 2.0 ATA. Soft-shell, hard-shell and walk-in rooms.', h: 'Hyperbaric oxygen, from a soft-shell you can move to a room you walk into.', p: 'Four chambers from 1.3 to 2.0 ATA. Soft-shell AirFit and AirFlex for flexibility and accessibility, steel AirForm for clinic pressures, and the modular AirSuite room with medical-grade BIBS.' },
  ice:   { key: 'ice',   label: 'Ice',   category: 'cold-therapy', name: 'Cold Therapy',      blurb: 'Dry, electric cold rooms for 2 to 8 people. No water, no ice, no nitrogen.', h: 'Cold therapy without the water, the ice or the gas.', p: 'The IceVault is a dry, electric cold room for two to eight people. Longer, more tolerable sessions, no wet floors, no cryogenic risk, and a self-cleaning cycle that keeps staff time low.' },
  heat:  { key: 'heat',  label: 'Heat',  category: 'sauna',        name: 'Infrared Saunas',   blurb: 'Full-spectrum, low-EMF infrared in Yakisugi cedar or Hemlock. Plug-and-play.', h: 'Full-spectrum infrared, built to run all day.', p: 'Low-EMF near, mid and far infrared at a restorative 135–149°F. Choose Yakisugi-charred cedar for the statement piece, or light Hemlock for a clean, contemporary suite.' },
  light: { key: 'light', label: 'Light', category: 'red-light',    name: 'Red Light Therapy', blurb: 'Modular panels and a 41,600-LED full-body bed. 633 to 940 nm.', h: 'Red and near-infrared light, sized to your floor.', p: 'Start with a single LightPanel, stack to a Quad, or step up to the 41,600-LED LightBed for full-body sessions with minimal operator time.' },
};
const policies = {
  warranty: ['Warranty Policy', ['## Standard warranty coverage', 'We offer a 2-year standard warranty on our products, covering defects in materials and workmanship under normal use and maintenance. The specific warranty period for each purchase is confirmed by the sales representative at the time of sale and stated on the invoice.', '## Exclusions', 'Normal wear and tear from regular use; improper use, misuse or mishandling; exposure to extreme or unsuitable environmental conditions; unauthorised modifications or repairs.', '## Filing a claim', 'Contact customerservice@onebasehealth.com with proof of purchase and a description of the issue. Approved claims are resolved through repair or replacement at the company’s discretion.']],
  returns: ['Refunds and Returns', ['## No returns or refunds', 'We maintain a strict policy of no returns or refunds. Exceptions are considered at our discretion, including incorrect items received due to our error.', '## Defective or damaged items', 'If your product arrives defective or damaged through no fault of your own, we will repair or replace it. Report within 7 days of receipt with proof of purchase and photos or video.', '## Second-hand and third-party purchases', 'Only products purchased directly from Waylen Allen Limited or its brands via our official websites are eligible.']],
  privacy: ['Privacy Policy', ['This Privacy Policy is subject to Hong Kong SAR laws.', '## What we collect', 'Account and profile information, support communications, transaction details, device and usage information, and information from our service providers in Hong Kong, the United States, Australia, China and India.', '## How we use it', 'To perform our contract with you, for legitimate interests not overridden by your rights, with your consent, or to comply with legal obligations. We never share personal information outside our group for marketing without your express consent.', '## Your rights', 'To be informed, access, correct, erase, restrict, object, port your data, and withdraw consent. Contact customerservice@onebasehealth.com.']],
  cookies: ['Cookie Policy', ['Essential cookies keep the site working. Analytics and marketing cookies (Google Tag Manager, GA4, Google Ads, HubSpot, Hotjar, LinkedIn Insight) are set only with your consent where the law requires it. Change your preferences any time via the cookie banner or your browser.']],
  terms: ['Terms of Use', ['Content on this site is for information and educational purposes only and is not medical advice. Product specifications, availability and pricing may change without notice; quotations issued by OneBase govern any purchase. Governed by the laws of Hong Kong SAR.']],
};
const posts = [
  { id: 'is-mild-hyperbaric-oxygen-mhbot-therapy-effective', title: 'Is Mild Hyperbaric Oxygen (mHBOT) Therapy Effective?', cat: 'Education', date: 'January 26, 2026', desc: 'What the research says about 1.3–1.5 ATA chambers, and how to think about pressure, protocol and goals.' },
  { id: 'why-red-light-therapy-clinics', title: 'Why Red Light Therapy Is Becoming a Smart Addition for Wellness Clinics and Recovery Centers', cat: 'Red light', date: 'March 27, 2026', desc: 'Throughput, operator time and the wavelengths that matter.' },
  { id: 'hot-cold-repeat', title: 'Hot, Cold, Repeat: Why Contrast Therapy Feels So Good', cat: 'Contrast therapy', date: 'February 17, 2026', desc: 'The physiology behind heat-and-ice, and how facilities programme it.' },
  { id: 'silent-energy-crisis', title: 'The Silent Energy Crisis Inside Your Cells', cat: 'Red light', date: 'March 12, 2026', desc: 'Mitochondria, near-infrared light and recovery.' },
  { id: 'types-of-hyperbaric-chambers', title: 'Types of Hyperbaric Chambers', cat: 'Education', date: 'September 12, 2023', desc: 'Soft-shell, hard-shell and multiplace: what the differences mean in practice.' },
  { id: 'hbot-for-sports-recovery', title: 'HBOT for Sports Recovery', cat: 'Education', date: 'May 19, 2023', desc: 'How teams use pressure and oxygen between sessions.' },
];

const imgDir = 'public/images/src';
const img = Object.fromEntries(fs.readdirSync(imgDir).filter(f => /\.(jpg|png|webp)$/.test(f)).map(f => [f.replace(/\.(jpg|png|webp)$/,''), 'data:image/' + (f.endsWith('.png') ? 'png' : f.endsWith('.webp') ? 'webp' : 'jpeg') + ';base64,' + fs.readFileSync(path.join(imgDir, f)).toString('base64')]));
const prodImg = { airfit:'airfit', airflex:'airflex', airform:'airform-plus-black', airsuite:null, icevault:'icevault-quad', yakisugi:'yakisugi', hemlock:'hemlock', lightpanel:'lightpanel-quad', lightbed:'lightbed-black' };
const solImg = { 'fitness-centers':'sol-fitness','luxury-hospitality':'sol-spas','pro-sports-performance':'sol-sports','multi-family-housing':'sol-multifamily','military-first-responders':'sol-military','high-end-real-estate':'sol-realestate','recovery-wellness-studios':'hero-bg','corporate-wellness':'engineers' };
// Customer wall — companies with closed-won deals in HubSpot (lifecycle = customer), grouped by segment. For review: remove any without permission.
const customers = [
  { seg: 'Pro sports & performance', names: ['Las Vegas Raiders', 'Los Angeles FC', 'New England Revolution', 'Portland Timbers', 'TB12', 'EXOS', 'SPORTFIVE', 'Hong Kong Sports Institute', 'Judo Association of Hong Kong', 'Flow Research Collective', 'Sports Performance Physical Therapy', 'Novum Performance & Longevity', 'Variant Training Lab', 'High Octane'] },
  { seg: 'Fitness clubs', names: ['The Edge Fitness Clubs', 'VIDA Fitness', 'PURE Family Fitness', 'Harbor Square Athletic Club', 'Razor Sharp Fitness', 'Balance Gym', 'Soluna Fitness', 'The Rising Zone', 'Wellness Solutions Inc.'] },
  { seg: 'Recovery & wellness studios', names: ['The Covery', '10X Longevity', 'Hume', 'Hype Wellness Studio', 'Collagen Lab', 'V2 Wellness Group', 'Patient Zero', 'Prairie Health & Wellness', 'Alive and Well', 'SB Wellness Group', 'Hopson Health Wellness Center', 'Northport Wellness Center', 'Wellness NOLA', 'Sola Wellness Aesthetics', 'Viridian Experience', 'Evolve Health Labs', 'Elixir', 'Time to Bloom', 'The Center for Connection and Wellness', 'Bang Salon'] },
  { seg: 'Clinics & medical', names: ['HealthFit', 'Hyperbaric Associates of America', 'Infinity IV & Wellness', 'Revital Health', 'Belo Medical Group', 'Makena Health Maui', 'Life Clinics', 'Genesis Surgery', 'IHASA', 'North Shore Hyperbarics', 'Inspire Chiropractic & Wellness', 'Horst Chiropractic', 'Restore Sports Medicine', 'Doylestown Sports Medicine Center', 'Penrose Physical Therapy', 'Fick PT & Performance', 'Morgain Physical Therapy', 'Warrior Restoration', 'de Musculatuur', 'Dr. Michael Ruscio, DC', 'Jason Alexander Med Spa'] },
  { seg: 'Brands & creators', names: ['Jake Paul', 'Kayla Barnes', 'The Fox Tan', 'FuzzYard', 'Pretty Farm Girl'] },
];
const EXTRA_CSS = fs.readFileSync('scripts/proto/extra.css','utf8');
const EXTRA_JS = fs.readFileSync('scripts/proto/extra.js','utf8') + '\n' + fs.readFileSync('scripts/proto/software.js','utf8') + '\n' + fs.readFileSync('scripts/proto/tablet.js','utf8') + '\n' + fs.readFileSync('scripts/proto/capture.js','utf8') + '\n' + fs.readFileSync('scripts/proto/products.js','utf8') + '\n' + fs.readFileSync('scripts/proto/tesla.js','utf8');
const data = { products, solutions, team, parts, modalities, policies, posts, img, prodImg, solImg, customers };

const html = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>OneBase Site Prototype</title>
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
.ct{display:inline-flex;align-items:center;justify-content:center;height:56px;padding:0 26px;white-space:nowrap}.ct.wm{font-weight:500;font-size:17px;letter-spacing:-.02em;color:var(--muted)}.ct.lg img{height:34px;width:auto;mix-blend-mode:multiply;opacity:.7;filter:grayscale(1);transition:filter .2s,opacity .2s}.ct.lg img.crest{height:46px}.ct.lg:hover img,.cg:hover .ct.lg img{filter:none;opacity:1}
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

<main id="app"></main>

<footer class="site"><div class="wrap sec" id="foot"></div></footer>

<div class="review" id="review">
  <span>Prototype · every page is live</span>
  <label><input type="checkbox" id="precorToggle"> Show “Available through Precor” line</label>
  <button class="x" id="closeReview" aria-label="Hide bar">×</button>
</div>

<script>
const D = ${JSON.stringify(data)};
const S = { precor: false };
try { S.precor = localStorage.getItem('ob-precor') === '1'; } catch (e) {}
const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const pn = (p, size) => 'OneBase ' + p.name + (size ? ' ' + size : '');
const mod = (k) => D.modalities[k];
const catMod = { 'hbot':'air','cold-therapy':'ice','sauna':'heat','red-light':'light' };
const pic = (key, label, h, extra='', fit='cover') => D.img[key] ? \`<img src="\${D.img[key]}" alt="\${esc(label)}" style="display:block;width:100%;height:\${h?h+'px':'100%'};object-fit:\${fit};border-radius:var(--r);\${extra}" loading="lazy">\` : ph(label, h, extra);
const ph = (label, h, extra='') => \`<div class="ph" style="min-height:\${h}px;\${extra}">\${esc(label)}</div>\`;
const LOGO = {'Los Angeles FC':'lafc','New England Revolution':'nerevolution','HealthFit':'healthfit','10X Longevity':'10x','The Covery':'covery','Hype Wellness Studio':'hype','Hume':'hume','Infinity IV & Wellness':'infinity','Revital Health':'revital'};
const CREST = ['lafc','nerevolution'];
const FEATURED = ['Los Angeles FC','New England Revolution','Las Vegas Raiders','Portland Timbers','TB12','EXOS','Jake Paul','Kayla Barnes','The Covery','10X Longevity','Hume','HealthFit','Hong Kong Sports Institute'];
const custCount = () => D.customers.reduce((a,c)=>a+c.names.length,0);
function allCust(){ const a=[]; D.customers.forEach(c=>c.names.forEach(n=>a.push({n,seg:c.seg}))); return FEATURED.map(n=>a.find(x=>x.n===n)).filter(Boolean).concat(a.filter(x=>!FEATURED.includes(x.n))); }
function ctile(n, hid){ const k=LOGO[n]; const h=hid?' aria-hidden="true"':''; return k&&D.img['logo-'+k]?\`<span class="ct lg"\${h}><img src="\${D.img['logo-'+k]}" alt="\${esc(n)}" class="\${CREST.includes(k)?'crest':''}"></span>\`:\`<span class="ct wm"\${h}>\${esc(n)}</span>\`; }
function marquee(){ const a=allCust(); const row=(r,rev)=>\`<div class="mq\${rev?' rev':''}"><div class="mq-t">\${r.map(x=>ctile(x.n)).join('')}\${r.map(x=>ctile(x.n,1)).join('')}</div></div>\`; return row(a.filter((_,i)=>i%2===0))+row(a.filter((_,i)=>i%2===1),1); }
const eyebrow = (t, cls='') => \`<p class="eyebrow \${cls}">\${t}</p>\`;
const precor = (small) => S.precor ? \`<span class="pill"><i></i>Available through Precor · US</span>\` : '';
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
 <p class="small muted">\${esc(p.tagline)}</p><p class="faint" style="font-size:12px">\${p.sizes.map(s=>s.label).join(' · ')||p.colours.join(' · ')}</p>
 <div class="row" style="justify-content:space-between;margin-top:auto;padding-top:8px"><span class="small" style="font-weight:500">View product →</span>\${p.channels.precor?precor():''}</div></div></a>\`; };

const pages = {
 home: () => \`
<section class="hero">\${D.img['hero-bg']?\`<img src="\${D.img['hero-bg']}" alt="OneBase Yakisugi sauna and IceVault installed in a recovery suite"><div class="veil"></div>\`:ph('OneBase Yakisugi sauna and IceVault installed in a recovery suite',0)}<div class="wrap inner stack" style="gap:18px">
 \${eyebrow('Air · Ice · Heat · Light')}<h1>Recovery equipment engineered for the facilities people come back to.</h1>
 <p class="key">Hyperbaric, cold, heat and light. Built in-house, medically led, connected by one platform.</p>
 <div class="row"><a href="#/contact" class="btn" style="background:#fff;color:#1f1f1f">Talk to sales</a><a href="#/products" class="btn" style="border-color:rgba(255,255,255,.45);color:#fff">See the products</a></div></div></section>
<section style="border-bottom:1px solid var(--line);padding-block:24px 20px"><div class="wrap row" style="justify-content:space-between;align-items:baseline;margin-bottom:10px">\${eyebrow('Installed at '+custCount()+'+ venues')}<a href="#/customers" class="small" style="font-weight:500;text-decoration:underline;text-underline-offset:4px">See all customers</a></div><div class="stack" style="gap:2px">\${marquee()}</div></section>
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
<section class="wrap stack" style="padding-block:56px 24px;max-width:760px">\${eyebrow('Products')}<h1>Commercial-grade, by design.</h1><p class="muted">Every product is engineered for daily commercial use: durable builds, plug-and-play installs, self-cleaning where it matters, and connection to the OneBase platform.</p></section>
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
   <div class="row faint" style="font-size:12px">\${p.status==='coming-soon'?'<span>Taking pre-orders</span>':'<span>Installation service · US-based support · 2-year warranty</span>'}\${p.channels.precor?precor():''}\${p.fromPriceUSD?\`<span>From US$\${p.fromPriceUSD.toLocaleString()}</span>\`:''}</div></div></div></section>
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
<section class="wrap stack" style="padding-block:56px 24px;max-width:760px">\${eyebrow('Solutions')}<h1>Recovery, built for the way your facility runs.</h1><p class="muted">Every industry has its own throughput, footprint and procurement needs. Pick yours and we’ll show you the configurations that work, and the operators already running them.</p></section>
<section class="wrap grid g3" style="padding-block:24px 64px">\${D.solutions.map(s=>\`<a href="#/solutions/\${s.id}" class="card dark" style="min-height:240px;justify-content:flex-end;padding:22px;position:relative">\${D.img[D.solImg[s.id]]?\`<img src="\${D.img[D.solImg[s.id]]}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><div class="veil" style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.75))"></div>\`:\`<span class="ph" style="position:absolute;inset:0;background:var(--ink);color:rgba(255,255,255,.25);border-radius:0">Photo: \${esc(s.label)}</span>\`}<div style="position:relative"><h2 style="font-size:24px">\${esc(s.label)}</h2><p class="small muted" style="margin-top:4px">\${esc(s.heroHeading)}</p></div></a>\`).join('')}</section>
\${cta()}\`,

 solution: (id) => { const s = D.solutions.find(x=>x.id===id); if(!s) return pages.notfound(); const feat = ['icevault','yakisugi','lightbed','airform'].map(i=>D.products.find(p=>p.id===i)).filter(p=>s.modalities.includes(p.modality)); return \`
<section class="hero" style="min-height:min(62vh,560px)">\${D.img[D.solImg[s.id]]?\`<img src="\${D.img[D.solImg[s.id]]}" alt="\${esc(s.label)}"><div class="veil"></div>\`:ph('Photo: '+s.label+' in use', 0)}<div class="wrap inner stack" style="gap:16px">\${eyebrow(s.label)}<h1>\${esc(s.heroHeading)}</h1><div class="row"><a href="#enquiry" class="btn" style="background:#fff;color:#1f1f1f" onclick="setTimeout(()=>document.getElementById('enquiry')?.scrollIntoView({behavior:'smooth'}),0);return false;">Contact sales</a>\${s.precorChannel?precor():''}</div></div></section>
<section class="dark"><div class="wrap grid g4" style="padding-block:48px;gap:28px">\${s.valueProps.map(v=>\`<div style="border-top:1px solid rgba(255,255,255,.15);padding-top:12px"><h3>\${esc(v.title)}</h3><p class="small muted" style="margin-top:8px">\${esc(v.body)}</p></div>\`).join('')}</div></section>
\${s.features.map((f,i)=>\`<section class="sec"><div class="wrap grid g2" style="gap:48px;align-items:center"><div style="\${i%2?'order:2':''}">\${pic(i===0?D.solImg[s.id]:'full-stack', f.title, 360)}</div><div class="stack"><h2>\${esc(f.title)}</h2><p class="muted">\${esc(f.body)}</p></div></div></section>\`).join('')}
<section class="sec" style="background:var(--surf)"><div class="wrap">\${eyebrow('Recommended for '+s.label.toLowerCase())}<div class="grid g4" style="margin-top:18px">\${feat.map(prodCard).join('')}</div></div></section>
\${enquiry('Let’s plan your '+s.label.toLowerCase()+' install')}\`; },

 software: () => \`
<section class="dark"><div class="wrap grid g2" style="padding-block:64px;gap:48px;align-items:center"><div class="stack">\${eyebrow('Software')}<h1>The engine behind smart recovery.</h1><p class="key">Hardware you can see. Software that makes it work together.</p><p class="muted">Two layers. OneBase OS for the operator: fleet monitoring, analytics and maintenance. The OneBase app for the client: protocols, scheduling and progress. Both talk to the same devices.</p></div>\${pic('app-interface','OneBase OS dashboard', 360)}</div></section>
<section class="sec"><div class="wrap stack" style="gap:28px">\${eyebrow('OneBase OS · for operators · coming late 2026')}<h2 style="max-width:680px">Manage your fleet from anywhere.</h2><div class="grid g4" style="gap:28px">\${[['Real-time monitoring','Temperature, pressure, session state and faults for every device, every site.'],['Usage analytics','Sessions per day, peak hours, utilisation by modality. The numbers that justify the next unit.'],['Automated alerts','Maintenance due, out-of-range readings and consumables running low, before staff notice.'],['Multi-location management','One login for the whole estate. Roles for owners, managers and technicians.']].map(([t,b])=>\`<div class="tip"><h3>\${t}</h3><p class="small muted" style="margin-top:6px">\${b}</p></div>\`).join('')}</div></div></section>
<section class="sec" style="background:var(--surf)"><div class="wrap grid" style="grid-template-columns:1fr 1.3fr;gap:48px;align-items:center"><div>\${ph('OneBase app: protocol screen', 420, 'max-width:280px')}</div><div class="stack" style="gap:20px">\${eyebrow('OneBase app · for members and clients')}<h2>Your wellness. Connected. Personalised.</h2>\${[['All devices, one app','HBOT, sauna, red light and cold therapy, with OneBase and other devices inside a single protocol.'],['Doctor-built protocols','Created by physicians and researchers for recovery, performance and longevity, tuned to goals, equipment and session preferences.'],['Progress you can see','Sessions logged and history in one place, so patterns and improvements are obvious.']].map(([t,b])=>\`<div><h3>\${t}</h3><p class="small muted" style="margin-top:4px">\${b}</p></div>\`).join('')}<div class="row"><a class="btn btn-p" href="#/software">Download for iOS</a><a class="btn btn-g" href="#/software">Download for Android</a></div><p class="faint" style="font-size:12px">Coming soon: wearable sync, protocols that adapt to your biometrics, daily recommendations.</p></div></div></section>
\${cta('Want to see the software on your equipment?','Book a demo and we’ll walk through OS monitoring and app protocols for your facility.','air')}\`,

 customers: () => \`
<section class="wrap stack" style="padding-block:56px 8px;max-width:800px">\${eyebrow('Installed at')}<h1>\${custCount()}+ venues run on OneBase.</h1><p class="muted">Pro teams, fitness clubs, recovery studios and clinics across North America, Australia, Asia and Europe. Filter to find operators like you.</p></section>
<section class="wrap" style="padding-block:24px 72px"><div class="chips" id="cf">\${['All',...D.customers.map(c=>c.seg)].map((sg,i)=>\`<button class="chip" aria-pressed="\${i===0}" data-seg="\${esc(sg)}">\${esc(sg)}\${i?\` <span style="opacity:.6">\${D.customers[i-1].names.length}</span>\`:''}</button>\`).join('')}</div><div class="cgrid" id="cg">\${allCust().map(x=>\`<div class="cg" data-seg="\${esc(x.seg)}">\${ctile(x.n)}<small>\${esc(x.seg)}</small></div>\`).join('')}</div></section>
<section class="sec" style="background:var(--surf)"><div class="wrap row" style="justify-content:space-between;align-items:center;gap:24px"><div class="stack" style="gap:8px;max-width:620px"><h2>Want your venue on this wall?</h2><p class="muted">We plan the space, handle install and train your team.</p></div><a href="#/contact" class="btn btn-p">Talk to sales</a></div></section>\`,
 partners: () => \`
<section class="wrap stack" style="padding-block:56px 32px;max-width:760px">\${eyebrow('Partners')}<h1>Buy direct, or through a partner you already trust.</h1><p class="muted">OneBase sells and supports direct across North America, Australia and Asia-Pacific. In selected markets our equipment is also available through distribution partners, with the same engineering, warranty and support behind it.</p></section>
\${S.precor?\`<section class="wrap" style="padding-bottom:40px"><div class="dark" style="border-radius:var(--r);padding:32px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:24px"><div class="stack" style="max-width:640px">\${eyebrow('US commercial fitness')}<h2>OneBase, available through Precor.</h2><p class="muted">IceVault cold rooms, Yakisugi and Hemlock saunas, and LightPanel and LightBed red light are available to US fitness facilities through Precor. Your Precor rep can spec, quote and deliver OneBase equipment alongside your cardio and strength floor.</p></div><a href="#/contact" class="btn" style="background:#fff;color:#1f1f1f">Ask about Precor</a></div></section>\`:''}
<section class="sec" style="background:var(--surf)"><div class="wrap grid g3" style="gap:36px">\${[['Direct sales','HBOT chambers, hospitality, real estate, sports, corporate and clinical projects are handled by the OneBase team. Facility planning, electrical guidance, installation and training included.'],['Dealers and integrators','Architects, wellness consultants and fit-out contractors can specify OneBase for their projects. Ask us for CAD, spec sheets and a partner price list.'],['Service partners','Trained technicians and local parts in North America and Australia. Remote diagnostics through OneBase OS for everything else.']].map(([t,b])=>\`<div><h3>\${t}</h3><p class="small muted" style="margin-top:8px">\${b}</p></div>\`).join('')}</div></section>
<section class="sec" style="background:var(--surf)"><div class="stack" style="gap:24px"><div class="wrap row" style="justify-content:space-between;align-items:flex-end"><div class="stack" style="gap:10px;max-width:720px">\${eyebrow('Customers')}<h2>\${custCount()}+ businesses across North America, Australia, Asia and Europe.</h2></div><a href="#/customers" class="small" style="font-weight:500;text-decoration:underline;text-underline-offset:4px">See all customers</a></div><div class="stack" style="gap:2px">\${marquee()}</div></div></section>
\${cta('Interested in partnering with OneBase?','Tell us about your market and we’ll come back with a partner pack.')}\`,

 about: () => { const groups = { founders:'Founders', medical:'Medical', engineering:'Engineering', commercial:'Sales & customer', operations:'Operations' }; return \`
<section class="hero" style="min-height:min(60vh,520px)">\${D.img['engineers']?\`<img src="\${D.img['engineers']}" alt="OneBase engineers at work"><div class="veil"></div>\`:ph('OneBase engineers at work',0)}<div class="wrap inner stack" style="gap:16px">\${eyebrow('About')}<h1>Recovery technology engineered for outcomes.</h1><p class="key">Founded by an engineer, a hyperbaric physician and a Scandinavian designer.</p></div></section>
<section class="sec"><div class="wrap grid g2" style="gap:48px"><div class="stack">\${eyebrow('Why we built OneBase')}<h2>Built for demanding wellness environments.</h2></div><div class="prose"><p>OneBase Health was founded with a single goal: to make advanced recovery technology accessible, reliable and beautiful enough for the world’s most demanding wellness environments. From professional sports facilities and luxury hospitality to corporate wellness programs and recovery studios, our equipment is engineered to perform at scale.</p><p>We believe recovery and longevity technology should be as rigorous in its engineering as it is in its outcomes. OneBase gives operators access to high-quality hyperbaric, contrast therapy, infrared sauna and light therapy equipment, backed by medical expertise, built to last, and designed to elevate any facility.</p></div></div></section>
<section class="dark"><div class="wrap grid g3" style="padding-block:56px;gap:32px">\${[['Innovation with results','We push the boundaries of what recovery equipment can do, then prove it in commercial environments before we ship.'],['Clean design, advanced technology','Every session should be effective and enjoyable. Products are designed to elevate a space, and interfaces to be understood at a glance.'],['The most efficient treatments','Ongoing support, doctor-built protocols and staff training, so facilities get results from day one.']].map(([t,b])=>\`<div style="border-top:1px solid rgba(255,255,255,.15);padding-top:12px"><h3>\${t}</h3><p class="small muted" style="margin-top:8px">\${b}</p></div>\`).join('')}</div></section>
<section class="sec"><div class="wrap">\${eyebrow('Credentials, standards and support')}<div class="grid g3" style="margin-top:18px;gap:32px">\${[['In-house engineering','Mechanical, electrical, embedded, software and security disciplines. Products validated for commercial duty before release.'],['Medical leadership','Our medical advisory and leadership team includes practising hyperbaric specialists who inform product decisions, protocols and operator education.'],['Quality systems','Supplier audits, certified components (CE, ISO 9001/13485 on applicable lines) and a 2-year standard warranty.']].map(([t,b])=>\`<div><h3>\${t}</h3><p class="small muted" style="margin-top:8px">\${b}</p></div>\`).join('')}</div></div></section>
<section class="sec" style="background:var(--surf)"><div class="wrap stack" style="gap:28px">\${eyebrow('The people behind OneBase')}<h2 style="max-width:680px">A team spanning health, engineering, design and commercial operations.</h2>\${Object.entries(groups).map(([k,l])=>\`<div><p class="eyebrow">\${l}</p><div class="grid g4" style="margin-top:12px;gap:14px">\${D.team.filter(t=>t.group===k).map(t=>\`<div><p style="font-weight:500">\${esc(t.name)}</p><p class="small muted">\${esc(t.role)}</p></div>\`).join('')}</div></div>\`).join('')}</div></section>
\${cta('Bring commercial recovery technology into your organisation.','Whether you run a studio, performance centre, hotel, workplace program or residential amenity, we can design a recovery experience built for measurable business value.')}\`; },

 contact: () => \`
<section class="wrap stack" style="padding-block:56px 8px;max-width:800px">\${eyebrow('Contact')}<h1>Let’s plan your recovery space.</h1><div class="grid g3 small" style="margin-top:12px">\${[['North America','<strong style="font-weight:500">(208) 408-1801</strong><br><a style="text-decoration:underline;text-underline-offset:3px" href="#/contact">Schedule a call</a>'],['Australia & APAC','Perth, Western Australia<br><a style="text-decoration:underline;text-underline-offset:3px" href="#/contact">sales@onebasehealth.com</a>'],['Customer service','<a style="text-decoration:underline;text-underline-offset:3px" href="#/contact">customerservice@onebasehealth.com</a><br>Warranty, parts and support']].map(([t,b])=>\`<div><p class="eyebrow">\${t}</p><p style="margin-top:6px">\${b}</p></div>\`).join('')}</div></section>
\${enquiry()}\`,

 blog: () => \`
<section class="wrap stack" style="padding-block:56px 24px;max-width:760px">\${eyebrow('Education')}<h1>Learn the science. Skip the jargon.</h1><p class="muted">Research-backed, written so anyone can act on it. 41 articles migrate from the current site.</p></section>
<section class="wrap grid g3" style="padding-block:16px 64px;gap:28px">\${D.posts.map(p=>\`<a href="#/blog/\${p.id}" class="stack" style="gap:8px">\${ph('Article image', 180)}<p class="eyebrow">\${p.cat} · \${p.date}</p><h2 style="font-size:20px">\${esc(p.title)}</h2><p class="small muted">\${esc(p.desc)}</p></a>\`).join('')}</section>\`,

 post: (id) => { const p = D.posts.find(x=>x.id===id) || D.posts[0]; return \`
<article class="wrap" style="padding-block:56px 40px;max-width:760px"><p class="eyebrow">\${p.cat} · \${p.date}</p><h1 style="margin-top:10px">\${esc(p.title)}</h1><p class="key" style="margin-top:12px">\${esc(p.desc)}</p>\${ph('Article hero image', 300, 'margin-top:24px')}<div class="prose" style="margin-top:28px"><p>Article body migrates from Shopify with the import script. This is a placeholder so the reading layout can be reviewed: measure, type size, spacing and the disclaimer treatment below.</p><h2>What "mild" means</h2><p>Mild hyperbaric oxygen therapy usually refers to sessions between 1.3 and 1.5 ATA, the range soft-shell chambers such as the OneBase AirFit and AirFlex operate in. Hard-shell chambers such as the AirForm and the AirSuite room reach 2.0 ATA.</p><h2>What to ask before choosing a pressure</h2><p>Research shows outcomes depend on pressure, session length and frequency together, not pressure alone. Here’s how it applies to you: define the goal first, then pick the protocol, then the chamber that delivers it. The OneBase app does the protocol part for you.</p><p class="faint" style="font-size:12px">For information and educational purposes only; not medical advice. Ask your doctor whether any therapy is appropriate for you.</p></div></article>
\${cta('Want this in your facility?','Talk to our team about the equipment behind the research.')}\`; },

 parts: () => \`
<section class="wrap stack" style="padding-block:56px 24px;max-width:760px">\${eyebrow('Parts & consumables')}<h1>Keep every session running.</h1><p class="muted">Genuine parts for OneBase chambers, shipped from the US. Prices in USD. Card payments are processed securely by Stripe.</p></section>
<section class="wrap grid g4" style="padding-block:16px 64px">\${D.parts.map(i=>\`<div class="card" style="padding:16px;gap:6px">\${ph(i.name, 120)}<h3 style="font-size:15px">\${esc(i.name)}</h3>\${i.fits?\`<p class="faint" style="font-size:12px">Fits: \${esc(i.fits)}</p>\`:''}\${i.description?\`<p class="small muted">\${esc(i.description)}</p>\`:''}<div class="row" style="justify-content:space-between;margin-top:auto;padding-top:10px"><span style="font-weight:500">US$\${i.priceUSD.toFixed(2)}</span><button class="btn btn-p" style="padding:9px 14px;font-size:13px" onclick="this.textContent='Opens Stripe Checkout'">Buy</button></div></div>\`).join('')}</section>\`,

 policy: (id) => { const [t, paras] = D.policies[id] || D.policies.terms; return \`<section class="wrap" style="padding-block:56px 64px;max-width:760px">\${eyebrow('Policies')}<h1 style="margin-top:8px">\${t}</h1><div class="prose" style="margin-top:28px">\${paras.map(x=>x.startsWith('## ')?\`<h2>\${x.slice(3)}</h2>\`:\`<p>\${x}</p>\`).join('')}</div></section>\`; },

 notfound: () => \`<section class="wrap" style="padding-block:96px"><h1>Page not found</h1><p class="muted" style="margin-top:12px"><a href="#/" style="text-decoration:underline">Back to home</a></p></section>\`,
};

const NAV = [['Products','#/products',Object.values(D.modalities).map(m=>[m.name,'#/products/'+m.category])],['Solutions','#/solutions'],['Software','#/software'],['Partners','#/partners'],['About','#/about'],['Blog','#/blog']];
function renderChrome(){
  const h = location.hash || '#/';
  document.getElementById('nav').innerHTML = NAV.map(([l,href])=>\`<a href="\${href}" class="\${h.startsWith(href)?'on':''}">\${l}</a>\`).join('');
  document.getElementById('drawer').innerHTML = NAV.map(([l,href,sub])=>\`<a href="\${href}">\${l}</a>\${(sub||[]).map(([sl,sh])=>\`<a href="\${sh}" class="sub">\${sl}</a>\`).join('')}\`).join('') + '<a href="#/parts" class="sub">Parts &amp; consumables</a>' + \`<img src="\${D.img['onebase-logo-white']}" alt="OneBase" style="height:22px;width:auto;margin-top:22px;align-self:flex-start">\` + '<a href="#/contact" class="btn" style="background:#fff;color:#1f1f1f;align-self:flex-start;margin-top:16px;border:0">Talk to sales</a>';
  document.getElementById('hdrLogo').innerHTML = D.img['onebase-logo-black'] ? \`<img src="\${D.img['onebase-logo-black']}" alt="OneBase" class="lg lg-dark"><img src="\${D.img['onebase-logo-white']}" alt="" class="lg lg-light">\` : 'OneBase';
  document.getElementById('foot').innerHTML = \`<div class="cols"><div class="stack"><span class="logo"><img src="\${D.img['onebase-logo-white']}" alt="OneBase" style="height:26px;width:auto"></span><p class="key" style="color:rgba(255,255,255,.8);font-size:20px">The world’s easiest therapy system.</p><p style="color:rgba(255,255,255,.6)">Sales: (208) 408-1801<br>or <a href="#/contact" style="text-decoration:underline">schedule a call</a></p></div>
  <div><p class="eyebrow">Products</p>\${Object.values(D.modalities).map(m=>\`<a href="#/products/\${m.category}">\${m.name}</a>\`).join('')}<a href="#/parts">Parts &amp; consumables</a></div>
  <div><p class="eyebrow">Solutions</p>\${D.solutions.map(s=>\`<a href="#/solutions/\${s.id}">\${s.label}</a>\`).join('')}</div>
  <div><p class="eyebrow">Company</p><a href="#/about">About OneBase</a><a href="#/software">Software</a><a href="#/partners">Partners</a><a href="#/customers">Customers</a><a href="#/blog">Blog</a><a href="#/contact">Contact</a></div>
  <div><p class="eyebrow">Support</p><a href="#/policies/warranty">Warranty policy</a><a href="#/policies/returns">Refunds &amp; returns</a><a href="#/policies/privacy">Privacy policy</a><a href="#/policies/cookies">Cookie policy</a><a href="#/policies/terms">Terms of use</a></div></div>
  <div class="legal"><p style="max-width:900px">The recommendations made by Waylen Allen Limited do not constitute a medical recommendation and are intended for information and educational purposes only; no claims (real or implied) are being made. While studies support the effectiveness of hyperbaric oxygen therapy for various conditions, individual results vary. Always ask your doctor about all treatment options; only a doctor can assess whether hyperbaric oxygen therapy is appropriate for your situation. In the United States, hyperbaric chambers are a Class II medical device and require a medical prescription for use.</p><p style="margin-top:12px">© 2026 OneBase Health · Waylen Allen Limited. All rights reserved.</p></div>\`;
}
function route(){
  const h = (location.hash || '#/').slice(1); const parts = h.split('/').filter(Boolean); let out;
  if (!parts.length) out = pages.home();
  else if (parts[0]==='products') out = parts.length===1?pages.products():parts.length===2?(D.modalities[catMod[parts[1]]]?pages.category(parts[1]):pages.notfound()):pages.product(parts[1],parts[2]);
  else if (parts[0]==='solutions') out = parts[1]?pages.solution(parts[1]):pages.solutions();
  else if (parts[0]==='blog') out = parts[1]?pages.post(parts[1]):pages.blog();
  else if (parts[0]==='policies') out = pages.policy(parts[1]);
  else if (pages[parts[0]]) out = pages[parts[0]]();
  else out = pages.notfound();
  document.getElementById('app').innerHTML = out;
  document.getElementById('drawer').classList.remove('open'); document.getElementById('menuBtn').setAttribute('aria-expanded','false');
  renderChrome(); window.scrollTo({ top: 0 }); if (typeof afterRender === 'function') afterRender();
}
document.getElementById('menuBtn').addEventListener('click', () => { const d = document.getElementById('drawer'); const o = d.classList.toggle('open'); document.getElementById('menuBtn').setAttribute('aria-expanded', String(o)); });
const tg = document.getElementById('precorToggle'); tg.checked = S.precor;
tg.addEventListener('change', () => { S.precor = tg.checked; try { localStorage.setItem('ob-precor', S.precor ? '1' : '0'); } catch (e) {} route(); });
document.getElementById('closeReview').addEventListener('click', () => { document.getElementById('review').hidden = true; });
if (matchMedia('(min-width:900px)').matches) document.getElementById('phone').style.display = 'inline';
document.addEventListener('click', e => { const b = e.target.closest('#cf .chip'); if (!b) return; const sg = b.dataset.seg; document.querySelectorAll('#cf .chip').forEach(x => x.setAttribute('aria-pressed', String(x === b))); document.querySelectorAll('#cg .cg').forEach(t => { t.hidden = !(sg === 'All' || t.dataset.seg === sg); }); });
${EXTRA_JS}
window.addEventListener('hashchange', route); route();
</script>
`;
fs.mkdirSync('prototype', { recursive: true });
fs.writeFileSync('prototype/onebase-prototype.html', html);
console.log('wrote prototype/onebase-prototype.html', (html.length / 1024).toFixed(0), 'KB');
