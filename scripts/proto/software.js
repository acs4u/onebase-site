/* ===== Mini clickable software demos: member app (phone) + OneBase OS (tablet), per modality ===== */
const SWP = {
  ice:   { unit:'°F', start:68, phases:['Cooling','In session'], protos:[['Post-workout reset',3,38,'Short, tolerable cold to bring heart rate down after training.'],['Morning activation',5,35,'Alertness and mood lift to start the day.'],['Deep cold',8,33,'For experienced users building cold tolerance.']] },
  heat:  { unit:'°F', start:72, phases:['Heating','In session'], protos:[['Recovery',20,135,'Gentle full-spectrum heat for muscle recovery.'],['Detox',30,140,'Longer session to raise core temperature and sweat.'],['Deep heat',40,149,'Maximum heat for heat-adapted users.']] },
  air:   { unit:' ATA', start:1.0, phases:['Pressurising','At pressure','Decompressing'], protos:[['Recovery',60,1.5,'Moderate pressure for everyday recovery and wellbeing.'],['Performance',60,2.0,'Higher pressure for athletes and clinical protocols.'],['Intro session',30,1.3,'A short, gentle first session.']] },
  light: { unit:'', start:0, phases:['In session'], protos:[['Skin health',10,'633 · 660 nm','Red wavelengths for skin and collagen.'],['Muscle recovery',15,'660 · 850 nm','Red and near-infrared for deeper tissue.'],['Full spectrum',20,'All wavelengths','Every channel for a whole-body session.']] },
};
const SW = { mod:'ice', name:'IceVault Quad', view:'app', scr:'list', pi:0, t:0, dur:20, run:false, done:0, iv:null, press:[] };
function swProtos(){
  const d = SWP[SW.mod]; let ps = d.protos;
  if (SW.mod==='air' && SW.pressures && SW.pressures.length) { const max = Math.max(...SW.pressures.map(x=>parseFloat(x))); ps = ps.filter(p=>p[2] <= max + 1e-6); }
  return ps;
}
function swVal(p, k){ // k = 0..1 progress through session
  const d = SWP[SW.mod];
  if (SW.mod==='light') return p[2];
  if (SW.mod==='air') { const target=p[2], a=Math.min(1,k/0.12), c=k>0.9?(k-0.9)/0.1:0; const v = 1 + (target-1)*a - (target-1)*c; return v.toFixed(2)+d.unit; }
  const target=p[2]; const a=Math.min(1,k/0.15); return Math.round(d.start + (target-d.start)*a) + d.unit;
}
function swPhase(k){ const ph = SWP[SW.mod].phases; if (SW.mod==='air') return k<0.12?ph[0]:k>0.9?ph[2]:ph[1]; if (ph.length===1) return ph[0]; return k<0.15?ph[0]:ph[1]; }
const mmss = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function swApp(){
  const c = MODC[SW.mod]; const acc = c.acc||c.glow; const ps = swProtos(); const p = ps[SW.pi] || ps[0];
  const top = `<div class="ph-top"><span>9:41</span><span class="ph-dev"><i style="background:${SW.run?acc:'#6fbf8e'}"></i>${esc(SW.name)} · ${SW.run?'In use':'Ready'}</span></div>`;
  if (SW.scr==='list') return top + `<div class="ph-body"><p class="ph-eyebrow">OneBase app</p><h4 class="ph-h">Choose a protocol</h4>${ps.map((x,i)=>`<button class="ph-card" data-sw="pick" data-i="${i}"><span><b>${esc(x[0])}</b><small>${x[1]} min · ${typeof x[2]==='number'?x[2]+SWP[SW.mod].unit:x[2]}</small></span><em>›</em></button>`).join('')}<p class="ph-foot">Sample protocols for demo purposes</p></div>`;
  if (SW.scr==='detail') return top + `<div class="ph-body"><button class="ph-back" data-sw="back">‹ Protocols</button><p class="ph-eyebrow">${esc(p[0])}</p><p class="ph-big" style="color:${acc}">${typeof p[2]==='number'?p[2]+SWP[SW.mod].unit:p[2]}</p><p class="ph-sub">${p[1]} minutes</p><p class="ph-copy">${esc(p[3])}</p><button class="ph-go" style="background:${acc}" data-sw="start">Start session</button></div>`;
  if (SW.scr==='run') { const k = SW.t/SW.dur; const R=78, C=2*Math.PI*R; const left = p[1]*60*(1-k);
    return top + `<div class="ph-body ph-run"><p class="ph-eyebrow">${esc(swPhase(k))}</p><svg viewBox="0 0 200 200" class="ph-ring"><circle cx="100" cy="100" r="${R}" stroke="rgba(255,255,255,.1)" stroke-width="10" fill="none"/><circle cx="100" cy="100" r="${R}" stroke="${acc}" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-k)}" transform="rotate(-90 100 100)"/><text x="100" y="96" text-anchor="middle" font-size="34" font-weight="500" fill="#fff">${mmss(left)}</text><text x="100" y="124" text-anchor="middle" font-size="12" fill="rgba(255,255,255,.6)">remaining</text></svg>
      <div class="ph-live"><div><small>${SW.mod==='air'?'Pressure':SW.mod==='light'?'Wavelengths':'Temperature'}</small><b>${swVal(p,k)}</b></div><div><small>Protocol</small><b>${esc(p[0])}</b></div></div>
      <div class="ph-row"><button class="ph-sec" data-sw="pause">${SW.run?'Pause':'Resume'}</button><button class="ph-sec" data-sw="end">End</button></div><p class="ph-foot">Demo runs sped up</p></div>`; }
  return top + `<div class="ph-body ph-run"><div class="ph-check" style="border-color:${acc};color:${acc}">✓</div><h4 class="ph-h" style="text-align:center">Session complete</h4><p class="ph-copy" style="text-align:center">${esc(p[0])} · ${p[1]} min · ${typeof p[2]==='number'?p[2]+SWP[SW.mod].unit:p[2]}</p><div class="ph-live"><div><small>Sessions this week</small><b>${3+SW.done}</b></div><div><small>Logged to</small><b>Your history</b></div></div><button class="ph-go" style="background:${acc}" data-sw="home">Done</button></div>`;
}
function swOS(){
  const c = MODC[SW.mod]; const acc=c.acc||c.glow; const ps=swProtos(); const p=ps[SW.pi]||ps[0]; const k=SW.scr==='run'?SW.t/SW.dur:0;
  const others = [['air','AirForm Plus','Ready','1.00 ATA'],['ice','IceVault Quad','In use','36°F'],['heat','Yakisugi Quad','Ready','140°F'],['light','LightBed','In use','660 · 850 nm']].filter(o=>o[0]!==SW.mod).slice(0,3);
  const mine = [SW.mod, SW.name, SW.scr==='run'?(SW.run?'In use':'Paused'):'Ready', SW.scr==='run'?swVal(p,k):(SW.mod==='light'?'Idle':(SW.mod==='air'?'1.00 ATA':(SWP[SW.mod].protos[0][2])+SWP[SW.mod].unit))];
  const rows = [mine, ...others];
  const bars = [4,6,9,7,11,14,12,9,13,16+SW.done,0,0].map((v,i)=>`<i style="height:${v?Math.min(100,v*5):4}%;background:${i===9?acc:'rgba(255,255,255,.22)'}"></i>`).join('');
  return `<div class="os-top"><b>OneBase OS</b><span>Demo Studio · Today</span></div>
   <div class="os-kpis"><div><small>Sessions today</small><b>${38+SW.done}</b></div><div><small>Utilisation</small><b>64%</b></div><div><small>Devices online</small><b>4 / 4</b></div></div>
   <div class="os-grid"><div class="os-card"><p class="os-l">Devices</p>${rows.map(r=>`<div class="os-row${r===mine?' me':''}"><i style="background:${MODC[r[0]].acc||MODC[r[0]].glow}"></i><span>${esc(r[1])}</span><em class="${r[2]==='In use'?'on':''}">${r[2]}</em><b>${esc(r[3])}</b></div>`).join('')}</div>
   <div class="os-card"><p class="os-l">Sessions by hour</p><div class="os-bars">${bars}</div><p class="os-l" style="margin-top:12px">Alerts</p><div class="os-alert">${SW.mod==='ice'?'Self-clean cycle scheduled 11:00 pm':SW.mod==='air'?'O₂ concentrator filter due in 6 days':SW.mod==='heat'?'Heater check due next week':'Lens clean due in 3 days'}</div></div></div>
   <p class="os-foot">Illustrative demo. OneBase OS is coming late 2026.</p>`;
}
function swRender(){
  const el = document.getElementById('sw-screen'); if (!el) return;
  el.className = SW.view==='app'?'sw-phone':'sw-tab'; el.innerHTML = SW.view==='app' ? swApp() : swOS();
  document.querySelectorAll('#sw-tabs button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.v===SW.view)));
  document.querySelectorAll('#sw-mods button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.v===SW.mod)));
}
function swStop(){ if (SW.iv) clearInterval(SW.iv); SW.iv=null; }
function swTick(){ if (!SW.run) return; SW.t += 0.25; if (SW.t >= SW.dur) { SW.t = SW.dur; SW.run=false; swStop(); SW.scr='done'; SW.done++; } swRender(); }
function swSetMod(m, name, pressures){ swStop(); Object.assign(SW, { mod:m, name, pressures, scr:'list', pi:0, t:0, run:false }); }
function swHTML(title, sub, switcher){
  return `<section class="sec sw-sec"><div class="wrap sw-wrap"><div class="stack" style="gap:16px">${eyebrow('Try the software')}<h2>${title}</h2><p class="muted">${sub}</p>
   ${switcher?`<div class="chips" id="sw-mods">${['air','ice','heat','light'].map(m=>`<button class="chip mchip" style="--c:${MODC[m].acc||MODC[m].glow}" data-v="${m}"><i></i>${D.modalities[m].label}</button>`).join('')}</div>`:''}
   <div class="seg" id="sw-tabs"><button data-v="app">Member app<small>Pick a protocol, run a session</small></button><button data-v="os">OneBase OS<small>What your team sees</small></button></div>
   <p class="note">Tap through it. Everything on the screen is clickable.</p></div>
   <div class="sw-stage"><div id="sw-screen"></div></div></div></section>`;
}
function swInit(){
  const scr = document.getElementById('sw-screen'); if (!scr) return;
  scr.addEventListener('click', e => { const b = e.target.closest('[data-sw]'); if (!b) return; const a = b.dataset.sw;
    if (a==='pick') { SW.pi=+b.dataset.i; SW.scr='detail'; }
    else if (a==='back') SW.scr='list';
    else if (a==='start') { SW.scr='run'; SW.t=0; SW.run=true; swStop(); SW.iv=setInterval(swTick,250); }
    else if (a==='pause') { SW.run=!SW.run; if (SW.run && !SW.iv) SW.iv=setInterval(swTick,250); }
    else if (a==='end') { swStop(); SW.run=false; SW.scr='done'; SW.done++; }
    else if (a==='home') SW.scr='list';
    swRender(); });
  document.getElementById('sw-tabs').addEventListener('click', e => { const b=e.target.closest('button'); if (!b) return; SW.view=b.dataset.v; swRender(); });
  const mods = document.getElementById('sw-mods'); if (mods) mods.addEventListener('click', e => { const b=e.target.closest('button'); if (!b) return; const m=b.dataset.v; const def={air:['AirForm Plus',['1.5 ATA','1.6 ATA','2.0 ATA']],ice:['IceVault Quad'],heat:['Yakisugi Quad'],light:['LightBed']}[m]; swSetMod(m, def[0], def[1]); swRender(); });
  swRender();
}
/* wire: product pages + software page */
const _product2 = pages.product, _software = pages.software;
pages.product = (cat, id) => {
  const h = _product2(cat, id); const p = D.products.find(x=>x.id===id&&x.category===cat); if (!p) return h;
  const size = p.sizes.length ? (p.sizes[Math.min(1,p.sizes.length-1)].label) : ''; swSetMod(p.modality, p.name + (size?' '+size:''), p.pressures);
  const sec = swHTML(`Run a session on the ${esc(p.name)}.`, `Members pick a doctor-built protocol in the OneBase app and follow their ${esc(p.name)} session on their phone. Your team sees every device, session and alert in OneBase OS.`, false);
  const anchor = '<section class="sec" style="background:var(--surf)">';
  return h.includes(anchor) ? h.replace(anchor, sec + anchor) : h + sec;
};
pages.software = () => { swSetMod('ice','IceVault Quad'); return _software().replace(/<section class="sec" style="background:var\(--surf\)"><div class="wrap grid" style="grid-template-columns:1fr 1\.3fr[\s\S]*?<\/section>/, m => swHTML('One app for every modality.', 'Switch between Air, Ice, Heat and Light, start a session in the member app, then flip to OneBase OS to see it from the operator’s side.', true) + m.replace(/<div><div class="ph"[\s\S]*?<\/div><\/div>/, '').replace('grid-template-columns:1fr 1.3fr','grid-template-columns:1fr;max-width:760px')); };
const _afterRender = afterRender;
afterRender = function(){ swStop(); _afterRender(); swInit(); };
