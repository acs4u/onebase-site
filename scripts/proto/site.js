/* ===== Routing, blog and parts helpers =====
   Two modes. On the real site (window.OB_SITE) every page has its own path (/products/hbot) using the History API,
   so search engines see real URLs; the build also writes a static HTML file per path with its own title, description
   and canonical tag. In the single-file preview, pages stay on #/ hashes. Old #/ links redirect to the path. */
function obHash(){
  if (window.OB_SITE) return '#' + (location.pathname.replace(/\/+$/, '') || '/');
  return (location.hash || '').startsWith('#/') ? location.hash : (window.__obLast || '#/');
}
function obNav(){ window.__obLast = obHash(); route(); dispatchEvent(new Event('obroute')); }
function obGo(h){
  if (!window.OB_SITE) { location.hash = h; return; }
  const p = h.replace(/^#/, '') || '/'; if (p !== location.pathname) history.pushState(null, '', p); obNav();
}
function obInit(){
  if (window.OB_SITE) {
    if ((location.hash || '').startsWith('#/')) history.replaceState(null, '', location.hash.slice(1) || '/');
    addEventListener('popstate', obNav);
    document.addEventListener('click', e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      let href = a.getAttribute('href'); if (href.startsWith('#/')) href = href.slice(1); else if (!href.startsWith('/') || href.startsWith('//')) return;
      if (/^\/(assets|video|images)\//.test(href)) return;
      e.preventDefault(); obGo('#' + href);
    });
  } else {
    addEventListener('hashchange', () => { if ((location.hash || '').startsWith('#/')) obNav(); });
  }
  obNav();
}
// Real hrefs on the site, so links work without JS and can be opened in a new tab.
function obFixLinks(root){ if (!window.OB_SITE) return; (root || document).querySelectorAll('a[href^="#/"]').forEach(a => a.setAttribute('href', a.getAttribute('href').slice(1) || '/')); }

/* Blog: category filter and on-demand article bodies */
document.addEventListener('click', e => { const b = e.target.closest('#bf .chip'); if (!b) return; const c = b.dataset.bc;
  document.querySelectorAll('#bf .chip').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  document.querySelectorAll('.bl-card').forEach(t => { t.hidden = !(c === 'All' || t.dataset.bc === c); }); });
async function obLoadPost(){ const el = document.getElementById('postBody'); if (!el || el.dataset.loaded) return; el.dataset.loaded = '1';
  const pre = document.getElementById('obPrerender'); if (pre) { el.innerHTML = pre.innerHTML; return; }
  try { const r = await fetch((window.OB_SITE ? '/assets/' : 'assets/') + 'posts/' + el.dataset.post + '.html'); if (!r.ok) throw 0; el.innerHTML = await r.text(); }
  catch (err) { el.innerHTML = '<p class="muted">This article could not be loaded. Please refresh the page.</p>'; } }
/* Parts: "Request" opens the enquiry form with the part named */
document.addEventListener('click', e => { const b = e.target.closest('.pt-req'); if (!b) return; const part = b.dataset.part;
  setTimeout(() => { const m = document.getElementById('msg'); if (m && !m.value) m.value = `Parts request: ${part}\nQuantity: \nChamber and serial number: \nDelivery address: `; document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' }); }, 120); });
(() => { const _ar = afterRender; afterRender = function(){ _ar(); obFixLinks(); obLoadPost(); }; })();
(() => { const s = document.createElement('style'); s.textContent = `
.bl-img{width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:var(--r);background:var(--surf)}
.bl-card[hidden]{display:none}
.bl-card h2{transition:opacity .2s}.bl-card:hover h2{opacity:.7}
.bl-hero{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:var(--r);margin-top:28px;background:var(--surf)}
.bl-body{margin-top:32px;font-size:17px;line-height:1.7;overflow-wrap:anywhere}
.bl-body h2{font-size:24px;margin:36px 0 12px;line-height:1.3}.bl-body h3{font-size:19px;margin:28px 0 10px}
.bl-body p{margin:0 0 16px}.bl-body ul,.bl-body ol{margin:0 0 16px;padding-left:22px}.bl-body li{margin:4px 0}
.bl-body img{max-width:100%;height:auto;border-radius:var(--r);margin:12px 0}
.bl-body a{text-decoration:underline;text-underline-offset:3px}
.bl-body blockquote{border-left:3px solid var(--line);padding-left:16px;color:var(--muted);margin:0 0 16px}
.pt-card{padding:16px;gap:8px;display:flex;flex-direction:column}
.pt-img{width:100%;aspect-ratio:1/1;object-fit:contain;background:#fff;border-radius:var(--r)}
.pt-req{margin-top:auto;align-self:flex-start;min-height:44px;border:1px solid var(--fg);padding:10px 18px;font-size:13px}
`; document.head.appendChild(s); })();
/* Every page gets one h1. Full-bleed pages whose visible headings are h2 (products, categories, guide) get a
   visually hidden one that names the page for search engines and screen readers. */
function obEnsureH1(){ const app = document.getElementById('app'); if (!app || app.querySelector('h1')) return;
  const parts = obHash().slice(2).split('/').filter(Boolean); let t = (typeof obRouteInfo === 'function' ? obRouteInfo().title : document.title).replace(/ · OneBase Health$/, '');
  if (parts[0] === 'products' && parts.length === 1) t = 'OneBase commercial recovery equipment';
  else if (parts[0] === 'products' && parts[1]) { const m = Object.values(D.modalities).find(x => x.category === parts[1]); if (m) t = 'OneBase ' + m.name; }
  else if (parts[0] === 'guide') t = 'Where recovery fits in your venue';
  const h = document.createElement('h1'); h.className = 'sr-only'; h.textContent = t; app.prepend(h); }
(() => { const _ar = afterRender; afterRender = function(){ _ar(); setTimeout(obEnsureH1, 0); }; })();
(() => { const s = document.createElement('style'); s.textContent = `.sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`; document.head.appendChild(s); })();
/* Mobile tap targets: at least 44px tall, or an invisible 44px hit area for small dots and pips. */
(() => { const s = document.createElement('style'); s.textContent = `@media (max-width:900px), (pointer:coarse){
footer.site .cols a{display:flex;align-items:center;min-height:44px}
.chip{min-height:44px}
.btn{min-height:44px}
header.site .logo{display:inline-flex;align-items:center;min-height:44px}
.crumb a,.ts-eyebrow a,.ts-models a,.sp-name,.st-link,.go,.pp-cad a,a.small{display:inline-flex;align-items:center;min-height:44px}
.sp-dots button,.ts-pips button,.st-nav button,.st-room,.sw button{position:relative}
.sp-dots button::after,.ts-pips button::after,.st-nav button::after,.st-room::after,.sw button::after{content:'';position:absolute;left:50%;top:50%;width:44px;height:44px;transform:translate(-50%,-50%)}
.rng{height:44px}
.story button,.story-nav button{min-height:44px}
.roi-in input{min-height:44px}
}`; document.head.appendChild(s); })();
