/* ===== ROI calculator: /#/roi =====
   Sessions a day, price, utilisation → monthly revenue and payback. Equipment is chosen by product and size;
   cycle times and capacity come from the equipment catalogue (CAT). The investment figure is typed by the operator,
   so no equipment price is shown. The result is sent through the enquiry form like a configurator build. */
const ROI = { code: 'IV4', hours: 12, price: 30, util: 35, invest: 0, days: 26 };
const ROI_ORDER = ['IV2','IV4','IV8','YK2','YK4','YK8','HM4','LB','LZ','LP4','AFT','AFP','AS2'];
const ROI_MOD = { ice:'Cold', heat:'Heat', light:'Light', air:'Air' };
const ROI_DEF_PRICE = { ice: 30, heat: 35, light: 40, air: 90 };
function roiCompute(){
  const c = CAT[ROI.code]; const cyc = c.cyc + 5; /* 5 min changeover */ const perDay = c.n * Math.floor(ROI.hours * 60 / cyc); const sessions = perDay * ROI.util / 100;
  const monthly = sessions * ROI.days * ROI.price; const yearly = monthly * 12;
  const payback = ROI.invest > 0 && monthly > 0 ? ROI.invest / monthly : null;
  return { c, cyc, perDay, sessions, monthly, yearly, payback };
}
function roiHTML(){
  const fmt = n => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const opts = ROI_ORDER.map(k => { const c = CAT[k]; return `<button type="button" data-roi="${k}" aria-pressed="${ROI.code===k}"><b>${esc(prodName(c).replace('OneBase ',''))}</b><small>${ROI_MOD[c.m]} · ${c.n} at a time · ${c.cyc} min</small></button>`; }).join('');
  return `<section class="wrap stack" style="padding-block:56px 12px;max-width:820px">${eyebrow('Return on investment')}<h1>What could it earn?</h1><p class="muted">Pick the equipment, set what you'd charge and how busy it would be. The numbers use real session and turnover times.</p></section>
  <section class="wrap" style="padding-block:24px 80px"><div class="roi">
   <div class="roi-ctl">
    <div><p class="eyebrow" style="margin-bottom:10px">Equipment</p><div class="seg roi-seg">${opts}</div></div>
    <div class="roi-sl">
     <div><h3>Hours open a day <output id="ro-hours">${ROI.hours}</output></h3><input class="rng" type="range" id="rr-hours" min="4" max="18" step="1" value="${ROI.hours}" aria-label="Hours open a day"></div>
     <div><h3>Price per session <output id="ro-price">US$${ROI.price}</output></h3><input class="rng" type="range" id="rr-price" min="0" max="200" step="5" value="${ROI.price}" aria-label="Price per session"></div>
     <div><h3>Utilisation <output id="ro-util">${ROI.util}%</output></h3><input class="rng" type="range" id="rr-util" min="10" max="80" step="5" value="${ROI.util}" aria-label="Utilisation"></div>
     <div><h3>Days open a month <output id="ro-days">${ROI.days}</output></h3><input class="rng" type="range" id="rr-days" min="20" max="31" step="1" value="${ROI.days}" aria-label="Days open a month"></div>
     <div><h3>Your all-in budget <small class="muted">(optional, for payback)</small></h3><label class="roi-in"><span>US$</span><input type="number" id="rr-invest" min="0" step="1000" placeholder="Equipment, install, fit-out" aria-label="Investment"></label></div>
    </div>
   </div>
   <div class="roi-out" id="roiOut"></div>
  </div></section>`;
}
function roiRender(){
  const r = roiCompute(); const fmt = n => n.toLocaleString('en-US', { maximumFractionDigits: 0 }); const out = document.getElementById('roiOut'); if (!out) return;
  const pb = r.payback == null ? '' : r.payback < 1 ? 'Under a month' : r.payback < 24 ? `${Math.round(r.payback)} months` : `${(r.payback/12).toFixed(1)} years`;
  out.innerHTML = `<p class="cfg-name">${esc(prodName(r.c))}</p>
   <div class="kpis"><div><strong>${fmt(r.sessions)}</strong><span>paid sessions a day</span></div><div><strong>US$${fmt(r.monthly/1000)}k</strong><span>revenue a month</span></div><div><strong>US$${fmt(r.yearly/1000)}k</strong><span>a year</span></div><div><strong>${pb||'—'}</strong><span>${pb?`payback on US$${fmt(ROI.invest)}`:'payback: enter your budget'}</span></div></div>
   <dl class="readout"><div><dt>Capacity</dt><dd>${r.c.n} ${r.c.n>1?'people':'person'} per ${r.c.cyc}-minute session, plus 5 minutes changeover</dd></div><div><dt>Maximum a day</dt><dd>${fmt(r.perDay)} sessions at ${ROI.hours} hours</dd></div><div><dt>At ${ROI.util}% utilisation</dt><dd>${fmt(r.sessions)} sessions × US$${ROI.price} × ${ROI.days} days</dd></div></dl>
   <p class="note">Illustrative only. Revenue depends on your pricing, membership model and local demand. Running costs (power, cleaning, staff time) are not included. Not a guarantee of results.</p>
   <div class="row"><button class="btn btn-p" id="roiSend">Send me this estimate</button><a class="btn" href="#/contact">Talk to sales</a></div>`;
}
function roiInit(){
  const el = document.querySelector('.roi'); if (!el) return;
  el.querySelectorAll('.rng').forEach(rngStyle);
  el.addEventListener('click', e => { const b = e.target.closest('[data-roi]'); if (!b) return; ROI.code = b.dataset.roi; if (!ROI._priceTouched) { ROI.price = ROI_DEF_PRICE[CAT[ROI.code].m]; const p = document.getElementById('rr-price'); p.value = ROI.price; rngStyle(p); document.getElementById('ro-price').textContent = 'US$' + ROI.price; }
    el.querySelectorAll('[data-roi]').forEach(x => x.setAttribute('aria-pressed', x === b)); roiRender(); });
  el.addEventListener('input', e => { const t = e.target; if (t.id === 'rr-hours') { ROI.hours = +t.value; document.getElementById('ro-hours').textContent = t.value; }
    if (t.id === 'rr-price') { ROI.price = +t.value; ROI._priceTouched = true; document.getElementById('ro-price').textContent = 'US$' + t.value; }
    if (t.id === 'rr-util') { ROI.util = +t.value; document.getElementById('ro-util').textContent = t.value + '%'; }
    if (t.id === 'rr-days') { ROI.days = +t.value; document.getElementById('ro-days').textContent = t.value; }
    if (t.id === 'rr-invest') ROI.invest = +t.value || 0;
    if (t.classList.contains('rng')) rngStyle(t); roiRender(); });
  el.addEventListener('click', e => { if (!e.target.closest('#roiSend')) return; const r = roiCompute(); const fmt = n => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    window.OB_CFG = `${prodName(r.c)} · ${fmt(r.sessions)} sessions/day at US$${ROI.price}, ${ROI.util}% utilisation, ${ROI.hours} h/day → US$${fmt(r.monthly)}/month` + (r.payback ? `, payback ${Math.round(r.payback)} months on US$${fmt(ROI.invest)}` : '');
    if (typeof obTrack === 'function') obTrack('roi_send', { product_id: r.c.p, modality: r.c.m });
    obGo('#/contact'); setTimeout(() => { const m = document.getElementById('msg'); if (m) m.value = `ROI estimate: ${window.OB_CFG}\n\nI'd like to talk about this.`; document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' }); }, 80); });
  roiRender();
}
pages.roi = () => roiHTML();
(() => { const _ar = afterRender; afterRender = function(){ _ar(); roiInit(); }; })();
// Nav and product-page entry points
(() => { const i = NAV.findIndex(x => x[1] === '#/solutions'); NAV.splice(i + 1, 0, ['ROI', '#/roi']); })();
(() => { const _p = pages.product; pages.product = (cat, id) => { const h = _p(cat, id); const cs = ROI_ORDER.filter(k => CAT[k].p === id); if (!cs.length) return h; const c = cs.length > 1 ? cs[1] : cs[0];
  const cta = `<section class="sec roi-cta"><div class="wrap roi-cta-in"><div>${eyebrow('Return on investment')}<h2>What could it earn?</h2><p class="muted">Set your price and how busy it would be, and see revenue a month and payback.</p></div><a class="btn btn-p" href="#/roi" data-roi-pre="${c}">Run the numbers</a></div></section>`;
  return h.includes('<section class="pp-state"') ? h.replace('<section class="pp-state"', cta + '<section class="pp-state"') : h + cta; }; })();
document.addEventListener('click', e => { const a = e.target.closest('[data-roi-pre]'); if (a) { ROI.code = a.dataset.roiPre; ROI._priceTouched = false; ROI.price = ROI_DEF_PRICE[CAT[ROI.code].m]; } });
(() => { const s = document.createElement('style'); s.textContent = `
.roi{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:start}
.roi-ctl{display:grid;gap:28px}
.roi-seg{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}
.roi-seg button{min-width:0}
.roi-sl{display:grid;gap:22px}
.roi-sl h3{font-size:14px;font-weight:500;display:flex;justify-content:space-between;margin-bottom:8px}
.roi-sl output{font-weight:300;color:var(--muted)}
.roi-in{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:10px;padding:10px 14px;background:var(--card)}
.roi-in input{font:inherit;font-size:16px;border:0;outline:0;background:none;width:100%}
.roi-out{position:sticky;top:84px;background:var(--surf);border-radius:20px;padding:28px}
.roi-out .kpis{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:18px 0 22px}
.roi-out .kpis strong{display:block;font-size:28px;font-weight:500;letter-spacing:-.02em}
.roi-out .kpis span{font-size:13px;color:var(--muted)}
.roi-out .note{font-size:12px;color:var(--faint);margin-top:16px;max-width:44ch}
.roi-out .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.roi-cta{background:var(--surf)}
.roi-cta-in{display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap}
.roi-cta-in h2{margin-top:8px}.roi-cta-in .muted{margin-top:8px;max-width:46ch}
@media(max-width:900px){.roi{grid-template-columns:1fr}.roi-out{position:static}}`; document.head.appendChild(s); })();
