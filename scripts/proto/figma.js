/* ===== Live Figma prototype embed (option 1) =====
   Needs the Figma file's share setting "Anyone with the link → can view".
   To start on a specific flow/screen, set FIG_START to that frame's node-id (e.g. '12-345'). */
const FIG_FILE = 'jwEqfDfEmzqVp4WpiR7J2G';
const FIG_START = '';
function figSrc(){
  const proto = `https://www.figma.com/proto/${FIG_FILE}/OneBase?scaling=scale-down&content-scaling=fixed&hide-ui=1&hotspot-hints=1${FIG_START?'&node-id='+FIG_START+'&starting-point-node-id='+FIG_START:''}`;
  return `https://www.figma.com/embed?embed_host=onebasehealth&url=${encodeURIComponent(proto)}`;
}
(function(){ const s=document.createElement('style'); s.textContent = `
.fg-launch{display:inline-flex;align-items:center;gap:10px;margin-top:4px;padding:12px 18px;border-radius:999px;border:1px solid var(--line,#d9d9d9);background:transparent;color:inherit;font:inherit;font-weight:500;cursor:pointer;width:max-content}
.fg-launch:hover{background:#1f1f1f;color:#fff;border-color:#1f1f1f}
.fg-launch i{width:0;height:0;border-left:9px solid currentColor;border-top:6px solid transparent;border-bottom:6px solid transparent}
.fg-sec{background:#1f1f1f;color:#fff}.fg-sec .muted{color:rgba(255,255,255,.7)}
.fg-frame{position:relative;margin-top:28px;border-radius:18px;overflow:hidden;background:#111;aspect-ratio:16/10;box-shadow:0 30px 80px rgba(0,0,0,.35)}
.fg-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.fg-poster{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:24px;background:radial-gradient(ellipse at 50% 40%,#2c2c2c,#141414)}
.fg-poster b{font-size:clamp(20px,3vw,30px);font-weight:500}.fg-poster span{color:rgba(255,255,255,.65);max-width:460px}
.fg-poster .fg-launch{border-color:rgba(255,255,255,.35)}.fg-poster .fg-launch:hover{background:#fff;color:#1f1f1f}
.fg-modal{position:fixed;inset:0;z-index:200;background:rgba(10,10,10,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:clamp(8px,3vw,40px)}
.fg-modal .fg-box{position:relative;width:min(1200px,100%);height:min(86vh,820px);border-radius:16px;overflow:hidden;background:#111}
.fg-modal iframe{width:100%;height:100%;border:0}
.fg-x{position:absolute;top:10px;right:10px;z-index:2;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:22px;cursor:pointer}
.fg-open{position:absolute;top:14px;left:14px;z-index:2;padding:9px 14px;border-radius:999px;background:rgba(255,255,255,.14);color:#fff;font-size:13px;text-decoration:none}
.fg-note{font-size:13px;color:rgba(255,255,255,.55);margin-top:12px}
@media(max-width:760px){.fg-frame{aspect-ratio:9/16}.fg-modal{padding:0}.fg-modal .fg-box{height:100%;border-radius:0}}`; document.head.appendChild(s); })();

const FIG_BTN = `<button class="fg-launch" data-figma><i></i>Open the real app prototype</button>`;
const _swHTMLfig = swHTML;
swHTML = function(){ return _swHTMLfig.apply(this, arguments).replace('Everything on the screen is clickable.</p>', 'Everything on the screen is clickable.</p>' + FIG_BTN); };

function figSection(){
  return `<section class="sec fg-sec" id="live-app"><div class="wrap">${eyebrow('Live prototype')}<h2 style="margin-top:10px">The real OneBase app, in your browser.</h2>
   <p class="muted" style="max-width:640px;margin-top:10px">This is our production design file, running live. Every modality tab and the member app, exactly as our team builds it.</p>
   <div class="fg-frame" id="fg-frame"><div class="fg-poster"><b>OneBase app · live</b><span>Loads the full clickable prototype from Figma. Best on desktop or tablet.</span><button class="fg-launch" data-figma-inline><i></i>Launch prototype</button></div></div>
   <p class="fg-note">Prototype for demonstration. Screens may differ from the shipping release. <a href="https://www.figma.com/proto/${FIG_FILE}/OneBase?scaling=scale-down" target="_blank" rel="noopener" style="color:inherit">Open in a new tab ↗</a></p></div></section>`;
}
const _softwareFig = pages.software;
pages.software = function(){ const h = _softwareFig.apply(this, arguments); return h.replace(/(<section class="sec sw-sec">[\s\S]*?<\/section>)/, '$1' + figSection()); };

function figOpen(){
  if (document.querySelector('.fg-modal')) return;
  const m = document.createElement('div'); m.className = 'fg-modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-label','OneBase app prototype');
  m.innerHTML = `<div class="fg-box"><a class="fg-open" href="https://www.figma.com/proto/${FIG_FILE}/OneBase?scaling=scale-down" target="_blank" rel="noopener">Open full screen ↗</a><button class="fg-x" aria-label="Close">×</button><iframe src="${figSrc()}" allowfullscreen title="OneBase app prototype"></iframe></div>`;
  document.body.appendChild(m); document.documentElement.style.overflow = 'hidden';
  const close = () => { m.remove(); document.documentElement.style.overflow = ''; removeEventListener('keydown', esc); };
  const esc = e => { if (e.key === 'Escape') close(); };
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('.fg-x')) close(); }); addEventListener('keydown', esc);
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-figma]')) { e.preventDefault(); figOpen(); return; }
  const inl = e.target.closest('[data-figma-inline]'); if (inl) { e.preventDefault(); const f = document.getElementById('fg-frame'); if (f) f.innerHTML = `<iframe src="${figSrc()}" allowfullscreen title="OneBase app prototype"></iframe>`; }
});
