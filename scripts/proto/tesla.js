/* ===== Tesla-style product presentation: full-screen snap slides on /products, full-screen hero on product pages ===== */
const TS_ORDER = ['icevault','yakisugi','airform','lightbed','airsuite','airfit','airflex','hemlock','lightpanel'];
const TS_LEAD = { icevault:'Dry cold for two to eight. No water, no ice, no nitrogen.', yakisugi:'Charred cedar. Full-spectrum infrared. Built to run all day.', airform:'Steel hard-shell hyperbaric. Clinic pressures, calm inside.',
  lightbed:'Whole-body red and near-infrared. Five wavelengths.', airsuite:'A walk-in hyperbaric room with medical-grade BIBS.', airfit:'Soft-shell hyperbaric you can place almost anywhere.',
  airflex:'Step in, roll in. Accessible soft-shell hyperbaric.', hemlock:'Four-person full-spectrum infrared in light Hemlock.', lightpanel:'Red and near-infrared panels. One, two or four.' };
function tsImg(p){ return CUT[p.id] || (D.prodImg[p.id]) || null; }
const TS_MEDIA = {
  icevault:{mode:'render', img:'render-icevault-studio', bg:'#1a1a1a'}, yakisugi:{mode:'render', img:'yk-real-closed', bg:'#ffffff', light:true},
  airsuite:{mode:'render', img:'as-hero', bg:'#e9e9e7', light:true},
  airform:{mode:'photo', img:'photo-airform', pos:'55% 50%'}, lightbed:{mode:'photo', img:'photo-lightbed', pos:'50% 55%'},
  airfit:{mode:'photo', img:'photo-airfit', pos:'45% 40%'}, airflex:{mode:'render', img:'cut-airflex', bg:'#e7e9eb', light:true}, hemlock:{mode:'photo', img:'photo-hemlock', pos:'45% 35%'}, lightpanel:{mode:'photo', img:'photo-lightpanel', pos:'60% 35%'},
};
const TS_GALLERY = { icevault:['render-icevault-gym','photo-sports'], yakisugi:['render-yakisugi-spa','yk-real-34-open','yk-real-open'], airsuite:['as-ext','canva-airsuite-photo','as-cover'], airform:['photo-hbot-inside','photo-sports'], lightbed:['photo-lightbed-2','render-lightbed-studio'], hemlock:['photo-hemlock'], lightpanel:['photo-lightpanel'], airfit:['photo-airfit'] };
function tsMedia(p){ const m=TS_MEDIA[p.id]; if (m && D.img[m.img]) return m; const k=tsImg(p); return k&&D.img[k]?{mode:'cut',img:k}:null; }
function tsVisual(p, m, i){
  if (!m) return `<div class="ts-ghost">${esc(p.name)}</div>`;
  if (m.mode==='photo') return `<img class="ts-cover" src="${D.img[m.img]}" alt="OneBase ${esc(p.name)} in use" style="object-position:${m.pos||'50% 50%'}" loading="${i<2?'eager':'lazy'}"><div class="ts-veil"></div>`;
  if (m.mode==='render') return `<div class="ts-fig ts-render"><img class="ts-img" src="${D.img[m.img]}" alt="OneBase ${esc(p.name)}" loading="${i<2?'eager':'lazy'}"></div>`;
  return `<div class="ts-fig"><img class="ts-img ts-cut" src="${D.img[m.img]}" alt="OneBase ${esc(p.name)}" loading="${i<2?'eager':'lazy'}"><span class="ts-shadow"></span></div>`;
}
function tsCls(m){ if (!m) return ' ts-dark'; if (m.mode==='photo') return ' ts-photo ts-dark'; if (m.mode==='render') return m.light?' ts-rlight':' ts-dark ts-rdark'; return ''; }
function tsStyle(p,m){ return `--ts-tint:${MODC[p.modality].soft};--ts-deep:${MODC[p.modality].deep};--ts-glow:${MODC[p.modality].glow}${m&&m.bg?';--ts-rbg:'+m.bg:''}`; }
function tsSlide(p, i){
  const m = tsMedia(p); const cls = tsCls(m); const dark = /ts-dark/.test(cls); const f = FACTS[p.id]||[];
  return `<section class="ts${cls}" data-i="${i}" data-dark="${dark?1:0}" style="${tsStyle(p,m)}">
   <div class="ts-bg"></div>
   <div class="ts-top"><p class="ts-eyebrow">${D.modalities[p.modality].name}${p.status==='coming-soon'?' · Pre-order':''}</p><h2>OneBase ${esc(p.name)}</h2><p class="ts-lead">${esc(TS_LEAD[p.id]||p.tagline)}</p></div>
   ${tsVisual(p,m,i)}
   <div class="ts-bot"><div class="ts-stats">${f.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <div class="ts-cta"><a class="ts-b1" href="#/products/${p.category}/${p.id}">${p.status==='coming-soon'?'Pre-order':'Configure'}</a><a class="ts-b2" href="#/contact">Talk to sales</a></div></div></section>`;
}
const TS_ROWS = [['air',['airform','airsuite','airfit','airflex']],['heat',['yakisugi','hemlock']],['light',['lightbed','lightpanel']],['ice',['icevault']]];
function tsIndex(){
  const rows = TS_ROWS.map(([mk,ids])=>[mk, ids.map(id=>D.products.find(p=>p.id===id)).filter(Boolean)]);
  return `<div class="ts-wrap">${rows.map(([mk,ps],r)=>`<section class="ts-row" data-row="${r}" aria-label="${esc(D.modalities[mk].name)}">
    <div class="ts-track" data-row="${r}">${ps.map((p,k)=>tsSlide(p,r).replace('<section class="ts','<section data-k="'+k+'" class="ts')).join('')}</div>
    ${ps.length>1?`<div class="ts-rownav"><button class="ts-arr" data-dir="-1" data-row="${r}" aria-label="Previous model">‹</button><div class="ts-pips">${ps.map((p,k)=>`<button data-row="${r}" data-k="${k}" class="${k===0?'on':''}">${esc(p.name)}</button>`).join('')}</div><button class="ts-arr" data-dir="1" data-row="${r}" aria-label="Next model">›</button></div><p class="ts-swipe">${ps.length} models · swipe to explore</p>`:''}</section>`).join('')}
   <section class="ts ts-dark ts-end" data-dark="1" data-i="end"><div class="ts-bg"></div><div class="ts-top"><p class="ts-eyebrow">Planner</p><h2>Not sure where to start?</h2><p class="ts-lead">Tell us your venue and space. We’ll suggest the mix and lay it out to scale.</p></div>
    <div class="ts-bot"><div class="ts-cta"><a class="ts-b1" href="#/planner">Plan your room</a><a class="ts-b2" href="#/contact">Talk to sales</a></div></div></section>
   <nav class="ts-dots" aria-label="Categories">${rows.map(([mk],r)=>`<button data-go="${r}" aria-label="${esc(D.modalities[mk].name)}"><span>${esc(D.modalities[mk].name)}</span></button>`).join('')}</nav></div>`;
}
function tsGoModel(r, k){ const tr=document.querySelector(`.ts-track[data-row="${r}"]`); if(!tr) return; const n=tr.children.length; k=Math.max(0,Math.min(n-1,k)); tr.scrollTo({left:k*tr.clientWidth, behavior:RM()?'auto':'smooth'}); }
function tsTrackSync(tr){ const r=tr.dataset.row; const k=Math.round(tr.scrollLeft/tr.clientWidth); document.querySelectorAll(`.ts-pips button[data-row="${r}"]`).forEach(b=>b.classList.toggle('on', +b.dataset.k===k)); const row=tr.closest('.ts-row'); row.querySelectorAll('.ts-arr').forEach(a=>a.disabled = (+a.dataset.dir<0 && k===0) || (+a.dataset.dir>0 && k===tr.children.length-1)); if (k>0) row.classList.add('seen'); }
document.addEventListener('click', e => { const a=e.target.closest('.ts-arr[data-row]'); if (a) { const tr=document.querySelector(`.ts-track[data-row="${a.dataset.row}"]`); if (!tr) return; tsGoModel(a.dataset.row, Math.round(tr.scrollLeft/tr.clientWidth)+(+a.dataset.dir)); return; }
  const pip=e.target.closest('.ts-pips button[data-row]'); if (pip) tsGoModel(pip.dataset.row, +pip.dataset.k); });
addEventListener('keydown', e => { if (!document.documentElement.classList.contains('snap') || !['ArrowLeft','ArrowRight'].includes(e.key)) return; const on=document.querySelector('.ts-track .ts.on'); if(!on) return; const tr=on.parentElement; e.preventDefault(); tsGoModel(tr.dataset.row, Math.round(tr.scrollLeft/tr.clientWidth)+(e.key==='ArrowRight'?1:-1)); });
let tsIO;
function tsInit(){
  const slides = document.querySelectorAll('.ts'); if (!slides.length) return;
  if (tsIO) tsIO.disconnect();
  tsIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .55) { const s=e.target; document.querySelectorAll('.ts.on').forEach(x=>x!==s&&x.classList.remove('on')); s.classList.add('on');
      document.body.classList.toggle('snap-dark', s.dataset.dark==='1'); const i=s.dataset.i; document.querySelectorAll('.ts-dots button').forEach(b=>b.classList.toggle('on', b.dataset.go===i)); } }), { threshold:[.56] });
  slides.forEach(s=>tsIO.observe(s)); slides[0].classList.add('on'); document.body.classList.toggle('snap-dark', slides[0].dataset.dark==='1');
  const dots=document.querySelector('.ts-dots'); if (dots) dots.addEventListener('click', e => { const b=e.target.closest('button'); if (!b) return; (document.querySelector(`.ts-row[data-row="${b.dataset.go}"]`)||document.querySelector(`.ts[data-i="${b.dataset.go}"]`)).scrollIntoView({behavior:RM()?'auto':'smooth'}); });
  document.querySelectorAll('.ts-track').forEach(tr => { let t; tr.addEventListener('scroll', () => { clearTimeout(t); t=setTimeout(()=>tsTrackSync(tr), 60); }, {passive:true}); tsTrackSync(tr); });
}
/* product page: full-screen hero, then the details that used to sit beside the image */
function tsSiblings(p){ const row=TS_ROWS.find(([mk])=>mk===p.modality); return (row?row[1]:[p.id]).map(id=>D.products.find(x=>x.id===id)).filter(Boolean); }
function tsHeroNav(p){ const sib=tsSiblings(p); if (sib.length<2) return ''; const i=sib.findIndex(x=>x.id===p.id); const href=x=>`#/products/${x.category}/${x.id}`;
  return `<div class="ts-rownav ts-heronav"><a class="ts-arr" data-swipe="-1" ${i>0?`href="${href(sib[i-1])}"`:'aria-disabled="true"'} aria-label="Previous model">‹</a><div class="ts-pips">${sib.map(x=>`<a href="${href(x)}" class="${x.id===p.id?'on':''}">${esc(x.name)}</a>`).join('')}</div><a class="ts-arr" data-swipe="1" ${i<sib.length-1?`href="${href(sib[i+1])}"`:'aria-disabled="true"'} aria-label="Next model">›</a></div>`; }
let TS_DIR = 0;
function tsModels(p){ const sib=tsSiblings(p); if (sib.length<2) return ''; const href=x=>`#/products/${x.category}/${x.id}`;
  return `<nav class="ts-models" aria-label="Models">${sib.map(x=>`<a href="${href(x)}" class="${x.id===p.id?'on':''}">${esc(x.name)}</a>`).join('')}</nav>`; }
/* full-bleed feature chapters per product (real photography) */
const TS_FEATURES = {
  airsuite:[
    {img:'as-cover', k:'Inside', t:'Space to work, watch or rest.', b:'Warm circadian lighting, water-based air conditioning and built-in entertainment make a 90-minute session feel easy.', pos:'50% 40%'},
    {img:'as-solo', k:'Solo', t:'One seat. Total privacy.', b:'A reclining leather seat and fold-down desk for focused, private sessions at 2.0 ATA.'},
    {img:'as-duo', k:'Duo', t:'Two seats. Same 2.0 ATA.', b:'Individual reclining seats, individual entertainment and a dedicated oxygen concentrator per person.'},
  ],
  yakisugi:[
    {img:'yk-led-ceiling', k:'Red light', t:'Red light, built into the ceiling.', b:'LED arrays across the ceiling add red and near-infrared light to every session. No separate bed, no extra room.'},
    {img:'yk-bench-l', k:'Infrared', t:'Full-spectrum heat behind every backrest.', b:'Low-EMF near, mid and far infrared emitters sit behind the cedar slats, at a restorative 135–149°F.'},
    {img:'yk-bench-tier', k:'Seating', t:'Two tiers. Pick your heat.', b:'Tiered L-shaped cedar benches seat the whole group, with side-wall LED panels at shoulder height.'},
    {img:'yk-audio', k:'Audio', t:'A Bose speaker in the ceiling.', b:'Stream music, breathwork or class audio straight into the cabin.', pos:'50% 50%'},
    {img:'yk-charred', k:'Finish', t:'Real charred cedar. You can feel it.', b:'The Yakisugi finish is a carbonised layer that resists moisture, bacteria and wear, with a texture no laminate can copy.', pos:'50% 4%'},
  ],
};
/* real-scale 3D models (exported from the render scenes) -> <model-viewer>, with AR on phones */
const TS_3D = {
  icevault:{glb:'icevault-quad', size:'Quad', dims:'74.8" W × 70.9" D × 95" H', orbit:'-18deg 80deg auto'},
  yakisugi:{glb:'yakisugi-octo', size:'Octo', dims:'108.5" W × 108.5" D × 82.7" H', orbit:'-15deg 78deg auto'},
  lightbed:{glb:'lightbed', size:'', dims:'89.5" L × 51" D × 44" H · built from our production CAD', orbit:'-22deg 76deg auto', limit:[-80,80], still:true,
    finishes:[['Black',[0.012,0.012,0.013,1]],['White',[0.80,0.80,0.78,1]]], mat:'gloss'},
};
function ts3D(p){ const t=TS_3D[p.id]; if (!t || !D.glb || !D.glb[t.glb]) return null;
  return `<section class="ts ts-ch ts-light-ch ts-3d" data-dark="0" style="${tsStyle(p,null)}"><div class="ts-bg"></div>
    <div class="ts-top"><p class="ts-eyebrow">3D · to scale</p><h2>Walk around it. Then put it in your room.</h2></div>
    <model-viewer class="ts-mv" src="${D.glb[t.glb]}" alt="OneBase ${esc(p.name)} ${t.size} 3D model" camera-controls touch-action="pan-y" ${t.still?'':'auto-rotate'} auto-rotate-delay="4000" rotation-per-second="10deg" interaction-prompt="none"
      camera-orbit="${t.orbit}" min-camera-orbit="${t.limit?t.limit[0]+'deg':'auto'} 40deg auto" max-camera-orbit="${t.limit?t.limit[1]+'deg':'auto'} 92deg auto" shadow-intensity="1.1" shadow-softness=".8" exposure="1.05" environment-image="neutral"
      ar ar-modes="webxr scene-viewer quick-look" ar-scale="fixed" ar-placement="floor" loading="lazy" reveal="auto">
      <button slot="ar-button" class="ts-b1 mv-ar">View in your room</button>
      <div slot="progress-bar"></div></model-viewer>
    <div class="ts-bot">${t.finishes?`<div class="mv-fin" data-mat="${t.mat}">${t.finishes.map(([n,c],i)=>`<button data-c="${c.join(',')}" class="${i?'':'on'}"><i style="background:rgb(${c.slice(0,3).map(v=>Math.round(Math.pow(v,1/2.2)*255)).join(',')})"></i>${n}</button>`).join('')}</div>`:''}<p class="mv-dims">OneBase ${esc(p.name)}${t.size?' '+t.size:''} · ${t.dims}</p><p class="mv-hint">Drag to rotate · scroll or pinch to zoom<span class="mv-noar"> · Open on your phone to place it in your room at full size</span></p></div></section>`; }
/* chapters you swipe through for ONE product: overview, in the room, why, specs, sizes, app */
function tsChapters(p){
  const md = tsMedia(p); const hl = (p.highlights||[]).slice(0,4); const sp = (p.specs||[]).slice(0,6);
  const room = (TS_GALLERY[p.id]||[]).find(k=>D.img[k] && !(md&&md.img===k));
  const ch = [];
  const m3 = ts3D(p); if (m3) ch.push(['3D & AR', m3]);
  if (room) ch.push(['In the room', `<section class="ts ts-ch ts-photo ts-dark" data-dark="1" style="${tsStyle(p,md)}"><img class="ts-cover" src="${D.img[room]}" alt="OneBase ${esc(p.name)} installed" loading="lazy"><div class="ts-veil"></div>
    <div class="ts-top"><p class="ts-eyebrow">In the room</p><h2>${esc(hl[0]?hl[0].title:'Built for the recovery floor')}</h2><p class="ts-lead">${esc(hl[0]?hl[0].body:p.tagline)}</p></div><div class="ts-bot"></div></section>`]);
  (TS_FEATURES[p.id]||[]).filter(f=>D.img[f.img]).forEach(f => ch.push([f.k, `<section class="ts ts-ch ts-photo ts-dark ts-feat" data-dark="1" style="${tsStyle(p,md)}"><img class="ts-cover" src="${D.img[f.img]}" alt="${esc(f.t)}" style="object-position:${f.pos||'50% 50%'}" loading="lazy"><div class="ts-veil"></div>
    <div class="ts-top"></div><div class="ts-bot ch-feat"><p class="ts-eyebrow">${esc(f.k)}</p><h2>${esc(f.t)}</h2><p class="ts-lead">${esc(f.b)}</p></div></section>`]));
  if (hl.length>1) ch.push(['Why it works', `<section class="ts ts-ch ts-dark ts-why" data-dark="1" style="${tsStyle(p,md)}"><div class="ts-bg"></div>
    <div class="ts-top"><p class="ts-eyebrow">Why it works</p><h2>${esc(p.tagline)}</h2></div>
    <div class="ts-bot ch-body"><div class="ch-grid">${hl.map((h,i)=>`<div class="ch-card"><span>0${i+1}</span><b>${esc(h.title)}</b><p>${esc(h.body)}</p></div>`).join('')}</div></div></section>`]);
  if (sp.length) ch.push(['Specs', `<section class="ts ts-ch ts-light-ch" data-dark="0" style="${tsStyle(p,md)}"><div class="ts-bg"></div>
    <div class="ts-top"><p class="ts-eyebrow">Specs</p><h2>The numbers.</h2></div>
    <div class="ts-bot ch-body"><dl class="ch-specs">${sp.map(x=>`<div><dt>${esc(x.label)}</dt><dd>${esc(x.value)}</dd></div>`).join('')}</dl>
    <div class="ts-cta"><a class="ts-b1" href="#specForm" data-scroll="specForm">Get the full spec sheet</a></div></div></section>`]);
  if ((p.sizes||[]).length) ch.push(['Sizes', `<section class="ts ts-ch ts-light-ch" data-dark="0" style="${tsStyle(p,md)}"><div class="ts-bg"></div>
    <div class="ts-top"><p class="ts-eyebrow">Sizes</p><h2>${p.sizes.length>1?`${p.sizes.length} sizes. Pick yours.`:'One size, done right.'}</h2></div>
    <div class="ts-bot ch-body"><div class="ch-sizes">${p.sizes.map(z=>`<a href="#cfg" data-scroll="cfg" class="ch-size"><b>${esc(z.label)}</b><span>${esc(z.note||'')}</span><i>Configure →</i></a>`).join('')}</div></div></section>`]);
  ch.push(['App', `<section class="ts ts-ch ts-rlight ts-app" data-dark="0" style="${tsStyle(p,{bg:'#e8eaec'})}"><div class="ts-bg"></div>
    <div class="ts-top"><p class="ts-eyebrow">Software</p><h2>Run it from one app.</h2><p class="ts-lead">Members book and start sessions from their phone. Your team sees every ${esc(p.name)} across every site in OneBase OS.</p></div>
    ${D.img['app-interface']?`<div class="ts-fig ts-render"><img class="ts-img" src="${D.img['app-interface']}" alt="OneBase OS dashboard" loading="lazy"></div>`:''}
    <div class="ts-bot"><div class="ts-cta"><a class="ts-b1" href="#sw" data-scroll-sw>Try it on this page</a><button class="ts-b2" data-figma>Open the real app</button></div></div></section>`]);
  return ch;
}
function tsProductHero(p){
  const md = tsMedia(p); const cls = tsCls(md); const dark = /ts-dark/.test(cls); const f = FACTS[p.id]||[]; const m = D.modalities[p.modality];
  const dir = TS_DIR; TS_DIR = 0;
  const ov = `<section class="ts ts-hero on${cls}${dir>0?' from-r':dir<0?' from-l':''}" data-k="0" data-dark="${dark?1:0}" style="${tsStyle(p,md)}"><div class="ts-bg"></div>
   <div class="ts-top"><p class="ts-eyebrow"><a href="#/products">Products</a> / <a href="#/products/${p.category}">${m.name}</a></p><h1>OneBase ${esc(p.name)}</h1><p class="ts-lead">${esc(TS_LEAD[p.id]||p.tagline)}</p></div>
   ${tsVisual(p,md,0)}
   <div class="ts-bot"><div class="ts-stats">${f.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <div class="ts-cta"><a class="ts-b1" href="#cfg" data-scroll="cfg">${p.status==='coming-soon'?'Pre-order':'Configure'}</a><a class="ts-b2" href="#/contact">Talk to sales</a></div></div></section>`;
  const ch = [['Overview', ov], ...tsChapters(p)];
  return `<section class="ts-row ts-hrow${tsSiblings(p).length>1?' has-models':''}" data-row="h" aria-label="OneBase ${esc(p.name)}">${tsModels(p)}
   <div class="ts-track" data-row="h">${ch.map(([,h],k)=>k?h.replace('<section class="ts ','<section data-k="'+k+'" class="ts '):h).join('')}</div>
   <div class="ts-rownav ts-chnav"><button class="ts-arr" data-dir="-1" data-row="h" aria-label="Previous">‹</button><div class="ts-pips">${ch.map(([n],k)=>`<button data-row="h" data-k="${k}" class="${k===0?'on':''}">${n}</button>`).join('')}</div><button class="ts-arr" data-dir="1" data-row="h" aria-label="Next">›</button></div>
   <p class="ts-swipe ts-chhint">Swipe for more</p></section>
  <section class="wrap ts-intro"><p class="key">${esc(p.tagline)}</p><div class="stack" style="gap:18px"><p class="muted">${esc(p.description)}</p>
   <dl class="ts-dl">${p.sizes.length?`<div><dt>Sizes</dt><dd>${p.sizes.map(s=>s.label).join(' · ')}</dd></div>`:''}${p.colours.length?`<div><dt>Finishes</dt><dd>${p.colours.join(' · ')}</dd></div>`:''}${p.pressures.length?`<div><dt>Pressure</dt><dd>${p.pressures.join(' · ')}</dd></div>`:''}${p.fromPriceUSD?`<div><dt>From</dt><dd>US$${p.fromPriceUSD.toLocaleString()}</dd></div>`:''}</dl>
   <p class="faint" style="font-size:12px">${p.status==='coming-soon'?'Taking pre-orders':'Installation service · US-based support · 2-year warranty'}${p.channels.precor&&S.precor?' · Available through Precor (US)':''}</p></div></section>
  ${(TS_GALLERY[p.id]||[]).filter(k=>D.img[k] && !(TS_MEDIA[p.id]&&TS_MEDIA[p.id].img===k)).length?`<section class="ts-gal wrap">${(TS_GALLERY[p.id]||[]).filter(k=>D.img[k] && !(TS_MEDIA[p.id]&&TS_MEDIA[p.id].img===k)).slice(0,2).map(k=>`<figure><img src="${D.img[k]}" alt="OneBase ${esc(p.name)} installed" loading="lazy"></figure>`).join('')}</section>`:''}`;
}
pages.products = () => tsIndex();
const _productTS = pages.product;
pages.product = (cat, id) => { const h=_productTS(cat,id); const p=D.products.find(x=>x.id===id&&x.category===cat); if (!p) return h;
  return h.replace(/<section class="wrap" style="padding-block:28px 40px">[\s\S]*?<\/div><\/div><\/section>/, tsProductHero(p)); };
document.addEventListener('click', e => { const a=e.target.closest('[data-scroll]'); if (!a) return; e.preventDefault(); document.getElementById(a.dataset.scroll)?.scrollIntoView({behavior:RM()?'auto':'smooth'}); });
const _afterRenderTS = afterRender;
afterRender = function(){
  const h=(location.hash||'#/').slice(2).split('/'); const snap = h[0]==='products' && h.length===1; const prod = h[0]==='products' && h.length===3;
  document.documentElement.classList.toggle('snap', snap); document.body.classList.toggle('is-snap', snap||prod); document.body.classList.remove('snap-dark');
  _afterRenderTS(); tsInit();
};
addEventListener('scroll', () => { if (!document.body.classList.contains('is-snap') || document.documentElement.classList.contains('snap')) { document.body.classList.remove('solid'); return; } document.body.classList.toggle('solid', scrollY > innerHeight - 80); }, { passive:true });

/* product page: arrows move between chapters; model pills animate direction */
addEventListener('keydown', e => { const tr=document.querySelector('.ts-track[data-row="h"]'); if (!tr || !['ArrowLeft','ArrowRight'].includes(e.key) || scrollY > innerHeight*0.5 || e.target.closest('input,textarea,select')) return; e.preventDefault(); tsGoModel('h', Math.round(tr.scrollLeft/tr.clientWidth)+(e.key==='ArrowRight'?1:-1)); });
document.addEventListener('click', e => { const a=e.target.closest('.ts-models a'); if (a) { const all=[...document.querySelectorAll('.ts-models a')]; const cur=all.findIndex(x=>x.classList.contains('on')); TS_DIR = all.indexOf(a)>cur?1:-1; return; }
  const sw=e.target.closest('[data-scroll-sw]'); if (sw) { e.preventDefault(); document.querySelector('.sw-sec')?.scrollIntoView({behavior:RM()?'auto':'smooth'}); } });
/* keep the active chapter pill in view on small screens */
const _tsTrackSyncCh = tsTrackSync;
tsTrackSync = function(tr){ _tsTrackSyncCh(tr); if (tr.dataset.row==='h') { const b=document.querySelector('.ts-chnav .ts-pips button.on'); const pp=b&&b.parentElement; if (pp) pp.scrollTo({left:b.offsetLeft - pp.clientWidth/2 + b.clientWidth/2, behavior:'smooth'}); } };

/* hide the 'open on your phone' note when AR is available */
document.addEventListener('load', e => { const mv=e.target; if (mv && mv.tagName==='MODEL-VIEWER') { mv.classList.add('ready'); if (mv.canActivateAR) mv.closest('.ts-3d')?.classList.add('has-ar'); } }, true);

/* finish switcher on the 3D model */
document.addEventListener('click', e => { const b=e.target.closest('.mv-fin button'); if (!b) return; const wrap=b.parentElement; const mv=wrap.closest('.ts-3d')?.querySelector('model-viewer'); if (!mv || !mv.model) return;
  const c=b.dataset.c.split(',').map(Number); mv.model.materials.filter(m=>m.name===wrap.dataset.mat).forEach(m=>m.pbrMetallicRoughness.setBaseColorFactor(c));
  wrap.querySelectorAll('button').forEach(x=>x.classList.toggle('on', x===b)); });
