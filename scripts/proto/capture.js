/* ===== Contact capture: book-a-call, two-step enquiry, spec-sheet download =====
   Production: every submit posts to HubSpot Forms API (portal 20568937) with hidden fields:
   source_page, capture_type (booking | enquiry | spec_sheet | planner | configurator), venue_type, sites, timeline, country, product, configuration.
   Booking step uses HubSpot Meetings (round-robin by region) in place of the mock calendar below. */
const VENUE_TYPES = ['Gym or fitness club','Recovery studio','Sports team','Hotel or spa','Clinic','Residential / real estate','Corporate wellness','Other'];
const TIMELINES = ['Ready now','1–3 months','3–6 months','6+ months','Just researching'];
const BK = { step:1, venue:'', sites:'', timeline:'', day:null, slot:null, context:'' };
function bkSlots(){ const out=[]; const d=new Date(); d.setHours(0,0,0,0); while(out.length<6){ d.setDate(d.getDate()+1); const wd=d.getDay(); if (wd===0||wd===6) continue; out.push(new Date(d)); } return out; }
const BK_TIMES = ['9:00','10:00','11:30','13:00','14:30','16:00'];
const bkTaken = (di, ti) => ((di*7 + ti*3) % 5) === 0;
function bkBody(){
  const chips = (k, list) => `<div class="chips" data-bk="${k}">${list.map(v=>`<button type="button" class="chip" aria-pressed="${BK[k]===v}" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;
  const steps = `<ol class="bk-steps">${['Venue','Time','Details'].map((s,i)=>`<li class="${BK.step===i+1?'on':BK.step>i+1?'done':''}">${s}</li>`).join('')}</ol>`;
  if (BK.step===1) return steps + `<h3>Book a call with our team</h3><p class="muted small">30 minutes with a OneBase specialist. We’ll cover your space, the right equipment and pricing.</p>${BK.context?`<p class="bk-ctx">Re: ${esc(BK.context)}</p>`:''}
    <p class="bk-q">What kind of venue?</p>${chips('venue',VENUE_TYPES)}<p class="bk-q">How many sites?</p>${chips('sites',['1','2–5','6+'])}<p class="bk-q">When are you looking to install?</p>${chips('timeline',TIMELINES)}
    <div class="bk-foot"><button class="btn btn-p" data-bk-go="2" ${BK.venue&&BK.sites&&BK.timeline?'':'disabled'}>Choose a time</button></div>`;
  if (BK.step===2) { const days=bkSlots(); if (BK.day===null) BK.day=0; const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g,' ');
    return steps + `<h3>Pick a time</h3><p class="muted small">Times shown in your time zone (${esc(tz)}).</p>
    <div class="bk-days">${days.map((d,i)=>`<button type="button" data-bk-day="${i}" aria-pressed="${BK.day===i}"><small>${d.toLocaleDateString('en-US',{weekday:'short'})}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-US',{month:'short'})}</small></button>`).join('')}</div>
    <div class="bk-times">${BK_TIMES.map((t,i)=>{ const tk=bkTaken(BK.day,i); return `<button type="button" data-bk-slot="${t}" ${tk?'disabled':''} aria-pressed="${BK.slot===t}">${tk?'Taken':t}</button>`; }).join('')}</div>
    <div class="bk-foot"><button class="btn btn-g" data-bk-go="1">Back</button><button class="btn btn-p" data-bk-go="3" ${BK.slot?'':'disabled'}>Continue</button></div>`; }
  if (BK.step===3) { const d=bkSlots()[BK.day];
    return steps + `<h3>Your details</h3><p class="bk-sum">${d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})} · ${BK.slot} · 30 min · ${esc(BK.venue)}</p>
    <form class="enq" id="bkForm" style="padding:0;border:0;background:none"><label>Name *<input required></label><label>Work email *<input type="email" required></label><label>Company *<input required></label><label>Phone<input type="tel"></label><label class="full">Anything we should know?<textarea rows="3">${BK.context?esc('Interested in '+BK.context):''}</textarea></label>
    <div class="full bk-foot" style="margin:0"><button type="button" class="btn btn-g" data-bk-go="2">Back</button><button class="btn btn-p" type="submit">Confirm booking</button></div></form>`; }
  const d=bkSlots()[BK.day];
  return `<div class="bk-done"><div class="bk-tick">✓</div><h3>You’re booked</h3><p>${d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})} at ${BK.slot}. A calendar invite is on its way.</p><p class="muted small">Want to get ahead? Try the <a href="#/planner" style="text-decoration:underline">room planner</a> and we’ll bring your layout to the call.</p><button class="btn btn-p" data-bk-close>Done</button></div>`;
}
function bkRender(){ const m=document.getElementById('bk-body'); if (m) m.innerHTML=bkBody(); }
function bkOpen(context){
  let m = document.getElementById('bk-modal');
  if (!m) { m=document.createElement('div'); m.id='bk-modal'; m.className='bk-modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-label','Book a call');
    m.innerHTML='<div class="bk-back" data-bk-close></div><div class="bk-card"><button class="bk-x" data-bk-close aria-label="Close">×</button><div id="bk-body"></div></div>'; document.body.appendChild(m);
    m.addEventListener('click', e => {
      if (e.target.closest('[data-bk-close]')) { m.classList.remove('open'); document.body.style.overflow=''; return; }
      const c=e.target.closest('[data-bk] .chip'); if (c) { BK[c.parentElement.dataset.bk]=c.dataset.v; bkRender(); return; }
      const g=e.target.closest('[data-bk-go]'); if (g && !g.disabled) { e.preventDefault(); BK.step=+g.dataset.bkGo; bkRender(); return; }
      const dy=e.target.closest('[data-bk-day]'); if (dy) { BK.day=+dy.dataset.bkDay; BK.slot=null; bkRender(); return; }
      const sl=e.target.closest('[data-bk-slot]'); if (sl && !sl.disabled) { BK.slot=sl.dataset.bkSlot; bkRender(); return; }
    });
    m.addEventListener('submit', e => { e.preventDefault(); BK.step=4; bkRender(); });
    addEventListener('keydown', e => { if (e.key==='Escape' && m.classList.contains('open')) { m.classList.remove('open'); document.body.style.overflow=''; } });
  }
  Object.assign(BK, { step:1, day:null, slot:null, context: context||'' }); bkRender(); m.classList.add('open'); document.body.style.overflow='hidden';
  setTimeout(()=>m.querySelector('.bk-card button, .bk-card .chip')?.focus(), 50);
}
/* intercept every sales CTA button (not plain nav links) */
document.addEventListener('click', e => {
  const a = e.target.closest('a.btn[href="#/contact"]'); if (!a) return;
  e.preventDefault(); const p = currentProduct(); bkOpen(p ? 'OneBase '+p.name : '');
}, true);
function currentProduct(){ const parts=(location.hash||'').slice(2).split('/'); return parts[0]==='products' && parts[2] ? D.products.find(x=>x.id===parts[2]) : null; }

/* ---------- Two-step enquiry (replaces the long form inside #enquiry) ---------- */
function enqHTML(p){
  return `<form class="enq enq2" id="enq2" novalidate>
   <div class="full enq-prog"><span class="on">1 · About you</span><span>2 · Your project</span></div>
   <div class="full enq-s1"><div class="enq-row"><label>Work email *<input type="email" name="email" required></label><label>Venue type *<select name="venue" required><option value="">Select</option>${VENUE_TYPES.map(v=>`<option>${esc(v)}</option>`).join('')}</select></label></div>
    <div class="row" style="margin-top:14px"><button class="btn btn-p" type="button" data-enq="next">Continue</button><span class="faint" style="font-size:12px">Takes under a minute.</span></div></div>
   <div class="full enq-s2" hidden><div class="enq-grid"><label>Name *<input name="name" required></label><label>Company *<input name="company" required></label><label>Phone<input name="phone" type="tel"></label><label>Country *<select name="country" required><option value="">Select</option>${['United States','Canada','Australia','New Zealand','United Kingdom','Hong Kong','Singapore','Other'].map(c=>`<option>${c}</option>`).join('')}</select></label>
    <label>Timeline<select name="timeline"><option value="">Select</option>${TIMELINES.map(t=>`<option>${t}</option>`).join('')}</select></label><label>Sites<select name="sites"><option value="">Select</option><option>1</option><option>2–5</option><option>6+</option></select></label>
    <label class="full">Message<textarea id="msg" name="message" rows="3">${p?esc('Interested in OneBase '+p.name):''}</textarea></label></div>
    <div class="row" style="margin-top:14px"><button class="btn btn-g" type="button" data-enq="back">Back</button><button class="btn btn-p" type="submit">Send enquiry</button><span class="faint" style="font-size:12px">By submitting, you agree to receive communications from OneBase. Unsubscribe anytime.</span></div></div>
   <input type="hidden" name="source_page" value="${esc(location.hash||'#/')}"><input type="hidden" name="product" value="${p?esc(p.id):''}">
  </form>`;
}
function enqInit(){
  const sec=document.getElementById('enquiry'); if (!sec) return; const old=sec.querySelector('form.enq'); if (!old || old.id==='enq2') return;
  const p=currentProduct(); old.outerHTML=enqHTML(p); const f=document.getElementById('enq2');
  const sched = sec.querySelector('a.btn-g[href="#/contact"]'); if (sched) sched.textContent='Book a call';
  f.addEventListener('click', e => { const b=e.target.closest('[data-enq]'); if (!b) return;
    if (b.dataset.enq==='next') { const em=f.elements.email, vn=f.elements.venue; if (!em.checkValidity()||!vn.value) { (!em.checkValidity()?em:vn).reportValidity(); return; } f.querySelector('.enq-s1').hidden=true; f.querySelector('.enq-s2').hidden=false; f.querySelectorAll('.enq-prog span')[1].classList.add('on'); f.elements.name.focus(); }
    else { f.querySelector('.enq-s1').hidden=false; f.querySelector('.enq-s2').hidden=true; f.querySelectorAll('.enq-prog span')[1].classList.remove('on'); } });
  f.addEventListener('submit', e => { e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; }
    const venue=f.elements.venue.value, tl=f.elements.timeline.value; const hot = tl==='Ready now'||tl==='1–3 months';
    f.innerHTML = `<div class="full stack" style="gap:10px"><p style="font-weight:500;font-size:20px">Thanks, we’ve got it.</p><p class="muted">A specialist will reply within one business day.${hot?' Since you’re moving soon, you can lock in a call now instead of waiting.':''}</p><div><button type="button" class="btn btn-p" data-book>Book a call now</button></div></div>`;
    f.querySelector('[data-book]').onclick = () => { BK.venue=venue; BK.timeline=tl; bkOpen(p?'OneBase '+p.name:''); };
  });
}

/* ---------- Spec-sheet download (product pages) ---------- */
function specHTML(p){
  return `<section class="sec spec-cta"><div class="wrap spec-grid"><div class="stack" style="gap:12px">${eyebrow('For architects, designers and procurement')}<h2>Get the ${esc(p.name)} spec sheet.</h2><p class="muted">Dimensions, electrical, certifications and install requirements on one page. Ready to drop into a fit-out pack.</p></div>
   <form class="enq spec-form" id="specForm"><label class="full">Work email *<input type="email" name="email" required></label><label class="full">I’m a…<select name="role"><option>Operator / owner</option><option>Architect or designer</option><option>Procurement</option><option>Contractor</option><option>Other</option></select></label><div class="full"><button class="btn btn-p" type="submit">Get the spec sheet</button></div></form></div></section>`;
}
function specSheet(p){
  const img = D.img[D.prodImg[p.id]];
  const rows = (arr) => arr.map(r=>`<tr><th>${esc(r.label)}</th><td>${esc(r.value)}</td></tr>`).join('');
  return `<div class="ss-sheet" id="ss-sheet"><header><img src="${D.img['onebase-logo-black']}" alt="OneBase"><span>Spec sheet · ${new Date().toLocaleDateString('en-US',{month:'short',year:'numeric'})}</span></header>
   <div class="ss-top"><div><p class="eyebrow">${esc(mod(p.modality).name)}</p><h2>OneBase ${esc(p.name)}</h2><p class="muted">${esc(p.tagline)}</p>
    <dl>${p.sizes.length?`<div><dt>Sizes</dt><dd>${p.sizes.map(s=>s.label).join(' · ')}</dd></div>`:''}${p.colours.length?`<div><dt>Finishes</dt><dd>${p.colours.join(' · ')}</dd></div>`:''}${p.pressures.length?`<div><dt>Pressure</dt><dd>${p.pressures.join(' · ')}</dd></div>`:''}${p.certifications.length?`<div><dt>Certifications</dt><dd>${p.certifications.join(' · ')}</dd></div>`:''}</dl></div>${img?`<img src="${img}" alt="">`:''}</div>
   <h3>Specifications</h3><table>${rows(p.specs)}</table>${p.electrical.length?`<h3>Electrical &amp; services</h3><table>${rows(p.electrical)}</table>`:''}
   <footer>OneBase Health · Waylen Allen Limited · Sales (208) 408-1801 · onebasehealth.com<br>Specifications subject to change. Confirm final dimensions and electrical requirements with OneBase before construction.</footer></div>`;
}
function specInit(){
  const f=document.getElementById('specForm'); if (!f) return; const p=currentProduct();
  f.addEventListener('submit', e => { e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; }
    f.innerHTML = `<p class="full" style="font-weight:500">Sent to ${esc(f.elements.email.value)}.</p><p class="full muted small">Here’s your copy now:</p><div class="full"><button type="button" class="btn btn-p" id="ssOpen">Open spec sheet</button></div>`;
    document.getElementById('ssOpen').onclick = () => ssOpen(p); ssOpen(p); });
}
function ssOpen(p){
  let m=document.getElementById('ss-modal'); if (!m) { m=document.createElement('div'); m.id='ss-modal'; m.className='bk-modal ss-modal'; document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target.closest('[data-ss-close]')) { m.classList.remove('open'); document.body.style.overflow=''; } if (e.target.closest('[data-ss-print]')) print(); }); }
  m.innerHTML = `<div class="bk-back" data-ss-close></div><div class="ss-card"><div class="ss-bar"><button class="btn btn-p" data-ss-print>Print or save as PDF</button><button class="bk-x" style="position:static" data-ss-close aria-label="Close">×</button></div>${specSheet(p)}</div>`;
  m.classList.add('open'); document.body.style.overflow='hidden';
}

/* ---------- Wire ---------- */
const _product3 = pages.product;
pages.product = (cat, id) => { const h=_product3(cat,id); const p=D.products.find(x=>x.id===id&&x.category===cat); if (!p) return h;
  const anchor='<section class="sec" style="background:var(--surf)" id="enquiry">'; return h.includes(anchor) ? h.replace(anchor, specHTML(p)+anchor) : h + specHTML(p); };
const _afterRender3 = afterRender;
afterRender = function(){ _afterRender3(); enqInit(); specInit(); const m=document.getElementById('bk-modal'); if (m) { m.classList.remove('open'); } document.body.style.overflow=''; };
