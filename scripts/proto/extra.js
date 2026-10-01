/* ===== High-end layer: scroll story, counters, reveal, configurator ===== */
const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const MODC = { air:{deep:'#122232',glow:'#9aacbe',soft:'#e7f6fd'}, ice:{deep:'#063944',glow:'#5c94ab',soft:'#c8e2e8'}, heat:{deep:'#3b1a0f',glow:'#e6886a',soft:'#f0d48e',acc:'#c4522e'}, light:{deep:'#3d1017',glow:'#ea7c8c',soft:'#f7bfbf',acc:'#8b2232'} };
const fmt = (n) => Math.round(n).toLocaleString('en-US');

/* ---------- Scroll story ---------- */
const CHAPTERS = [
  { k:'air', label:'Air', cat:'hbot', img:'cut-airform-plus-black', title:'Hyperbaric oxygen, from soft-shell to walk-in suite.', lead:'Four chambers from 1.3 to 2.0 ATA. Soft-shell for flexibility, steel for clinic pressures, and the modular AirSuite room with medical-grade BIBS.', stats:[['1.3–2.0','ATA pressure range'],['4','chamber models'],['BIBS','medical-grade in AirSuite']] },
  { k:'ice', label:'Ice', cat:'cold-therapy', img:'cut-icevault-quad', title:'Cold therapy without the water, the ice or the gas.', lead:'The IceVault is a dry, electric cold room for two to eight people. Longer, more tolerable sessions, no wet floors, and a self-cleaning cycle.', stats:[['32–40°F','dry, electric cold'],['2–8','people per session'],['0','plumbing required']] },
  { k:'heat', label:'Heat', cat:'sauna', img:'cut-yakisugi', title:'Infrared or traditional, built to run all day.', lead:'Low-EMF full-spectrum infrared in Yakisugi-charred cedar or clean Hemlock, or a custom traditional sauna we design, build and install for your room.', stats:[['135–149°F','restorative heat'],['Low-EMF','near, mid and far IR'],['2–8','people per cabin']] },
  { k:'light', label:'Light', cat:'red-light', img:'cut-lightbed-black', title:'Whole-body red light, dosed to the protocol.', lead:'Lie down in the LightBed, stand in the LightZone, or start with a LightPanel. Five wavelengths from 633 to 940 nm across the range.', stats:[['3','ways to deliver it'],['5','wavelengths'],['49,600','LEDs in the LightZone']] },
];
function storyHTML(){
  if (RM()) return `<section class="story-flat">${CHAPTERS.map((c,i)=>`<div class="ch-flat" style="--sbg:${MODC[c.k].deep};--sglow:${MODC[c.k].glow}"><div class="wrap grid"><div class="ch"><p class="num"><b>0${i+1}</b> · ${c.label}</p><h2>${c.title}</h2><p class="lead">${c.lead}</p><div class="stats">${c.stats.map(s=>`<div><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join('')}</div><a class="go" href="#/products/${c.cat}">Explore ${c.label.toLowerCase()} →</a></div>${D.img[c.img]?`<a href="#/products/${c.cat}" aria-label="Explore ${c.label.toLowerCase()}"><img src="${D.img[c.img]}" alt=""></a>`:''}</div></div>`).join('')}</section>`;
  return `<section class="story" id="story" style="height:${CHAPTERS.length*100+60}svh" aria-label="Four modalities">
  <div class="story-stage" style="--sbg:${MODC.air.deep};--sglow:${MODC.air.glow}"><div class="story-glow"></div><div class="story-grain"></div>
   <div class="wrap story-grid">
    <div class="story-copy">${CHAPTERS.map((c,i)=>`<div class="ch${i===0?' on':''}" data-i="${i}"><p class="num">${c.label}</p><h2>${c.title}</h2><p class="lead">${c.lead}</p><div class="stats">${c.stats.map(s=>`<div><strong>${s[0]}</strong><span>${s[1]}</span></div>`).join('')}</div><a class="go" href="#/products/${c.cat}">Explore ${c.label.toLowerCase()} →</a></div>`).join('')}</div>
    <div class="story-media">${CHAPTERS.map((c,i)=>`<figure class="${i===0?'on':''}" data-i="${i}">${storyFig(c)}</figure>`).join('')}</div>
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

/* ---------- Equipment catalogue (used by the ROI calculator, the guide and the products filter) ---------- */
const CAT = {
  IV2:{p:'icevault',s:'Duo',m:'ice',w:47.24,d:51.8,n:2,cyc:15,img:'cut3-icevault-duo'}, IV4:{p:'icevault',s:'Quad',m:'ice',w:74.8,d:70.87,n:4,cyc:15,img:'cut-icevault-quad'}, IV8:{p:'icevault',s:'Octo',m:'ice',w:106.3,d:110.24,n:8,cyc:15,img:'cut-icevault-octo'},
  YK2:{p:'yakisugi',s:'Duo',m:'heat',w:68.9,d:68.9,n:2,cyc:45,img:'cut3-yakisugi-duo'}, YK4:{p:'yakisugi',s:'Quad',m:'heat',w:79,d:79,n:4,cyc:45,img:'cut-yakisugi'}, YK8:{p:'yakisugi',s:'Octo',m:'heat',w:108.5,d:108.5,n:8,cyc:45,img:'cut3-yakisugi-octo'},
  HM4:{p:'hemlock',s:'Quad',m:'heat',w:83,d:52,n:4,cyc:45,img:'hemlock'},
  AFT:{p:'airfit',s:'Plus',m:'air',w:86.5,d:50,n:1,cyc:75,img:'airfit'}, AFP:{p:'airform',s:'Plus',m:'air',w:87,d:58,n:1,cyc:75,img:'airform-plus-black'}, AS2:{p:'airsuite',s:'Duo',m:'air',w:86.6,d:63,n:2,cyc:75,img:'canva-airsuite-duo'},
  LB:{p:'lightbed',s:'',m:'light',w:89.5,d:51,n:1,cyc:25,img:'cut-lightbed-black'}, LZ:{p:'lightzone',s:'',m:'light',w:54,d:56,n:1,cyc:15,img:'cut3-lightzone'}, LP4:{p:'lightpanel',s:'Quad',m:'light',w:31.5,d:60,n:1,cyc:20,img:'lightpanel-quad'},
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
function prodName(c){ const p = D.products.find(x=>x.id===c.p); return 'OneBase ' + (p?p.name:c.p) + (c.s?' '+c.s:''); }
const rngStyle = (el) => { const v=(el.value-el.min)/(el.max-el.min)*100; el.style.setProperty('--v', v+'%'); };
function teaserHTML(){ return ''; }

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
  lightzone:{_one:[54,56,92.5,1],_p:'8000 W · 220–240 V'},
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
     <div class="row"><button class="btn btn-p" id="cfgQuote">Get pricing for this build</button></div>
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
  document.getElementById('cfgQuote').onclick = () => { const m = document.getElementById('msg'); window.OB_CFG = `${name} · ${st.col}`; if (m) m.value = `I'd like pricing for: ${window.OB_CFG}`; document.getElementById('enquiry')?.scrollIntoView({behavior: RM()?'auto':'smooth'}); };
}
function cfgInit(){
  const el = document.getElementById('cfg'); if (!el) return; const parts=obHash().slice(2).split('/'); const p = D.products.find(x=>x.id===parts[2]); if (!p) return;
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

let ticking = false;
function onScroll(){ if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; storyUpdate(); const st = document.getElementById('story'); let pinned = false; if (st) { const r = st.getBoundingClientRect(); pinned = r.top <= 1 && r.bottom >= innerHeight - 1; } document.body.classList.toggle('over', document.body.classList.contains('is-home') && (scrollY < innerHeight*0.85 - 66 || pinned)); }); }
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
document.addEventListener('click', e => { const b = e.target.closest('.story-rail button'); if (!b) return; const s = document.getElementById('story'); const span = s.offsetHeight - innerHeight; scrollTo({ top: s.offsetTop + span*(+b.dataset.go + 0.5)/CHAPTERS.length, behavior: RM()?'auto':'smooth' }); });
function afterRender(){
  const home = !obHash().replace('#/','').length; document.body.classList.toggle('is-home', home); storyIdx = -1;
  cfgInit(); observe(); onScroll();
}
/* ---------- Tile hero: four real sessions, one per modality. Hover or tap a tile to open it, click through to the range. ---------- */
const HT = [['air','hero-air','24%'],['ice','hero-ice','30%'],['heat','hero-heat','38%'],['light','hero-light','26%']];
function tileHeroHTML(){
if (!HT.every(t => D.img[t[1]])) return '';
const tiles = HT.map(([k,img,y],i) => { const m = D.modalities[k]; return `<a class="ht ht-${k}${i===0?' on':''}" href="#/products/${m.category}" data-i="${i}" style="--y:${y}"><img src="${D.img[img]}" alt="${esc(m.name)} session at a OneBase venue"><span class="ht-veil"></span><span class="ht-cap"><span class="ht-lab">${m.label}</span><span class="ht-name">${m.name}</span><span class="ht-more"><span class="ht-blurb">${m.blurb}</span><span class="ht-go">See the range →</span></span></span><span class="ht-bar"></span></a>`; }).join('');
const pills = HT.map(([k],i) => `<button type="button" data-i="${i}" aria-pressed="${i===0}">${D.modalities[k].label}</button>`).join('');
const m0 = D.modalities[HT[0][0]];
return `<section class="hero hero-tiles"><div class="ht-copy"><div class="ht-pills" role="group" aria-label="Modality">${pills}</div><a class="ht-now" href="#/products/${m0.category}"><span>${m0.name}</span> · See the range →</a>${eyebrow('Air · Ice · Heat · Light')}<h1>Recovery equipment engineered for the facilities people come back to.</h1><p class="key">Hyperbaric, cold, heat and light. Built in-house, medically led, connected by one platform.</p><div class="row"><a href="#/contact" class="btn" style="background:#fff;color:#1f1f1f">Talk to sales</a><a href="#/products" class="btn" style="border-color:rgba(255,255,255,.45);color:#fff">See the products</a></div></div><div class="ht-grid" role="list">${tiles}</div></section>`;
}
const _homeT = pages.home;
pages.home = () => {
let h = _homeT().replace(counterHTML(), '');
const t = tileHeroHTML();
return t ? h.replace(/<section class="hero hero-x">[\s\S]*?<\/section>/, t) : h;
};
let htTimer = null, htUser = false, htPtr = 'mouse';
document.addEventListener('pointerdown', e => { htPtr = e.pointerType; }, true); document.addEventListener('keydown', () => { htPtr = 'key'; }, true);
function htSet(i){ document.querySelectorAll('.ht').forEach(el => el.classList.toggle('on', +el.dataset.i === i)); document.querySelectorAll('.ht-pills button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === i))); const now = document.querySelector('.ht-now'), m = D.modalities[HT[i][0]]; if (now) { now.href = '#/products/' + m.category; now.firstChild.textContent = m.name; } }
document.addEventListener('click', e => { const b = e.target.closest('.ht-pills button'); if (!b) return; htUser = true; clearInterval(htTimer); htSet(+b.dataset.i); });
function htCycle(){ clearInterval(htTimer); if (htUser || RM()) return; htTimer = setInterval(() => { const g = document.querySelector('.ht-grid'); if (!g) { clearInterval(htTimer); return; } if (g.getBoundingClientRect().bottom < 0) return; const on = document.querySelector('.ht.on'); htSet(((on ? +on.dataset.i : -1) + 1) % HT.length); }, 3600); }
document.addEventListener('pointerover', e => { const t = e.target.closest('.ht'); if (!t || e.pointerType === 'touch') return; htUser = true; clearInterval(htTimer); htSet(+t.dataset.i); });
document.addEventListener('focusin', e => { const t = e.target.closest('.ht'); if (!t || htPtr === 'touch') return; htUser = true; clearInterval(htTimer); htSet(+t.dataset.i); });
document.addEventListener('click', e => { const t = e.target.closest('.ht'); if (!t || t.classList.contains('on') || htPtr !== 'touch') return; e.preventDefault(); htUser = true; clearInterval(htTimer); htSet(+t.dataset.i); });
addEventListener('obroute', () => setTimeout(htCycle, 50)); setTimeout(htCycle, 50);

/* ---------- Home: software, Tesla-style — one idea per chapter, the real product in frame, a live screen you can use ---------- */
const ST = { tab:'ready', mins:60, ata:1.3, left:3600, tog:{light:true,ac:true,bibs:false}, ph:'today', proto:0, booked:false, room:-1, tech:false, upd:'idle' };
const ST_PROTOS = [['Deep Recovery','Hyperbaric · 60 min · 1.3 ATA'],['Post-workout reset','Cold · 3 min · 38°F'],['Detox','Sauna · 30 min · 140°F'],['Skin & repair','Red light · 12 min']];
const ST_ROOMS = [['AirSuite Solo','In session','1.30 ATA · 42 min left','Service in 38 days'],['IceVault Quad','In session','37°F · 2 of 4 seats','Service in 12 days'],['Yakisugi Quad','Heating','128°F → 140°F','Service in 51 days'],['LightBed','Service due','Filter hours at 96%','Service due in 5 days'],['AirForm Plus','Ready','Next booking 7:00 pm','Service in 64 days'],['Hemlock Quad','Cleaning','Cycle ends in 6 min','Service in 29 days']];
const stFmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
const ST_MODS = [
 { k:'air', label:'Air', unit:'AirSuite Solo', imgs:['as-man','hero-air'], a:['Time','min',60,20,90,5], b:['Pressure','ATA',1.3,1.1,1.5,0.1,1], c:['Air breaks',['Off','Every 20 min','Every 30 min'],1], start:1.0, tog:[['Lights',1],['Air con',1],['BIBS',0]], done:'Vented and logged to OneBase OS.' },
 { k:'ice', label:'Ice', unit:'IceVault Quad', imgs:['hero-ice','render-icevault-studio'], a:['Time','min',3,1,10,1], b:['Temperature','°F',38,30,50,1,0], start:68, tog:[['Lights',1],['Music',1],['Airflow',1]], done:'Room back to standby and logged.' },
 { k:'heat', label:'Heat', unit:'Yakisugi Quad', imgs:['hero-heat','yk-real-open'], a:['Time','min',30,10,45,5], b:['Temperature','°F',140,120,149,1,0], start:72, tog:[['Lights',1],['Music',1],['Colour light',0]], done:'Cabin cooling down and logged.' },
 { k:'light', label:'Light', unit:'LightBed', imgs:['hero-light','photo-lightbed-2'], a:['Time','min',12,6,20,2], b:['Intensity','%',100,50,100,10,0], start:0, tog:[['Pulse',0],['Fan',1],['Music',1]], done:'Bed cooled and logged.' }];
ST.mod = 0; ST.va = ST_MODS[0].a[2]; ST.vb = ST_MODS[0].b[2]; ST.vc = 1; ST.tg = ST_MODS[0].tog.map(t=>!!t[1]);
const stM = () => ST_MODS[ST.mod];
function stBreak(){ const cyc = (ST.vc === 1 ? 20 : 30) * 60, el = ST.va * 60 - ST.left, t = el % (cyc + 300); return t >= cyc ? `Air break · back on oxygen in ${stFmt(cyc + 300 - t)}` : `On oxygen · air break in ${stFmt(cyc - t)}`; }
const stFmtB = (m, v) => m.b[1] === 'ATA' ? v.toFixed(m.b[6] ? 2 : 1) + ' ATA' : Math.round(v) + (m.b[1] === '%' ? '%' : m.b[1]);
function stImg(m){ const i = m.imgs.find(x => D.img[x]); return i ? D.img[i] : ''; }
function stTabHTML(){
  const t = ST.tab, m = stM();
  const bar = st => `<div class="sx-bar"><span>${m.unit}</span><span class="sx-st">${st}</span></div>`;
  const adj = (key, cfg, v) => `<div><span>${cfg[0]}</span><div class="st-adj"><button data-st="adj" data-key="${key}" data-d="-1" aria-label="Less ${cfg[0].toLowerCase()}">−</button><b>${key==='a' ? v + ' ' + cfg[1] : stFmtB(m, v).replace(/(\d)(ATA)/,'$1 $2')}</b><button data-st="adj" data-key="${key}" data-d="1" aria-label="More ${cfg[0].toLowerCase()}">+</button></div></div>`;
  const brk = m.c ? `<div class="st-brk"><span>${m.c[0]}</span><div class="st-seg">${m.c[1].map((o,i)=>`<button data-st="brk" data-i="${i}" aria-pressed="${i===ST.vc}">${o}</button>`).join('')}</div>${ST.vc?`<small>5 min on air after every ${ST.vc===1?20:30} min on oxygen</small>`:''}</div>` : '';
  if (t === 'ready') return `${bar('Ready')}<div class="st-pre">${adj('a', m.a, ST.va)}${adj('b', m.b, ST.vb)}</div>${brk}<button class="sx-btn" data-st="start">Start session</button>`;
  if (t === 'run') { const k = 1 - ST.left / (ST.va * 60); const cur = m.b[1] === '%' ? ST.vb : m.start + (ST.vb - m.start) * Math.min(1, k * 4);
    return `${bar('In session')}<div class="sx-run"><div><span>Time left</span><b class="st-left">${stFmt(ST.left)}</b></div><div><span>${m.b[0]}</span><b class="st-cur">${stFmtB(m, cur)}</b></div></div><div class="sx-meter"><i class="sx-fill" style="width:${k*100}%"></i></div>${m.c && ST.vc ? `<p class="st-nb">${stBreak()}</p>` : ''}<div class="st-row">${m.tog.map((x,i)=>`<button class="st-tg" data-st="tog" data-i="${i}" aria-pressed="${ST.tg[i]}">${x[0]}<i></i></button>`).join('')}<button class="st-end" data-st="end">End</button></div>`; }
  return `${bar('Complete')}<div class="sx-mid"><div class="sx-ok">✓</div><b class="sx-big">Session complete</b><span class="sx-m">${m.done}</span></div><button class="sx-btn" data-st="reset">New session</button>`;
}
function stModsHTML(){ return `<div class="st-mods" role="tablist" aria-label="Product">${ST_MODS.map((m,i)=>`<button role="tab" data-st="mod" data-i="${i}" aria-selected="${i===ST.mod}">${m.label}</button>`).join('')}</div><button class="st-arr st-prev" data-st="modstep" data-d="-1" aria-label="Previous product">‹</button><button class="st-arr st-next" data-st="modstep" data-d="1" aria-label="Next product">›</button>`; }
function stSetMod(i, dir){
  ST.mod = (i + ST_MODS.length) % ST_MODS.length; const m = stM(); clearInterval(stT);
  ST.tab = 'ready'; ST.va = m.a[2]; ST.vb = m.b[2]; ST.vc = m.c ? m.c[2] : 0; ST.tg = m.tog.map(t=>!!t[1]);
  const vis = document.querySelector('.st-a1 .st-vis'); if (!vis) return;
  vis.dataset.mod = m.k; const img = vis.querySelector('img'), src = stImg(m);
  if (img && src) { img.classList.remove('in-l','in-r'); void img.offsetWidth; img.src = src; img.classList.add(dir < 0 ? 'in-l' : 'in-r'); }
  vis.querySelectorAll('.st-mods button').forEach(b => b.setAttribute('aria-selected', String(+b.dataset.i === ST.mod)));
  stPaint('tab');
}
function stPhoneHTML(){
  const p = ST.ph, pr = ST_PROTOS[ST.proto];
  let body = '';
  if (p === 'today') body = ST.booked ? `<div class="sx-ok">✓</div><b class="sx-c">You’re booked</b><span class="sx-c sx-m">${pr[0]} · Thu 6:30 pm</span><button class="st-ghost" data-st="unbook">Change booking</button>` : `<p class="sx-k">Good evening, Sam</p><div class="sx-card"><p class="sx-k">Today’s protocol</p><b>${pr[0]}</b><span>${pr[1]}</span></div><p class="sx-k">Thursday</p><div class="sx-slots"><i>5:30</i><i class="on">6:30</i><i>7:30</i></div><button class="sx-btn" data-st="book">Book 6:30 pm</button>`;
  if (p === 'protos') body = `<p class="sx-k">Protocols</p>${ST_PROTOS.map((x,i)=>`<button class="st-pro" data-st="proto" data-i="${i}" aria-pressed="${i===ST.proto}"><b>${x[0]}</b><span>${x[1]}</span></button>`).join('')}`;
  if (p === 'progress') body = `<p class="sx-k">This month</p><b class="st-bigc">4 sessions</b><div class="sx-bars">${[40,65,50,80,70,90].map(h=>`<i style="height:${h}%"></i>`).join('')}</div><div class="sx-row"><span>Streak</span><b>3 weeks</b></div><div class="sx-row"><span>Favourite</span><b>Deep Recovery</b></div>`;
  return `<div class="sx-notch"></div><div class="st-pbody">${body}</div><nav class="st-nav">${[['today','Today'],['protos','Protocols'],['progress','Progress']].map(([k,l])=>`<button data-st="ph" data-k="${k}" aria-pressed="${p===k}">${l}</button>`).join('')}</nav>`;
}
function stDashHTML(){
  const inUse = ST_ROOMS.filter(r=>r[1]==='In session').length;
  return `<div class="sx-bar"><span>OneBase OS · All sites</span><span class="sx-m">Demo data</span></div><div class="sx-kpi"><div><span>Sessions today</span><b>86</b></div><div><span>Rooms in use</span><b>${inUse} of 6</b></div><div><span>Alerts</span><b class="${ST.tech?'':'st-warn'}">${ST.tech?0:1}</b></div></div><div class="sx-rooms">${ST_ROOMS.map((r,i)=>{ const st = (i===3&&ST.tech)?'Service booked':r[1]; return `<button class="st-room" data-st="room" data-i="${i}" aria-expanded="${ST.room===i}"><span>${r[0]}</span><em class="show st-${st.toLowerCase().replace(/ /g,'-')}">${st}</em>${ST.room===i?`<small>${r[2]}<br>${i===3&&ST.tech?'Technician booked for Tue 9:00 am':r[3]}</small>`:''}</button>`; }).join('')}</div>${ST.tech?`<div class="st-okb">Technician booked for Tuesday 9:00 am</div>`:`<div class="sx-alert show st-al"><span>LightBed · filter service due in 5 days</span><button data-st="tech">Book technician</button></div>`}`;
}
function stUpdHTML(){
  const u = ST.upd;
  return `<span>Controller software</span><b>${u==='idle'?'Up to date':u==='check'?'Checking…':u==='get'?'Installing update':'Updated'}</b><i class="st-upbar ${u}"></i><small>${u==='done'?'New: guided cool-down protocol added':u==='get'?'Sessions carry on as normal':'Last checked this morning'}</small>${u==='idle'||u==='done'?`<button class="st-ghost" data-st="upd">Check for updates</button>`:''}`;
}
function stPaint(which){ const m = { tab:['.st-tab .sx-bez',stTabHTML], ph:['.st-phone .sx-bez',stPhoneHTML], dash:['.st-dash .sx-bez',stDashHTML], upd:['.st-ver',stUpdHTML] }; (which?[which]:Object.keys(m)).forEach(k=>{ const el=document.querySelector(m[k][0]); if (el) el.innerHTML = m[k][1](); }); }
function swOverviewHTML(){
  const hint = '<span class="st-hint">Tap to try</span>';
  const ch = (cls, img, eb, h, p, link, dev) => `<article class="st-ch ${cls}"><div class="st-copy"><p class="eyebrow">${eb}</p><h2>${h}</h2><p class="st-p">${p}</p>${link}</div><div class="st-vis">${img?`<img src="${D.img[img]}" alt="">`:''}${dev}</div></article>`;
  return `<section class="st" aria-label="Software">
  <article class="st-ctl"><div class="st-ctl-copy"><p class="eyebrow">AirSuite controller</p><h2>Guided, start to finish.</h2><p class="st-p">Your operator starts and watches the session. The chamber handles the profile.</p></div><div class="st-ctl-dev" aria-hidden="true">${tbHTML()}</div><ol class="st-caps"><li><b>Settings load from the booking</b><span>Time, pressure and speed arrive with the member.</span></li><li><b>Airbreaks, handled automatically</b><span>Oxygen and air alternate on schedule.</span></li><li><b>One tap to start</b><span>Close the door and the profile runs, with your operator watching.</span></li></ol><a class="st-link" href="#/software" data-apz-modal>Try the real controller app →</a></article>
  ${ch('st-a2 st-flip','af-life','OneBase app','Their plan, in their pocket.','Doctor-built protocols, booking and progress in one app. Members know what to do, and keep coming back to do it.','<a class="st-link" href="#/software">See the member app →</a>',`<div class="st-dev st-phone">${hint}<div class="sx-bez">${stPhoneHTML()}</div></div>`)}
  ${ch('st-a3 st-dark','','OneBase OS · Coming late 2026','Every room. Every site. One screen.','Live status, usage and alerts for every unit you own, so problems reach you before they reach a member.','<a class="st-link" href="#/software">Explore OneBase OS →</a>',`<div class="st-dev st-dash">${hint}<div class="sx-bez">${stDashHTML()}</div></div>`)}
  ${ch('st-a4 st-dark st-upd','','Software updates','It gets better after it’s installed.','New protocols and controller features arrive as software updates. No site visit, no downtime.','<a class="st-link" href="#/contact">Talk to sales →</a>',`<div class="st-ver">${stUpdHTML()}</div>`)}
  </section>`;
}
let stT = null;
function stRunTimer(){ clearInterval(stT); if (ST.tab !== 'run') return; stT = setInterval(() => { if (!document.querySelector('.st') || ST.tab !== 'run') { clearInterval(stT); return; } ST.left = Math.max(0, ST.left - Math.max(1, Math.round(ST.va * 60 / 90))); if (ST.left === 0) { ST.tab = 'done'; stPaint('tab'); clearInterval(stT); return; } const l = document.querySelector('.st-left'); if (l) l.textContent = stFmt(ST.left); const k = 1-ST.left/(ST.va*60); const f = document.querySelector('.st-tab .sx-fill'); if (f) f.style.width = k*100 + '%'; const m = stM(), c = document.querySelector('.st-cur'); const nb = document.querySelector('.st-nb'); if (nb) nb.textContent = stBreak(); if (c && m.b[1] !== '%') c.textContent = stFmtB(m, m.start + (ST.vb - m.start) * Math.min(1, k * 4)); }, 1000); }
document.addEventListener('click', e => {
  const b = e.target.closest('[data-st]'); if (!b || !b.closest('.st')) return; e.preventDefault(); const a = b.dataset.st;
  b.closest('.st-dev')?.classList.add('used');
  if (a === 'adj') { const m = stM(), c = b.dataset.key === 'a' ? m.a : m.b, d = +b.dataset.d * c[5]; if (b.dataset.key === 'a') ST.va = Math.min(c[4], Math.max(c[3], ST.va + d)); else ST.vb = Math.round(Math.min(c[4], Math.max(c[3], ST.vb + d)) * 10) / 10; stPaint('tab'); }
  if (a === 'start') { ST.tab = 'run'; ST.left = ST.va * 60; stPaint('tab'); stRunTimer(); }
  if (a === 'tog') { const i = +b.dataset.i; ST.tg[i] = !ST.tg[i]; b.setAttribute('aria-pressed', ST.tg[i]); }
  if (a === 'brk') { ST.vc = +b.dataset.i; stPaint('tab'); }
  if (a === 'mod') { const i = +b.dataset.i; stSetMod(i, i < ST.mod ? -1 : 1); }
  if (a === 'modstep') { stSetMod(ST.mod + +b.dataset.d, +b.dataset.d); }
  if (a === 'end') { ST.tab = 'done'; clearInterval(stT); stPaint('tab'); }
  if (a === 'reset') { ST.tab = 'ready'; stPaint('tab'); }
  if (a === 'ph') { ST.ph = b.dataset.k; stPaint('ph'); }
  if (a === 'proto') { ST.proto = +b.dataset.i; ST.ph = 'today'; ST.booked = false; stPaint('ph'); }
  if (a === 'book') { ST.booked = true; stPaint('ph'); }
  if (a === 'unbook') { ST.booked = false; stPaint('ph'); }
  if (a === 'room') { ST.room = ST.room === +b.dataset.i ? -1 : +b.dataset.i; stPaint('dash'); }
  if (a === 'tech') { ST.tech = true; ST.room = 3; stPaint('dash'); }
  if (a === 'upd') { ST.upd = 'check'; stPaint('upd'); setTimeout(() => { ST.upd = 'get'; stPaint('upd'); setTimeout(() => { ST.upd = 'done'; stPaint('upd'); }, 2600); }, 1200); }
});
addEventListener('obroute', () => setTimeout(stRunTimer, 60));
const _homeS = pages.home;
pages.home = () => {
  let h = _homeS();
  h = h.replace(/<section class="sec"><div class="wrap grid g2" style="align-items:center;gap:48px"><div class="stack"><p class="eyebrow ">OneBase OS · coming late 2026[\s\S]*?<\/section>/, '');
  const b = h.indexOf('>Built for business<'); const at = b < 0 ? -1 : h.lastIndexOf('<section', b);
  return at < 0 ? h : h.slice(0, at) + swOverviewHTML() + h.slice(at);
};

/* ---------- Customer wording: no venue counts anywhere ---------- */
const _homeC = pages.home, _custC = pages.customers, _partC = pages.partners;
pages.home = () => _homeC().replace(/Installed at \d+\+ venues/, 'Trusted by leading operators worldwide');
pages.customers = () => _custC().replace(/\d+\+ venues run on OneBase\./, 'Leading venues run on OneBase.').replace(/ <span style="opacity:\.6">\d+<\/span>/g, '');
pages.partners = () => _partC().replace(/\d+\+ businesses across/, 'Trusted by businesses across');

(() => { let x0 = null, y0 = 0;
  document.addEventListener('dragstart', e => { if (e.target.closest && e.target.closest('.st-a1 .st-vis')) e.preventDefault(); });
  document.addEventListener('pointerdown', e => { const v = e.target.closest('.st-a1 .st-vis'); if (!v || e.target.closest('button')) { x0 = null; return; } x0 = e.clientX; y0 = e.clientY; });
  document.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { stSetMod(ST.mod + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); document.querySelector('.st-a1 .st-dev')?.classList.add('used'); } });
  document.addEventListener('keydown', e => { if (!e.target.closest || !e.target.closest('.st-mods')) return; if (e.key === 'ArrowRight') stSetMod(ST.mod + 1, 1); if (e.key === 'ArrowLeft') stSetMod(ST.mod - 1, -1); });
})();

/* ---------- Scroll story: swipe through the products in each range ---------- */
// Each chapter's picture is a native, snapping horizontal track: finger and trackpad swipes use the browser's own momentum,
// the neighbouring products peek in at the edges, and a mouse can drag it too. Tap a product to open it.
const STORY_PRODUCTS = {
  air:   [['airform','cut-airform-plus-black','AirForm Plus'],['airfit','cut2-airfit','AirFit'],['airflex','cut2-airflex','AirFlex'],['airsuite','cut2-airsuite-duo','AirSuite Duo']],
  ice:   [['icevault','cut-icevault-quad','IceVault Quad'],['icevault','cut-icevault-octo','IceVault Octo']],
  heat:  [['yakisugi','cut-yakisugi','Yakisugi'],['traditional','trad-after','Custom Traditional','photo'],['hemlock','cut-hemlock','Hemlock']],
  light: [['lightbed','cut-lightbed-black','LightBed'],['lightzone','lz-photo','LightZone','photo'],['lightpanel','cut-lightpanel-quad','LightPanel Quad']],
};
const spList = (k) => (STORY_PRODUCTS[k] || []).filter(x => D.img[x[1]]);
function storyFig(c){
  const list = spList(c.k);
  if (!list.length) return D.img[c.img] ? `<a href="#/products/${c.cat}"><img src="${D.img[c.img]}" alt="OneBase ${c.label} equipment"></a>` : '';
  const slides = list.map(([id, img, name, mode], j) => `<a class="sp-slide${mode==='photo'?' sp-photo':''}" data-j="${j}" href="#/products/${c.cat}/${id}" draggable="false"><img src="${D.img[img]}" alt="OneBase ${esc(name)}" draggable="false"${mode==='key'?' data-key="1"':''}></a>`).join('');
  const many = list.length > 1;
  return `<div class="sp${many?' sp-many':''}" data-k="${c.k}" aria-roledescription="carousel" aria-label="${esc(c.label)} range">
    <div class="sp-track" tabindex="0">${slides}</div>
    <div class="sp-cap"><a class="sp-name" href="#/products/${c.cat}/${list[0][0]}">OneBase ${esc(list[0][2])}</a></div>
    ${many?`<div class="sp-dots" role="tablist" aria-label="${esc(c.label)} models">${list.map((x,j)=>`<button type="button" role="tab" data-sp="${j}" aria-label="OneBase ${esc(x[2])}" aria-selected="${j===0}"></button>`).join('')}</div><p class="sp-hint">${list.length} models · swipe or tap</p>`:''}</div>`;
}
function spIndex(tr){ const w = tr.clientWidth; let best = 0, bd = 1e9; tr.querySelectorAll('.sp-slide').forEach((s,j) => { const d = Math.abs(s.offsetLeft + s.offsetWidth/2 - (tr.scrollLeft + w/2)); if (d < bd) { bd = d; best = j; } }); return best; }
function spSync(sp){
  const tr = sp.querySelector('.sp-track'), j = spIndex(tr), k = sp.dataset.k, list = spList(k), cat = CHAPTERS.find(c => c.k===k).cat;
  if (sp.dataset.j === String(j)) return; sp.dataset.j = j;
  tr.querySelectorAll('.sp-slide').forEach((s,i) => s.classList.toggle('on', i===j));
  sp.querySelectorAll('.sp-dots button').forEach((d,i) => d.setAttribute('aria-selected', i === j));
  const nm = sp.querySelector('.sp-name'); nm.textContent = 'OneBase ' + list[j][2]; nm.setAttribute('href', `#/products/${cat}/${list[j][0]}`);
}
function spTo(sp, j){ const tr = sp.querySelector('.sp-track'); const s = tr.querySelectorAll('.sp-slide')[j]; if (!s) return; tr.scrollTo({ left: s.offsetLeft + s.offsetWidth/2 - tr.clientWidth/2, behavior: RM() ? 'auto' : 'smooth' }); }
function spInit(){
  document.querySelectorAll('.sp').forEach(sp => {
    const tr = sp.querySelector('.sp-track'); spSync(sp);
    tr.addEventListener('scroll', () => { cancelAnimationFrame(tr._raf); tr._raf = requestAnimationFrame(() => spSync(sp)); }, { passive:true });
    // mouse drag (touch and trackpads scroll natively)
    let drag = null;
    tr.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; drag = { x:e.clientX, left:tr.scrollLeft, j:spIndex(tr), moved:false }; });
    addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; tr.classList.add('drag'); } if (drag.moved) tr.scrollLeft = drag.left - dx; });
    addEventListener('pointerup', e => { if (!drag) return; const d = drag; drag = null; if (!d.moved) return; tr.classList.remove('drag'); const dx = e.clientX - d.x, n = tr.querySelectorAll('.sp-slide').length;
      spTo(sp, Math.abs(dx) > 40 ? Math.min(n-1, Math.max(0, d.j + (dx < 0 ? 1 : -1))) : d.j); sp._swiped = Date.now(); });
    tr.addEventListener('click', e => { if (sp._swiped && Date.now() - sp._swiped < 300) { e.preventDefault(); e.stopPropagation(); return; } const s = e.target.closest('.sp-slide'); if (s && !s.classList.contains('on')) { e.preventDefault(); spTo(sp, +s.dataset.j); } }, true);
    sp.querySelectorAll('.sp-arr').forEach(b => b.addEventListener('click', () => { const n = sp.querySelectorAll('.sp-slide').length; spTo(sp, Math.min(n-1, Math.max(0, spIndex(tr) + (b.classList.contains('sp-next') ? 1 : -1)))); }));
    tr.addEventListener('keydown', e => { if (e.key==='ArrowRight'||e.key==='ArrowLeft') { e.preventDefault(); const n = sp.querySelectorAll('.sp-slide').length; spTo(sp, Math.min(n-1, Math.max(0, spIndex(tr) + (e.key==='ArrowRight'?1:-1)))); } });
  });
}

// AirSuite's render sits on a studio backdrop; lift the product off it once, in the browser, so it matches the other cut-outs.
const spKeyed = {};
function spKeyOut(img){
  const src = img.getAttribute('src'); if (spKeyed[src]) { img.src = spKeyed[src]; img.dataset.key = ''; return; }
  const run = () => { try {
    const w = img.naturalWidth, h = img.naturalHeight; const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, w, h), a = d.data; const px = (x,y) => (y*w+x)*4;
    let r=0,g=0,b=0,c=0; for (let x=0;x<w;x+=4) for (const y of [0,h-1]) { const i=px(x,y); r+=a[i]; g+=a[i+1]; b+=a[i+2]; c++; } r/=c; g/=c; b/=c;
    const near = i => Math.hypot(a[i]-r, a[i+1]-g, a[i+2]-b) < 30; const seen = new Uint8Array(w*h); const st = [];
    for (let x=0;x<w;x++) { st.push(x, (h-1)*w+x); } for (let y=0;y<h;y++) { st.push(y*w, y*w+w-1); }
    while (st.length) { const p = st.pop(); if (seen[p]) continue; seen[p] = 1; const i = p*4; if (!near(i)) continue; a[i+3] = 0; const x = p % w, y = (p / w) | 0; if (x>0) st.push(p-1); if (x<w-1) st.push(p+1); if (y>0) st.push(p-w); if (y<h-1) st.push(p+w); }
    cx.putImageData(d, 0, 0); const url = cv.toDataURL('image/png'); spKeyed[src] = url; img.src = url; img.dataset.key = '';
  } catch (err) {} };
  if (img.complete && img.naturalWidth) run(); else img.addEventListener('load', run, { once:true });
}
const _afterRenderSP = afterRender;
afterRender = function(){ _afterRenderSP(); document.querySelectorAll('.sp img[data-key="1"]').forEach(spKeyOut); spInit(); };

// dots: tap one to jump to that model
document.addEventListener('click', e => { const d = e.target.closest('.sp-dots button'); if (!d) return; const sp = d.closest('.sp'); spTo(sp, +d.dataset.sp); });
