/* ===== Analytics: Google Tag Manager, consent, page views and events =====
   GTM is the single hub. GA4, Google Ads, LinkedIn Insight, Meta Pixel and Microsoft Clarity are configured as tags
   inside the container (import analytics/gtm-container.json). The site only pushes to window.dataLayer.
   Consent: Google Consent Mode v2. Denied by default in the EEA, UK and Switzerland, granted elsewhere, then updated
   from the HubSpot cookie banner (analytics → analytics_storage, advertisement → ad_*).
   Page views: the site routes on the URL hash, so each route change pushes `virtual_page_view` to GTM and tells HubSpot.
   No personal data (email, name, phone) is ever pushed to the dataLayer. */
const OB_GTM = 'GTM-T433HTQJ';
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
(() => {
  const strict = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH'];
  const denied = { ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'denied' };
  gtag('consent', 'default', { ...denied, wait_for_update: 500, region: strict });
  gtag('consent', 'default', { ad_storage:'granted', ad_user_data:'granted', ad_personalization:'granted', analytics_storage:'granted' });
  gtag('set', 'ads_data_redaction', true); gtag('set', 'url_passthrough', true);
  // HubSpot cookie banner → Consent Mode
  window._hsp = window._hsp || [];
  window._hsp.push(['addPrivacyConsentListener', c => {
    const cat = (c && c.categories) || {}; const a = c && c.allowed;
    const an = a || !!cat.analytics, ad = a || !!cat.advertisement, g = v => v ? 'granted' : 'denied';
    gtag('consent', 'update', { analytics_storage:g(an), ad_storage:g(ad), ad_user_data:g(ad), ad_personalization:g(ad) });
    dataLayer.push({ event:'consent_update', consent_analytics:an, consent_ads:ad });
  }]);
  // GTM loader
  if (OB_GTM && !document.getElementById('gtm-loader')) {
    dataLayer.push({ 'gtm.start': Date.now(), event:'gtm.js' });
    const s = document.createElement('script'); s.id = 'gtm-loader'; s.async = true; s.src = 'https://www.googletagmanager.com/gtm.js?id=' + OB_GTM; document.head.appendChild(s);
  }
})();

/* ---------- helpers ---------- */
function obTrack(event, params){ dataLayer.push(Object.assign({ event, page_path: obPath() }, params || {})); }
function obPath(){ const h = obHash().slice(1) || '/'; return h.split('?')[0]; }
function obRouteInfo(){
  const parts = obPath().split('/').filter(Boolean); const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ') : '';
  let title = 'OneBase Health', type = parts[0] || 'home', product = null;
  if (parts[0] === 'products' && parts[2]) { product = D.products.find(x => x.id === parts[2]); title = product ? `OneBase ${product.name}` : 'Product'; type = 'product'; }
  else if (parts[0] === 'products' && parts[1]) { const m = Object.values(D.modalities).find(x => x.category === parts[1]); title = m ? m.name : cap(parts[1]); type = 'category'; }
  else if (parts[0] === 'solutions' && parts[1]) { const s = D.solutions.find(x => x.id === parts[1]); title = s ? s.label : cap(parts[1]); type = 'solution'; }
  else if (parts[0] === 'blog' && parts[1]) { const p = (D.posts || []).find(x => x.slug === parts[1] || x.id === parts[1]); title = p ? p.title : cap(parts[1]); type = 'post'; }
  else if (parts[0] === 'policies') { title = cap(parts[1] || 'policies') + ' policy'; }
  else if (parts[0] === 'customers' && parts[1] && typeof CASES !== 'undefined') { const c = CASES.find(x => x.id === parts[1]); title = c ? c.name : 'Customers'; type = 'case_study'; }
  else if (parts[0] === 'roi') title = 'ROI calculator';
  else if (parts[0] === 'guide') { const VN = { gym: 'gyms', studio: 'recovery studios', team: 'pro teams', hotel: 'hotels and spas', clinic: 'clinics', home: 'homes' }, MN = { air: 'Hyperbaric oxygen', ice: 'Cold therapy', heat: 'Sauna', light: 'Red light therapy' };
    title = parts[2] && MN[parts[2]] ? `${MN[parts[2]]} for ${VN[parts[1]] || parts[1]}` : parts[1] ? `Recovery for ${VN[parts[1]] || parts[1]}` : 'Where it fits'; }
  else if (parts[0]) title = cap(parts[0]);
  return { title: parts.length ? `${title} · OneBase Health` : 'OneBase Health · Commercial recovery equipment', type, product };
}

/* ---------- page views ---------- */
(() => {
  let first = true, last = null;
  const send = () => {
    const path = obPath(); if (path === last) return; last = path;
    const r = obRouteInfo(); document.title = r.title;
    const loc = location.origin + location.pathname + (path === '/' ? '' : '#' + path);
    dataLayer.push({ event:'virtual_page_view', page_path: path, page_title: r.title, page_location: loc, page_type: r.type });
    if (r.product) obTrack('product_view', { product_id: r.product.id, product_name: 'OneBase ' + r.product.name, modality: r.product.modality });
    // HubSpot counts the first load itself; later route changes are sent by hand
    if (!first) { const q = window._hsq = window._hsq || []; q.push(['setPath', location.pathname + '#' + path]); q.push(['trackPageView']); }
    first = false;
  };
  addEventListener('obroute', () => setTimeout(send, 0));
  setTimeout(send, 0);
})();

/* ---------- lead events: every HubSpot capture ---------- */
const OB_LEAD_EVENT = { booking: 'book_call_details', enquiry: 'enquiry_submit', spec_sheet: 'spec_sheet_download', configurator: 'configurator_quote' };
const _hsSubmitA = hsSubmit;
hsSubmit = function(type, d){
  const p = d && d.product ? D.products.find(x => x.id === d.product) : null;
  obTrack(OB_LEAD_EVENT[type] || 'lead_' + type, {
    capture_type: type, lead: true, product_id: p ? p.id : undefined, modality: p ? p.modality : undefined,
    venue_type: d && d.venue || undefined, timeline: d && d.timeline || undefined, sites: d && d.sites || undefined, role: d && d.role || undefined,
  });
  return _hsSubmitA(type, d);
};

/* ---------- booking funnel ---------- */
const _bkOpenA = bkOpen;
bkOpen = function(context){ const p = currentProduct(); obTrack('book_call_open', { product_id: p ? p.id : undefined, modality: p ? p.modality : undefined }); return _bkOpenA(context); };
addEventListener('message', e => {
  if (/hubspot/.test(e.origin) && e.data && e.data.meetingBookSucceeded) { const p = currentProduct(); obTrack('meeting_booked', { capture_type:'booking', lead:true, product_id: p ? p.id : undefined, modality: p ? p.modality : undefined, venue_type: BK.venue || undefined, timeline: BK.timeline || undefined }); }
});

/* ---------- engagement ---------- */
document.addEventListener('click', e => {
  const t = e.target; const p = currentProduct(); const pp = p ? { product_id: p.id, modality: p.modality } : {};
  if (t.closest('a[href^="tel:"]')) return obTrack('phone_click', pp);
  if (t.closest('a[href^="mailto:"]')) return obTrack('email_click', pp);
  if (t.closest('#cfgQuote')) return obTrack('configurator_complete', { ...pp, configuration: window.OB_CFG || undefined });
  if (t.closest('[data-lzdoor]')) return obTrack('viewer_interact', { ...pp, viewer: 'lightzone', action: LZ.open ? 'door_close' : 'door_open' });
  if (t.closest('[data-lza]')) return obTrack('viewer_interact', { ...pp, viewer: 'lightzone', action: 'turn' });
  if (t.closest('#ssOpen')) return obTrack('spec_sheet_open', pp);
  const a = t.closest('a[href^="http"]'); if (a && !a.href.startsWith(location.origin)) obTrack('outbound_click', { link_url: a.href });
}, true);
// first touch on a 3D model per page
(() => { let done = null; document.addEventListener('pointerdown', e => {
  const mv = e.target.closest && e.target.closest('model-viewer'); if (!mv || done === obPath()) return; done = obPath();
  const p = currentProduct(); obTrack('viewer_interact', { viewer: '3d', action: 'rotate', product_id: p ? p.id : undefined, modality: p ? p.modality : undefined });
}, true); })();
// scroll depth on product and solution pages (50% and 90%)
(() => { let marks = {}; addEventListener('obroute', () => { marks = {}; });
  addEventListener('scroll', () => {
    const sh = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight); const pct = (scrollY + innerHeight) / sh;
    for (const m of [50, 90]) if (pct * 100 >= m && !marks[m]) { marks[m] = 1; obTrack('scroll_depth', { percent: m, page_type: obRouteInfo().type }); }
  }, { passive: true });
})();
