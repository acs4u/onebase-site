/* ===== HubSpot lead capture =====
   One HubSpot form receives every website capture via the Forms API v3. The form must contain these fields
   (hidden is fine): email, firstname, lastname, company, phone, country, message, industryleadmagnet,
   other__facility_type_, when_are_you_planning_install, how_many_locations_do_you_own_or_manage, primary_equipment_type.
   Paste the form's GUID into HS.form. Until then submissions are logged to the console and nothing is sent. */
const HS = { portal: '20568937', form: '1194e353-0e93-4633-b646-c522802cd883', meetings: 'https://meetings.hubspot.com/jett-moody/meet-with-jett-moody' };

// Site answers → the values HubSpot already uses on these properties
const HS_VENUE = {
  'Gym or fitness club': 'Fitness Facilities', 'Recovery studio': 'Spa/Wellness Centers', 'Sports team': 'Pro Sports Teams & Performance Centers',
  'Hotel or spa': 'Luxury & Boutique Hospitality', 'Residential / real estate': 'High-End Real Estate Developments',
  'Corporate wellness': 'Corporate Wellness', 'Clinic': 'Other', 'Other': 'Other',
};
const HS_TIMELINE = { 'Ready now': 'Ready no (0-30 days)', '1–3 months': '1-3 months', '3–6 months': '3-6 months', '6+ months': '6+ months', 'Just researching': 'Just researching' };
const HS_SITES = { '1': 1, '2–5': 3, '6+': 6 };
const HS_MOD = { air: 'Hyperbaric Chambers', ice: 'Cold Therapy', heat: 'Sauna', light: 'Red Light' };
const HS_LABEL = { booking: 'Book a call', enquiry: 'Enquiry form', spec_sheet: 'Spec sheet download', configurator: 'Configurator quote' };

function hsCookie(){ const m = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/); return m ? m[1] : undefined; }

/* d: { email, name, company, phone, country, venue, sites, timeline, message, product (id), configuration, role } */
function hsFields(type, d){
  const f = []; const add = (name, value) => { if (value !== undefined && value !== null && String(value).trim() !== '') f.push({ objectTypeId: '0-1', name, value: String(value) }); };
  const [first, ...rest] = String(d.name || '').trim().split(/\s+/);
  const p = d.product ? D.products.find(x => x.id === d.product) : null;
  add('email', d.email); add('firstname', first); add('lastname', rest.join(' '));
  add('company', d.company); add('phone', d.phone); add('country', d.country);
  add('industryleadmagnet', HS_VENUE[d.venue]); if (d.venue === 'Clinic') add('other__facility_type_', 'Clinic');
  add('when_are_you_planning_install', HS_TIMELINE[d.timeline]);
  add('how_many_locations_do_you_own_or_manage', HS_SITES[d.sites]);
  add('primary_equipment_type', p ? HS_MOD[p.modality] : undefined);
  const note = [
    `Website: ${HS_LABEL[type] || type}`,
    p ? `Product: OneBase ${p.name}` : '',
    d.configuration ? `Configuration: ${d.configuration}` : '',
    d.venue ? `Venue: ${d.venue}` : '', d.sites ? `Sites: ${d.sites}` : '', d.role ? `Role: ${d.role}` : '',
  ].filter(Boolean).join(' · ');
  add('message', [d.message, note].filter(Boolean).join('\n\n'));
  return f;
}
async function hsSubmit(type, d){
  const body = { fields: hsFields(type, d), context: { hutk: hsCookie(), pageUri: location.href, pageName: document.title + (location.hash ? ' ' + location.hash : '') } };
  window.OB_LEADS = (window.OB_LEADS || []).concat([{ type, body }]);
  if (!HS.form) { console.info('[HubSpot] form GUID not set — not sent', type, body); return { ok: true, sent: false }; }
  try {
    const r = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HS.portal}/${HS.form}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) console.warn('[HubSpot] submit failed', r.status, await r.text().catch(() => ''));
    return { ok: r.ok, sent: true };
  } catch (e) { console.warn('[HubSpot] submit error', e); return { ok: false, sent: true }; }
}
// Tracking code: page views, and ties submissions to the visitor's session (also loads the portal's cookie banner)
(() => { if (document.getElementById('hs-script-loader')) return; const s = document.createElement('script'); s.id = 'hs-script-loader'; s.async = true; s.defer = true; s.src = `https://js.hs-scripts.com/${HS.portal}.js`; document.head.appendChild(s); })();
