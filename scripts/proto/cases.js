/* ===== Case studies by venue type: /#/customers/<id> =====
   Only facts confirmed in HubSpot closed deals are stated. No quotes and no performance numbers unless a customer supplies them. */
const CASES = [
  { id:'the-covery', venue:'Recovery studio franchise', name:'The Covery', logo:'logo-covery', mods:['air','light','heat','ice'],
    lead:'A franchise recovery brand that fits out every new studio with the same four modalities.',
    sum:'The Covery opens recovery studios under franchise across the United States. Each studio runs hyperbaric, red light, sauna and cold under one roof, so members get a full session in an hour. Since 2024 the franchise has fitted out studios with OneBase equipment across all four modalities.',
    facts:[['Modalities','Hyperbaric, red light, sauna, cold'],['Sites','Multiple franchise studios'],['Since','2024']],
    story:[
      ['The problem','A franchisee opening a studio needs the whole room to work on day one: equipment that arrives together, installs in a week, and runs without a technician on site. Buying four modalities from four suppliers means four delivery windows, four warranties and four support numbers.'],
      ['What they did','Each studio takes a hyperbaric chamber, a red light bed, an infrared sauna and a cold room from OneBase, sized to the floor plan. One quote, one delivery, one install team, one warranty.'],
      ['How it runs','Members book each modality in the app. The front desk sees one schedule. A single OneBase support contact covers every unit in the room.'],
    ] },
  { id:'gym-chains', venue:'Gym chains', name:'The Edge Fitness Clubs and PURE Family Fitness', logo:null, mods:['ice'],
    lead:'Two multi-club operators adding dry cold rooms as a member benefit.',
    sum:'The Edge Fitness Clubs runs full-service clubs across the north-eastern United States. PURE Family Fitness runs clubs in Maryland. In 2026 both added OneBase IceVault cold rooms, giving members cold therapy without the water, ice or daily maintenance of plunge tubs. PURE installed at two clubs, Edgewater and Annapolis.',
    facts:[['Modality','Cold (IceVault)'],['Venue','Full-service fitness clubs'],['Since','2026']],
    story:[
      ['The problem','Members ask for cold plunge. Tubs mean water treatment, wet floors, daily cleaning and a supervision problem on a busy floor. Many clubs that install a tub end up restricting its hours or taking it out.'],
      ['What they did','The IceVault is a dry, electric cold room. No water, no ice, no nitrogen. Members walk in wearing gym kit, stand for three to fifteen minutes at 32–40°F and walk out dry. It sits on the floor like any other piece of equipment.'],
      ['How it runs','Members book a slot in the app, the session runs to time and the room is ready for the next person. No reset between sessions and nothing for staff to clean beyond a wipe-down. For a multi-club operator, the same unit, app and support contact repeat at every site.'],
    ] },
  { id:'razor-sharp', venue:'Gym', name:'Razor Sharp Fitness', logo:null, mods:['heat','ice'],
    lead:'A club that built recovery into the membership, with OneBase heat and cold at the centre of its contrast suite.',
    sum:'Razor Sharp Fitness runs clubs in Mount Pleasant and Racine, Wisconsin. Its Mount Pleasant club offers what it calls a complete recovery ecosystem: massage and compression tools, a whirlpool, salt sauna and steam room, and a contrast suite of cold, infrared and red light. The infrared sauna in that suite is a OneBase unit, supplied in 2025, and an IceVault cold room is joining it.',
    facts:[['Modalities','Heat (infrared sauna) and cold (IceVault)'],['Venue','Fitness club, Mount Pleasant WI'],['Since','2025']],
    story:[
      ['The problem','Members pay for recovery when it feels like a programme, not a spare room with a sauna in it. Razor Sharp wanted a contrast routine, hot then cold then light, that members could follow after a workout or on an off day, and that staff could run without standing over it.'],
      ['What they did','A full-spectrum infrared sauna and a dry IceVault cold room, alongside red light, in one suite. Infrared runs at 135–149°F, so more members can sit for a full session. The IceVault gives the cold half of the contrast without water, ice or a wet floor. Both install on a standard dedicated circuit with no venting or plumbing.'],
      ['How it runs','Members book a slot, start each session themselves and move through the suite in order. The club publishes guided routines for post-workout, off-day and high-stress weeks, so the equipment gets used the way it was meant to.'],
    ] },
  { id:'pro-teams', venue:'Pro sports', name:'Los Angeles FC and the Las Vegas Raiders', logo:'logo-lafc', mods:['air'],
    lead:'Professional teams using hyperbaric oxygen between sessions and on travel days.',
    sum:'Los Angeles FC (MLS) and the Las Vegas Raiders (NFL) both run OneBase hyperbaric chambers in their performance programmes. Team staff use them for recovery between training sessions and to shorten the gap between a knock and a return to the pitch.',
    facts:[['Modality','Hyperbaric (AirForm, up to 2.0 ATA)'],['Users','Performance and medical staff'],['Since','2023 (LAFC), 2025 (Raiders)']],
    story:[
      ['The problem','A pro squad has forty athletes and a few hours between sessions. A recovery modality only earns its place if a player can use it without a nurse, a long setup or a change of routine.'],
      ['What they did','A hard-shell AirForm chamber at up to 2.0 ATA, installed in the performance area. Players lie down, the operator starts the session, and the chamber runs a 60–90 minute protocol under supervision.'],
      ['How it runs','Sessions are scheduled by the performance staff around training. Oxygen is supplied by the on-board concentrator; the chamber needs a dedicated power supply and nothing else.'],
    ] },
];
const CASE_MODC = { air:'Air', ice:'Cold', heat:'Heat', light:'Light' };
function caseCard(c){ return `<a class="cs-card" href="#/customers/${c.id}"><p class="eyebrow">${esc(c.venue)}</p><h3>${esc(c.name)}</h3><p class="muted">${esc(c.lead)}</p><span class="cs-more">Read the story →</span></a>`; }
function casePage(c){
  const others = CASES.filter(x => x.id !== c.id);
  return `<section class="wrap" style="padding-block:56px 24px;max-width:860px"><div class="stack" style="gap:12px">${eyebrow(c.venue)}<h1>${esc(c.name)}</h1><p class="muted" style="font-size:19px;max-width:60ch">${esc(c.sum)}</p></div>
   <dl class="readout cs-facts">${c.facts.map(([k,v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>
  <section class="wrap cs-story" style="max-width:860px">${c.story.map(([h,p]) => `<div><h2>${esc(h)}</h2><p>${esc(p)}</p></div>`).join('')}</section>
  <section class="sec" style="background:var(--surf)"><div class="wrap row" style="justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap"><div class="stack" style="gap:8px;max-width:620px"><h2>Planning something similar?</h2><p class="muted">We'll size the equipment to your floor plan and your numbers.</p></div><div class="row" style="gap:10px"><a href="#/roi" class="btn">Run the numbers</a><a href="#/contact" class="btn btn-p">Talk to sales</a></div></div></section>
  <section class="wrap" style="padding-block:56px 72px"><p class="eyebrow" style="margin-bottom:16px">More stories</p><div class="cs-grid">${others.map(caseCard).join('')}</div></section>`;
}
(() => { const _c = pages.customers; pages.customers = (id) => { if (id) { const c = CASES.find(x => x.id === id); return c ? casePage(c) : pages.notfound(); }
  const h = _c(); const block = `<section class="wrap" style="padding-block:8px 48px"><p class="eyebrow" style="margin-bottom:16px">Stories by venue type</p><div class="cs-grid">${CASES.map(caseCard).join('')}</div></section>`;
  return h.replace('<section class="wrap" style="padding-block:24px 72px">', block + '<section class="wrap" style="padding-block:24px 72px">'); }; })();
(() => { const s = document.createElement('style'); s.textContent = `
.cs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.cs-card{display:block;border:1px solid var(--line);border-radius:16px;padding:22px;background:var(--card);color:inherit;text-decoration:none;transition:border-color .2s,transform .2s}
.cs-card:hover{border-color:var(--fg);transform:translateY(-2px)}
.cs-card h3{margin:8px 0 8px;font-size:20px;font-weight:500;letter-spacing:-.01em}
.cs-card .muted{font-size:14px}.cs-more{display:inline-block;margin-top:14px;font-size:13px;font-weight:500}
.cs-facts{margin-top:28px}
.cs-story{display:grid;gap:36px;padding-block:32px 64px}
.cs-story h2{font-size:22px;margin-bottom:10px}.cs-story p{max-width:64ch;line-height:1.6}
`; document.head.appendChild(s); })();
