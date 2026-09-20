/* ===== Tesla-style product presentation: full-screen snap slides on /products, full-screen hero on product pages ===== */
const TS_ORDER = ['icevault','yakisugi','airform','lightbed','airsuite','airfit','airflex','hemlock','lightpanel'];
const TS_LEAD = { icevault:'Dry cold for two to eight. No water, no ice, no nitrogen.', yakisugi:'Charred cedar. Full-spectrum infrared. Built to run all day.', airform:'Steel hard-shell hyperbaric. Clinic pressures, calm inside.',
  lightbed:'Whole-body red and near-infrared. Five wavelengths.', airsuite:'A walk-in hyperbaric room with medical-grade BIBS.', airfit:'Soft-shell hyperbaric you can place almost anywhere.',
  airflex:'Step in, roll in. Accessible soft-shell hyperbaric.', hemlock:'Four-person full-spectrum infrared in light Hemlock.', lightpanel:'Red and near-infrared panels. One, two or four.' };
function tsImg(p){ return CUT[p.id] || (D.prodImg[p.id]) || null; }
const TS_MEDIA = {
  icevault:{mode:'render', img:'canva-icevault-render', bg:'#1f1f1f'}, yakisugi:{mode:'render', img:'canva-yakisugi-render', bg:'#1f1f1f'},
  airsuite:{mode:'render', img:'canva-airsuite-duo', bg:'#b3b0a8', light:true},
  airform:{mode:'photo', img:'photo-airform', pos:'55% 50%'}, lightbed:{mode:'photo', img:'photo-lightbed', pos:'50% 55%'},
  airflex:{mode:'photo', img:'photo-airflex', pos:'45% 40%'}, hemlock:{mode:'photo', img:'photo-hemlock', pos:'45% 35%'}, lightpanel:{mode:'photo', img:'photo-lightpanel', pos:'60% 35%'},
};
const TS_GALLERY = { icevault:['photo-spa','photo-sports'], yakisugi:['canva-yakisugi-spa','photo-spa'], airsuite:['canva-airsuite-photo','canva-airsuite-solo'], airform:['photo-hbot-inside','photo-sports'], lightbed:['photo-lightbed-2'], hemlock:['photo-hemlock'], lightpanel:['photo-lightpanel'], airflex:['photo-airflex'] };
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
function tsProductHero(p){
  const md = tsMedia(p); const cls = tsCls(md); const dark = /ts-dark/.test(cls); const f = FACTS[p.id]||[]; const m = D.modalities[p.modality];
  const dir = TS_DIR; TS_DIR = 0;
  return `<section class="ts ts-hero on${cls}${dir>0?' from-r':dir<0?' from-l':''}" data-dark="${dark?1:0}" style="${tsStyle(p,md)}"><div class="ts-bg"></div>
   <div class="ts-top"><p class="ts-eyebrow"><a href="#/products">Products</a> / <a href="#/products/${p.category}">${m.name}</a></p><h1>OneBase ${esc(p.name)}</h1><p class="ts-lead">${esc(TS_LEAD[p.id]||p.tagline)}</p></div>
   ${tsVisual(p,md,0)}
   <div class="ts-bot"><div class="ts-stats">${f.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <div class="ts-cta"><a class="ts-b1" href="#cfg" data-scroll="cfg">${p.status==='coming-soon'?'Pre-order':'Configure'}</a><a class="ts-b2" href="#/contact">Talk to sales</a></div></div>${tsHeroNav(p)}</section>
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

/* swipe between sibling models on a product page */
(function(){ let x0=null, y0=0;
  addEventListener('touchstart', e => { const h=e.target.closest('.ts-hero'); if (!h || e.target.closest('.ts-cta')) { x0=null; return; } x0=e.touches[0].clientX; y0=e.touches[0].clientY; }, {passive:true});
  addEventListener('touchend', e => { if (x0===null) return; const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; x0=null; if (Math.abs(dx)<60 || Math.abs(dx)<Math.abs(dy)*1.3) return;
    const a=document.querySelector(`.ts-heronav .ts-arr[data-swipe="${dx<0?1:-1}"]`); if (a && a.getAttribute('href')) { TS_DIR = dx<0?1:-1; location.hash = a.getAttribute('href'); } }, {passive:true});
  document.addEventListener('click', e => { const a=e.target.closest('.ts-heronav a'); if (!a) return; if (!a.getAttribute('href')) { e.preventDefault(); return; } const sib=[...document.querySelectorAll('.ts-heronav .ts-pips a')]; const cur=sib.findIndex(x=>x.classList.contains('on')); const nxt=a.dataset.swipe? cur+(+a.dataset.swipe) : sib.indexOf(a); TS_DIR = nxt>cur?1:-1; });
  addEventListener('keydown', e => { if (!['ArrowLeft','ArrowRight'].includes(e.key) || !document.querySelector('.ts-heronav') || scrollY > innerHeight*0.5 || e.target.closest('input,textarea,select')) return; const a=document.querySelector(`.ts-heronav .ts-arr[data-swipe="${e.key==='ArrowRight'?1:-1}"]`); if (a && a.getAttribute('href')) { TS_DIR = e.key==='ArrowRight'?1:-1; location.hash=a.getAttribute('href'); } });
})();
