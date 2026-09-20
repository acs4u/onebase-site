/* ===== Live Android app (AirSuite / HBOT controller APK) via Appetize.io =====
   1. Sign in at appetize.io, upload app-hbot-v3.14.63.apk.
   2. Paste the app's public key below. Until then the section shows a "coming soon" poster. */
const APZ_KEY = 'b_mhlty4h6bjycybguui3oxg65ym';
/* device/orientation come from the app's settings on appetize.io; add e.g. &device=pixel7&orientation=landscape to override */
const APZ_OPTS = 'scale=auto&centered=both&autoplay=true';
function apzSrc(){ return `https://appetize.io/embed/${APZ_KEY}?${APZ_OPTS}`; }
(function(){ const s=document.createElement('style'); s.textContent=`
.apz-sec{background:#111;color:#fff}.apz-sec .muted{color:rgba(255,255,255,.7)}
.apz-frame{position:relative;margin-top:28px;border-radius:18px;overflow:hidden;background:#0b0b0b;aspect-ratio:16/9;box-shadow:0 30px 80px rgba(0,0,0,.4)}
.apz-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
@media(max-width:760px){.apz-frame{aspect-ratio:4/5}}`; document.head.appendChild(s); })();
function apzSection(){
  const btn = APZ_KEY ? `<button class="fg-launch" data-apz><i></i>Start the app</button>` : `<span class="fg-launch" style="cursor:default;opacity:.6">Live demo coming soon</span>`;
  return `<section class="sec apz-sec" id="try-apk"><div class="wrap">${eyebrow('Try the chamber app')}<h2 style="margin-top:10px">Run the AirSuite controller, right here.</h2>
   <p class="muted" style="max-width:640px;margin-top:10px">This is the real Android app that runs on the chamber tablet, streaming from a cloud device. Tap through sessions, pressure profiles and settings.</p>
   <div class="apz-frame" id="apz-frame"><div class="fg-poster"><b>AirSuite app · live Android</b><span>Starts a real Android device in your browser. Sessions are limited to a few minutes.</span>${btn}</div></div></div></section>`;
}
const _softwareApz = pages.software;
pages.software = function(){ const h=_softwareApz.apply(this, arguments); return h.replace(/(<section class="sec fg-sec" id="live-app">[\s\S]*?<\/section>)/, '$1'+apzSection()); };
document.addEventListener('click', e => { if (e.target.closest('[data-apz]')) { e.preventDefault(); const f=document.getElementById('apz-frame'); if (f) f.innerHTML=`<iframe src="${apzSrc()}" allow="autoplay" title="AirSuite app"></iframe>`; } });

function apzOpen(){
  if (document.querySelector('.fg-modal')) return;
  const m=document.createElement('div'); m.className='fg-modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-label','AirSuite app');
  m.innerHTML=`<div class="fg-box" style="background:#0b0b0b"><button class="fg-x" aria-label="Close">×</button><iframe src="${apzSrc()}" allow="autoplay" title="AirSuite app"></iframe></div>`;
  document.body.appendChild(m); document.documentElement.style.overflow='hidden';
  const close=()=>{ m.remove(); document.documentElement.style.overflow=''; removeEventListener('keydown',esc); };
  const esc=e=>{ if(e.key==='Escape') close(); };
  m.addEventListener('click',e=>{ if(e.target===m||e.target.closest('.fg-x')) close(); }); addEventListener('keydown',esc);
}
document.addEventListener('click', e => { if (e.target.closest('[data-apz-modal]')) { e.preventDefault(); apzOpen(); } });
