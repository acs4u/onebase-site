/* ===== Custom Traditional: the full catalogue on the product page ===== */
const TR_INSIDE = [
  ['Heater', 'Harvia, 6–15 kW'],
  ['Control', 'Harvia CX30 / CX45, outside the room'],
  ['Stones', 'Peridotite or igneous, 2–4 in'],
  ['Benches', 'Clear kiln-dried 2×2'],
  ['Door', 'Cedar and tempered glass, with other styles available'],
  ['Air', 'Low vent behind the heater'],
  ['Light', 'Vapor-proof, clear of the heater'],
  ['Operating range', '149–176 °F (65–80 °C), measured 6 in below the ceiling above the heater'],
];
const TR_WOOD = [
  ['cat-wood-red', 'Western Red Cedar', 'Standard', 'Our standard option. The softest to the touch, with the widest colour variation. Naturally rot-resistant, with a fresh aroma.'],
  ['cat-wood-yellow', 'Alaska Yellow Cedar', 'Upgrade', 'A silky texture and creamy, even finish, with a strong, distinctive aroma. Higher cost and a longer lead time.'],
  ['cat-wood-hemlock', 'Western Hemlock', 'Upgrade', 'Pale and even, with no aroma and no resin — the choice for anyone sensitive to wood.'],
];
const TR_HEATERS = [
  ['HL series · up to 635 cu ft', [
    ['HL(S)6U1', '6.0 kW', '240 V · 1-phase', '35 A', '177–294', 'CX30 or CX45'],
    ['HL(S)7U1', '6.8 kW', '240 V · 1-phase', '35 A', '177–354', 'CX30 or CX45'],
    ['HL(S)8U1', '8.0 kW', '240 V · 1-phase', '45 A', '177–431', 'CX45'],
    ['HL(S)9U1', '9.0 kW', '240 V · 1-phase', '50 A', '177–494', 'CX45'],
    ['HL(S)11U1', '10.5 kW', '240 V · 1-phase', '60 A', '177–635', 'CX45'],
    ['HL(S)11U3', '10.5 kW', '208 V · 3-phase', '40 A', '177–635', 'CX30 or CX45'],
  ]],
  ['K series · larger rooms and other electrical configurations', [
    ['K10G-U1-NC', '10.0 kW', '240 V · 1-phase', '50 A', '390–600', 'CX30 or CX45'],
    ['K12.5G-U1-NC', '12.6 kW', '240 V · 1-phase', '60 A', '500–750', 'CX45'],
    ['K15G-U1-NC', '14.8 kW', '240 V · 1-phase', '70 A', '630–1,000', 'CX45'],
    ['K10G-U3-NC', '9.8 kW', '208 V · 3-phase', '40 A', '390–600', 'CX30 or CX45'],
    ['K12.5G-U3-NC', '12.3 kW', '208 V · 3-phase', '40 A', '500–750', 'CX45'],
    ['K15G-U3-NC', '14.4 kW', '208 V · 3-phase', '50 A', '630–1,000', 'CX45'],
  ]],
];
const TR_SIZING = [
  ['Room volume', 'Length × width × height of the finished room, in cubic feet. The heater is chosen from the smallest model that covers it.'],
  ['Seating', 'Allow 2 ft of bench per bather. Upper and lower benches in matching timber.'],
  ['Heat-up', '20–30 minutes to temperature when the heater is sized correctly and the room is properly vented.'],
];
const TR_PLAN = [
  ['The room', [
    ['Ceiling', '7\'0" min, 7\'6" max to joists'],
    ['Framing', '2×4 or 2×6, lined with 3/4 in plywood'],
    ['Insulation', 'R-13 walls, R-19 ceiling'],
    ['Vapor barrier', 'Type C foil, supplied by OneBase'],
  ]],
  ['Floor and door', [
    ['Floor', 'Finished before install; concrete or tile'],
    ['Drain', 'Recommended for commercial'],
    ['Door', 'Opens outward. 24 in: 26 × 82 in RO. 36 in: 38½ × 82 in RO'],
    ['Vents', 'Usually one 4 × 10 in, low behind the heater'],
  ]],
  ['Electrical and safety', [
    ['Circuit', 'Dedicated, non-GFCI breaker labelled SAUNA'],
    ['Wiring', 'Licensed electrician, to NEC and local code'],
    ['Controls', 'Power unit and control outside the room, in a dry place'],
    ['Sprinkler', 'Head rated 285 °F or higher, not above the heater. Confirm with local AHJ'],
  ]],
];
const TR_PROJECTS = [
  ['Fitness club · Wisconsin · Renovation', 'An old club sauna, rebuilt.',
   'The club’s existing sauna was demolished and rebuilt from the ground up as a Traditional room.',
   [['Room', '8 × 10 ft, 7\'2" ceiling'], ['Timber', 'Western Red Cedar, horizontal'], ['Benches', 'L-shaped, upper and lower'], ['Heater', 'Harvia Club 12.3 kW, 208 V 3-phase']],
   ['cat-proj-club-1', 'cat-proj-club-2'],
   'The club also runs OneBase IceVault cold rooms and Yakisugi infrared saunas.'],
  ['Wellness studio · Arizona · New build', 'From a prepared shell to first session.',
   'The studio’s contractor built the shell to our submittal. We lined the room, built the benches and fitted the heater.',
   [['Room', '9\'1" × 9\'1", 7\'2" ceiling'], ['Volume', '607 cu ft'], ['Benches', 'L-shaped, upper and lower'], ['Heater', 'Harvia Club series']],
   ['cat-proj-studio-1', 'cat-proj-studio-2'], ''],
];
function trSections(){
  const img = k => D.img[k] || '';
  const inside = `<section class="sec trc-sec"><div class="wrap trc-split">
    <div class="trc-shot">${img('cat-trad-heater') ? `<img src="${img('cat-trad-heater')}" alt="Harvia stone heater in a OneBase Traditional sauna" loading="lazy">` : ''}${img('cat-trad-bench') ? `<img src="${img('cat-trad-bench')}" alt="Clear-grade cedar benches" loading="lazy">` : ''}</div>
    <div><p class="eyebrow">Inside the sauna</p><h2 class="trc-h">Built around the stones.</h2>
      <p class="muted trc-lead">Heat rises off the stones, rolls across the ceiling and settles on the upper bench. Everything in the room is placed to keep that loop even.</p>
      <dl class="trc-dl">${TR_INSIDE.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></div></div></section>`;

  const wood = `<section class="sec trc-sec trc-surf"><div class="wrap"><p class="eyebrow">Wood types</p><h2 class="trc-h">One wood type, throughout.</h2>
    <div class="trc-wood">${TR_WOOD.map(([k, name, tag, body]) => `<div class="trc-wcard">${img(k) ? `<img src="${img(k)}" alt="${esc(name)} sample boards" loading="lazy">` : ''}<p class="trc-tag">${esc(tag)}</p><h3>${esc(name)}</h3><p class="muted">${esc(body)}</p></div>`).join('')}</div>
    <p class="note trc-note">Panelling, benches and trim are all in the chosen species. 1×4 tongue-and-groove, v-joint, clear grade, kiln-dried to 11% moisture or less, 11/16 in finished. Interior timber is left unsealed.</p></div></section>`;

  const heaters = `<section class="sec trc-sec"><div class="wrap"><p class="eyebrow">Heaters and sizing</p><h2 class="trc-h">Sized to the room.</h2>
    <div class="trc-tw"><table class="trc-table"><thead><tr><th>Heater</th><th>Output</th><th>Supply</th><th>Breaker</th><th>Room, cu ft</th><th>Control</th></tr></thead>
    ${TR_HEATERS.map(([group, rows]) => `<tbody><tr class="trc-group"><th colspan="6">${esc(group)}</th></tr>${rows.map(r => `<tr>${r.map((c, i) => i ? `<td>${esc(c)}</td>` : `<th>${esc(c)}</th>`).join('')}</tr>`).join('')}</tbody>`).join('')}</table></div>
    <div class="trc-three">${TR_SIZING.map(([a, b]) => `<div><h3>${esc(a)}</h3><p class="muted">${esc(b)}</p></div>`).join('')}</div></div></section>`;

  const plan = `<section class="sec trc-sec trc-surf"><div class="wrap"><p class="eyebrow">Planning</p><h2 class="trc-h">Planning and installation.</h2>
    <div class="trc-three trc-plan">${TR_PLAN.map(([title, rows]) => `<div><h3>${esc(title)}</h3><dl class="trc-dl">${rows.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl></div>`).join('')}</div>
    <p class="note trc-note">Warranty: 1 year on room materials and workmanship; 5-year limited on the heater. Specifications subject to change. Local building code takes precedence.</p></div></section>`;

  const projects = `<section class="sec trc-sec"><div class="wrap"><p class="eyebrow">Recent projects</p><h2 class="trc-h">Built for clubs and studios.</h2>
    <div class="trc-projects">${TR_PROJECTS.map(([label, title, body, rows, shots, foot]) => `<article class="trc-proj">
      <div class="trc-pshots">${shots.filter(k => img(k)).map(k => `<img src="${img(k)}" alt="${esc(title)}" loading="lazy">`).join('')}</div>
      <p class="eyebrow">${esc(label)}</p><h3>${esc(title)}</h3><p class="muted">${esc(body)}</p>
      <dl class="trc-dl">${rows.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
      ${foot ? `<p class="note">${esc(foot)}</p>` : ''}</article>`).join('')}</div></div></section>`;

  return inside + wood + heaters + plan + projects;
}
const _productTRC = pages.product;
pages.product = (cat, id) => {
  const h = _productTRC(cat, id);
  if (id !== 'traditional') return h;
  return h.replace('<section class="pp-specs"', trSections() + '<section class="pp-specs"');
};
(() => { const s = document.createElement('style'); s.textContent = `
.trc-sec{padding-block:72px}
.trc-surf{background:var(--surf)}
.trc-h{font-size:clamp(28px,3.4vw,44px);letter-spacing:-.02em;margin-top:10px;max-width:18ch}
.trc-lead{max-width:52ch;margin-top:16px}
.trc-split{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.trc-shot{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.trc-shot img{width:100%;height:100%;max-height:520px;object-fit:cover;border-radius:14px}
.trc-dl{margin-top:22px;display:grid;gap:0}
.trc-dl>div{display:grid;grid-template-columns:150px 1fr;gap:16px;padding:11px 0;border-top:1px solid var(--line);font-size:14.5px}
.trc-dl dt{color:var(--muted)}
.trc-dl dd{margin:0;font-weight:500}
.trc-wood{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:32px}
.trc-wcard img{width:100%;aspect-ratio:4/3;object-fit:contain;background:var(--card);border-radius:14px;padding:12px}
.trc-tag{margin-top:14px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
.trc-wcard h3{font-size:20px;margin:4px 0 8px}
.trc-wcard p{font-size:14.5px;line-height:1.55}
.trc-note{margin-top:26px;max-width:90ch}
.trc-tw{margin-top:30px;overflow-x:auto}
.trc-table{width:100%;border-collapse:collapse;font-size:14px;min-width:720px}
.trc-table th,.trc-table td{text-align:left;padding:11px 14px;border-bottom:1px solid var(--line);font-weight:400}
.trc-table thead th{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
.trc-table tbody th{font-weight:500}
.trc-group th{padding-top:22px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);border-bottom:0}
.trc-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;margin-top:34px}
.trc-three h3{font-size:17px;font-weight:500}
.trc-three p{margin-top:8px;font-size:14.5px;line-height:1.55}
.trc-plan .trc-dl{margin-top:12px}
.trc-plan .trc-dl>div{grid-template-columns:110px 1fr;gap:12px;font-size:14px}
.trc-projects{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:32px}
.trc-pshots{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px}
.trc-pshots img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:14px}
.trc-proj h3{font-size:24px;margin:6px 0 10px}
.trc-proj .trc-dl{margin-top:16px}
.trc-proj .note{margin-top:16px}
@media(max-width:900px){
 .trc-sec{padding-block:52px}
 .trc-split{grid-template-columns:1fr;gap:28px}
 .trc-shot img{max-height:300px}
 .trc-wood,.trc-three,.trc-projects{grid-template-columns:1fr;gap:26px}
 .trc-dl>div{grid-template-columns:120px 1fr;gap:12px}
}`; document.head.appendChild(s); })();
