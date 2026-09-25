/* ===== Where recovery fits: why each modality is used in each kind of venue, how venues run it, and where to start ===== */
// Copy is deliberately plain and claim-light: it says how and why operators use each modality, not what it treats.
const GD_VENUES = [
  ['gym','Gyms & fitness clubs','fitness-centers'],
  ['studio','Recovery studios','recovery-wellness-studios'],
  ['team','Sports teams','pro-sports-performance'],
  ['hotel','Hotels & spas','luxury-hospitality'],
  ['clinic','Clinics','recovery-wellness-studios'],
  ['home','Residential & corporate','multi-family-housing'],
];
const GD = {
  gym: {
    lead:'Members train hard four or five days a week. Recovery gives them a reason to come in on the other two, and something they can’t get at a budget gym.',
    light:['Short, easy and fits after a session','A red light session takes about 10–20 minutes, needs no change of clothes and suits the end of a workout. That makes it one of the easiest recovery add-ons to sell into a membership.','After training','10–20 min'],
    heat:['The one members already ask for','Sauna is the most familiar recovery habit. Infrared runs at a gentler 135–149°F, so more people can stay in longer, and a four- or eight-person cabin serves a crowd.','After training, or on rest days','20–30 min'],
    ice:['Cold without the mess','Members want the cold-plunge experience, but a shared tub means water testing and wet floors. A dry cold room gives the cold with none of the upkeep, several people at once.','After training, or alternating with sauna','3–10 min'],
    air:['A premium tier, with medical oversight','Hyperbaric sessions are longer and higher-touch. In gyms they usually sit in a premium tier or a partner clinic, and in the US they need a prescription and a trained operator.','On rest days','60–90 min'],
  },
  studio: {
    lead:'Recovery is the product. The mix and the flow between rooms decide how many people you can serve an hour, and how much each visit is worth.',
    light:['Easy to stack into a visit','Red light is quick and solo, so it slots between other sessions and lifts the value of a visit without holding up a room.','Anywhere in a visit','10–20 min'],
    heat:['The anchor of contrast therapy','Heat and cold together is the ritual people book for. A cabin for four to eight keeps groups moving through on the hour.','Paired with cold','15–30 min'],
    ice:['The other half of contrast','A dry cold room lets groups go straight from sauna to cold and back, with no water to change between guests.','Between heat rounds','3–5 min'],
    air:['The high-value session','Hyperbaric is the longest and highest-priced session in most studios. It needs medical oversight and a trained operator, and it is usually booked on its own.','On its own','60–90 min'],
  },
  team: {
    lead:'Recovery is part of the training plan. What matters is getting a whole squad through between sessions, and fitting around travel and game days.',
    ice:['A whole squad at once','An eight-person cold room turns ice baths into a quick group routine, with no filling, draining or bags of ice.','After training and games','3–10 min'],
    heat:['Easy on rest days','Sauna sessions are simple to programme for rest days and quieter weeks, and a large cabin takes a group.','Rest days','20–30 min'],
    light:['Targeted and quick','Red light is used on specific areas between sessions, and a panel system fits in a treatment room.','Between sessions','10–20 min'],
    air:['Under the team’s medical staff','Teams use hyperbaric under their own doctors and physios. It is programmed per athlete, not offered as open access.','As prescribed','60–90 min'],
  },
  hotel: {
    lead:'Guests want a spa experience that feels special but doesn’t need a therapist on every booking.',
    heat:['The heart of the spa','A statement sauna is what guests photograph. Charred cedar or a custom traditional build sets the tone of the space.','Any time of day','20–30 min'],
    ice:['Contrast without a plunge pool','A dry cold room pairs with the sauna for a contrast circuit, with no pool plant or water chemistry to manage.','With the sauna','3–5 min'],
    light:['A bookable treatment','A red light bed needs no hands-on time during a session, so it can be sold as a treatment without adding therapist hours.','Pre- or post-spa','10–20 min'],
    air:['Only with medical partners','Hyperbaric belongs in a medically supervised wellness programme, not an open-access spa.','Supervised programmes','60–90 min'],
  },
  clinic: {
    lead:'Clinics add recovery equipment to extend care between appointments and add a service patients can book on their own.',
    air:['Where hyperbaric belongs','Clinics already have the medical oversight hyperbaric needs, and it sits alongside the care they already give.','As directed by a clinician','60–90 min'],
    light:['Runs between appointments','Red light sessions need no hands-on time, so patients can book them around treatment.','Around treatment','10–20 min'],
    ice:['Cold without the tub','A dry cold room gives patients cold exposure with no water to manage and no slip risk.','As directed','3–10 min'],
    heat:['A gentle heat option','Infrared heat is gentler than a traditional sauna, which suits a wider range of patients.','As directed','15–30 min'],
  },
  home: {
    lead:'In apartments and offices, recovery is an amenity. It has to run itself, be booked from an app and look good on a tour.',
    heat:['The amenity people use','A sauna gets used most days, and residents and staff book it from their phones.','Evenings and weekends','20–30 min'],
    light:['Small footprint, easy to run','A panel system fits in a small room and needs nothing but a power outlet.','Any time','10–20 min'],
    ice:['Cold with no upkeep','A dry cold room needs no plumbing or water treatment, which building managers appreciate.','With the sauna','3–10 min'],
    air:['Usually not the right fit','Hyperbaric needs medical oversight, so it rarely suits an unsupervised amenity space.','—','—'],
  },
};
const GD_ORDER = { gym:['light','heat','ice','air'], studio:['heat','ice','light','air'], team:['ice','heat','light','air'], hotel:['heat','ice','light','air'], clinic:['air','light','ice','heat'], home:['heat','light','ice','air'] };
let gdVenue = 'gym';
let gdCards = function(v){
  const g = GD[v];
  return GD_ORDER[v].map(m => { const [h, p, when, len] = g[m]; const mod = D.modalities[m];
    const vn = GD_VENUES.find(x => x[0] === v)[1].toLowerCase();
    return `<article class="gd-card mod-${m}"><div class="bar"></div><p class="eyebrow acc">${mod.label}</p><h3>${h}</h3><p class="gd-p">${p}</p>
      <dl class="gd-dl"><div><dt>When</dt><dd>${when}</dd></div><div><dt>Session</dt><dd>${len}</dd></div></dl>
      <a class="gd-go" href="#/products/${mod.category}">See ${mod.name.toLowerCase()} →</a></article>`; }).join('');
}
let gdSection = function(full){
  const sol = D.solutions.find(s => s.id === GD_VENUES.find(x => x[0] === gdVenue)[2]);
  return `<section class="sec gd${full?' gd-full':''}" id="gd"><div class="wrap">
    ${full?'':'<p class="eyebrow">Where recovery fits</p>'}<h2 class="gd-h">${full?'Why recovery works where it does.':'Why each modality earns its place.'}</h2>
    <p class="gd-intro muted">Pick your kind of venue. We’ll show how operators like you use each one, when in the day, and for how long.</p>
    <div class="gd-pills" role="tablist">${GD_VENUES.map(([k,l]) => `<button type="button" role="tab" data-gd="${k}" aria-selected="${k===gdVenue}">${l}</button>`).join('')}</div>
    <p class="gd-lead">${GD[gdVenue].lead}</p>
    <div class="gd-grid">${gdCards(gdVenue)}</div>
    <div class="gd-foot"><a href="#/contact" class="btn btn-p">Book a call</a>${sol?`<a class="gd-sol" href="#/solutions/${sol.id}">More on ${esc(sol.label.toLowerCase())} →</a>`:''}</div>
    <p class="note gd-note">General information about how venues use recovery equipment, not medical advice. Hyperbaric chambers are Class II medical devices in the US and require a prescription.</p>
  </div></section>`;
}
document.addEventListener('click', e => { const b = e.target.closest('[data-gd]'); if (!b) return; gdVenue = b.dataset.gd; const s = document.getElementById('gd'); if (!s) return; const full = s.classList.contains('gd-full'); const y = s.getBoundingClientRect().top; s.outerHTML = gdSection(full); const n = document.getElementById('gd'); if (y < 0) n.scrollIntoView(); n.querySelector(`[data-gd="${gdVenue}"]`).focus({ preventScroll:true }); });
pages.guide = () => { const seg = (location.hash.split('/')[2] || ''); if (GD[seg]) gdVenue = seg; return gdSection(true); };
teaserHTML = function(){ return gdSection(false); };
NAV.splice(1, 0, ['Where it fits', '#/guide']);
// "Not sure where to start?" panels offer the guide next to booking a call
(() => {
  const s = document.createElement('style'); s.textContent = `
.gd .gd-h{max-width:22ch;margin-top:10px}.gd-full{padding-top:56px}.gd-full .gd-h{font-size:clamp(34px,5vw,56px);margin-top:0}
.gd-intro{max-width:56ch;margin-top:14px}
.gd-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px}
.gd-pills button{font:inherit;font-size:14px;padding:10px 16px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer}
.gd-pills button[aria-selected=true]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.gd-lead{font-family:var(--key);font-style:italic;font-weight:300;font-size:clamp(19px,2vw,24px);line-height:1.4;color:var(--muted);max-width:52ch;margin:28px 0 24px}
.gd-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.gd-card{border:1px solid var(--line);border-radius:12px;background:var(--card);overflow:hidden;display:flex;flex-direction:column;gap:10px;padding:0 20px 20px}
.gd-card .bar{margin:0 -20px 10px;height:4px}
.gd-card h3{font-size:19px;line-height:1.2}
.gd-p{font-size:14.5px;color:var(--muted);line-height:1.55}
.gd-dl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:4px 0 0;padding-top:10px;border-top:1px solid var(--line)}
.gd-dl dt{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}.gd-dl dd{margin:2px 0 0;font-size:13.5px;font-weight:500}
.gd-dr{display:flex;align-items:center;gap:10px;margin-top:auto;padding:10px;border-radius:10px;background:var(--surf);font-size:13px}
.gd-dr img{width:40px;height:40px;border-radius:50%;object-fit:cover;flex:none}
.gd-dr b{font-weight:500}.gd-dr small{display:block;font-size:11.5px;color:var(--faint)}
.gd-go{font-size:13.5px;font-weight:500}.gd-go:hover{text-decoration:underline;text-underline-offset:4px}
.gd-foot{display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:28px}.gd-sol{font-size:14px;text-decoration:underline;text-underline-offset:4px}
.gd-note{margin-top:18px;max-width:80ch}
@media(max-width:1100px){.gd-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.gd-grid{grid-template-columns:1fr}.gd-pills{flex-wrap:nowrap;overflow-x:auto;margin-inline:-20px;padding-inline:20px;scrollbar-width:none}.gd-pills::-webkit-scrollbar{display:none}.gd-pills button{white-space:nowrap}}`;
  document.head.appendChild(s);
})();

/* ---------- Built out: how venues run each one, what it pairs with, the OneBase options, where to start and a typical day ---------- */
// [how it's run, pairs with (modality key), OneBase products to look at]
const GD_MORE = {
  gym: {
    light:['Members book a slot in the app and start it themselves. It needs a small room or a screened corner and a wipe-down between users.','heat',['lightpanel','lightbed']],
    heat:['Most gyms run open sessions on the hour with a booking cap. Members use it unattended; staff check it at opening and close.','ice',['yakisugi','hemlock','traditional']],
    ice:['Members use it unattended, with a short timer on the door and a clear first-timer guide. No water means no testing log and no wet change area.','heat',['icevault']],
    air:['Usually run through a partner clinician, booked as a premium session with a health screen first.','light',['airfit','airform']],
  },
  studio: {
    light:['Sold as an add-on to any visit. It frees up the sauna and cold room for the next group while one person uses it.','heat',['lightbed','lightpanel']],
    heat:['Booked as a timed contrast session for a small group, usually 45–60 minutes with the cold room.','ice',['yakisugi','traditional','hemlock']],
    ice:['Guests step in between heat rounds. A room for four to eight means a group never waits for a turn.','heat',['icevault']],
    air:['Booked on its own with a trained operator on site. Studios often keep it in a quieter room away from the contrast suite.','light',['airsuite','airform']],
  },
  team: {
    ice:['Programmed by the performance staff after sessions and matches. Players go in together, so the whole squad is done in minutes.','heat',['icevault']],
    heat:['Scheduled for rest days and lighter weeks. A large cabin takes a unit or position group at a time.','ice',['yakisugi','traditional']],
    light:['Used by the physio team in the treatment room, between sessions or before training.','air',['lightpanel','lightbed']],
    air:['Run by the team’s medical staff, per athlete. Duo chambers let staff supervise two players at once.','light',['airsuite','airform']],
  },
  hotel: {
    heat:['Open to spa guests or booked privately. A design-led cabin can be finished to match the rest of the spa.','ice',['traditional','yakisugi']],
    ice:['Part of a self-guided contrast circuit, with timings on the wall. No plunge pool means no plant room and no chemical dosing.','heat',['icevault']],
    light:['Sold on the spa menu as a standalone or add-on treatment, started from the tablet by the guest.','heat',['lightbed']],
    air:['Offered only through a medically supervised wellness programme, often with a partner clinic.','light',['airsuite']],
  },
  clinic: {
    air:['Run by trained staff under clinical direction, with screening before the first session.','light',['airform','airsuite','airfit']],
    light:['Patients book it around their appointments. It needs no hands-on time, so it adds no clinician hours.','air',['lightbed','lightpanel']],
    ice:['Used as directed, with staff nearby. A dry room avoids wet floors in a clinical space.','heat',['icevault']],
    heat:['A gentler infrared cabin, used as directed alongside other care.','ice',['hemlock','yakisugi']],
  },
  home: {
    heat:['Residents or staff book it from the building app. It needs a dedicated circuit and a cleaning check in the daily round.','ice',['hemlock','yakisugi']],
    light:['Booked from the app. A panel system fits in a small wellness room or a corner of the gym.','heat',['lightpanel']],
    ice:['Booked with the sauna as a contrast pair. No water, drains or chemical dosing for the building team.','heat',['icevault']],
    air:['We’d normally steer amenity spaces away from hyperbaric. It suits a supervised clinic better.','',[]],
  },
};
const GD_START = {
  gym:[['lightpanel','Quick to install, fits a small room and easy to sell into membership.'],['yakisugi','The sauna members already ask for, for a group at a time.']],
  studio:[['yakisugi','The heat half of a contrast circuit.'],['icevault','The cold half, with no water to change between groups.']],
  team:[['icevault','A whole squad through cold in minutes after training.'],['yakisugi','Rest-day heat for a group at a time.']],
  hotel:[['traditional','A statement sauna built to match the spa.'],['icevault','Cold for a contrast circuit, without a plunge pool.']],
  clinic:[['airform','A monoplace chamber that sits alongside existing care.'],['lightbed','No clinician time between appointments.']],
  home:[['hemlock','A four-person sauna residents book from their phones.'],['lightpanel','A small-footprint panel for a wellness room.']],
};
const GD_DAY = {
  gym:[['6–9am','Before-work lifters: quick red light before heading out.'],['12–2pm','Lunchtime: sauna for people fitting in a short session.'],['5–8pm','Peak: sauna and cold after classes, booked in the app.'],['Weekends','Rest-day visits, often sauna and cold together.']],
  studio:[['7–9am','Pre-work contrast for regulars.'],['Midday','Longer sessions, hyperbaric and red light.'],['4–8pm','Back-to-back contrast groups on the hour.'],['Weekends','Friends and couples booking together.']],
  team:[['Morning','Red light and prep before training.'],['After training','The whole squad through the cold room.'],['Rest days','Sauna in position groups.'],['Match day +1','Cold, heat and hyperbaric as the medical staff plan it.']],
  hotel:[['Morning','Sauna before breakfast.'],['Afternoon','Contrast circuit between activities.'],['Evening','Red light treatments on the spa menu.'],['Weekends','Day-spa guests and packages.']],
  clinic:[['Appointments','Hyperbaric sessions as directed.'],['Between visits','Red light booked around treatment.'],['As directed','Cold and heat alongside care.']],
  home:[['Before work','Quick red light or cold.'],['Evenings','Sauna, booked from the app.'],['Weekends','The busiest time for the sauna and cold room.']],
};
const gdProd = (id) => D.products.find(p => p.id === id);
const gdThumb = (id) => { const m = { icevault:'cut-icevault-quad', yakisugi:'cut-yakisugi', hemlock:'cut-hemlock', traditional:'trad-after', airfit:'cut2-airfit', airflex:'cut2-airflex', airform:'cut-airform-plus-black', airsuite:'cut2-airsuite-duo', lightbed:'cut-lightbed-black', lightpanel:'cut-lightpanel-quad' }[id]; return m && D.img[m]; };
gdCards = function(v){
  const g = GD[v], more = GD_MORE[v];
  return GD_ORDER[v].map(m => { const [h, p, when, len] = g[m]; const mod = D.modalities[m]; const [run, pair, prods] = more[m];
    const opts = prods.map(id => { const pr = gdProd(id); if (!pr) return ''; const im = gdThumb(id); return `<a class="gd-opt" href="#/products/${pr.category}/${id}">${im?`<img src="${im}" alt="">`:''}<span>OneBase ${esc(pr.name)}</span></a>`; }).join('');
    return `<article class="gd-card mod-${m}"><div class="bar"></div><p class="eyebrow acc">${mod.label}</p><h3>${h}</h3><p class="gd-p">${p}</p>
      <dl class="gd-dl"><div><dt>When</dt><dd>${when}</dd></div><div><dt>Session</dt><dd>${len}</dd></div></dl>
      <details class="gd-more"><summary>How venues run it</summary><p>${run}</p>${pair?`<p class="gd-pair">Pairs well with <b>${D.modalities[pair].label.toLowerCase()}</b>.</p>`:''}${opts?`<div class="gd-opts">${opts}</div>`:''}</details></article>`; }).join('');
};
function gdExtra(v){
  const vl = GD_VENUES.find(x => x[0] === v)[1];
  const start = GD_START[v].map(([id, why]) => { const pr = gdProd(id); if (!pr) return ''; const im = gdThumb(id); return `<a class="gd-start-p" href="#/products/${pr.category}/${id}"><span class="gd-start-im">${im?`<img src="${im}" alt="">`:''}</span><span><b>OneBase ${esc(pr.name)}</b><small>${why}</small></span></a>`; }).join('');
  const day = GD_DAY[v].map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('');
  return `<div class="gd-extra"><div><h3 class="gd-sub">Where most ${esc(vl.toLowerCase())} start</h3><div class="gd-start">${start}</div></div>
    <div><h3 class="gd-sub">A day in the recovery room</h3><ol class="gd-day">${day}</ol></div></div>`;
}
const _gdSection = gdSection;
gdSection = function(full){
  let h = _gdSection(full);
  const vl = GD_VENUES.find(x => x[0] === gdVenue)[1];
  if (full) h = h.replace('<div class="gd-foot">', gdExtra(gdVenue) + '<div class="gd-foot">');
  else h = h.replace('<div class="gd-foot"><a href="#/contact" class="btn btn-p">Book a call</a>', `<div class="gd-foot"><a href="#/guide/${gdVenue}" class="btn btn-p">The full guide for ${esc(vl.toLowerCase())}</a><a href="#/contact" class="btn btn-g">Book a call</a>`);
  return h;
};
(() => { const s = document.createElement('style'); s.textContent = `
.gd-more{border:0;border-top:1px solid var(--line);padding:10px 0 0;margin-top:auto}
.gd-more summary{font-size:13.5px;font-weight:500}
.gd-more p{font-size:14px;color:var(--muted);line-height:1.55;margin-top:8px}
.gd-pair b{color:var(--fg);font-weight:500}
.gd-opts{display:flex;flex-direction:column;gap:6px;margin-top:10px}
.gd-opt{display:flex;align-items:center;gap:10px;font-size:13.5px;font-weight:500;padding:6px;border-radius:8px;background:var(--surf)}
.gd-opt:hover{text-decoration:underline;text-underline-offset:3px}
.gd-opt img{width:44px;height:34px;object-fit:contain;border-radius:4px;flex:none}
.gd-extra{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px;padding-top:36px;border-top:1px solid var(--line)}
.gd-sub{font-size:13px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-bottom:16px}
.gd-start{display:flex;flex-direction:column;gap:10px}
.gd-start-p{display:grid;grid-template-columns:96px 1fr;gap:16px;align-items:center;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--card)}
.gd-start-p:hover b{text-decoration:underline;text-underline-offset:4px}
.gd-start-im{height:72px;display:flex;align-items:center;justify-content:center}.gd-start-im img{max-width:96px;max-height:72px;object-fit:contain;border-radius:4px}
.gd-start-p b{display:block;font-weight:500}.gd-start-p small{font-size:13.5px;color:var(--muted)}
.gd-day{list-style:none;margin:0;padding:0;border-left:2px solid var(--line)}
.gd-day li{position:relative;padding:0 0 18px 20px;display:flex;flex-direction:column;gap:2px}
.gd-day li:before{content:'';position:absolute;left:-6px;top:6px;width:10px;height:10px;border-radius:50%;background:var(--fg)}
.gd-day b{font-weight:500;font-size:14px}.gd-day span{font-size:14px;color:var(--muted)}
.gd-card .gd-go{display:none}
@media(max-width:860px){.gd-extra{grid-template-columns:1fr;gap:32px}}`; document.head.appendChild(s); })();

/* ---------- Tesla pass: one image, one headline, one line, two numbers. No expanders, no timelines. ---------- */
const GD_SHORT = {
  gym:{ lead:'A reason to come in on rest days.',
    light:['Fits after a session','Ten minutes, no change of clothes.'], heat:['What members ask for','A cabin for four to eight at once.'],
    ice:['Cold, without the mess','No water, no testing, no wet floors.'], air:['A premium tier','With medical oversight and a trained operator.'] },
  studio:{ lead:'Recovery is the product. Flow is everything.',
    heat:['The anchor of contrast','Groups move through on the hour.'], ice:['The other half','Straight from sauna to cold and back.'],
    light:['Stacks into any visit','Solo, quick, adds value per visit.'], air:['The high-value session','Booked on its own, with an operator.'] },
  team:{ lead:'A whole squad, between sessions.',
    ice:['A whole squad at once','No filling, draining or bags of ice.'], heat:['Rest-day heat','A position group at a time.'],
    light:['Targeted and quick','Fits in the treatment room.'], air:['Under your medical staff','Programmed per athlete.'] },
  hotel:{ lead:'A spa that doesn’t add therapist hours.',
    heat:['The heart of the spa','The room guests photograph.'], ice:['Contrast, no plunge pool','No plant room, no chemicals.'],
    light:['A bookable treatment','Started from the tablet.'], air:['With medical partners','Supervised programmes only.'] },
  clinic:{ lead:'More care between appointments.',
    air:['Where hyperbaric belongs','Alongside the care you already give.'], light:['Runs between visits','No clinician time needed.'],
    ice:['Cold, without the tub','No water, no slip risk.'], heat:['Gentle heat','Infrared suits more patients.'] },
  home:{ lead:'An amenity residents book themselves.',
    heat:['The one people use','Booked from the building app.'], light:['Small footprint','A corner and a power outlet.'],
    ice:['No upkeep','No plumbing, no water treatment.'], air:['Usually not the fit','Better in a supervised clinic.'] },
};
const GD_IMG = { air:'as-cover', ice:'render-icevault-gym', heat:'render-yakisugi-spa', light:'render-lightbed-studio' };
const GD_IMG_V = { hotel:{ heat:'trad-after' }, studio:{ ice:'render-icevault-studio' }, team:{ air:'as-pair' }, clinic:{ air:'photo-hbot-inside', light:'photo-lightbed' }, home:{ heat:'photo-hemlock', light:'photo-lightpanel' } };
gdCards = function(v){
  return GD_ORDER[v].map(m => { const [h, line] = GD_SHORT[v][m]; const [, , when, len] = GD[v][m]; const mod = D.modalities[m];
    const img = D.img[(GD_IMG_V[v] || {})[m] || GD_IMG[m]] || D.img[GD_IMG[m]];
    return `<a class="gd-tile mod-${m}" href="#/products/${mod.category}">${img?`<img src="${img}" alt="" loading="lazy">`:''}<span class="gd-veil"></span>
      <span class="gd-t"><span class="gd-mod">${mod.label}</span><b>${h}</b><span class="gd-line">${line}</span>
      <span class="gd-stats"><span><i>${len}</i>session</span><span><i>${when.split(',')[0]}</i>when</span></span></span></a>`; }).join('');
};
gdSection = function(full){
  const v = gdVenue, vl = GD_VENUES.find(x => x[0] === v)[1];
  const start = full ? `<div class="gd-startrow"><p class="gd-sub">Most ${esc(vl.toLowerCase())} start with</p><div>${GD_START[v].map(([id]) => { const pr = gdProd(id); if (!pr) return ''; const im = gdThumb(id); return `<a class="gd-sp" href="#/products/${pr.category}/${id}">${im?`<img src="${im}" alt="">`:''}<b>OneBase ${esc(pr.name)}</b></a>`; }).join('')}</div></div>` : '';
  return `<section class="sec gd gd2${full?' gd-full':''}" id="gd"><div class="wrap">
    <div class="gd-top"><div><p class="eyebrow">Where it fits</p><h2 class="gd-h">${esc(GD_SHORT[v].lead)}</h2></div>
    <div class="gd-pills" role="tablist">${GD_VENUES.map(([k,l]) => `<button type="button" role="tab" data-gd="${k}" aria-selected="${k===v}">${l}</button>`).join('')}</div></div>
    <div class="gd-tiles">${gdCards(v)}</div>${start}
    <div class="gd-foot"><a href="#/contact" class="btn btn-p">Book a call</a>${full?'':`<a href="#/guide/${v}" class="btn btn-g">More for ${esc(vl.toLowerCase())}</a>`}</div>
    <p class="note gd-note">Not medical advice. Hyperbaric chambers are Class II medical devices in the US and need a prescription.</p>
  </div></section>`;
};
(() => { const s = document.createElement('style'); s.textContent = `
.gd2 .gd-top{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.gd2 .gd-h{font-size:clamp(30px,4.2vw,52px);letter-spacing:-.03em;line-height:1.05;max-width:16ch;margin-top:8px}
.gd2 .gd-pills{margin-top:0;max-width:640px;justify-content:flex-end}
.gd2 .gd-pills button{font-size:13px;padding:8px 14px}
.gd-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:32px}
.gd-tile{position:relative;aspect-ratio:3/4;border-radius:14px;overflow:hidden;background:var(--deep,#1f1f1f);color:#fff;display:flex;align-items:flex-end}
.gd-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.2,.7,.2,1)}
.gd-tile:hover img{transform:scale(1.04)}
.gd-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.78) 100%)}
.gd-t{position:relative;padding:20px;display:flex;flex-direction:column;gap:6px;width:100%}
.gd-mod{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--acc,#fff)}
.gd-t b{font-size:clamp(19px,1.7vw,24px);font-weight:500;letter-spacing:-.02em;line-height:1.15}
.gd-line{font-size:14px;color:rgba(255,255,255,.8)}
.gd-stats{display:flex;gap:22px;margin-top:10px;padding-top:12px;border-top:1px solid rgba(255,255,255,.2);font-size:11px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.12em}
.gd-stats i{display:block;font-style:normal;font-size:15px;color:#fff;text-transform:none;letter-spacing:0;font-weight:500}
.gd-startrow{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-top:32px}
.gd-startrow .gd-sub{margin:0}
.gd-startrow>div{display:flex;gap:12px;flex-wrap:wrap}
.gd-sp{display:flex;align-items:center;gap:12px;padding:8px 18px 8px 8px;border:1px solid var(--line);border-radius:999px;background:var(--card);font-size:14px}
.gd-sp img{width:52px;height:40px;object-fit:contain}.gd-sp b{font-weight:500}.gd-sp:hover b{text-decoration:underline;text-underline-offset:4px}
@media(max-width:1000px){.gd-tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.gd2 .gd-pills{justify-content:flex-start}}
@media(max-width:600px){.gd-tiles{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:78%;overflow-x:auto;scroll-snap-type:x mandatory;margin-inline:-20px;padding-inline:20px;scrollbar-width:none}.gd-tiles::-webkit-scrollbar{display:none}.gd-tile{scroll-snap-align:start}}`; document.head.appendChild(s); })();
(() => { const s = document.createElement('style'); s.textContent = `
.gd2 .gd-top{flex-direction:column;align-items:flex-start;gap:20px}
.gd2 .gd-pills{justify-content:flex-start;max-width:none}
.gd-mod{color:rgba(255,255,255,.75)}`; document.head.appendChild(s); })();

/* ---------- Copy, rewritten plainly: what each one is used for, and why it suits this venue ---------- */
// [what it's used for, why it suits this venue, session, when]
Object.assign(GD_SHORT, {
  gym:{ lead:'Give members a reason to come in on rest days.',
    light:['Muscle recovery after training','Ten minutes on a bed after a session. No need to change.','10–20 min','After training'],
    heat:['The post-workout sauna','Most members already have a sauna habit. Give them one worth booking.','20–30 min','After training'],
    ice:['Cold after hard sessions','Used to take the edge off soreness. A dry room means no tub to clean.','3–10 min','After training'],
    air:['A premium add-on','Pressurised oxygen sessions, run with a clinician. Priced above membership.','60–90 min','Rest days'] },
  studio:{ lead:'Contrast therapy, done properly.',
    heat:['The hot half of contrast','Sauna, then cold, repeated. The session people come back for.','15–20 min','Each round'],
    ice:['The cold half','A few minutes cold between sauna rounds, up to eight at once.','3–5 min','Between rounds'],
    light:['An add-on to any visit','A quick solo session that raises the value of each booking.','10–20 min','Any time'],
    air:['Your headline session','Hyperbaric oxygen. The longest, highest-priced booking, run by trained staff.','60–90 min','Booked alone'] },
  team:{ lead:'Recover the whole squad between sessions.',
    ice:['Post-game cold','The squad cools down together. No ice to buy, no tubs to drain.','3–10 min','After games'],
    heat:['Heat on light days','Used on rest days, and to get ready for games in hot weather.','20–30 min','Rest days'],
    light:['Physio-room recovery','Targeted on sore areas between sessions.','10–20 min','Between sessions'],
    air:['Led by your medical team','Hyperbaric oxygen, programmed per player by your doctors.','60–90 min','As prescribed'] },
  hotel:{ lead:'A spa that doesn’t need a therapist for every booking.',
    heat:['The spa’s centrepiece','The sauna guests book first, and photograph.','20–30 min','Any time'],
    ice:['Hot-cold circuits','Pair it with the sauna. No plunge pool to maintain.','3–5 min','With the sauna'],
    light:['A treatment with no hands-on time','Add it to the spa menu without adding therapist hours.','10–20 min','Any time'],
    air:['Wellness programmes','Best offered with a medical partner, not as open access.','60–90 min','Supervised'] },
  clinic:{ lead:'Extend care between appointments.',
    air:['Hyperbaric oxygen therapy','Delivered under clinical supervision, alongside your treatment plans.','60–90 min','As directed'],
    light:['Red and near-infrared light','Booked around appointments, with no clinician time needed.','10–20 min','Around visits'],
    ice:['Whole-body cold','Cold therapy without ice baths or wet floors.','3–10 min','As directed'],
    heat:['Infrared heat','A lower air temperature than a traditional sauna, so more patients can use it.','15–30 min','As directed'] },
  home:{ lead:'Amenities residents book themselves.',
    heat:['The everyday sauna','The amenity residents actually use, booked from the building app.','20–30 min','Evenings'],
    light:['A red light room','Needs little more than a corner and a power point.','10–20 min','Any time'],
    ice:['A cold room','Cold exposure with no plumbing, water treatment or pool contractor.','3–10 min','With the sauna'],
    air:['Leave this one out','Hyperbaric needs medical oversight, so it doesn’t suit an unsupervised space.','—','—'] },
});
gdCards = function(v){
  return GD_ORDER[v].map(m => { const [h, line, len, when] = GD_SHORT[v][m]; const mod = D.modalities[m];
    const img = D.img[(GD_IMG_V[v] || {})[m] || GD_IMG[m]] || D.img[GD_IMG[m]];
    return `<a class="gd-tile mod-${m}" href="#/products/${mod.category}">${img?`<img src="${img}" alt="" loading="lazy">`:''}<span class="gd-veil"></span>
      <span class="gd-t"><span class="gd-mod">${mod.name}</span><b>${h}</b><span class="gd-line">${line}</span>
      <span class="gd-stats"><span><i>${len}</i>session</span><span><i>${when}</i>when</span></span></span></a>`; }).join('');
};
(() => { const s = document.createElement('style'); s.textContent = `.gd-veil{background:linear-gradient(180deg,rgba(0,0,0,0) 22%,rgba(0,0,0,.55) 50%,rgba(0,0,0,.88) 100%)}`; document.head.appendChild(s); })();

/* ---------- Detail pages: #/guide/<venue>/<modality> — how this one is used in this kind of venue, before any product ---------- */
const GD_WHAT = {
  light:{ name:'Red light', what:'Red and near-infrared light from an LED bed or panel. You lie or stand in front of it for 10–20 minutes.', feel:'No heat or cold to put up with, so it’s the easiest one for first-timers.' },
  heat:{ name:'Sauna', what:'Dry heat you sit in for 15–30 minutes. Infrared runs at 135–149°F; a traditional stone-heater sauna runs hotter.', feel:'The most familiar recovery habit. People already know what to do.' },
  ice:{ name:'Cold', what:'Whole-body cold for a few minutes at a time. OneBase’s cold room holds 32–40°F with electric refrigeration, with no water.', feel:'Short and intense. Most people build up from a minute or two.' },
  air:{ name:'Hyperbaric', what:'Sitting or lying in a pressurised chamber, usually for 60–90 minutes. Medical-grade chambers deliver oxygen at higher pressure; soft chambers use air at lower pressure.', feel:'Quiet and long. In the US it is a prescription medical device, run under medical supervision.' },
};
const GD_OFFER = {
  gym:[['Premium tier','Include it in a higher membership level.'],['Per session','Book and pay in the app.'],['Session packs','Sell 5 or 10 at a time.']],
  studio:[['Per session','The core booking.'],['Unlimited membership','Monthly access, capped per day.'],['Add-on','Upsell at check-in.']],
  team:[['In the program','Scheduled by the performance staff.'],['By position group','Rotate groups through after training.'],['Per athlete','For medical-led sessions.']],
  hotel:[['Spa menu','A bookable treatment.'],['Room packages','Included with wellness stays.'],['Day passes','For non-resident guests.']],
  clinic:[['Treatment plans','Part of a course of care.'],['Session packs','Prepaid blocks.'],['Standalone','Booked on its own.']],
  home:[['Included amenity','Part of rent or membership.'],['App booking','Time slots with a weekly cap.'],['Premium amenity','A small monthly fee.']],
};
const GD_KIT = { light:['lightbed','lightpanel'], heat:['yakisugi','traditional','hemlock'], ice:['icevault'], air:['airform','airsuite','airfit'] };
const GD_KIT_CODE = { lightbed:'LB', lightpanel:'LP4', yakisugi:'YK4', traditional:null, hemlock:'HM4', icevault:'IV4', airform:'AFP', airsuite:'AS2', airfit:'AFT' };
function gdDetail(v, m){
  const vl = GD_VENUES.find(x => x[0] === v)[1], mod = D.modalities[m], w = GD_WHAT[m];
  const [h, line, len, when] = GD_SHORT[v][m]; const [run, pair] = GD_MORE[v][m];
  const img = D.img[(GD_IMG_V[v] || {})[m] || GD_IMG[m]] || D.img[GD_IMG[m]];
  const kit = (GD_KIT[m] || []).map(id => { const pr = gdProd(id); if (!pr) return ''; const c = CAT[GD_KIT_CODE[id]]; const im = gdThumb(id);
    const cap = c ? `${c.n} ${c.n>1?'people':'person'} at a time · ${Math.round(c.w/12*10)/10} × ${Math.round(c.d/12*10)/10} ft` : 'Built to fit your room';
    return `<a class="gdd-kit" href="#/products/${pr.category}/${id}">${im?`<img src="${im}" alt="">`:''}<span><b>OneBase ${esc(pr.name)}</b><small>${cap}</small></span></a>`; }).join('');
  const others = GD_ORDER[v].filter(x => x !== m).map(x => `<a href="#/guide/${v}/${x}" class="gdd-other mod-${x}"><span>${D.modalities[x].label}</span>${esc(GD_SHORT[v][x][0])} →</a>`).join('');
  const skip = m === 'air' && v === 'home';
  return `<article class="gdd mod-${m}">
    <header class="gdd-hero">${img?`<img src="${img}" alt="">`:''}<span class="gdd-veil"></span>
      <div class="wrap gdd-hero-t"><a class="gdd-back" href="#/guide/${v}">← ${esc(vl)}</a><p class="gdd-eb">${esc(w.name)} in ${esc(vl.toLowerCase())}</p><h1>${esc(h)}</h1><p class="gdd-sub">${esc(line)}</p>
      <div class="gdd-stats"><span><i>${len}</i>per session</span><span><i>${esc(when)}</i>best time</span>${pair?`<span><i>${D.modalities[pair].label}</i>pairs with</span>`:''}</div></div></header>
    <div class="wrap gdd-body">
      <section class="gdd-sec"><p class="gdd-n">01</p><div><h2>What it is</h2><p>${w.what}</p><p class="muted">${w.feel}</p></div></section>
      <section class="gdd-sec"><p class="gdd-n">02</p><div><h2>How ${esc(vl.toLowerCase())} run it</h2><p>${run}</p></div></section>
      ${skip?'':`<section class="gdd-sec"><p class="gdd-n">03</p><div><h2>How to offer it</h2><div class="gdd-offer">${GD_OFFER[v].map(([t,d]) => `<div><b>${t}</b><span>${d}</span></div>`).join('')}</div></div></section>
      <section class="gdd-sec"><p class="gdd-n">04</p><div><h2>The equipment</h2><div class="gdd-kits">${kit}</div></div></section>`}
      <section class="gdd-sec gdd-talk"><p class="gdd-n">${skip?'03':'05'}</p><div><h2>Talk it through</h2><p class="muted">A specialist can walk you through how venues like yours set it up. No obligation.</p><div class="row" style="margin-top:14px"><a href="#/contact" class="btn btn-p">Book a call</a></div></div></section>
      <nav class="gdd-others"><p class="gd-sub">Also in ${esc(vl.toLowerCase())}</p><div>${others}</div></nav>
      <p class="note gd-note">General information about how venues use this equipment, not medical advice.${m==='air'?' Hyperbaric chambers are Class II medical devices in the US and require a prescription.':''}</p>
    </div></article>`;
}
pages.guide = () => { const seg = location.hash.split('/'); const v = seg[2], m = seg[3];
  if (GD[v]) gdVenue = v;
  if (GD[v] && GD_SHORT[v][m]) return gdDetail(v, m);
  return gdSection(true); };
// tiles now open the detail page, not the product range
const _gdCardsTesla = gdCards;
gdCards = function(v){ return _gdCardsTesla(v).replace(/<a class="gd-tile mod-(\w+)" href="#\/products\/[^"]+"/g, (s, m) => `<a class="gd-tile mod-${m}" href="#/guide/${v}/${m}"`); };
(() => { const s = document.createElement('style'); s.textContent = `
.gdd-hero{position:relative;min-height:min(78vh,720px);display:flex;align-items:flex-end;color:#fff;background:var(--deep,#1f1f1f);overflow:hidden}
.gdd-hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.gdd-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.15) 40%,rgba(0,0,0,.8))}
.gdd-hero-t{position:relative;padding-block:120px 56px;width:100%}
.gdd-back{font-size:14px;color:rgba(255,255,255,.8)}.gdd-back:hover{color:#fff}
.gdd-eb{margin-top:28px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.75)}
.gdd h1{color:#fff;font-size:clamp(40px,6vw,76px);letter-spacing:-.035em;line-height:1.02;max-width:14ch;margin-top:10px}
.gdd-sub{font-size:clamp(17px,1.6vw,21px);color:rgba(255,255,255,.85);max-width:44ch;margin-top:14px}
.gdd-stats{display:flex;gap:40px;flex-wrap:wrap;margin-top:32px;padding-top:20px;border-top:1px solid rgba(255,255,255,.25);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.65)}
.gdd-stats i{display:block;font-style:normal;font-size:clamp(20px,2vw,28px);font-weight:500;letter-spacing:-.02em;text-transform:none;color:#fff;margin-bottom:2px}
.gdd-body{padding-block:24px 72px;max-width:980px}
.gdd-sec{display:grid;grid-template-columns:80px 1fr;gap:20px;padding:40px 0;border-bottom:1px solid var(--line)}
.gdd-n{font-size:13px;color:var(--faint);letter-spacing:.1em;padding-top:8px}
.gdd-sec h2{font-size:clamp(24px,2.6vw,32px);margin-bottom:12px}
.gdd-sec p{font-size:17px;line-height:1.6;max-width:60ch}.gdd-sec p+p{margin-top:8px}
.gdd-offer{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:4px}
.gdd-offer div{padding:16px;border:1px solid var(--line);border-radius:12px;display:flex;flex-direction:column;gap:4px}
.gdd-offer b{font-weight:500}.gdd-offer span{font-size:14px;color:var(--muted)}
.gdd-kits{display:flex;flex-direction:column;gap:10px}
.gdd-kit{display:grid;grid-template-columns:88px 1fr;gap:16px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:12px}
.gdd-kit img{width:88px;height:64px;object-fit:contain}.gdd-kit b{display:block;font-weight:500}.gdd-kit small{font-size:13.5px;color:var(--faint)}
.gdd-kit:hover b{text-decoration:underline;text-underline-offset:4px}
.gdd-others{padding-top:36px}.gdd-others>div{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.gdd-other{padding:16px;border-radius:12px;background:var(--surf);font-weight:500;font-size:15px;display:flex;flex-direction:column;gap:6px}
.gdd-other span{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--deep,var(--faint));font-weight:500}
.gdd-other:hover{background:var(--line)}
@media(max-width:700px){.gdd-sec{grid-template-columns:1fr;gap:6px;padding:28px 0}.gdd-offer,.gdd-others>div{grid-template-columns:1fr}.gdd-stats{gap:24px}}`; document.head.appendChild(s); })();

/* ---------- "The science" panel on each detail page: mechanism, key studies (verified citations) and honest limits ---------- */
const GD_SCI = {
  light:{ how:'Red (about 630–670 nm) and near-infrared (about 800–950 nm) light is absorbed by cytochrome c oxidase, an enzyme in the mitochondria. The leading theory is that this helps cells make more energy (ATP) and triggers short-lived signals linked to lower inflammation. Dose matters: too little does nothing, and too much can cancel the effect.',
    studies:[
      ['Vanin et al., 2018','Lasers in Medical Science','Across 39 trials, light applied to muscles showed some effect on performance and fatigue, with evidence rated very low to moderate quality.','https://doi.org/10.1007/s10103-017-2368-6'],
      ['Leal-Junior et al., 2015','Lasers in Medical Science','Light applied before exercise modestly increased time to exhaustion and repetitions versus placebo.','https://doi.org/10.1007/s10103-013-1465-4'],
      ['Wunsch & Matuschka, 2014','Photomedicine and Laser Surgery','In a controlled trial using full-body light units, treated participants had improved skin roughness and collagen density.','https://doi.org/10.1089/pho.2013.3616'],
      ['Álvarez-Martínez et al., 2025','Lasers in Medical Science','A review of whole-body light found possible sleep benefits, but no effect on fatigue markers or exercise performance.','https://doi.org/10.1007/s10103-025-04318-w'],
    ],
    limits:'Most positive performance results come from lasers or LED clusters on specific muscles. Whole-body evidence is thinner and points mainly to skin and possibly sleep.' },
  heat:{ how:'Heat raises skin and core temperature. Heart rate rises, blood vessels in the skin widen and you sweat, a load on the cardiovascular system similar to moderate exercise. Repeated sessions lead to heat adaptation, including more blood plasma. Infrared cabins warm the body directly at lower air temperatures than a traditional sauna.',
    studies:[
      ['Laukkanen et al., 2015','JAMA Internal Medicine','In 2,315 Finnish men followed for about 21 years, sauna 4–7 times a week was associated with lower cardiovascular and all-cause mortality than once a week.','https://doi.org/10.1001/jamainternmed.2014.8187'],
      ['Laukkanen et al., 2018','Mayo Clinic Proceedings','A review linking regular Finnish sauna with lower blood pressure, less arterial stiffness and better blood-vessel function.','https://doi.org/10.1016/j.mayocp.2018.04.008'],
      ['Scoon et al., 2007','Journal of Science and Medicine in Sport','Three weeks of post-training sauna increased runners’ time to exhaustion and plasma volume.','https://doi.org/10.1016/j.jsams.2006.06.009'],
      ['Mero et al., 2015','SpringerPlus','A far-infrared sauna session after endurance training was followed by better jump performance than no sauna.','https://doi.org/10.1186/s40064-015-1093-5'],
    ],
    limits:'The long-term health findings are observational, from Finnish men, and can’t prove cause and effect. Recovery and infrared-specific trials are small and short.' },
  ice:{ how:'Cold narrows blood vessels and lowers tissue temperature, which may limit swelling and dull the sensation of soreness. It also triggers a strong release of noradrenaline, linked to alertness and mood. Water pulls heat away far faster than air, so a dry cold room at 32–40°F is a milder, more tolerable dose than an ice bath or a −100°C cryotherapy chamber.',
    studies:[
      ['Bleakley et al., 2012','Cochrane Database of Systematic Reviews','Across 17 small trials, cold-water immersion reduced muscle soreness 24–96 hours after exercise compared with passive rest.','https://doi.org/10.1002/14651858.CD008262.pub2'],
      ['Machado et al., 2016','Sports Medicine','Cold-water immersion was slightly better than passive recovery for soreness, best at 11–15°C for 11–15 minutes.','https://doi.org/10.1007/s40279-015-0431-7'],
      ['Šrámek et al., 2000','European Journal of Applied Physiology','Immersion in 14°C water raised noradrenaline by 530% and dopamine by 250%.','https://doi.org/10.1007/s004210050065'],
      ['Roberts et al., 2015','The Journal of Physiology','Cold-water immersion straight after every strength session blunted gains in muscle size and strength over 12 weeks.','https://doi.org/10.1113/JP270570'],
    ],
    limits:'The research tests cold water or extreme-cold chambers, not cold air at 32–40°F. It mostly measures how sore people feel. Straight after strength training, regular cold may reduce muscle gains, so timing matters.' },
  air:{ how:'Under pressure, more oxygen dissolves directly into the blood plasma (Henry’s law), raising oxygen levels in tissue beyond what red blood cells alone can carry. Medical hyperbaric treatment uses 100% oxygen at about 2–3 atmospheres. Soft chambers run at lower pressure, around 1.3 atmospheres, with air.',
    studies:[
      ['Ortega et al., 2021','Medicina','A review of how hyperbaric oxygen raises tissue oxygen and its effects on infection, inflammation and new blood vessel growth.','https://doi.org/10.3390/medicina57090864'],
      ['Kranke et al., 2015','Cochrane Database of Systematic Reviews','In diabetic foot ulcers, hyperbaric oxygen improved healing at 6 weeks, but not at long-term follow-up.','https://doi.org/10.1002/14651858.CD004123.pub4'],
      ['Luo et al., 2026','Archives of Physical Medicine and Rehabilitation','Across 10 trials using clinical protocols, hyperbaric oxygen sped recovery from exercise-induced muscle injury but did not reduce soreness overall.','https://doi.org/10.1016/j.apmr.2025.07.017'],
      ['Undersea & Hyperbaric Medical Society, 2018','Position statement','Soft chambers under 1.4 atmospheres are FDA-cleared for acute mountain sickness only, and the Society knows of no reliable evidence of other therapeutic effects at that pressure.','https://uhms.org/images/Position-Statements/UHMS_Position_Statement_LP_chambers_revised.pdf'],
    ],
    limits:'The established medical uses rely on 100% oxygen at 2–3 atmospheres under medical supervision. Evidence for sports recovery is small and mixed, and there is no reliable evidence for mild pressure with air.' },
};
function gdSci(m){
  const s = GD_SCI[m]; if (!s) return '';
  return `<details class="gdd-sci"><summary><span>The science</span><em>Show</em></summary>
    <div class="gdd-sci-b"><h3>How it works</h3><p>${s.how}</p>
    <h3>Key research</h3><ol class="gdd-refs">${s.studies.map(([who, where, what, url]) => `<li><p>${what}</p><a href="${url}" target="_blank" rel="noopener">${who} · <i>${where}</i> ↗</a></li>`).join('')}</ol>
    <h3>What the evidence doesn’t show yet</h3><p>${s.limits}</p></div></details>`;
}
const _gdDetail = gdDetail;
gdDetail = function(v, m){ return _gdDetail(v, m).replace(/(<section class="gdd-sec"><p class="gdd-n">01<\/p><div><h2>What it is<\/h2>[\s\S]*?)(<\/div><\/section>)/, (all, a, b) => a + gdSci(m) + b); };
document.addEventListener('toggle', e => { const d = e.target; if (!d.classList || !d.classList.contains('gdd-sci')) return; const em = d.querySelector('summary em'); if (em) em.textContent = d.open ? 'Hide' : 'Show'; }, true);
(() => { const s = document.createElement('style'); s.textContent = `
.gdd-sci{margin-top:22px;border:1px solid var(--line);border-radius:14px;background:var(--surf);padding:0}
.gdd-sci summary{list-style:none;display:flex;justify-content:space-between;align-items:center;padding:16px 20px;cursor:pointer;font-weight:500;font-size:16px}
.gdd-sci summary::after{content:none}.gdd-sci summary::-webkit-details-marker{display:none}
.gdd-sci summary em{font-style:normal;font-size:13px;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:4px 12px;background:var(--bg)}
.gdd-sci-b{padding:4px 20px 20px}
.gdd-sci h3{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);font-weight:500;margin:16px 0 8px}
.gdd-sci p{font-size:15px!important;line-height:1.6}
.gdd-refs{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:12px}
.gdd-refs li p{margin:0}
.gdd-refs a{font-size:13px;color:var(--muted);text-decoration:underline;text-underline-offset:3px}
.gdd-refs a i{font-style:italic}`; document.head.appendChild(s); })();
// Tile and page copy kept in line with what the research supports
Object.assign(GD_SHORT.gym, { light:['The easy add-on','Ten minutes, no change of clothes. Popular for skin and winding down.','10–20 min','After training'],
  ice:['A short, sharp cold hit','A few minutes of cold after a hard session. No tub to clean.','3–10 min','After training'],
  air:['A premium add-on','Pressurised chamber sessions, run with a clinician. Priced above membership.','60–90 min','Rest days'] });
Object.assign(GD_SHORT.studio, { air:['Your headline session','Hyperbaric sessions, the longest booking of the day, run by trained staff.','60–90 min','Booked alone'] });
Object.assign(GD_SHORT.team, { light:['Physio-room light','Used by the physio team between sessions.','10–20 min','Between sessions'],
  air:['Led by your medical team','Hyperbaric, programmed per player by your doctors.','60–90 min','As prescribed'] });

/* ---------- Drop-down detail for section 02 (running it) and 03 (offering it), same pattern as "The science" ---------- */
const GD_RUN = {
  light:{ space:'A small room or screened corner. A LightBed is about 7.5 × 4.3 ft; a LightPanel Quad stands in about 2.6 × 5 ft.',
    power:'LightBed: a 240 V supply (6,500 W). LightPanel Quad: a standard 100–240 V outlet (1,520 W).',
    clean:'Wipe the bed surface or handles between users. Eye protection on hand for anyone who wants it.',
    safety:'Ask about light sensitivity and photosensitising medication at sign-up.' },
  heat:{ space:'A Yakisugi Quad is about 6.6 × 6.6 ft, Hemlock Quad about 6.9 × 4.3 ft. Custom traditional saunas are built to fit the room.',
    power:'Hemlock: 220–240 V single-phase on a 15 A+ breaker (3,000 W). Yakisugi: confirmed by size at quote. Traditional: sized to the heater. No plumbing needed for infrared.',
    clean:'Towel-on-bench policy, a daily bench wipe and a weekly deeper clean.',
    safety:'Water on hand, a clear session limit on the door, and screening for pregnancy and heart conditions.' },
  ice:{ space:'IceVault Duo is about 3.9 × 4.3 ft, Quad 6.2 × 5.9 ft, Octo 8.9 × 9.2 ft. Allow 10 ft ceiling height for the monoblock.',
    power:'A 240 V single-phase supply. No plumbing, drainage or water treatment.',
    clean:'Floor and bench wipe-down daily. The room runs a self-cleaning cycle.',
    safety:'A visible timer, a first-timer guide that starts at a minute or two, and screening for heart conditions and cold sensitivity.' },
  air:{ space:'AirForm Plus is about 7.3 × 4.8 ft, AirFit Plus about 7.2 × 4.2 ft, AirSuite Duo about 7.2 × 5.3 ft, plus room for the compressor.',
    power:'AirFit and AirForm: two standard wall plugs per chamber (1,400 W compressor + 300 W air conditioner). AirSuite: confirmed at quote.',
    clean:'Wipe the interior, mattress and seals between users.',
    safety:'A trained operator on every session, health screening before the first one, and medical oversight. In the US, hyperbaric chambers are prescription devices.' },
};
const GD_TRACK = [['Sessions per unit per day','Tells you when to add capacity.'],['Share of members or guests using it','Shows whether it’s reaching people.'],['Repeat bookings','The clearest sign it’s valued.']];
const GD_OFFER_MORE = {
  gym:[['Premium tier','Works when recovery is a reason to upgrade. Watch that peak-hour demand doesn’t outrun capacity.'],['Per session','Simple to start and easy to measure. Can feel nickel-and-dime to members.'],['Session packs','Upfront cash and a nudge to come back. Set an expiry.']],
  studio:[['Per session','Clear, and suits first visits. Keep it quick to book again.'],['Unlimited membership','Predictable revenue. Cap daily sessions so regulars don’t crowd out bookings.'],['Add-on','Lifts the value of each visit. Offer it at check-in, not after.']],
  team:[['In the program','Performance staff decide who goes when.'],['By position group','Keeps queues short straight after training.'],['Per athlete','For medically led sessions, logged per player.']],
  hotel:[['Spa menu','Priced like a treatment, with no therapist time needed.'],['Room packages','Adds value to wellness stays without discounting the room.'],['Day passes','Fills quiet weekday hours with non-resident guests.']],
  clinic:[['Treatment plans','Booked as part of a course, reviewed by the clinician.'],['Session packs','Prepaid blocks for returning patients.'],['Standalone','An easy first step for new patients.']],
  home:[['Included amenity','Supports leasing and retention. Cap bookings so everyone gets a turn.'],['App booking','Time slots and a weekly limit keep access fair.'],['Premium amenity','A small monthly fee covers running costs.']],
};
function gdDrop(label, body){ return `<details class="gdd-sci gdd-drop"><summary><span>${label}</span><em>Show</em></summary><div class="gdd-sci-b">${body}</div></details>`; }
function gdRunMore(m){ const r = GD_RUN[m]; if (!r) return '';
  return gdDrop('The details', `<h3>Space</h3><p>${r.space}</p><h3>Power</h3><p>${r.power}</p><h3>Booking</h3><p>Booked and started from the OneBase app or tablet. Sessions time out on their own, and the dashboard shows usage by hour.</p><h3>Cleaning</h3><p>${r.clean}</p><h3>Safety</h3><p>${r.safety}</p>`); }
function gdOfferMore(v){ const o = GD_OFFER_MORE[v]; if (!o) return '';
  return gdDrop('The details', `<h3>How each option works</h3><ul class="gdd-list">${o.map(([t,d]) => `<li><b>${t}.</b> ${d}</li>`).join('')}</ul><h3>What to track</h3><ul class="gdd-list">${GD_TRACK.map(([t,d]) => `<li><b>${t}.</b> ${d}</li>`).join('')}</ul>`); }
const _gdDetail2 = gdDetail;
gdDetail = function(v, m){
  let h = _gdDetail2(v, m);
  h = h.replace(/(<section class="gdd-sec"><p class="gdd-n">02<\/p><div><h2>[\s\S]*?)(<\/div><\/section>)/, (a, x, y) => x + gdRunMore(m) + y);
  h = h.replace(/(<section class="gdd-sec"><p class="gdd-n">03<\/p><div><h2>How to offer it[\s\S]*?)(<\/div><\/section>)/, (a, x, y) => x + gdOfferMore(v) + y);
  return h;
};
(() => { const s = document.createElement('style'); s.textContent = `
.gdd-list{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;font-size:15px;line-height:1.55}
.gdd-list b{font-weight:500}`; document.head.appendChild(s); })();
(() => { const s = document.createElement('style'); s.textContent = `.gdd-sci>summary::after,details[open].gdd-sci>summary::after{content:none!important;display:none!important}`; document.head.appendChild(s); })();

/* ---------- "At home": private buyers, where hyperbaric leads ---------- */
GD_VENUES.push(['private','At home','high-end-real-estate']);
GD.private = { lead:'Recovery on your own schedule.',
  air:['','','',''], light:['','','',''], heat:['','','',''], ice:['','','',''] };
GD_ORDER.private = ['air','heat','light','ice'];
GD_SHORT.private = { lead:'Recovery on your own schedule.',
  air:['Hyperbaric at home','The most common home purchase. Daily sessions, no appointment needed.','60–90 min','Daily'],
  heat:['A sauna of your own','Infrared runs on a standard setup and fits a spare room or garage.','20–30 min','Evenings'],
  light:['Red light at home','A panel on a stand fits almost anywhere.','10–20 min','Morning or night'],
  ice:['Cold without a tub','No filling, draining or chemicals to look after.','3–10 min','Mornings'] };
GD_MORE.private = {
  air:['Owners run sessions themselves after setup and training from our team. A soft chamber needs a small room and two standard wall plugs.','light',['airfit','airflex','airform']],
  heat:['Most home saunas go in a spare room, garage or outbuilding. Infrared needs no plumbing.','ice',['hemlock','yakisugi','traditional']],
  light:['Start it from the app or tablet. A panel stands in a corner; a bed needs a dedicated room.','heat',['lightpanel','lightbed']],
  ice:['A dry cold room needs a 240 V supply and no plumbing. Most owners pair it with a sauna.','heat',['icevault']] };
GD_START.private = [['airfit','A soft chamber sized for home use.'],['hemlock','A four-person infrared sauna.']];
GD_IMG_V.private = { air:'af-life', heat:'photo-hemlock', light:'photo-lightpanel' };
var GD_WHAT_HOME_AIR = 'In the US, hyperbaric chambers are prescription medical devices. Talk to your doctor before buying one for home use.';
// "How to offer it" doesn't apply at home: drop section 03 there, and add the prescription note for hyperbaric.
const _gdDetail3 = gdDetail;
gdDetail = function(v, m){
  let h = _gdDetail3(v, m);
  if (v === 'private') {
    h = h.replace(/<section class="gdd-sec"><p class="gdd-n">03<\/p><div><h2>How to offer it[\s\S]*?<\/section>/, '')
         .replace('<p class="gdd-n">04</p>', '<p class="gdd-n">03</p>').replace('<p class="gdd-n">05</p>', '<p class="gdd-n">04</p>')
         .replace('How at home run it', 'How owners use it at home');
    if (m === 'air') h = h.replace(/(<h2>What it is<\/h2>)/, `$1<p class="gdd-rx">${GD_WHAT_HOME_AIR}</p>`);
  }
  return h;
};
// Residential & corporate amenity spaces: hyperbaric is still not advised there; home owners now have their own tab.
GD_SHORT.home.lead = 'Amenities residents book themselves.';

/* ---------- Each venue gets its own world: photo, tint and motion when you switch ---------- */
const GD_BG = { gym:'sol-fitness', studio:'hero-bg', team:'sol-sports', hotel:'sol-spas', clinic:'photo-hbot-inside', home:'sol-multifamily', private:'af-life' };
const GD_TINT = { gym:'#1b2230', studio:'#2a1d18', team:'#0f2a2a', hotel:'#2b2219', clinic:'#162536', home:'#22222a', private:'#1d2330' };
let gdPrev = null;
const _gdSection3 = gdSection;
gdSection = function(full){
  const v = gdVenue, prev = gdPrev && gdPrev !== v ? gdPrev : null;
  const layer = (k, cls) => D.img[GD_BG[k]] ? `<span class="gdv-bg ${cls}" style="--t:${GD_TINT[k]}"><img src="${D.img[GD_BG[k]]}" alt=""></span>` : '';
  let h = _gdSection3(full);
  h = h.replace('<section class="sec gd gd2', `<section data-v="${v}" style="--t:${GD_TINT[v]}" class="sec gd gd2 gdv${prev?' gdv-anim':''}`)
       .replace('<div class="wrap">', `<div class="gdv-stage">${prev?layer(prev,'gdv-old'):''}${layer(v,'gdv-new')}<span class="gdv-shade"></span></div><div class="wrap">`);
  // split the headline into words so it can rise in
  h = h.replace(/<h2 class="gd-h">([\s\S]*?)<\/h2>/, (a, t) => `<h2 class="gd-h">${t.split(' ').map((w,i) => `<span class="gdw" style="--i:${i}">${w}</span>`).join(' ')}</h2>`);
  gdPrev = null;
  return h;
};
document.addEventListener('click', e => { const b = e.target.closest('[data-gd]'); if (!b) return; const s = document.getElementById('gd'); if (s) gdPrev = s.dataset.v || null; }, true);
(() => { const s = document.createElement('style'); s.textContent = `
.gdv{position:relative;overflow:hidden;background:var(--t);color:#fff;transition:background-color .6s ease}
.gdv .wrap{position:relative;z-index:1}
.gdv-stage{position:absolute;inset:0;z-index:0}
.gdv-bg{position:absolute;inset:0;background:var(--t)}
.gdv-bg img{width:100%;height:100%;object-fit:cover;opacity:.42;filter:saturate(.9)}
.gdv-shade{position:absolute;inset:0;background:linear-gradient(180deg,var(--t) 0%,rgba(0,0,0,.25) 35%,var(--t) 100%);opacity:.85}
.gdv-anim .gdv-new{animation:gdvIn .9s cubic-bezier(.2,.7,.2,1) both}
.gdv-anim .gdv-new img{animation:gdvZoom 1.6s cubic-bezier(.2,.7,.2,1) both}
@keyframes gdvIn{from{opacity:0}to{opacity:1}}
@keyframes gdvZoom{from{transform:scale(1.12)}to{transform:scale(1)}}
.gdv .eyebrow{color:rgba(255,255,255,.7)}
.gdv .gd-h{color:#fff}
.gdw{display:inline-block}
.gdv-anim .gdw{animation:gdvWord .7s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i) * 55ms)}
@keyframes gdvWord{from{opacity:0;transform:translateY(.45em)}to{opacity:1;transform:none}}
.gdv-anim .gd-tile{animation:gdvTile .8s cubic-bezier(.2,.7,.2,1) both}
.gdv-anim .gd-tile:nth-child(2){animation-delay:.07s}.gdv-anim .gd-tile:nth-child(3){animation-delay:.14s}.gdv-anim .gd-tile:nth-child(4){animation-delay:.21s}
@keyframes gdvTile{from{opacity:0;transform:translateY(40px) scale(.96)}to{opacity:1;transform:none}}
.gdv .gd-pills button{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.22);color:#fff;backdrop-filter:blur(6px);transition:background .25s,transform .15s}
.gdv .gd-pills button:hover{background:rgba(255,255,255,.18)}
.gdv .gd-pills button:active{transform:scale(.96)}
.gdv .gd-pills button[aria-selected=true]{background:#fff;color:#1f1f1f;border-color:#fff}
.gdv .btn-p{background:#fff;color:#1f1f1f}.gdv .btn-g{border-color:rgba(255,255,255,.5);color:#fff}
.gdv .gd-note,.gdv .gd-sub{color:rgba(255,255,255,.6)}
.gdv .gd-sp{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff}
.gdv .gd-tile{box-shadow:0 20px 50px rgba(0,0,0,.35)}
.gdd-rx{font-size:15px!important;padding:12px 14px;border-radius:10px;background:var(--surf);border-left:3px solid var(--air-400);margin-bottom:10px}
@media(prefers-reduced-motion:reduce){.gdv-anim .gdv-new,.gdv-anim .gdv-new img,.gdv-anim .gdw,.gdv-anim .gd-tile{animation:none}}`; document.head.appendChild(s); })();
GD_OFFER.private = []; GD_OFFER_MORE.private = [];

/* ---------- Quieter venue switch: light section, text tabs, one short crossfade ---------- */
gdSection = function(full){
  const v = gdVenue, anim = gdPrev && gdPrev !== v;
  gdPrev = null;
  return _gdSection3(full).replace('<section class="sec gd gd2', `<section data-v="${v}" class="sec gd gd2 gdq${anim ? ' gdq-anim' : ''}`);
};
(() => { const s = document.createElement('style'); s.textContent = `
.gdq .gd-pills{gap:0 26px;border-bottom:1px solid var(--line)}
.gdq .gd-pills button{background:none!important;border:0;border-radius:0;padding:10px 0 12px;font-size:14px;color:var(--muted,#6b6b6b);position:relative;transition:color .2s}
.gdq .gd-pills button:hover{color:var(--fg)}
.gdq .gd-pills button[aria-selected=true]{color:var(--fg)}
.gdq .gd-pills button::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--fg);transform:scaleX(0);transition:transform .3s ease}
.gdq .gd-pills button[aria-selected=true]::after{transform:scaleX(1)}
.gdq-anim .gd-h,.gdq-anim .gd-tiles,.gdq-anim .gd-startrow{animation:gdqIn .45s ease both}
.gdq-anim .gd-tiles{animation-delay:.05s}
@keyframes gdqIn{from{opacity:0}to{opacity:1}}
@media(max-width:600px){.gdq .gd-pills{gap:0 22px}}
@media(prefers-reduced-motion:reduce){.gdq-anim *{animation:none!important}}`; document.head.appendChild(s); })();
// keep the chosen tab in view on narrow screens
document.addEventListener('click', e => { if (!e.target.closest('[data-gd]')) return; requestAnimationFrame(() => { const r = document.querySelector('#gd .gd-pills'), t = r && r.querySelector('[aria-selected=true]'); if (r && t && r.scrollWidth > r.clientWidth) r.scrollLeft = t.offsetLeft - r.offsetLeft - 20; }); });

/* ---------- Tiles: the studio renders as supplied, on a light card with the words underneath ---------- */
Object.assign(GD_IMG, { air:'gdr-air', ice:'gdr-ice', heat:'gdr-heat', light:'gdr-light' });
delete GD_IMG_V.team.air; delete GD_IMG_V.clinic.air; delete GD_IMG_V.private.air;
delete GD_IMG_V.studio.ice; delete GD_IMG_V.hotel.heat; delete GD_IMG_V.clinic.light; delete GD_IMG_V.home.heat; delete GD_IMG_V.home.light; delete GD_IMG_V.private.heat; delete GD_IMG_V.private.light;
(() => { const s = document.createElement('style'); s.textContent = `
.gd2 .gd-tile{aspect-ratio:auto;display:block;background:var(--card);color:var(--fg);border:1px solid var(--line);overflow:hidden}
.gd2 .gd-tile img{position:relative;inset:auto;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;display:block}
.gd2 .gd-veil{display:none}
.gd2 .gd-t{padding:18px 18px 20px}
.gd2 .gd-mod{color:var(--faint)}
.gd2 .gd-line{color:var(--muted)}
.gd2 .gd-stats{border-top-color:var(--line);color:var(--faint)}
.gd2 .gd-stats i{color:var(--fg)}
.gdv .gd-tile{box-shadow:none}`; document.head.appendChild(s); })();
