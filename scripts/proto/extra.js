/* ===== High-end layer: scroll story, counters, reveal, planner, configurator ===== */
const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const MODC = { air:{deep:'#122232',glow:'#9aacbe',soft:'#e7f6fd'}, ice:{deep:'#063944',glow:'#5c94ab',soft:'#c8e2e8'}, heat:{deep:'#3b1a0f',glow:'#e6886a',soft:'#f0d48e',acc:'#c4522e'}, light:{deep:'#3d1017',glow:'#ea7c8c',soft:'#f7bfbf',acc:'#8b2232'} };
const fmt = (n) => Math.round(n).toLocaleString('en-US');

/* ---------- Scroll story ---------- */
const CHAPTERS = [
  { k:'air', label:'Air', cat:'hbot', img:'cut-airform-plus-black', title:'Hyperbaric oxygen, from soft-shell to walk-in suite.', lead:'Four chambers from 1.3 to 2.0 ATA. Soft-shell for flexibility, steel for clinic pressures, and the modular AirSuite room with medical-grade BIBS.', stats:[['1.3–2.0','ATA pressure range'],['4','chamber models'],['BIBS','medical-grade in AirSuite']] },
  { k:'ice', label:'Ice', cat:'cold-therapy', img:'cut-icevault-quad', title:'Cold therapy without the water, the ice or the gas.', lead:'The IceVault is a dry, electric cold room for two to eight people. Longer, more tolerable sessions, no wet floors, and a self-cleaning cycle.', stats:[['32–40°F','dry, electric cold'],['2–8','people per session'],['0','plumbing required']] },
  { k:'heat', label:'Heat', cat:'sauna', img:'cut-yakisugi', title:'Full-spectrum infrared, built to run all day.', lead:'Low-EMF near, mid and far infrared at a restorative 135–149°F. Yakisugi-charred cedar for the statement piece, Hemlock for a clean, contemporary suite.', stats:[['135–149°F','restorative heat'],['Low-EMF','near, mid and far IR'],['2–8','people per cabin']] },
  { k:'light', label:'Light', cat:'red-light', img:'cut-lightbed-black', title:'Whole-body red light, dosed to the protocol.', lead:'The LightBed delivers five wavelengths from 633 to 940 nm. LightPanel systems scale from a single panel to a four-panel stand.', stats:[['41,600','LEDs in the LightBed'],['5','wavelengths'],['Solo–Quad','LightPanel systems']] },
];
function storyHTML(){
  if (RM()) return `<section class="story-flat">${CHAPTERS.map((c,i)=>`<div class="ch-flat" style="--sbg:${MODC[c.k].deep};--sglow:${MODC[c.k].glow}"><div class="wrap grid"><div class="ch"><p class="num"><b>0${i+1}</b> · ${c.label}</p><h2>${c.title}</h2><p class="lead">${c.lead}</p><div class="stats">${c.stats.map(s=>`<div><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join('')}</div><a class="go" href="#/products/${c.cat}">Explore ${c.label.toLowerCase()} →</a></div>${D.img[c.img]?`<img src="${D.img[c.img]}" alt="">`:''}</div></div>`).join('')}</section>`;
  return `<section class="story" id="story" style="height:${CHAPTERS.length*100+60}svh" aria-label="Four modalities">
  <div class="story-stage" style="--sbg:${MODC.air.deep};--sglow:${MODC.air.glow}"><div class="story-glow"></div><div class="story-grain"></div>
   <div class="wrap story-grid">
    <div class="story-copy">${CHAPTERS.map((c,i)=>`<div class="ch${i===0?' on':''}" data-i="${i}"><p class="num"><b>0${i+1}</b> / 04 · ${c.label}</p><h2>${c.title}</h2><p class="lead">${c.lead}</p><div class="stats">${c.stats.map(s=>`<div><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join('')}</div><a class="go" href="#/products/${c.cat}">Explore ${c.label.toLowerCase()} →</a></div>`).join('')}</div>
    <div class="story-media">${CHAPTERS.map((c,i)=>`<figure class="${i===0?'on':''}" data-i="${i}">${D.img[c.img]?`<img src="${D.img[c.img]}" alt="OneBase ${c.label} equipment">`:''}</figure>`).join('')}</div>
   </div>
   <div class="story-rail"><div class="wrap">${CHAPTERS.map((c,i)=>`<button data-go="${i}" class="${i===0?'on':''}"><i></i>0${i+1} ${c.label}</button>`).join('')}</div></div>
  </div></section>`;
}
let storyIdx = -1;
function storyUpdate(){
  const s = document.getElementById('story'); if (!s) return;
  const r = s.getBoundingClientRect(); const vh = innerHeight; const span = s.offsetHeight - vh;
  const p = Math.min(1, Math.max(0, -r.top / span)); const n = CHAPTERS.length;
  const f = p * n; const idx = Math.min(n-1, Math.floor(f)); const t = Math.min(1, f - idx);
  const stage = s.querySelector('.story-stage');
  if (idx !== storyIdx) {
    storyIdx = idx; const c = CHAPTERS[idx];
    stage.style.setProperty('--sbg', MODC[c.k].deep); stage.style.setProperty('--sglow', MODC[c.k].glow);
    s.querySelectorAll('.ch,.story-media figure').forEach(el => { const i = +el.dataset.i; el.classList.toggle('on', i===idx); el.classList.toggle('past', i<idx); });
    s.querySelectorAll('.story-rail button').forEach((b,i)=>b.classList.toggle('on', i===idx));
  }
  s.querySelectorAll('.story-rail button').forEach((b,i)=>b.style.setProperty('--f', (i<idx?100:i===idx?t*100:0)+'%'));
  const fig = s.querySelector('.story-media figure.on'); if (fig) fig.style.setProperty('--py', ((0.5-t)*36).toFixed(1)+'px');
}

/* ---------- Counters + reveal ---------- */
function counterHTML(){ return `<section class="dark sec"><div class="wrap stack" style="gap:36px"><p class="eyebrow">OneBase in numbers</p><div class="counters">${[[custCount(),'+','venues installed'],[4,'','modalities, one platform'],[12,'+','countries'],[2,'-year','standard warranty']].map(([v,s,l])=>`<div><strong><span data-count="${v}">0</span>${s}</strong><span>${l}</span></div>`).join('')}</div></div></section>`; }
let io;
function observe(){
  if (io) io.disconnect();
  if (!('IntersectionObserver' in window)) { document.querySelectorAll('[data-count]').forEach(e=>e.textContent=e.dataset.count); return; }
  io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
    if (el.dataset.count) { const end=+el.dataset.count; if (RM()) { el.textContent=end; return; } const t0=performance.now(); const tick=(now)=>{ const k=Math.min(1,(now-t0)/1400); el.textContent=Math.round(end*(1-Math.pow(1-k,3))); if(k<1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
    else el.classList.add('in'); }), { threshold: 0.15 });
  document.querySelectorAll('[data-count]').forEach(e=>io.observe(e));
  if (!RM()) document.querySelectorAll('#app section:not(.hero):not(.story):not(.story-flat) h2, #app .card, #app .rvx').forEach(el => { if (el.closest('.story,.plan-card,.pl-controls,.cfg')) return; el.classList.add('rv'); io.observe(el); });
}

/* ---------- Planner ---------- */
const CAT = {
  IV2:{p:'icevault',s:'Duo',m:'ice',w:47.24,d:51.8,n:2,cyc:15,img:'icevault-quad'}, IV4:{p:'icevault',s:'Quad',m:'ice',w:74.8,d:70.87,n:4,cyc:15,img:'icevault-quad'}, IV8:{p:'icevault',s:'Octo',m:'ice',w:106.3,d:110.24,n:8,cyc:15,img:'icevault-octo'},
  YK2:{p:'yakisugi',s:'Duo',m:'heat',w:68.9,d:68.9,n:2,cyc:45,img:'yakisugi'}, YK4:{p:'yakisugi',s:'Quad',m:'heat',w:79,d:79,n:4,cyc:45,img:'yakisugi'}, YK8:{p:'yakisugi',s:'Octo',m:'heat',w:108.5,d:108.5,n:8,cyc:45,img:'yakisugi'},
  HM4:{p:'hemlock',s:'Quad',m:'heat',w:83,d:52,n:4,cyc:45,img:'hemlock'},
  AFT:{p:'airfit',s:'Plus',m:'air',w:86.5,d:50,n:1,cyc:75,img:'airfit'}, AFP:{p:'airform',s:'Plus',m:'air',w:87,d:58,n:1,cyc:75,img:'airform-plus-black'}, AS2:{p:'airsuite',s:'Duo',m:'air',w:86.6,d:63,n:2,cyc:75,img:'canva-airsuite-duo'},
  LB:{p:'lightbed',s:'',m:'light',w:89.5,d:51,n:1,cyc:25,img:'lightbed-black'}, LP4:{p:'lightpanel',s:'Quad',m:'light',w:31.5,d:60,n:1,cyc:20,img:'lightpanel-quad'},
};
const VENUES = {
  gym:{l:'Gym or fitness club', def:['ice','heat','light'], price:0, t:{ice:['IV2','IV4','IV8'],heat:['HM4','YK4','YK8'],light:['LP4','LB',['LB','LP4']],air:['AFT','AFP','AFP']}},
  studio:{l:'Recovery studio', def:['air','ice','heat','light'], price:45, t:{air:['AFP','AFP',['AFP','AFP']],ice:['IV2','IV4','IV4'],heat:['YK2','YK4','YK4'],light:['LP4','LB',['LB','LB']]}},
  team:{l:'Sports team', def:['air','ice','heat','light'], price:0, t:{ice:['IV4','IV8','IV8'],heat:['YK4','YK8','YK8'],air:['AFP','AS2',['AS2','AFP']],light:['LP4','LB',['LB','LP4','LP4']]}},
  hotel:{l:'Hotel or spa', def:['heat','ice','light'], price:60, t:{heat:['YK2','YK4','YK4'],ice:['IV2','IV2','IV4'],light:['LP4','LB','LB'],air:['AFT','AFP','AFP']}},
  clinic:{l:'Clinic', def:['air','light'], price:120, t:{air:['AFP',['AFP','AFP'],['AS2','AFP','AFP']],light:['LP4','LB','LB'],ice:['IV2','IV2','IV4'],heat:['HM4','YK2','YK4']}},
  residential:{l:'Residential amenity', def:['heat','ice','light'], price:0, t:{heat:['HM4','YK4','YK4'],ice:['IV2','IV4','IV4'],light:['LP4','LP4','LB'],air:['AFT','AFT','AFP']}},
  corporate:{l:'Corporate wellness', def:['heat','ice','light'], price:0, t:{heat:['YK2','YK4','YK4'],ice:['IV2','IV2','IV4'],light:['LP4','LP4','LB'],air:['AFT','AFT','AFP']}},
};
const PL = { venue:'studio', area:600, mods:['air','ice','heat','light'], hours:12, price:45, util:35 };
function prodName(c){ const p = D.products.find(x=>x.id===c.p); return 'OneBase ' + (p?p.name:c.p) + (c.s?' '+c.s:''); }
function packRoom(items, W, Dp){
  // items: [{code,w,d}] in feet. Rows along the room width with 3.5 ft aisles between rows; 1.5 ft between units; 0.5 ft wall gap.
  const gap=1.5, wall=0.5, aisle=3.5; const placed=[]; let x=wall, y=wall, rowH=0, rowIdx=0;
  for (const it of items) {
    let w=it.w, d=it.d; if (w > W-2*wall && d <= W-2*wall) [w,d]=[d,w];
    if (x + w > W - wall + 1e-6) { y += rowH + aisle; x = wall; rowH = 0; rowIdx++; }
    if (x + w > W - wall + 1e-6 || y + d > Dp - wall + 1e-6) return null;
    placed.push({...it, x, y, w, d}); x += w + gap; rowH = Math.max(rowH, d);
  }
  // leave a walkway in front of the last row
  if (placed.length && y + rowH + 3 > Dp) { return null; }
  return placed;
}
function planCompute(){
  const v = VENUES[PL.venue]; const tier = PL.area < 350 ? 0 : PL.area < 800 ? 1 : 2;
  const order = v.def.filter(m=>PL.mods.includes(m)).concat(['air','ice','heat','light'].filter(m=>PL.mods.includes(m)&&!v.def.includes(m)));
  let codes = []; order.forEach(m => { const x = v.t[m][tier]; codes = codes.concat(Array.isArray(x)?x:[x]); });
  const W = Math.sqrt(PL.area*1.45), Dp = PL.area / W; const dropped=[];
  let list = codes.slice(); let placed;
  const toItems = (cs) => cs.map(c=>({code:c, w:CAT[c].w/12, d:CAT[c].d/12})).sort((a,b)=>b.d-a.d||b.w-a.w);
  // try as-is, then downsize, then drop from the end
  for (let guard=0; guard<30; guard++) {
    placed = packRoom(toItems(list), W, Dp); if (placed) break;
    const down = { IV8:'IV4', IV4:'IV2', YK8:'YK4', YK4:'YK2', AS2:'AFP', LB:'LP4', HM4:'YK2' };
    let changed=false; for (let i=list.length-1;i>=0;i--) { if (down[list[i]]) { list[i]=down[list[i]]; changed=true; break; } }
    if (!changed) { dropped.push(list.pop()); if (!list.length) { placed=[]; break; } }
  }
  const counts = {}; list.forEach(c=>counts[c]=(counts[c]||0)+1);
  const sessions = list.reduce((a,c)=>a + CAT[c].n * Math.floor(PL.hours*60/CAT[c].cyc), 0);
  const people = list.reduce((a,c)=>a+CAT[c].n,0);
  const used = list.reduce((a,c)=>a+CAT[c].w*CAT[c].d/144,0);
  return { W, Dp, placed, counts, sessions, people, used, dropped, list };
}
function planSVG(r, dark=true){
  const pad=1.2, sc=10; const vw=(r.W+pad*2)*sc, vh=(r.Dp+pad*2)*sc; const ink = dark?'#fff':'#1f1f1f';
  const grid=[]; for (let i=1;i<r.W;i++) grid.push(`<line x1="${(pad+i)*sc}" y1="${pad*sc}" x2="${(pad+i)*sc}" y2="${(pad+r.Dp)*sc}"/>`); for (let j=1;j<r.Dp;j++) grid.push(`<line x1="${pad*sc}" y1="${(pad+j)*sc}" x2="${(pad+r.W)*sc}" y2="${(pad+j)*sc}"/>`);
  const items = r.placed.map((it,i)=>{ const c=CAT[it.code]; const col=MODC[c.m]; const x=(pad+it.x)*sc, y=(pad+it.y)*sc, w=it.w*sc, h=it.d*sc; const vert = w < 44 && h > w; const lbl = ((D.products.find(p=>p.id===c.p)||{}).name||'') + (c.s&&!vert?' '+c.s:''); const fs=Math.max(6,Math.min(10,(vert?h:w)/(lbl.length*0.62)));
    return `<g class="it" style="animation-delay:${i*60}ms"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${col.acc||col.glow}" fill-opacity="${dark?.9:.95}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="${ink}" stroke-opacity=".25"/><text x="${x+w/2}" y="${y+h/2}" text-anchor="middle" dominant-baseline="middle" font-size="${fs}" font-weight="500" fill="${c.m==='air'||c.m==='ice'?'#0b1620':'#fff'}"${vert?` transform="rotate(-90 ${x+w/2} ${y+h/2})"`:''}>${lbl}</text></g>`; }).join('');
  return `<svg class="plan-svg" viewBox="0 0 ${vw.toFixed(1)} ${vh.toFixed(1)}" role="img" aria-label="Floor plan, ${Math.round(r.W)} by ${Math.round(r.Dp)} feet">
   <g stroke="${ink}" stroke-opacity=".07" stroke-width=".6">${grid.join('')}</g>
   <rect x="${pad*sc}" y="${pad*sc}" width="${r.W*sc}" height="${r.Dp*sc}" fill="none" stroke="${ink}" stroke-opacity=".75" stroke-width="2.2"/>
   <line x1="${(pad+r.W-4)*sc}" y1="${(pad+r.Dp)*sc}" x2="${(pad+r.W-1)*sc}" y2="${(pad+r.Dp)*sc}" stroke="${dark?'#1f1f1f':'#fff'}" stroke-width="4"/>
   <path d="M${(pad+r.W-4)*sc} ${(pad+r.Dp)*sc} V${(pad+r.Dp-3)*sc} A ${3*sc} ${3*sc} 0 0 1 ${(pad+r.W-1)*sc} ${(pad+r.Dp)*sc}" fill="none" stroke="${ink}" stroke-opacity=".4" stroke-width=".8"/>
   ${items}
   <g fill="${ink}" fill-opacity=".6" font-size="8"><text x="${pad*sc}" y="${(pad*sc)-4}">${Math.round(r.W)} ft</text><text x="${(pad+r.W)*sc+4}" y="${(pad+r.Dp/2)*sc}" writing-mode="tb">${Math.round(r.Dp)} ft</text></g>
  </svg>`;
}
const rngStyle = (el) => { const v=(el.value-el.min)/(el.max-el.min)*100; el.style.setProperty('--v', v+'%'); };
function plannerHTML(){
  return `<section class="wrap stack" style="padding-block:56px 12px;max-width:820px">${eyebrow('Recovery room planner')}<h1>Plan your recovery room in 60 seconds.</h1><p class="muted">Tell us about your venue and space. We’ll suggest an equipment mix, lay it out to scale and estimate what it can deliver. Then send it to our team for pricing and a detailed drawing.</p></section>
  <section class="wrap" style="padding-block:24px 80px"><div class="planner">
   <div class="pl-controls" id="plc">
    <div><h3>Venue</h3><div class="chips" data-k="venue">${Object.entries(VENUES).map(([k,v])=>`<button class="chip" aria-pressed="${PL.venue===k}" data-v="${k}">${v.l}</button>`).join('')}</div></div>
    <div><h3>Room size <output id="o-area"></output></h3><input class="rng" type="range" id="r-area" min="120" max="2500" step="10" value="${PL.area}" aria-label="Room size in square feet"></div>
    <div><h3>Modalities</h3><div class="chips" data-k="mods">${['air','ice','heat','light'].map(m=>`<button class="chip mchip" style="--c:${MODC[m].acc||MODC[m].glow}" aria-pressed="${PL.mods.includes(m)}" data-v="${m}"><i></i>${D.modalities[m].label}</button>`).join('')}</div></div>
    <div><h3>Hours open a day <output id="o-hours"></output></h3><input class="rng" type="range" id="r-hours" min="4" max="18" step="1" value="${PL.hours}" aria-label="Hours open per day"></div>
    <div><h3>Price per session <output id="o-price"></output></h3><input class="rng" type="range" id="r-price" min="0" max="150" step="5" value="${PL.price}" aria-label="Price per session in US dollars"><p class="note" style="margin-top:6px">Set to $0 if sessions are included in membership.</p></div>
    <div><h3>Expected utilisation <output id="o-util"></output></h3><input class="rng" type="range" id="r-util" min="10" max="80" step="5" value="${PL.util}" aria-label="Expected utilisation percent"></div>
   </div>
   <div class="pl-out" id="plo"></div>
  </div></section>`;
}
function plannerRender(){
  const out = document.getElementById('plo'); if (!out) return; const r = planCompute(); const v = VENUES[PL.venue];
  const set=(id,t)=>{const e=document.getElementById(id); if(e) e.textContent=t;};
  set('o-area', `${fmt(PL.area)} sq ft · ${fmt(PL.area*0.0929)} m²`); set('o-hours', PL.hours+' hrs'); set('o-price', PL.price?('US$'+PL.price):'Included'); set('o-util', PL.util+'%');
  document.querySelectorAll('#plc .rng').forEach(rngStyle);
  const daily = r.sessions*PL.util/100; const monthly = daily*PL.price*30;
  const mix = Object.entries(r.counts).map(([c,q])=>{ const k=CAT[c]; const p=D.products.find(x=>x.id===k.p); return `<a href="#/products/${p?p.category:''}/${k.p}"><span class="th">${k.img&&D.img[k.img]?`<img src="${D.img[k.img]}" alt="">`:`<i style="width:34px;height:26px;border-radius:3px;background:${MODC[k.m].acc||MODC[k.m].glow}"></i>`}</span><span><h4>${prodName(k)}</h4><p>${k.n} ${k.n>1?'people':'person'} · ${Math.round(k.w)}″ × ${Math.round(k.d)}″ · ${D.modalities[k.m].label}</p></span><span class="q">× ${q}</span></a>`; }).join('');
  const summary = `Venue: ${v.l}\nRoom: ${fmt(PL.area)} sq ft\nMix: ${Object.entries(r.counts).map(([c,q])=>q+' × '+prodName(CAT[c])).join(', ')}\nHours: ${PL.hours}/day · Price: ${PL.price?('US$'+PL.price):'membership'} · Utilisation: ${PL.util}%`;
  out.innerHTML = `
   <div class="plan-card"><div class="hdr"><h2>${v.l} · ${fmt(PL.area)} sq ft</h2><span>Top-down layout, to scale · ${Math.round(r.W)} × ${Math.round(r.Dp)} ft</span></div>${r.placed.length?planSVG(r):'<p style="color:rgba(255,255,255,.7)">Pick at least one modality.</p>'}</div>
   ${r.dropped.length?`<p class="warn">This room is tight for ${[...new Set(r.dropped)].map(c=>prodName(CAT[c])).join(', ')}. Try a larger space, or talk to us about a custom layout.</p>`:''}
   <div class="kpis"><div><strong>${PL.price?('US$'+fmt(monthly/1000)+'k'):fmt(daily)}</strong><span>${PL.price?'monthly revenue potential':'member sessions a day'}</span></div><div><strong>${fmt(r.sessions)}</strong><span>session capacity a day</span></div><div><strong>${r.people}</strong><span>people at once</span></div></div>
   <p class="note">Illustrative estimate based on ${PL.hours} open hours, typical session and turnover times, and ${PL.util}% utilisation. Not a guarantee of results. Final layout depends on doors, power and ventilation, which our team checks with you.</p>
   <div><p class="eyebrow" style="margin-bottom:6px">Suggested mix</p><div class="mix">${mix||'<p class="note">No equipment selected.</p>'}</div></div>
   <form class="enq" id="plForm"><p class="full" style="font-weight:500;font-size:18px">Send me this plan</p><p class="full note" style="margin-top:-8px">We’ll follow up with pricing and a detailed layout drawing.</p><label>Name *<input required></label><label>Email *<input type="email" required></label><label class="full">Company<input></label><textarea hidden name="plan">${esc(summary)}</textarea><div class="full"><button class="btn btn-p" type="submit">Send me this plan</button></div></form>`;
  const f = document.getElementById('plForm'); f.addEventListener('submit', e => { e.preventDefault(); f.innerHTML = '<p class="full" style="font-weight:500;font-size:18px">Plan sent.</p><p class="full muted">Thanks. Our team will be in touch with pricing and a detailed layout.</p>'; });
}
function plannerInit(){
  const c = document.getElementById('plc'); if (!c) return;
  c.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; const k = b.parentElement.dataset.k;
    if (k==='venue') { PL.venue=b.dataset.v; PL.mods=VENUES[PL.venue].def.slice(); PL.price=VENUES[PL.venue].price; const pr=document.getElementById('r-price'); pr.value=PL.price; c.querySelectorAll('[data-k=venue] .chip').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); c.querySelectorAll('[data-k=mods] .chip').forEach(x=>x.setAttribute('aria-pressed',String(PL.mods.includes(x.dataset.v)))); }
    else { const m=b.dataset.v; PL.mods = PL.mods.includes(m)?PL.mods.filter(x=>x!==m):PL.mods.concat(m); b.setAttribute('aria-pressed', String(PL.mods.includes(m))); }
    plannerRender(); });
  ['area','hours','price','util'].forEach(k => { const el=document.getElementById('r-'+k); el.addEventListener('input', ()=>{ PL[k]=+el.value; plannerRender(); }); });
  plannerRender();
}
function teaserHTML(){
  const save = {...PL}; Object.assign(PL,{venue:'studio',area:600,mods:['air','ice','heat','light']}); const r = planCompute(); Object.assign(PL, save);
  return `<section class="sec dark" style="border-top:1px solid rgba(255,255,255,.08)"><div class="wrap pl-teaser"><div class="stack" style="gap:16px">${eyebrow('Recovery room planner')}<h2>See your recovery room before you buy it.</h2><p class="muted">Pick your venue and space. We’ll suggest the mix, lay it out to scale and estimate sessions and revenue. Takes about a minute.</p><div><a href="#/planner" class="btn btn-p">Plan your room</a></div></div><a href="#/planner" class="plan-wrap" aria-label="Open the planner">${planSVG(r)}</a></div></section>`;
}

/* ---------- Configurator ---------- */
const DIMS = {
  icevault:{duo:[47.24,51.8,95,2],quad:[74.8,70.87,95,4],octo:[106.3,110.24,95,8],_p:'240 V single phase · no plumbing'},
  yakisugi:{duo:[68.9,68.9,82.72,2],quad:[79,79,82.72,4],octo:[108.5,108.5,82.72,8],_p:'Standard outlet · circuit confirmed at quote'},
  hemlock:{quad:[83,52,75,4],_p:'3000 W · 220/240 V · min. 15 A'},
  airform:{mini:[87,29.5,null,1],plus:[87,35.5,null,1],_p:'SUB 1400 W + AC 300 W · standard wall plugs'},
  airfit:{mini:[67,27.5,43,1],plus:[86.5,27.5,43,1],_p:'SUB 1400 W + AC 300 W · standard wall plugs'},
  airsuite:{solo:[59.1,35.4,70.1,1],duo:[86.6,63,78.7,2],_p:'Confirmed at quote'},
  lightpanel:{solo:[8.7,2.6,36,1,'380 W'],duo:[31.5,2.6,72.4,1,'404 W'],quad:[31.5,27.6,72.4,1,'1520 W'],_p:'100–240 V'},
  lightbed:{_one:[89.5,51,44,1],_p:'6500 W · 240 V'},
};
const SWC = {'Matte Black':'#1f1f1f','Black':'#1f1f1f','Midnight Black':'#15161a','Yakisugi Black':'#2b2622','Matte White':'#f4f4f4','Arctic White':'#eef3f5','White':'#f4f4f4','Hemlock':'#d9b98c'};
const VIMG = { airsuite:{solo:'canva-airsuite-solo',duo:'canva-airsuite-duo'} };
const CF = {};
const inch = (v) => v==null?'—':`${Math.round(v*10)/10}″`;
const cm = (v) => v==null?'':`${Math.round(v*2.54)} cm`;
function cfgHTML(p){
  const dm = DIMS[p.id]; const sizes = p.sizes.length ? p.sizes : [];
  if (!dm && sizes.length<2 && p.colours.length<2) return '';
  const st = CF[p.id] = { size: sizes.length ? (sizes[Math.min(1,sizes.length-1)].id) : '_one', col: p.colours[0], pr: p.pressures[p.pressures.length-1] };
  return `<section class="sec" style="border-top:1px solid var(--line)" id="cfg"><div class="wrap"><div class="stack" style="gap:10px;margin-bottom:28px;max-width:640px">${eyebrow('Configure')}<h2>Build your ${esc(p.name)}.</h2></div>
   <div class="cfg">
    <div class="cfg-vis"><div class="fp" id="fp" aria-hidden="true"><div class="box" id="fpbox"></div><span class="dw" id="fpw"></span><span class="dd" id="fpd"></span><span class="scale"><i></i>2 ft</span></div><p class="note" style="text-align:center">Top-down footprint on a 12 × 12 ft grid</p></div>
    <div class="cfg-ctl">
     <p class="cfg-name" id="cfgName"></p>
     ${sizes.length>1?`<div><p class="eyebrow" style="margin-bottom:10px">Size</p><div class="seg" data-k="size">${sizes.map(s=>{ const d=dm&&dm[s.id]; return `<button aria-pressed="${st.size===s.id}" data-v="${s.id}">${esc(s.label)}<small>${d?d[3]+(d[3]>1?' people':' person'):''}</small></button>`; }).join('')}</div></div>`:''}
     ${p.colours.length>1?`<div><p class="eyebrow" style="margin-bottom:10px">Finish</p><div class="sw" data-k="col">${p.colours.map(c=>`<button aria-pressed="${st.col===c}" data-v="${esc(c)}"><i style="--c:${SWC[c]||'#888'}"></i>${esc(c)}</button>`).join('')}</div></div>`:''}
     ${p.pressures.length>1?`<div><p class="eyebrow" style="margin-bottom:10px">Pressure</p><div class="seg" data-k="pr">${p.pressures.map(x=>`<button aria-pressed="${st.pr===x}" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>`:''}
     <dl class="readout" id="ro"></dl>
     <div class="row"><button class="btn btn-p" id="cfgQuote">Get pricing for this build</button><a class="btn btn-g" href="#/planner">Plan a room with it</a></div>
    </div></div></div></section>`;
}
function cfgRender(p){
  const st = CF[p.id]; if (!st || !document.getElementById('cfg')) return; const dm = DIMS[p.id]; const d = dm && dm[st.size];
  const sizeLabel = (p.sizes.find(s=>s.id===st.size)||{}).label || '';
  const name = 'OneBase ' + p.name + (sizeLabel?' '+sizeLabel:'') + (p.pressures.length>1?' '+st.pr:'');
  const nm = document.getElementById('cfgName'); nm.textContent = name; nm.classList.remove('flash'); void nm.offsetWidth; nm.classList.add('flash');
  const box=document.getElementById('fpbox'), fp=document.getElementById('fp');
  if (d) { const W=d[0]/144*100, H=d[1]/144*100; box.style.width=W+'%'; box.style.height=H+'%'; box.textContent = sizeLabel || p.name;
    const sc = SWC[st.col]; const lt = sc && parseInt(sc.slice(1,3),16) > 150; box.style.background = sc || 'var(--deep,#1f1f1f)'; box.style.color = lt ? '#1f1f1f' : '#fff'; box.style.outline = lt ? '1px solid rgba(0,0,0,.18)' : 'none';
    const w=document.getElementById('fpw'), dd=document.getElementById('fpd'); w.textContent = inch(d[0]); w.style.left='50%'; w.style.transform='translateX(-50%)'; w.style.top=`calc(${50-H/2}% - 20px)`;
    dd.textContent = inch(d[1]); dd.style.top='50%'; dd.style.transform='translateY(-50%)'; dd.style.left=`calc(${50+W/2}% + 8px)`; fp.style.display=''; }
  else fp.style.display='none';
  const vk = VIMG[p.id] && (VIMG[p.id][st.size] || VIMG[p.id][st.col]); const hero = document.querySelector('#app .softbg img'); if (vk && hero && D.img[vk] && hero.getAttribute('src')!==D.img[vk]) hero.src = D.img[vk];
  const rows = [];
  if (d) { rows.push(['Footprint', `${inch(d[0])} × ${inch(d[1])}<small>${cm(d[0])} × ${cm(d[1])}</small>`]); rows.push(['Height', d[2]?`${inch(d[2])}<small>${cm(d[2])}</small>`:'Confirmed at quote']); rows.push(['Capacity', `${d[3]} ${d[3]>1?'people':'person'}`]); rows.push(['Room from', `~${fmt(Math.ceil((d[0]/12+3)*(d[1]/12+4)/5)*5)} sq ft<small>incl. access space</small>`]); }
  rows.push(['Finish', esc(st.col||'—')]); rows.push(['Power', esc((d&&d[4]?d[4]+' · ':'')+(dm?dm._p:'Confirmed at quote'))]);
  document.getElementById('ro').innerHTML = rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  document.getElementById('cfgQuote').onclick = () => { const m = document.getElementById('msg'); if (m) m.value = `I'd like pricing for: ${name} · ${st.col}`; document.getElementById('enquiry')?.scrollIntoView({behavior: RM()?'auto':'smooth'}); };
}
function cfgInit(){
  const el = document.getElementById('cfg'); if (!el) return; const parts=(location.hash||'').slice(2).split('/'); const p = D.products.find(x=>x.id===parts[2]); if (!p) return;
  el.addEventListener('click', e => { const b = e.target.closest('[data-k] button'); if (!b) return; const k=b.parentElement.dataset.k; CF[p.id][k]=b.dataset.v; b.parentElement.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); cfgRender(p); });
  cfgRender(p);
}

/* ---------- Wire into pages ---------- */
const _home = pages.home, _product = pages.product;
pages.home = () => {
  let h = _home();
  h = h.replace('<section class="hero">', '<section class="hero hero-x">').replace(/(<\/div><\/section>)/, '</div><a href="#story" class="scroll-cue" onclick="document.getElementById(\'story\')?.scrollIntoView({behavior:\'smooth\'});return false;"><span>Scroll</span><i></i></a></section>');
  h = h.replace(/<section class="sec"><div class="wrap stack" style="gap:32px"><div class="stack" style="max-width:680px"><p class="eyebrow ">Four modalities[\s\S]*?<\/section>/, storyHTML() + counterHTML() + teaserHTML());
  return h;
};
pages.product = (cat, id) => {
  let h = _product(cat, id); const p = D.products.find(x=>x.id===id&&x.category===cat); if (!p) return h;
  const cfg = cfgHTML(p); if (!cfg) return h;
  const re = /<section class="wrap" style="padding-block:28px;border-top:1px solid var\(--line\)"><p class="eyebrow ">Configurations[\s\S]*?<\/section>/;
  return re.test(h) ? h.replace(re, cfg) : h.replace('<section class="sec" style="background:var(--surf)">', cfg + '<section class="sec" style="background:var(--surf)">');
};
pages.planner = () => plannerHTML() + enquiry('Prefer to talk it through?');
NAV.splice(1, 0, ['Planner', '#/planner']);

let ticking = false;
function onScroll(){ if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; storyUpdate(); const st = document.getElementById('story'); let pinned = false; if (st) { const r = st.getBoundingClientRect(); pinned = r.top <= 1 && r.bottom >= innerHeight - 1; } document.body.classList.toggle('over', document.body.classList.contains('is-home') && (scrollY < innerHeight*0.85 - 66 || pinned)); }); }
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
document.addEventListener('click', e => { const b = e.target.closest('.story-rail button'); if (!b) return; const s = document.getElementById('story'); const span = s.offsetHeight - innerHeight; scrollTo({ top: s.offsetTop + span*(+b.dataset.go + 0.5)/CHAPTERS.length, behavior: RM()?'auto':'smooth' }); });
function afterRender(){
  const home = !(location.hash||'#/').replace('#/','').length; document.body.classList.toggle('is-home', home); storyIdx = -1;
  plannerInit(); cfgInit(); observe(); onScroll();
}
/* ---------- Tile hero: four real sessions, one per modality. Hover or tap a tile to open it, click through to the range. ---------- */
const HT = [['air','hero-air','24%'],['ice','hero-ice','30%'],['heat','hero-heat','38%'],['light','hero-light','26%']];
function tileHeroHTML(){
if (!HT.every(t => D.img[t[1]])) return '';
const tiles = HT.map(([k,img,y],i) => { const m = D.modalities[k]; return `<a class="ht ht-${k}${i===0?' on':''}" href="#/products/${m.category}" data-i="${i}" style="--y:${y}"><img src="${D.img[img]}" alt="${esc(m.name)} session at a OneBase venue"><span class="ht-veil"></span><span class="ht-cap"><span class="ht-lab">${m.label}</span><span class="ht-name">${m.name}</span><span class="ht-more"><span class="ht-blurb">${m.blurb}</span><span class="ht-go">See the range →</span></span></span><span class="ht-bar"></span></a>`; }).join('');
return `<section class="hero hero-tiles"><div class="ht-copy">${eyebrow('Air · Ice · Heat · Light')}<h1>Recovery equipment engineered for the facilities people come back to.</h1><p class="key">Hyperbaric, cold, heat and light. Built in-house, medically led, connected by one platform.</p><div class="row"><a href="#/contact" class="btn" style="background:#fff;color:#1f1f1f">Talk to sales</a><a href="#/products" class="btn" style="border-color:rgba(255,255,255,.45);color:#fff">See the products</a></div></div><div class="ht-grid" role="list">${tiles}</div></section>`;
}
const _homeT = pages.home;
pages.home = () => {
let h = _homeT().replace(counterHTML(), '');
const t = tileHeroHTML();
return t ? h.replace(/<section class="hero hero-x">[\s\S]*?<\/section>/, t) : h;
};
let htTimer = null, htUser = false, htPtr = 'mouse';
document.addEventListener('pointerdown', e => { htPtr = e.pointerType; }, true); document.addEventListener('keydown', () => { htPtr = 'key'; }, true);
function htSet(i){ document.querySelectorAll('.ht').forEach(el => el.classList.toggle('on', +el.dataset.i === i)); }
function htCycle(){ clearInterval(htTimer); if (htUser || RM()) return; htTimer = setInterval(() => { const g = document.querySelector('.ht-grid'); if (!g) { clearInterval(htTimer); return; } if (g.getBoundingClientRect().bottom < 0) return; const on = document.querySelector('.ht.on'); htSet(((on ? +on.dataset.i : -1) + 1) % HT.length); }, 3600); }
document.addEventListener('pointerover', e => { const t = e.target.closest('.ht'); if (!t || e.pointerType === 'touch') return; htUser = true; clearInterval(htTimer); htSet(+t.dataset.i); });
document.addEventListener('focusin', e => { const t = e.target.closest('.ht'); if (!t || htPtr === 'touch') return; htUser = true; clearInterval(htTimer); htSet(+t.dataset.i); });
document.addEventListener('click', e => { const t = e.target.closest('.ht'); if (!t || t.classList.contains('on') || htPtr !== 'touch') return; e.preventDefault(); htUser = true; clearInterval(htTimer); htSet(+t.dataset.i); });
addEventListener('hashchange', () => setTimeout(htCycle, 50)); setTimeout(htCycle, 50);
