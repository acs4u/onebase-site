/* ===== AirSuite chamber tablet — rebuilt from Figma "TABLET - AirSuite Solo/Duo" (file jwEqfDfEmzqVp4WpiR7J2G) =====
   Canvas is authored at 1280×800 (the Figma frame size) and scaled to fit. Copy and flow follow the Figma frames:
   Splash → Start Session (time / pressure / speed) → door pop-up → Pressurizing… (3 s) → In session → Session Completed! (5 s) → home.
   Settings panel (left, 420 wide): Session Control, Light Control, Air Conditioning, BIBS Breathing Control, Pressurization Speed, Insights, About. */
const TB = { scr:'splash', mins:90, ata:1.3, speed:'Medium', pick:null, set:null, t:0, iv:null, finish:'', light:{on:true, link:true, floor:true, roof:true, bright:70, col:'#9aacbe', delay:10}, ac:{on:true, temp:21}, bibs:{opt:'Oxygen', breaks:true, o2:20, air:5}, dspeed:'Medium', noshow:false };
const TB_SPEEDS = ['Slow','Smooth','Medium','Quick','Rapid'];
const TB_COLS = ['#ffffff','#f0d48e','#e6886a','#ea7c8c','#9aacbe','#5c94ab'];
function tbStop(){ if (TB.iv) clearInterval(TB.iv); TB.iv=null; }
function tbFinish(){ const d=new Date(Date.now()+TB.mins*60000); return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}); }
function tbTimer(k, label){ const R=160, C=2*Math.PI*R; const left=TB.mins*60*(1-k);
  return `<svg viewBox="0 0 375 375" class="tb-timer"><circle cx="187.5" cy="187.5" r="${R}" stroke="rgba(255,255,255,.12)" stroke-width="14" fill="none"/><circle cx="187.5" cy="187.5" r="${R}" stroke="#9aacbe" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-k)}" transform="rotate(-90 187.5 187.5)"/><text x="187.5" y="180" text-anchor="middle" font-size="64" font-weight="500" fill="#fff">${label||mmss(left)}</text><text x="187.5" y="225" text-anchor="middle" font-size="20" fill="rgba(255,255,255,.6)">${label?'':'remaining'}</text></svg>`; }
function tbBoxes(interactive){
  return `<div class="tb-boxes"><button class="tb-box" ${interactive?'data-tb="pick-time"':''}><b>${TB.mins}</b><span>Mins</span></button><button class="tb-box" ${interactive?'data-tb="pick-ata"':''}><b>${TB.ata.toFixed(1)}</b><span>ATA</span></button><button class="tb-box" ${interactive?'data-tb="pick-speed"':''}><b>${TB.speed}</b><span>Speed</span></button></div>`;
}
function tbInfo(){ return `<div class="tb-info"><div><b>${TB.mins}</b> <span>Mins</span><small>Session Duration</small></div><i></i><div><b>${TB.ata.toFixed(1)}</b> <span>ATA</span><small>Pressure</small></div></div>`; }
function tbPicker(){
  if (!TB.pick) return '';
  let vals, cur, fmtv, title;
  if (TB.pick==='time') { vals=[]; for (let m=20;m<=120;m+=5) vals.push(m); cur=TB.mins; fmtv=v=>v; title='Set time'; }
  else if (TB.pick==='ata') { vals=[]; for (let a=11;a<=20;a++) vals.push(a/10); cur=TB.ata; fmtv=v=>v.toFixed(1); title='Set pressure'; }
  else { vals=TB_SPEEDS; cur=TB.speed; fmtv=v=>v; title='Pressurization Speed'; }
  const i=vals.indexOf(cur); const win=vals.slice(Math.max(0,i-2), i+3);
  return `<div class="tb-sheet"><p class="tb-sheet-t">${title}</p><div class="tb-wheel">${win.map(v=>`<button data-tb="val" data-v="${v}" class="${v===cur?'on':''}">${fmtv(v)}</button>`).join('')}</div><div class="tb-steps"><button data-tb="step" data-d="-1">‹</button><button data-tb="step" data-d="1">›</button></div><button class="tb-btn" data-tb="pick-done">Done</button></div>`;
}
const TB_MENU = [['session','Session Control'],['light','Light Control'],['ac','Air Conditioning'],['bibs','BIBS Breathing Control'],['speed','Pressurization Speed'],['insights','Insights'],['about','About']];
function tbToggle(on, act){ return `<button class="tb-tog${on?' on':''}" data-tb="${act}" aria-pressed="${on}"><i></i></button>`; }
function tbSettings(){
  if (!TB.set) return '';
  const menu = `<div class="tb-menu"><p class="tb-cap">SETTINGS</p>${TB_MENU.map(([k,l])=>`<button class="${TB.set===k?'on':''}" data-tb="set" data-k="${k}">${l}</button>`).join('')}<p class="tb-ver">Version: 1.0.7</p></div>`;
  let body='';
  if (TB.set==='session') body = `<h3>Session Control</h3><p class="tb-p">Set time, pressure and pressurization speed for the next session.</p>${tbBoxes(true)}`;
  if (TB.set==='light') { const L=TB.light; body = `<h3>Light</h3><div class="tb-line"><span>Power</span>${tbToggle(L.on,'l-on')}</div><div class="tb-line"><span>Link</span>${tbToggle(L.link,'l-link')}</div><p class="tb-note">Link controls the roof and floor lights together.</p><div class="tb-line"><span>Ceiling light</span>${tbToggle(L.roof,'l-roof')}</div><div class="tb-line"><span>Floor light</span>${tbToggle(L.floor,'l-floor')}</div><div class="tb-line col"><span>Brightness <em>${L.bright}%</em></span><input type="range" min="0" max="100" value="${L.bright}" data-tb-range="bright"></div><div class="tb-line col"><span>Colours</span><div class="tb-cols">${TB_COLS.map(c=>`<button data-tb="l-col" data-v="${c}" class="${L.col===c?'on':''}" style="background:${c}"></button>`).join('')}</div></div><div class="tb-line"><span>Delay time</span><div class="tb-mini"><button data-tb="l-delay" data-d="-1">–</button><b>${L.delay} Mins</b><button data-tb="l-delay" data-d="1">+</button></div></div>`; }
  if (TB.set==='ac') body = `<h3>Air Conditioning</h3><div class="tb-line"><span>Power</span>${tbToggle(TB.ac.on,'ac-on')}</div><div class="tb-line"><span>Temperature</span><div class="tb-mini"><button data-tb="ac-t" data-d="-1">–</button><b>${TB.ac.temp}°C</b><button data-tb="ac-t" data-d="1">+</button></div></div><p class="tb-note">${TB.ac.on?'A/C is on.':'A/C is off.'}</p>`;
  if (TB.set==='bibs') { const B=TB.bibs; body = `<h3>BIBS Breathing Control</h3><p class="tb-p"><b>Customize your session</b><br>Customize your breathing experience. Choose between oxygen or normal air, or enable AirBreaks to alternate automatically. Adjust the interval length for a balanced session.</p><p class="tb-cap2">Breathing Options</p><div class="tb-opts">${[['Oxygen','Purified oxygen for maximum therapeutic effect during your session.'],['Normal Air','Clean, filtered air with the same natural oxygen level as the environment outside the chamber']].map(([k,d])=>`<button class="${B.opt===k?'on':''}" data-tb="b-opt" data-v="${k}"><b>${k}</b><small>${d}</small></button>`).join('')}</div><div class="tb-line"><span>Airbreaks</span>${tbToggle(B.breaks,'b-breaks')}</div>${B.breaks?`<div class="tb-line"><span>Oxygen</span><div class="tb-mini"><button data-tb="b-o2" data-d="-1">–</button><b>${B.o2} mins</b><button data-tb="b-o2" data-d="1">+</button></div></div><div class="tb-line"><span>Normal air</span><div class="tb-mini"><button data-tb="b-air" data-d="-1">–</button><b>${B.air} mins</b><button data-tb="b-air" data-d="1">+</button></div></div>`:''}`; }
  if (TB.set==='speed') body = `<h3>Pressurization Speed</h3><div class="tb-seg">${TB_SPEEDS.map(s=>`<button class="${TB.speed===s?'on':''}" data-tb="sp" data-v="${s}">${s}</button>`).join('')}</div><h3 style="margin-top:26px">Depressurization Speed</h3><div class="tb-seg">${TB_SPEEDS.map(s=>`<button class="${TB.dspeed===s?'on':''}" data-tb="dsp" data-v="${s}">${s}</button>`).join('')}</div>`;
  if (TB.set==='insights') { const pts=[0.1,0.1,0.6,1.0,1.3,1.3,1.3,1.3,1.3,1.3]; const path=pts.map((p,i)=>`${i?'L':'M'}${20+i*44} ${190-p*80}`).join(' ');
    body = `<h3>Insights</h3><p class="tb-p">You are breathing <b>${TB.bibs.opt}</b></p><svg viewBox="0 0 440 200" class="tb-chart">${[0.5,1,1.5,2].map(v=>`<line x1="20" x2="420" y1="${190-v*80}" y2="${190-v*80}" stroke="rgba(255,255,255,.08)"/><text x="0" y="${194-v*80}" font-size="11" fill="rgba(255,255,255,.4)">${v.toFixed(1)}</text>`).join('')}<path d="${path}" fill="none" stroke="#9aacbe" stroke-width="3"/></svg><p class="tb-cap2">Environment Insight</p><div class="tb-env">${[['O₂','20.9%'],['Pressure',TB.ata.toFixed(1)+' ATA'],['CO₂','989 ppm'],['Temperature',TB.ac.temp+'°C'],['Humidity','42%RH'],['Sound','96 dBA'],['PM2.5','16 µg/m³'],['TVOC','0.3 mg/m³']].map(([k,v])=>`<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>`; }
  if (TB.set==='about') body = `<h3>About</h3><div class="tb-env">${[['Model','AirSuite Duo 2.0 ATA'],['Session State',TB.scr==='run'||TB.scr==='press'?'In session':'Free'],['Firmware','1.0.7'],['Product ID','Demo']].map(([k,v])=>`<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>`;
  return `<div class="tb-set">${menu}<div class="tb-panel"><button class="tb-x" data-tb="close-set" aria-label="Close settings">×</button>${body}</div></div>`;
}
function tbScreen(){
  const devices = `<div class="tb-devs"><span class="on">HBOT</span><span>IR Sauna · 2 person</span></div>`;
  const gear = `<button class="tb-gear" data-tb="open-set" aria-label="Settings"><i></i><i></i><i></i></button>`;
  if (TB.scr==='splash') return `<div class="tb-splash" data-tb="go-home">${D.img['onebase-logo-white']?`<img src="${D.img['onebase-logo-white']}" alt="OneBase">`:'OneBase'}<p>Tap to begin</p></div>`;
  let content='';
  if (TB.scr==='home') content = `<div class="tb-ico">${hbotIcon()}</div><h2 class="tb-h">Welcome!</h2><p class="tb-sub">Select your settings to begin</p>${tbBoxes(true)}<button class="tb-btn" data-tb="start">Start Session</button>${tbPicker()}`;
  if (TB.scr==='door') content = `<div class="tb-ico">${hbotIcon()}</div><h2 class="tb-h">Close the door</h2><p class="tb-sub">Your session will start automatically once the door is closed.</p>${tbBoxes(false)}<button class="tb-btn" data-tb="door">Door closed</button><button class="tb-link" data-tb="go-home">Cancel</button>`;
  if (TB.scr==='press') content = `${tbTimer(0,'')}<p class="tb-fin">Pressurizing…</p>${tbInfo()}<button class="tb-btn ghost" data-tb="end">End Session</button>`;
  if (TB.scr==='run') content = `${tbTimer(TB.t)}<p class="tb-fin">Finish time: ${TB.finish}</p>${tbInfo()}<button class="tb-btn ghost" data-tb="end">End Session</button>`;
  if (TB.scr==='done') content = `<div class="tb-done"><div class="tb-check">✓</div><h2 class="tb-h">Session Completed!</h2><div class="tb-care"><b>We Care About You</b><p>The chamber will automatically depressurize to ambient pressure. If you need manual assistance use the manual pressure release valves.</p><label><input type="checkbox" data-tb="noshow" ${TB.noshow?'checked':''}> Don't show this message again</label></div><button class="tb-btn" data-tb="go-home">Done</button></div>`;
  return `<div class="tb-bg"></div>${gear}${devices}<div class="tb-content">${content}</div>${tbSettings()}`;
}
function hbotIcon(){ return `<svg viewBox="0 0 185 185" width="150" height="150"><circle cx="92.5" cy="92.5" r="88" fill="none" stroke="rgba(154,172,190,.5)" stroke-width="2"/><rect x="38" y="72" width="109" height="44" rx="22" fill="none" stroke="#fff" stroke-width="5"/><circle cx="62" cy="94" r="8" fill="#9aacbe"/><path d="M84 94h40" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`; }
function tbRender(){
  const c = document.getElementById('tb-canvas'); if (!c) return; c.innerHTML = tbScreen(); tbFit();
}
function tbFit(){ const f=document.getElementById('tb-frame'), c=document.getElementById('tb-canvas'); if(!f||!c) return;
  if (f.classList.contains('full')) { const port = innerHeight > innerWidth; const s = port ? Math.min(innerHeight/1280, innerWidth/800) : Math.min(innerWidth/1280, innerHeight/800);
    c.style.transform = port ? `translate(${(innerWidth+800*s)/2}px, ${(innerHeight-1280*s)/2}px) rotate(90deg) scale(${s})` : `translate(${(innerWidth-1280*s)/2}px, ${(innerHeight-800*s)/2}px) scale(${s})`; }
  else c.style.transform = `scale(${f.clientWidth/1280})`; }
function tbGo(scr){ tbStop(); TB.scr=scr;
  if (scr==='press') { TB.iv=setTimeout(()=>{ TB.finish=tbFinish(); TB.t=0; tbGo('run'); }, 3000); }
  if (scr==='run') { TB.iv=setInterval(()=>{ TB.t=Math.min(1,TB.t+0.25/24); if (TB.t>=1) tbGo('done'); else { const tm=document.querySelector('#tb-canvas .tb-timer'); if (tm) tm.outerHTML=tbTimer(TB.t); } }, 250); }
  if (scr==='done') { TB.iv=setTimeout(()=>{ if (TB.scr==='done') tbGo('home'); }, 8000); }
  tbRender(); }
function tbHTML(){ return `<div class="tb-wrap"><div class="tb-frame" id="tb-frame"><div class="tb-canvas" id="tb-canvas"></div><button class="tb-full" data-tbf aria-label="Full screen">⤢</button></div><p class="note" style="text-align:center;margin-top:10px">AirSuite chamber tablet · rebuilt from the OneBase Figma design · demo runs sped up</p></div>`; }
function tbInit(){
  const f = document.getElementById('tb-frame'); if (!f) return; TB.scr='splash'; TB.set=null; TB.pick=null; tbRender();
  f.addEventListener('click', e => {
    if (e.target.closest('[data-tbf]')) { f.classList.toggle('full'); document.body.style.overflow = f.classList.contains('full')?'hidden':''; tbFit(); return; }
    const b = e.target.closest('[data-tb]'); if (!b) return; const a=b.dataset.tb, v=b.dataset.v, d=+b.dataset.d;
    const L=TB.light, B=TB.bibs;
    if (a==='go-home') return tbGo('home');
    if (a==='start') return tbGo('door');
    if (a==='door') return tbGo('press');
    if (a==='end') return tbGo('done');
    if (a==='pick-time') TB.pick='time'; else if (a==='pick-ata') TB.pick='ata'; else if (a==='pick-speed') TB.pick='speed';
    else if (a==='pick-done') TB.pick=null;
    else if (a==='val') { if (TB.pick==='time') TB.mins=+v; else if (TB.pick==='ata') TB.ata=+v; else TB.speed=v; }
    else if (a==='step') { if (TB.pick==='time') TB.mins=Math.min(120,Math.max(20,TB.mins+5*d)); else if (TB.pick==='ata') TB.ata=Math.round(Math.min(2,Math.max(1.1,TB.ata+0.1*d))*10)/10; else TB.speed=TB_SPEEDS[Math.min(4,Math.max(0,TB_SPEEDS.indexOf(TB.speed)+d))]; }
    else if (a==='open-set') TB.set = TB.set ? null : 'session';
    else if (a==='close-set') TB.set=null;
    else if (a==='set') { TB.set=b.dataset.k; if (TB.set!=='session') TB.pick=null; }
    else if (a==='l-on') L.on=!L.on; else if (a==='l-link') L.link=!L.link;
    else if (a==='l-roof') { L.roof=!L.roof; if (L.link) L.floor=L.roof; } else if (a==='l-floor') { L.floor=!L.floor; if (L.link) L.roof=L.floor; }
    else if (a==='l-col') L.col=v; else if (a==='l-delay') L.delay=Math.min(30,Math.max(0,L.delay+d));
    else if (a==='ac-on') TB.ac.on=!TB.ac.on; else if (a==='ac-t') TB.ac.temp=Math.min(26,Math.max(16,TB.ac.temp+d));
    else if (a==='b-opt') B.opt=v; else if (a==='b-breaks') B.breaks=!B.breaks; else if (a==='b-o2') B.o2=Math.min(40,Math.max(5,B.o2+5*d)); else if (a==='b-air') B.air=Math.min(15,Math.max(1,B.air+d));
    else if (a==='sp') TB.speed=v; else if (a==='dsp') TB.dspeed=v;
    else if (a==='noshow') TB.noshow=b.checked;
    if (a!=='noshow') tbRender();
  });
  f.addEventListener('input', e => { const r=e.target.closest('[data-tb-range]'); if (r) { TB.light.bright=+r.value; const em=r.parentElement.querySelector('em'); if (em) em.textContent=r.value+'%'; } });
}
addEventListener('resize', tbFit);
/* wire into software section for Air products and the Software page */
const _swHTML = swHTML;
swHTML = function(title, sub, switcher){
  const html = _swHTML(title, sub, switcher);
  if (SW.mod!=='air' && !switcher) return html;
  return html.replace('<div class="seg" id="sw-tabs">', `<div class="seg" id="sw-tabs"><button data-v="tablet">Chamber tablet<small>The AirSuite control screen</small></button>`);
};
const _swRender = swRender;
swRender = function(){
  const el = document.getElementById('sw-screen'); if (!el) return;
  if (SW.view==='tablet' && SW.mod!=='air') SW.view='app';
  if (SW.view==='tablet') { const has=document.getElementById('tb-frame'); if (!has) { el.className=''; el.innerHTML=tbHTML(); tbInit(); } else tbFit();
    document.querySelectorAll('#sw-tabs button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.v==='tablet'))); document.querySelectorAll('#sw-mods button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.v===SW.mod))); return; }
  tbStop(); _swRender();
  const tt = document.querySelector('#sw-tabs [data-v=tablet]'); if (tt) tt.hidden = SW.mod!=='air';
};
const _swSetMod = swSetMod;
swSetMod = function(m, name, pressures){ _swSetMod(m, name, pressures); if (m==='air') SW.view='tablet'; else if (SW.view==='tablet') SW.view='app'; };
const _afterRender2 = afterRender;
afterRender = function(){ tbStop(); document.body.style.overflow=''; _afterRender2(); };
