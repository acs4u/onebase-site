/* ===== Products index: modality doors, filters, showcase cards, compare ===== */
const CUT = { airfit:'cut-airfit', airflex:'cut-airflex', airform:'cut-airform-plus-black', airsuite:null, icevault:'cut-icevault-quad', yakisugi:'cut-yakisugi', hemlock:'cut-hemlock', lightpanel:'cut-lightpanel-quad', lightbed:'cut-lightbed-black' };
const DOOR_IMG = { air:'cut-airform-plus-black', ice:'cut-icevault-quad', heat:'cut-yakisugi', light:'cut-lightbed-black' };
const FACTS = {
  airfit:[['1.3–1.5','ATA'],['1','person'],['Soft-shell','portable']], airflex:[['1.3–1.5','ATA'],['1','person, seated'],['Step-in','soft-shell']],
  airform:[['1.5–2.0','ATA'],['1','person'],['Steel','hard-shell']], airsuite:[['2.0','ATA'],['1–2','people'],['Walk-in','modular room']],
  icevault:[['32–40°F','dry cold'],['2–8','people'],['0','plumbing']], yakisugi:[['135–149°F','infrared'],['2–8','people'],['Cedar','Yakisugi finish']],
  hemlock:[['135–149°F','infrared'],['4','people'],['Hemlock','timber']], lightpanel:[['630–850','nm'],['Solo–Quad','panels'],['Stand','mounted']],
  lightbed:[['633–940','nm'],['41,600','LEDs'],['Full','body']],
};
const PF = { mod:'all', venue:'' , cmp:[] };
function venueProducts(v){ if (!v || !VENUES[v]) return null; const s=new Set(); Object.values(VENUES[v].t).forEach(arr=>arr.forEach(x=>(Array.isArray(x)?x:[x]).forEach(c=>s.add(CAT[c].p)))); return s; }
function showcard(p){
  const m=p.modality, c=MODC[m], img=CUT[p.id]&&D.img[CUT[p.id]], on=PF.cmp.includes(p.id);
  return `<article class="sc mod-${m}" data-id="${p.id}" data-mod="${m}" style="--sc-soft:${c.soft};--sc-acc:${c.acc||c.glow};--sc-deep:${MODC[m].deep}">
   <a class="sc-media" href="#/products/${p.category}/${p.id}" aria-label="${esc(pn(p))}">${img?`<img src="${img}" alt="" loading="lazy">`:`<span class="sc-ph">${esc(p.name)}<small>Render coming soon</small></span>`}
    <span class="sc-pill"><i></i>${D.modalities[m].label}</span>${p.status==='coming-soon'?'<span class="sc-new">Pre-order</span>':''}</a>
   <div class="sc-body"><div class="sc-head"><h3><a href="#/products/${p.category}/${p.id}">${esc(pn(p))}</a></h3>${p.fromPriceUSD?`<span class="sc-price">From US$${p.fromPriceUSD.toLocaleString()}</span>`:''}</div>
    <p class="sc-tag">${esc(p.tagline)}</p>
    <div class="sc-facts">${(FACTS[p.id]||[]).map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <div class="sc-foot"><span class="sc-sizes">${p.sizes.length?p.sizes.map(s=>s.label).join(' · '):p.colours.join(' · ')}</span>
     <label class="sc-cmp"><input type="checkbox" data-cmp="${p.id}" ${on?'checked':''}> Compare</label></div></div></article>`;
}
function productsHTML(){
  const mods = Object.values(D.modalities);
  const doors = `<div class="doors">${mods.map(m=>{ const n=D.products.filter(p=>p.modality===m.key).length; return `<button class="door" data-door="${m.key}" style="--d-deep:${MODC[m.key].deep};--d-glow:${MODC[m.key].glow}"><span class="door-glow"></span>${D.img[DOOR_IMG[m.key]]?`<img src="${D.img[DOOR_IMG[m.key]]}" alt="">`:''}<span class="door-txt"><small>${m.label}</small><b>${m.name}</b><em>${esc(m.blurb)}</em><span class="door-n">${n} ${n>1?'models':'model'} →</span></span></button>`; }).join('')}</div>`;
  const venueOpts = Object.entries(VENUES).map(([k,v])=>`<option value="${k}" ${PF.venue===k?'selected':''}>${v.l}</option>`).join('');
  return `<section class="pr-hero"><div class="wrap"><div class="stack" style="gap:14px;max-width:720px">${eyebrow('Products')}<h1>Commercial-grade, by design.</h1><p class="pr-lead">Four modalities, nine products, one platform. Built for daily commercial use: durable, plug-and-play, and connected to OneBase OS.</p></div>${doors}</div></section>
  <div class="pr-bar" id="prBar"><div class="wrap pr-bar-in"><div class="chips" id="prMods">${[['all','All']].concat(mods.map(m=>[m.key,m.label])).map(([k,l])=>`<button class="chip${k!=='all'?' mchip':''}" ${k!=='all'?`style="--c:${MODC[k].acc||MODC[k].glow}"`:''} data-v="${k}" aria-pressed="${PF.mod===k}">${k!=='all'?'<i></i>':''}${l}</button>`).join('')}</div>
   <label class="pr-venue">Best for <select id="prVenue"><option value="">Any venue</option>${venueOpts}</select></label><span class="pr-count" id="prCount"></span></div></div>
  <section class="wrap pr-grid-wrap"><div class="pr-grid" id="prGrid">${D.products.slice().sort((a,b)=>'air ice heat light'.indexOf(a.modality)-'air ice heat light'.indexOf(b.modality)||a.order-b.order).map(showcard).join('')}</div>
   <div class="pr-empty" id="prEmpty" hidden>No products match. <button class="linkbtn" data-reset>Clear filters</button></div></section>
  <section class="sec" style="background:var(--surf)"><div class="wrap pr-help"><div class="stack" style="gap:10px"><h2>Not sure what fits your space?</h2><p class="muted">Tell the planner your venue and room size. It suggests a mix and lays it out to scale.</p></div><div class="row"><a href="#/planner" class="btn btn-p">Plan your room</a><a href="#/contact" class="btn btn-g">Talk to sales</a></div></div></section>
  <div class="cmp-tray" id="cmpTray" hidden></div>`;
}
function prApply(){
  const g=document.getElementById('prGrid'); if (!g) return; const vs=venueProducts(PF.venue); let n=0;
  g.querySelectorAll('.sc').forEach(el=>{ const ok=(PF.mod==='all'||el.dataset.mod===PF.mod)&&(!vs||vs.has(el.dataset.id)); el.hidden=!ok; if(ok) n++; });
  document.getElementById('prCount').textContent = `${n} ${n===1?'product':'products'}`; document.getElementById('prEmpty').hidden = n>0;
  document.querySelectorAll('#prMods .chip').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===PF.mod)));
  document.querySelectorAll('.door').forEach(d=>d.classList.toggle('on', d.dataset.door===PF.mod));
}
function cmpRender(){
  const t=document.getElementById('cmpTray'); if (!t) return; t.hidden = !PF.cmp.length;
  t.innerHTML = `<div class="wrap cmp-in"><div class="cmp-items">${PF.cmp.map(id=>{ const p=D.products.find(x=>x.id===id); const im=CUT[id]&&D.img[CUT[id]]; return `<span class="cmp-item">${im?`<img src="${im}" alt="">`:''}${esc(p.name)}<button data-uncmp="${id}" aria-label="Remove ${esc(p.name)}">×</button></span>`; }).join('')}${PF.cmp.length<3?`<span class="cmp-hint">Add up to ${3-PF.cmp.length} more</span>`:''}</div><button class="btn btn-p" id="cmpGo" ${PF.cmp.length<2?'disabled':''}>Compare ${PF.cmp.length}</button></div>`;
  document.querySelectorAll('[data-cmp]').forEach(c=>{ c.checked=PF.cmp.includes(c.dataset.cmp); c.disabled=!c.checked&&PF.cmp.length>=3; });
}
function cmpOpen(){
  const ps=PF.cmp.map(id=>D.products.find(x=>x.id===id));
  const dimsOf=(p)=>{ const dm=DIMS[p.id]; if(!dm) return '—'; const ks=Object.keys(dm).filter(k=>k!=='_p'); const v=ks.map(k=>dm[k]).filter(Boolean); if(!v.length) return '—'; const a=v[0], b=v[v.length-1]; const f=(d)=>`${Math.round(d[0])}″ × ${Math.round(d[1])}″`; return v.length>1?`${f(a)} to ${f(b)}`:f(a); };
  const rows=[['Modality',p=>D.modalities[p.modality].name],['Sizes',p=>p.sizes.map(s=>s.label).join(' · ')||'One size'],['Key spec',p=>(FACTS[p.id]||[])[0]?.join(' ')||'—'],['Capacity',p=>(FACTS[p.id]||[]).find(f=>/person|people/.test(f[1]))?.join(' ')||'1 person'],['Footprint',dimsOf],['Power',p=>DIMS[p.id]?DIMS[p.id]._p:(p.electrical[0]?.value||'Confirmed at quote')],['Finishes',p=>p.colours.join(' · ')],['Certifications',p=>p.certifications.join(' · ')||'—'],['Price',p=>p.fromPriceUSD?`From US$${p.fromPriceUSD.toLocaleString()}`:'Quote']];
  let m=document.getElementById('cmp-modal'); if (!m) { m=document.createElement('div'); m.id='cmp-modal'; m.className='bk-modal'; document.body.appendChild(m); m.addEventListener('click',e=>{ if(e.target.closest('[data-cmp-close]')){ m.classList.remove('open'); document.body.style.overflow=''; } }); }
  m.innerHTML=`<div class="bk-back" data-cmp-close></div><div class="bk-card cmp-card"><button class="bk-x" data-cmp-close aria-label="Close">×</button><h3>Compare</h3><div class="cmp-scroll"><table class="cmp-t"><thead><tr><th></th>${ps.map(p=>`<th><div class="cmp-img" style="background:${MODC[p.modality].soft}">${CUT[p.id]&&D.img[CUT[p.id]]?`<img src="${D.img[CUT[p.id]]}" alt="">`:''}</div><a href="#/products/${p.category}/${p.id}" data-cmp-close>${esc(pn(p))}</a></th>`).join('')}</tr></thead><tbody>${rows.filter(([l,fn])=>ps.some(p=>{const v=fn(p); return v&&v!=='—';})).map(([l,fn])=>`<tr><th>${l}</th>${ps.map(p=>`<td>${esc(fn(p))}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="bk-foot"><a href="#/contact" class="btn btn-p" data-cmp-close>Talk to sales about these</a></div></div>`;
  m.classList.add('open'); document.body.style.overflow='hidden';
}
function prInit(){
  const g=document.getElementById('prGrid'); if (!g) return;
  document.querySelector('.doors').addEventListener('click',e=>{ const d=e.target.closest('.door'); if(!d) return; PF.mod = PF.mod===d.dataset.door?'all':d.dataset.door; prApply(); document.getElementById('prBar').scrollIntoView({behavior:RM()?'auto':'smooth'}); });
  document.getElementById('prMods').addEventListener('click',e=>{ const b=e.target.closest('.chip'); if(!b) return; PF.mod=b.dataset.v; prApply(); });
  document.getElementById('prVenue').addEventListener('change',e=>{ PF.venue=e.target.value; prApply(); });
  g.addEventListener('change',e=>{ const c=e.target.closest('[data-cmp]'); if(!c) return; const id=c.dataset.cmp; PF.cmp = c.checked ? PF.cmp.concat(id).slice(0,3) : PF.cmp.filter(x=>x!==id); cmpRender(); });
  prApply(); cmpRender();
}
document.addEventListener('click', e => {
  const u=e.target.closest('[data-uncmp]'); if (u) { PF.cmp=PF.cmp.filter(x=>x!==u.dataset.uncmp); cmpRender(); return; }
  if (e.target.closest('#cmpGo')) { cmpOpen(); return; }
  if (e.target.closest('[data-reset]')) { PF.mod='all'; PF.venue=''; const v=document.getElementById('prVenue'); if (v) v.value=''; prApply(); }
});
pages.products = () => productsHTML() + enquiry('Tell us about your facility');
/* category pages: swap the old card grid for showcase cards */
const _category = pages.category;
pages.category = (cat) => { const h=_category(cat); const ps=D.products.filter(p=>p.category===cat).sort((a,b)=>a.order-b.order);
  return h.replace(/<section class="sec"><div class="wrap grid g4">[\s\S]*?<\/div><\/section>/, `<section class="sec"><div class="wrap"><div class="pr-grid">${ps.map(showcard).join('')}</div></div></section><div class="cmp-tray" id="cmpTray" hidden></div>`); };
const _afterRender4 = afterRender;
afterRender = function(){ _afterRender4(); prInit();
  if (!document.getElementById('prGrid') && document.querySelector('.pr-grid')) { const g=document.querySelector('.pr-grid'); g.addEventListener('change',e=>{ const c=e.target.closest('[data-cmp]'); if(!c) return; const id=c.dataset.cmp; PF.cmp = c.checked ? PF.cmp.concat(id).slice(0,3) : PF.cmp.filter(x=>x!==id); cmpRender(); }); cmpRender(); }
};
