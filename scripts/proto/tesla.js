/* ===== Tesla-style product presentation: full-screen snap slides on /products, full-screen hero on product pages ===== */
const TS_ORDER = ['icevault','yakisugi','airform','lightbed','airsuite','airfit','airflex','hemlock','lightpanel'];
const TS_LEAD = { icevault:'Dry cold for two to eight. No water, no ice, no nitrogen.', yakisugi:'Charred cedar. Full-spectrum infrared. Built to run all day.', airform:'Steel hard-shell hyperbaric. Clinic pressures, calm inside.',
  lightbed:'Whole-body red and near-infrared. Five wavelengths.', airsuite:'A walk-in hyperbaric room with medical-grade BIBS.', airfit:'Soft-shell hyperbaric you can place almost anywhere.',
  airflex:'Step in, roll in. Accessible soft-shell hyperbaric.', hemlock:'Four-person full-spectrum infrared in light Hemlock.', lightpanel:'Red and near-infrared panels. One, two or four.' };
function tsImg(p){ return CUT[p.id] || (D.prodImg[p.id]) || null; }
function tsSlide(p, i){
  const k = tsImg(p); const dark = !k || !D.img[k]; const f = FACTS[p.id]||[];
  return `<section class="ts${dark?' ts-dark':''}" data-i="${i}" data-dark="${dark?1:0}" style="--ts-tint:${MODC[p.modality].soft};--ts-deep:${MODC[p.modality].deep};--ts-glow:${MODC[p.modality].glow}">
   <div class="ts-bg"></div>
   <div class="ts-top"><p class="ts-eyebrow">${D.modalities[p.modality].name}${p.status==='coming-soon'?' · Pre-order':''}</p><h2>OneBase ${esc(p.name)}</h2><p class="ts-lead">${esc(TS_LEAD[p.id]||p.tagline)}</p></div>
   ${dark?`<div class="ts-ghost">${esc(p.name)}</div>`:`<div class="ts-fig"><img class="ts-img" src="${D.img[k]}" alt="OneBase ${esc(p.name)}" loading="${i<2?'eager':'lazy'}"><span class="ts-shadow"></span></div>`}
   <div class="ts-bot"><div class="ts-stats">${f.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <div class="ts-cta"><a class="ts-b1" href="#/products/${p.category}/${p.id}">${p.status==='coming-soon'?'Pre-order':'Configure'}</a><a class="ts-b2" href="#/contact">Talk to sales</a></div></div></section>`;
}
function tsIndex(){
  const ps = TS_ORDER.map(id=>D.products.find(p=>p.id===id)).filter(Boolean);
  return `<div class="ts-wrap">${ps.map(tsSlide).join('')}
   <section class="ts ts-dark ts-end" data-dark="1"><div class="ts-bg"></div><div class="ts-top"><p class="ts-eyebrow">Planner</p><h2>Not sure where to start?</h2><p class="ts-lead">Tell us your venue and space. We’ll suggest the mix and lay it out to scale.</p></div>
    <div class="ts-bot"><div class="ts-cta"><a class="ts-b1" href="#/planner">Plan your room</a><a class="ts-b2" href="#/contact">Talk to sales</a></div></div></section>
   <nav class="ts-dots" aria-label="Products">${ps.map((p,i)=>`<button data-go="${i}" aria-label="${esc(p.name)}"><span>${esc(p.name)}</span></button>`).join('')}</nav></div>`;
}
let tsIO;
function tsInit(){
  const slides = document.querySelectorAll('.ts'); if (!slides.length) return;
  if (tsIO) tsIO.disconnect();
  tsIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .55) { const s=e.target; document.querySelectorAll('.ts.on').forEach(x=>x!==s&&x.classList.remove('on')); s.classList.add('on');
      document.body.classList.toggle('snap-dark', s.dataset.dark==='1'); const i=s.dataset.i; document.querySelectorAll('.ts-dots button').forEach(b=>b.classList.toggle('on', b.dataset.go===i)); } }), { threshold:[.56] });
  slides.forEach(s=>tsIO.observe(s)); slides[0].classList.add('on'); document.body.classList.toggle('snap-dark', slides[0].dataset.dark==='1');
  const dots=document.querySelector('.ts-dots'); if (dots) dots.addEventListener('click', e => { const b=e.target.closest('button'); if (!b) return; document.querySelector(`.ts[data-i="${b.dataset.go}"]`).scrollIntoView({behavior:RM()?'auto':'smooth'}); });
}
/* product page: full-screen hero, then the details that used to sit beside the image */
function tsProductHero(p){
  const k = tsImg(p); const has = k && D.img[k]; const f = FACTS[p.id]||[]; const m = D.modalities[p.modality];
  return `<section class="ts ts-hero on${has?'':' ts-dark'}" data-dark="${has?0:1}" style="--ts-tint:${MODC[p.modality].soft};--ts-deep:${MODC[p.modality].deep};--ts-glow:${MODC[p.modality].glow}"><div class="ts-bg"></div>
   <div class="ts-top"><p class="ts-eyebrow"><a href="#/products">Products</a> / <a href="#/products/${p.category}">${m.name}</a></p><h1>OneBase ${esc(p.name)}</h1><p class="ts-lead">${esc(TS_LEAD[p.id]||p.tagline)}</p></div>
   ${has?`<div class="ts-fig"><img class="ts-img" src="${D.img[k]}" alt="OneBase ${esc(p.name)}"><span class="ts-shadow"></span></div>`:`<div class="ts-ghost">${esc(p.name)}</div>`}
   <div class="ts-bot"><div class="ts-stats">${f.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <div class="ts-cta"><a class="ts-b1" href="#cfg" data-scroll="cfg">${p.status==='coming-soon'?'Pre-order':'Configure'}</a><a class="ts-b2" href="#/contact">Talk to sales</a></div></div></section>
  <section class="wrap ts-intro"><p class="key">${esc(p.tagline)}</p><div class="stack" style="gap:18px"><p class="muted">${esc(p.description)}</p>
   <dl class="ts-dl">${p.sizes.length?`<div><dt>Sizes</dt><dd>${p.sizes.map(s=>s.label).join(' · ')}</dd></div>`:''}${p.colours.length?`<div><dt>Finishes</dt><dd>${p.colours.join(' · ')}</dd></div>`:''}${p.pressures.length?`<div><dt>Pressure</dt><dd>${p.pressures.join(' · ')}</dd></div>`:''}${p.fromPriceUSD?`<div><dt>From</dt><dd>US$${p.fromPriceUSD.toLocaleString()}</dd></div>`:''}</dl>
   <p class="faint" style="font-size:12px">${p.status==='coming-soon'?'Taking pre-orders':'Installation service · US-based support · 2-year warranty'}${p.channels.precor&&S.precor?' · Available through Precor (US)':''}</p></div></section>`;
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
