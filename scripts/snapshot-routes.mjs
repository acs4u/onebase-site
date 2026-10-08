// Records prototype/routes.json: every page of the site with its title, description and text.
// Run after each update of prototype/onebase-prototype.html, then commit the result:
//
//   npm install            (once, for playwright)
//   node scripts/snapshot-routes.mjs
//
// It builds the site, opens every page in a headless browser, follows every internal link, and writes
// down what each page actually says. scripts/build-site.mjs puts that text into each page's HTML so
// search engines and link previews see the real content. Nothing here is written by hand except
// prototype/seo.json, which holds titles and descriptions that should override the recorded ones.
// The run fails if any page throws an error, shows "Page not found" from a link, or scrolls sideways.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const OUT = 'proto-dist', ROUTES = 'prototype/routes.json';
const seo = fs.existsSync('prototype/seo.json') ? JSON.parse(fs.readFileSync('prototype/seo.json', 'utf8')) : {};
// Pages that exist but should not be listed in search engines or the sitemap.
const NOINDEX = new Set(seo._noindex || []);
// Pages nothing links to that should still be built (for example the target of an old address's redirect).
const UNLINKED = seo._unlinked || [];
const clip = (t, n = 158) => { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, t.lastIndexOf(' ', n - 1)) + '…' : t; };

// The build needs a routes file to run at all; start from the last one, or from the home page alone.
if (!fs.existsSync(ROUTES)) fs.writeFileSync(ROUTES, JSON.stringify([{ path: '/', title: 'OneBase Health', desc: '', pre: '' }]));
execFileSync('node', ['scripts/build-site.mjs'], { stdio: 'inherit' });

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.glb': 'model/gltf-binary', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(OUT, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  // Any page address is answered with the home page's file, so pages not yet recorded can still be opened and recorded.
  if (!fs.existsSync(f)) { if (path.extname(p)) { res.writeHead(404); res.end(); return; } f = path.join(OUT, 'index.html'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
// Nothing leaves the machine: no HubSpot, no analytics, no fonts.
await ctx.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
const page = await ctx.newPage();
const problems = []; let current = '';
page.on('pageerror', e => problems.push(`${current}: ${e.message}`));
page.on('response', r => { if (r.status() === 404 && r.url().startsWith(base)) problems.push(`${current}: missing file ${r.url().slice(base.length)}`); });

const read = () => page.evaluate(() => {
  const app = document.getElementById('app'); const t = (e) => (e.textContent || '').replace(/\s+/g, ' ').trim();
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const skip = 'form, dialog, template, script, style, select, button, [hidden], [aria-hidden="true"], video, model-viewer';
  const seen = new Set(); let html = '', size = 0, desc = '';
  for (const e of app.querySelectorAll('h1,h2,h3,h4,p,li,dt,dd,figcaption,summary,blockquote,th,td')) {
    if (e.closest(skip) || e.querySelector('h1,h2,h3,h4,p,li,dt,dd,blockquote')) continue;
    const s = t(e); if (!s || seen.has(s) || size > 9000) continue; seen.add(s); size += s.length;
    const tag = /^H[1-4]$/.test(e.tagName) ? e.tagName.toLowerCase() : 'p'; html += `<${tag}>${esc(s)}</${tag}>`;
    if (!desc && tag === 'p' && s.length >= 60 && !e.closest('.crumb, nav')) desc = s;
  }
  const origin = location.origin; const links = new Map();
  for (const a of document.querySelectorAll('a[href]')) { let u; try { u = new URL(a.getAttribute('href').replace(/^#\//, '/'), origin); } catch { continue; }
    if (u.origin !== origin || /\.[a-z0-9]+$/i.test(u.pathname)) continue; const p = u.pathname.replace(/\/+$/, '') || '/';
    if (!links.has(p)) links.set(p, { text: t(a) || (a.querySelector('img[alt]') || {}).alt || '', inApp: app.contains(a) }); }
  for (const e of document.querySelectorAll('[data-href]')) { const p = (e.dataset.href || '').replace(/^#/, '').replace(/\/+$/, '') || '/'; if (p.startsWith('/') && !links.has(p)) links.set(p, { text: '', inApp: false }); }
  const pageLinks = [...links].filter(([p, v]) => v.inApp && v.text && v.text.length < 90).slice(0, 80);
  if (pageLinks.length) html += '<ul>' + pageLinks.map(([p, v]) => `<li><a href="${p}">${esc(v.text)}</a></li>`).join('') + '</ul>';
  const h1 = app.querySelector('h1'); const here = location.pathname.replace(/\/+$/, '') || '/';
  // Where the site's own data carries a search title or description for the page, that is used.
  // Solutions are left to the page text: their stored descriptions make claims the pages no longer make.
  const parts = here.split('/').filter(Boolean); let dTitle = '', dDesc = '';
  if (parts[0] === 'products' && parts[2]) { const p = D.products.find(x => x.id === parts[2]); if (p) { dTitle = p.seoTitle || ''; dDesc = p.seoDescription || ''; } }
  else if (parts[0] === 'products' && parts[1]) { const m = Object.values(D.modalities).find(x => x.category === parts[1]); if (m) dDesc = `${m.h} ${m.blurb}`; }
  else if (parts[0] === 'guide' && parts[1] && typeof GD !== 'undefined' && GD[parts[1]]) { const g = GD[parts[1]]; dDesc = parts[2] ? (Array.isArray(g[parts[2]]) ? g[parts[2]][1] : '') : g.lead; }
  else if (parts[0] === 'policies' && D.policies[parts[1]]) dTitle = D.policies[parts[1]][0];
  return { path: here, title: dTitle ? `${dTitle} · OneBase Health` : document.title, h1: h1 ? t(h1) : '', desc: dDesc || desc, pre: html, links: [...links.keys()],
    notFound: !!h1 && t(h1) === 'Page not found', sideways: document.documentElement.scrollWidth > innerWidth + 1 };
});

await page.goto(base + '/'); await page.waitForTimeout(600);
// Start from the home page and everything in the site's own data, then follow links from each page.
const seeds = await page.evaluate(() => {
  const s = ['/'];
  for (const m of Object.values(D.modalities)) s.push('/products/' + m.category);
  for (const p of D.products) s.push(`/products/${p.category}/${p.id}`);
  for (const x of D.solutions) s.push('/solutions/' + x.id);
  for (const p of D.posts) s.push('/blog/' + p.id);
  for (const k of Object.keys(D.policies)) s.push('/policies/' + k);
  if (typeof CASES !== 'undefined') for (const c of CASES) s.push('/customers/' + c.id);
  // "Where it fits" moves between venues and modalities with buttons, not links.
  if (typeof GD !== 'undefined') for (const [v, g] of Object.entries(GD)) { s.push('/guide/' + v); for (const m of ['air', 'ice', 'heat', 'light']) if (Array.isArray(g[m])) s.push(`/guide/${v}/${m}`); }
  return s;
});
seeds.push(...UNLINKED);
const appPages = await page.evaluate(() => Object.keys(pages));
const posts = Object.fromEntries((await page.evaluate(() => D.posts)).map(p => [p.id, p]));

const queue = [...new Set(seeds)], done = new Map(), from = new Map(), moved = [];
while (queue.length) {
  const p = queue.shift(); if (done.has(p)) continue; current = p;
  await page.goto(base + p, { waitUntil: 'load' }); await page.waitForTimeout(250);
  const r = await read(); done.set(p, r);
  if (r.path !== p) { moved.push(`${p} -> ${r.path}`); if (!done.has(r.path)) queue.push(r.path); continue; }
  if (r.notFound) { if (from.has(p)) problems.push(`${from.get(p)}: links to ${p}, which is not a page`); continue; }
  if (r.sideways) problems.push(`${p}: scrolls sideways at 1280 wide`);
  for (const l of r.links) if (!done.has(l) && !queue.includes(l)) { queue.push(l); from.set(l, p); }
}
await browser.close(); server.close();

const routes = [...done].filter(([p, r]) => r.path === p && !r.notFound).map(([p, r]) => {
  const o = seo[p] || {}; const post = p.startsWith('/blog/') ? posts[p.slice(6)] : null;
  const out = { path: p, title: o.title || r.title, desc: clip(o.desc || (post && post.desc) || r.desc || r.h1), pre: post ? '' : r.pre };
  if (post) out.post = { id: post.id, title: post.title, author: post.author, date: post.date, iso: post.iso, updated: post.updated, hero: post.hero || '' };
  if (NOINDEX.has(p)) out.noindex = true;
  return out;
}).sort((a, b) => a.path === '/' ? -1 : b.path === '/' ? 1 : a.path.localeCompare(b.path));

for (const k of Object.keys(seo)) if (!k.startsWith('_') && !routes.some(r => r.path === k)) problems.push(`prototype/seo.json names ${k}, which is not a page`);
if (problems.length) { console.error('\nNot written. Problems found:\n  ' + [...new Set(problems)].join('\n  ')); process.exit(1); }
fs.writeFileSync(ROUTES, JSON.stringify(routes, null, 1) + '\n');
const unbuilt = appPages.filter(k => !['home', 'category', 'product', 'solution', 'post', 'policy', 'notfound'].includes(k) && !done.has('/' + k));
if (unbuilt.length) console.log('in the app but not linked from any page, so not built (list in "_unlinked" in prototype/seo.json to build one): ' + unbuilt.map(k => '/' + k).join(', '));
if (moved.length) console.log('addresses that move to another page (add a redirect in vercel.json for each):\n  ' + moved.join('\n  '));
console.log(`wrote ${ROUTES}: ${routes.length} pages`);
execFileSync('node', ['scripts/build-site.mjs'], { stdio: 'inherit' });
