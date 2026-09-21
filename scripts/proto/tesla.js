/* ===== Tesla-style product presentation: full-screen snap slides on /products, full-screen hero on product pages ===== */
const TS_ORDER = ['icevault','yakisugi','airform','lightbed','airsuite','airfit','airflex','hemlock','lightpanel'];
const TS_LEAD = { icevault:'Dry cold for two to eight. No water, no ice, no nitrogen.', yakisugi:'Charred cedar. Full-spectrum infrared. Built to run all day.', airform:'Steel hard-shell hyperbaric. Clinic pressures, calm inside.',
  lightbed:'Whole-body red and near-infrared. Five wavelengths.', airsuite:'A walk-in hyperbaric room with medical-grade BIBS.', airfit:'Soft-shell hyperbaric you can place almost anywhere.',
  airflex:'Step in, roll in. Accessible soft-shell hyperbaric.', hemlock:'Four-person full-spectrum infrared in light Hemlock.', lightpanel:'Red and near-infrared panels. One, two or four.' };
function tsImg(p){ return CUT[p.id] || (D.prodImg[p.id]) || null; }
const TS_MEDIA = {
  icevault:{mode:'render', img:'render-icevault-studio', bg:'#1a1a1a'}, yakisugi:{mode:'render', img:'yk-real-closed', bg:'#ffffff', light:true},
  airsuite:{mode:'render', img:'as-pair', bg:'#1f1f1f'},
  airform:{mode:'photo', img:'photo-airform', pos:'55% 50%'}, lightbed:{mode:'photo', img:'photo-lightbed', pos:'50% 55%'},
  airfit:{mode:'photo', img:'photo-airfit', pos:'45% 40%'}, airflex:{mode:'render', img:'cut-airflex', bg:'#e7e9eb', light:true}, hemlock:{mode:'photo', img:'photo-hemlock', pos:'45% 35%'}, lightpanel:{mode:'photo', img:'photo-lightpanel', pos:'60% 35%'},
};
const TS_GALLERY = { icevault:['render-icevault-gym','photo-sports'], yakisugi:['render-yakisugi-spa','yk-real-34-open','yk-real-open'], airsuite:['as-solo-chair','as-man','as-ext'], airform:['photo-hbot-inside','photo-sports'], lightbed:['photo-lightbed-2','render-lightbed-studio'], hemlock:['photo-hemlock'], lightpanel:['photo-lightpanel'], airfit:['photo-airfit'], airflex:['af-life','af-prod'] };
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
   <section class="ts ts-dark ts-end" data-dark="1" data-i="end"><div class="ts-bg"></div><div class="ts-top"><p class="ts-eyebrow">Planner</p><h2>Not sure where to start?</h2><p class="ts-lead">Tell us about your facility and a OneBase specialist will recommend the right setup.</p></div>
    <div class="ts-bot"><div class="ts-cta"><a class="ts-b1" href="#/contact">Book a call</a><a class="ts-b2" href="#/guide">Where each one fits</a></div></div></section>
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
/* portrait photos: split layout on desktop (text left, photo right) */
const TS_PORT = new Set(['as-lady','af-life','as-man','as-solo-man','as-duo-int','as-solo-chair']);
/* full-bleed feature chapters per product (real photography) */
const TS_FEATURES = {
  airsuite:[
    {img:'as-lady', k:'Inside', t:'Space to work, watch or rest.', b:'Warm circadian lighting, water-based air conditioning and built-in entertainment make a 90-minute session feel easy.', pos:'50% 40%'},
    {img:'as-solo-man', k:'Solo', t:'One seat. Total privacy.', b:'A reclining leather seat and fold-down desk for focused, private sessions at 2.0 ATA.', pos:'50% 35%'},
    {img:'as-duo-int', k:'Duo', t:'Two seats. Same 2.0 ATA.', b:'Individual reclining seats, individual entertainment and a dedicated oxygen concentrator per person.', pos:'50% 60%'},
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
  if (room) ch.push(['In the room', `<section class="ts ts-ch ts-photo ts-dark${TS_PORT.has(room)?' ts-split':''}" data-dark="1" style="${tsStyle(p,md)}"><img class="ts-cover" src="${D.img[room]}" alt="OneBase ${esc(p.name)} installed" loading="lazy"><div class="ts-veil"></div>
    <div class="ts-top"><p class="ts-eyebrow">In the room</p><h2>${esc(hl[0]?hl[0].title:'Built for the recovery floor')}</h2><p class="ts-lead">${esc(hl[0]?hl[0].body:p.tagline)}</p></div><div class="ts-bot"></div></section>`]);
  (TS_FEATURES[p.id]||[]).filter(f=>D.img[f.img]).forEach(f => ch.push([f.k, `<section class="ts ts-ch ts-photo ts-dark ts-feat${TS_PORT.has(f.img)?' ts-split':''}" data-dark="1" style="${tsStyle(p,md)}"><img class="ts-cover" src="${D.img[f.img]}" alt="${esc(f.t)}" style="object-position:${f.pos||'50% 50%'}" loading="lazy"><div class="ts-veil"></div>
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
    <div class="ts-bot"><div class="ts-cta"><a class="ts-b1" href="#sw" data-scroll-sw>Try it on this page</a>${p.id==='airsuite'&&typeof APZ_KEY!=='undefined'&&APZ_KEY?'<button class="ts-b2" data-apz-modal>Try the live chamber app</button>':'<button class="ts-b2" data-figma>Open the real app</button>'}</div></div></section>`]);
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

/* ===== Category pages ("Explore Air" etc.): one product per full screen, like /products, then a single call to action ===== */
function tsCategory(cat){
  const mk = Object.keys(D.modalities).find(k => D.modalities[k].category === cat); if (!mk) return null;
  const order = (TS_ROWS.find(r => r[0] === mk) || [0, []])[1];
  const ps = [...order.map(id => D.products.find(p => p.id === id)), ...D.products.filter(p => p.category === cat && !order.includes(p.id))].filter(Boolean);
  const m = D.modalities[mk];
  const slide = (p, r) => tsSlide(p, r).replace('<section class="ts', `<section data-k="0" class="ts`).replace(/>(Configure|Pre-order)<\/a>/, '>Explore</a>');
  return `<div class="ts-wrap ts-cat">${ps.map((p, r) => `<section class="ts-row" data-row="${r}" aria-label="OneBase ${esc(p.name)}"><div class="ts-track" data-row="${r}">${slide(p, r)}</div></section>`).join('')}
   <section class="ts ts-dark ts-end" data-dark="1" data-i="end" style="${tsStyle(ps[0] || { modality: mk }, null)}"><div class="ts-bg"></div><div class="ts-top"><p class="ts-eyebrow">${esc(m.name)}</p><h2>Not sure which one fits?</h2><p class="ts-lead">Tell us your venue and space. We’ll tell you whether ${esc(m.label.toLowerCase())} fits, and the setup we’d start with.</p></div>
    <div class="ts-bot"><div class="ts-cta"><a class="ts-b1" href="#/contact">Book a call</a><a class="ts-b2" href="#/guide">Where each one fits</a></div></div></section>
   ${ps.length > 1 ? `<nav class="ts-dots" aria-label="${esc(m.name)}">${ps.map((p, r) => `<button data-go="${r}" aria-label="OneBase ${esc(p.name)}"><span>${esc(p.name)}</span></button>`).join('')}</nav>` : ''}</div>`;
}
const _categoryTS = pages.category;
pages.category = (cat) => tsCategory(cat) || _categoryTS(cat);

/* ===== Product pages below the hero: fewer, bigger sections — statement, configurator, software, specs (with the spec sheet), questions, one enquiry, related ===== */
const _productPP = pages.product;
pages.product = (cat, id) => {
  let h = _productPP(cat, id); const p = D.products.find(x => x.id === id && x.category === cat); if (!p) return h;
  const m = D.modalities[p.modality];
  const form = (h.match(/<form class="enq spec-form" id="specForm">[\s\S]*?<\/form>/) || [''])[0];
  const rows = [...(p.specs || []), ...(p.electrical || [])];
  const state = `<section class="pp-state"><div class="wrap"><p class="pp-big">${esc(p.tagline)}</p><p class="pp-desc">${esc(p.description)}</p></div></section>`;
  const specs = `<section class="pp-specs" id="specs"><div class="wrap pp-sgrid"><div><p class="eyebrow">Specs</p><h2>OneBase ${esc(p.name)}</h2><dl class="pp-dl">${rows.map(r => `<div><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`).join('')}</dl></div>${form ? `<aside class="pp-ss"><h3>Get the spec sheet</h3><p>Dimensions, electrical, certifications and install requirements on one page, ready for a fit-out pack.</p>${form}<p class="pp-cad">Need CAD or electrical single-lines? <a href="#/contact">Ask our engineers</a></p></aside>` : ''}</div></section>`;
  const rel = D.products.filter(x => x.category === cat && x.id !== id);
  const more = rel.length ? `<section class="pp-more"><div class="wrap"><p class="eyebrow">Also in ${esc(m.name)}</p><div class="pp-mgrid">${rel.map(r => { const k = tsImg(r); return `<a class="pp-m" href="#/products/${cat}/${r.id}"><div class="pp-mimg">${k && D.img[k] ? `<img src="${D.img[k]}" alt="" loading="lazy">` : ''}</div><b>OneBase ${esc(r.name)}</b><span>${esc(TS_LEAD[r.id] || r.tagline)}</span><i>Explore →</i></a>`; }).join('')}</div></div></section>` : '';
  h = h.replace(/<section class="wrap ts-intro">[\s\S]*?<\/section>/, state)
       .replace(/<section class="ts-gal wrap">[\s\S]*?<\/section>/, '')
       .replace(/<section class="sec" style="background:var\(--surf\)"><div class="wrap"><p class="eyebrow ">Product highlights[\s\S]*?<\/section>/, '')
       .replace(/<section class="sec spec-cta">[\s\S]*?<\/section>/, '')
       .replace(/<section class="sec"><div class="wrap grid g2" style="gap:48px"><div><h3 style="font-size:24px;margin-bottom:12px">Specifications[\s\S]*?<\/section>/, specs)
       .replace(/<section class="sec"><div class="wrap"><p class="eyebrow ">More in [\s\S]*?<\/section>/, more);
  return h;
};
const _afterRenderCat = afterRender;
afterRender = function(){
  _afterRenderCat();
  const h = (location.hash || '#/').slice(2).split('/'); const cat = h[0] === 'products' && h.length === 2 && document.querySelector('.ts-cat');
  if (cat) { document.documentElement.classList.add('snap'); document.body.classList.add('is-snap'); tsInit(); }
};

/* ===== Saunas: category renamed (infrared + custom traditional), and the Custom Traditional before-and-after story ===== */
Object.assign(D.modalities.heat, { name:'Saunas', blurb:'Full-spectrum infrared in Yakisugi cedar or Hemlock, and custom traditional saunas built for your room.', h:'Infrared or traditional, built to run all day.', p:'Plug-and-play infrared in charred Yakisugi cedar or light Hemlock, or a traditional stone-heater sauna we design, build and install for your space.' });
FACTS.traditional = [['Custom','to your room'],['Stone','heater & löyly'],['Design→install','one team']];
TS_LEAD.traditional = 'Traditional saunas, designed, built and installed for your space.';
TS_MEDIA.traditional = { mode:'photo', img:'trad-after', pos:'50% 60%' };
D.prodImg.traditional = 'trad-after';
TS_ROWS.find(r => r[0] === 'heat')[1].unshift('traditional');
const TRAD_CLIENTS = 'Razor Sharp Fitness · Skyline Saunas';
function tradVid(src, poster){ return `<video class="ts-cover tr-vid" muted playsinline loop preload="metadata" poster="${D.img[poster]||''}"><source src="video/${src}.mp4" type="video/mp4"></video>`; }
const _tsChaptersTR = tsChapters;
tsChapters = function(p){
  const ch = _tsChaptersTR(p); if (p.id !== 'traditional') return ch;
  const st = tsStyle(p, TS_MEDIA.traditional);
  const vch = (k, vid, poster, eb, h2, lead) => [k, `<section class="ts ts-ch ts-photo ts-dark ts-split tr-ch" data-dark="1" style="${st}">${tradVid(vid, poster)}<div class="ts-veil"></div><div class="ts-top"></div><div class="ts-bot ch-feat"><p class="ts-eyebrow">${eb}</p><h2>${h2}</h2><p class="ts-lead">${lead}</p></div></section>`];
  const cmp = ['Compare', `<section class="ts ts-ch ts-dark tr-cmp-ch" data-dark="1" style="${st}"><div class="ts-bg"></div><div class="ts-top"><p class="ts-eyebrow">Before and after</p><h2>Same room. New sauna.</h2></div>
    <div class="tr-cmp" style="--x:50%"><img src="${D.img['trad-after']}" alt="The rebuilt sauna"><div class="tr-b"><img src="${D.img['trad-before']}" alt="The sauna before the rebuild"></div><span class="tr-l">Before</span><span class="tr-r">After</span><input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after"><i class="tr-h"></i></div><div class="ts-bot"></div></section>`];
  const how = ['How we deliver', `<section class="ts ts-ch ts-light-ch" data-dark="0" style="${st}"><div class="ts-bg"></div><div class="ts-top"><p class="ts-eyebrow">How we deliver</p><h2>One team, first drawing to first session.</h2></div>
    <div class="ts-bot ch-body"><div class="ch-grid">${[['Design','Layout, bench tiers, heater and lighting drawn for your room.'],['Manufacture','Benches and panelling made to the design.'],['Procure','Heater, stones, lighting and fittings sourced and shipped.'],['Install','Built on site and handed over ready to heat.']].map(([t,b],i)=>`<div class="ch-card"><span>0${i+1}</span><b>${t}</b><p>${b}</p></div>`).join('')}</div><p class="tr-cl">Recent projects: ${TRAD_CLIENTS}</p></div></section>`];
  const overview = ch.findIndex(c => c[0] === '3D & AR');
  const proj = (k, name, kind) => [k, `<section class="ts ts-ch ts-dark tr-proj" data-dark="1" style="${st}"><div class="ts-bg"></div><div class="ts-top"><p class="ts-eyebrow">${kind}</p><h2>${name}</h2></div><div class="ts-bot"></div></section>`];
  return [vch('Rebuild', 'sauna-before', 'trad-before', 'Razor Sharp Fitness · Before', 'Tired, dark, past its best.', 'The gym’s old sauna: weathered benches, worn panelling and a heater near the end of its life.'),
          vch('After', 'sauna-after-1', 'trad-heater', 'Razor Sharp Fitness · After', 'Rebuilt in fresh timber.', 'New stone heater, new tiered benches and backrests, new panelling. Built in place, in the same room.'),
          cmp,
          vch('Finished', 'sauna-after-2', 'trad-bench', 'Razor Sharp Fitness · Finished', 'Made for the room.', 'Every bench, rail and panel cut to fit, so it feels built in, not dropped in.'),
          vch('New build', 'skyline-1', 'sky-room', 'Skyline Saunas · New build', 'From an empty shell to a full cedar room.', 'A brand-new sauna, designed for the space and fitted out top to bottom: tiered L-shaped benches, cedar walls and ceiling, stone heater.'),
          vch('Detail', 'skyline-2', 'sky-heater', 'Skyline Saunas · Detail', 'Built to be used every day.', 'Guarded heater, tiered seating for groups, and timber chosen to take heat and heavy use.'),
          how, ...ch.filter(c => c[0] !== 'App' && c[0] !== 'Sizes')];
};;
document.addEventListener('input', e => { const r = e.target.closest('.tr-cmp input'); if (r) r.parentElement.style.setProperty('--x', r.value + '%'); });
let trIO = null;
function trVideos(){ if (trIO) trIO.disconnect(); const vs = document.querySelectorAll('video.tr-vid'); if (!vs.length) return; if (RM()) return;
  trIO = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting && e.intersectionRatio > .5) { v.play().catch(()=>{}); } else v.pause(); }), { threshold:[0,.5,1] }); vs.forEach(v => trIO.observe(v)); }
const _afterRenderTR = afterRender;
afterRender = function(){ _afterRenderTR(); trVideos(); };
const _productTR = pages.product;
pages.product = (cat, id) => { let h = _productTR(cat, id); if (id !== 'traditional') return h; return h.replace(/<a class="ts-b1" href="#cfg" data-scroll="cfg">Configure<\/a>/, '<a class="ts-b1" href="#enquiry" data-scroll="enquiry">Start your design</a>'); };
/* every model in a range full-screen photo, so rows read consistently */
Object.assign(TS_MEDIA, { yakisugi:{ mode:'photo', img:'yk-bench-tier', pos:'50% 55%' }, airsuite:{ mode:'photo', img:'as-cover', pos:'50% 45%' }, airflex:{ mode:'photo', img:'af-life', pos:'50% 30%' } });
(() => { const r = TS_ROWS.find(x => x[0] === 'heat'); r[1] = ['yakisugi', 'traditional', 'hemlock']; })();

/* ===== Pictures lead somewhere: clicking a product picture takes you to the next step ===== */
// Range and overview chapters open that product; the product hero scrolls on to the story; software pictures open the software page.
function tsLinkify(){
  document.querySelectorAll('#app .ts').forEach(sec => {
    if (sec.classList.contains('ts-hero') || sec.classList.contains('ts-end') || sec.dataset.href) return;
    const a = [...sec.querySelectorAll('a[href^="#/products/"]')].find(x => /^#\/products\/[^/]+\/[^/]+$/.test(x.getAttribute('href')));
    if (a) { sec.dataset.href = a.getAttribute('href'); sec.classList.add('ts-link'); }
  });
  document.querySelectorAll('#app .ts-hero').forEach(sec => { if ((sec.closest('.ts-row') || sec).nextElementSibling) sec.classList.add('ts-link', 'ts-next'); });
  document.querySelectorAll('#app .st .st-vis > img').forEach(img => img.classList.add('st-link'));
}
let tsDown = null;
document.addEventListener('pointerdown', e => { tsDown = { x: e.clientX, y: e.clientY }; }, true);
document.addEventListener('click', e => {
  if (e.defaultPrevented || e.button) return;
  if (tsDown && Math.hypot(e.clientX - tsDown.x, e.clientY - tsDown.y) > 8) return; // a swipe, not a tap
  const t = e.target;
  if (t.closest('a,button,input,select,textarea,label,video,summary,[data-apz-modal],.tr-cmp,.tb-frame,.ts-dots,.ts-bot,.ts-top p')) return;
  const st = t.closest('.st-link'); if (st) { location.hash = '#/software'; return; }
  const sec = t.closest('.ts-link'); if (!sec) return;
  if (sec.classList.contains('ts-next')) { (sec.closest('.ts-row') || sec).nextElementSibling.scrollIntoView({ behavior: RM() ? 'auto' : 'smooth' }); return; }
  if (sec.dataset.href) location.hash = sec.dataset.href;
});
const _afterRenderLink = afterRender;
afterRender = function(){ _afterRenderLink(); tsLinkify(); };
