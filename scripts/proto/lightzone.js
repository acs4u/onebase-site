/* ===== LightZone: walk around it, open the door ===== */
const LZ_ANG = [['l', 'Left'], ['f', 'Front'], ['r', 'Right']];
const LZ = { a: 'f', open: false };
function lzViewer(){
  const shots = ['closed', 'open'].flatMap(s => LZ_ANG.map(([a]) => {
    const k = `lzr-${s}-${a}`; if (!D.img[k]) return '';
    return `<img src="${D.img[k]}" data-s="${s}" data-a="${a}" alt="OneBase LightZone, door ${s}, ${a === 'f' ? 'front' : a === 'l' ? 'left' : 'right'} view" draggable="false"${s === 'closed' && a === 'f' ? ' class="on"' : ''}>`;
  })).join('');
  return `<section class="lzv" id="lzv"><div class="wrap lzv-in">
    <div class="lzv-copy"><p class="eyebrow">Walk around it</p><h2>Step in. Close the door. Light on every side.</h2>
      <p class="muted">Drag to turn it, then open the door to see the array that surrounds you.</p>
      <div class="lzv-facts"><div><b>49,600</b><span>LEDs</span></div><div><b>5</b><span>wavelengths</span></div><div><b>54 × 56 in</b><span>footprint</span></div></div></div>
    <div class="lzv-stage"><div class="lzv-imgs" tabindex="0" aria-label="LightZone viewer. Use left and right arrows to turn it.">${shots}</div>
      <div class="lzv-ctl"><div class="lzv-ang" role="tablist">${LZ_ANG.map(([a, l]) => `<button type="button" role="tab" data-lza="${a}" aria-selected="${a === 'f'}">${l}</button>`).join('')}</div>
        <button type="button" class="lzv-door" data-lzdoor aria-pressed="false">Open the door</button></div></div>
  </div></section>`;
}
function lzShow(root){
  root.querySelectorAll('.lzv-imgs img').forEach(i => i.classList.toggle('on', i.dataset.a === LZ.a && i.dataset.s === (LZ.open ? 'open' : 'closed')));
  root.querySelectorAll('[data-lza]').forEach(b => b.setAttribute('aria-selected', b.dataset.lza === LZ.a));
  const d = root.querySelector('[data-lzdoor]'); if (d) { d.textContent = LZ.open ? 'Close the door' : 'Open the door'; d.setAttribute('aria-pressed', LZ.open); }
}
function lzStep(dir){ const i = LZ_ANG.findIndex(x => x[0] === LZ.a); const n = Math.max(0, Math.min(LZ_ANG.length - 1, i + dir)); LZ.a = LZ_ANG[n][0]; }
document.addEventListener('click', e => {
  const root = e.target.closest('#lzv'); if (!root) return;
  const a = e.target.closest('[data-lza]'); if (a) { LZ.a = a.dataset.lza; lzShow(root); return; }
  if (e.target.closest('[data-lzdoor]')) { LZ.open = !LZ.open; lzShow(root); }
});
document.addEventListener('keydown', e => {
  const st = e.target.closest && e.target.closest('.lzv-imgs'); if (!st) return;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); lzStep(e.key === 'ArrowLeft' ? -1 : 1); lzShow(st.closest('#lzv')); }
});
(() => { let x0 = null, root = null;
  document.addEventListener('pointerdown', e => { const st = e.target.closest('.lzv-imgs'); if (!st) return; x0 = e.clientX; root = st.closest('#lzv'); });
  document.addEventListener('pointermove', e => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 60) { lzStep(dx > 0 ? -1 : 1); lzShow(root); x0 = e.clientX; } });
  document.addEventListener('pointerup', () => { x0 = null; });
})();
const _productLZ = pages.product;
pages.product = (cat, id) => {
  const h = _productLZ(cat, id);
  if (id !== 'lightzone') return h;
  LZ.a = 'f'; LZ.open = false;
  return h.replace('<section class="pp-state"', lzViewer() + '<section class="pp-state"');
};
(() => { const s = document.createElement('style'); s.textContent = `
.lzv{background:var(--psurf,#fcecec);padding-block:clamp(56px,8vw,104px)}
.lzv-in{display:grid;grid-template-columns:.9fr 1.1fr;gap:56px;align-items:center}
.lzv-copy .eyebrow{color:var(--pm,#8b2232)}
.lzv-copy h2{font-size:clamp(30px,3.6vw,48px);letter-spacing:-.025em;margin-top:10px;max-width:14ch}
.lzv-copy .muted{margin-top:16px;max-width:40ch}
.lzv-facts{display:flex;gap:32px;margin-top:28px;padding-top:20px;border-top:1px solid color-mix(in srgb,var(--pmid,#ea7c8c) 40%,transparent)}
.lzv-facts b{display:block;font-size:24px;font-weight:500;letter-spacing:-.02em}
.lzv-facts span{font-size:13px;color:var(--muted)}
.lzv-stage{background:#fafafa;border-radius:22px;padding:28px 28px 22px;box-shadow:0 30px 60px -30px rgba(61,16,23,.25)}
.lzv-imgs{position:relative;aspect-ratio:624/820;max-height:62vh;margin:0 auto;cursor:grab;touch-action:pan-y;outline:none;user-select:none}
.lzv-imgs:active{cursor:grabbing}
.lzv-imgs img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity .45s ease;pointer-events:none}
.lzv-imgs img.on{opacity:1}
.lzv-ctl{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-top:18px;flex-wrap:wrap}
.lzv-ang{display:flex;gap:4px;padding:4px;border-radius:999px;background:#ececec}
.lzv-ang button{font:inherit;font-size:13px;padding:8px 16px;border:0;border-radius:999px;background:none;color:var(--muted);cursor:pointer}
.lzv-ang button[aria-selected=true]{background:#fff;color:var(--fg);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.lzv-door{font:inherit;font-size:14px;font-weight:500;padding:11px 20px;border-radius:999px;border:0;background:var(--pm,#8b2232);color:#fff;cursor:pointer;transition:transform .15s}
.lzv-door:active{transform:scale(.97)}
.ts-render img[alt="OneBase LightZone"]{-webkit-mask-image:radial-gradient(ellipse 60% 62% at 50% 50%,#000 64%,transparent 100%);mask-image:radial-gradient(ellipse 60% 62% at 50% 50%,#000 64%,transparent 100%);transform:scale(1.25);transform-origin:50% 55%}
@media(max-width:900px){.lzv-in{grid-template-columns:1fr;gap:28px}.lzv-stage{padding:18px}.lzv-imgs{max-height:58vh}}
@media(prefers-reduced-motion:reduce){.lzv-imgs img{transition:none}}`; document.head.appendChild(s); })();
