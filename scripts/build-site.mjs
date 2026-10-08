// Builds the site Vercel serves (proto-dist/) from the agreed prototype page.
//
// Source of truth: prototype/onebase-prototype.html. It is the page published as the Claude artifact
// "OneBase Site Prototype"; changes are made and agreed there first, then the file is copied here.
// This script does not change what the page says. It only turns the single hash-routed page into a site:
//   - one index.html per page at its real path, each with its own title, description, canonical URL,
//     Open Graph tags and the page's text in the HTML (the app then renders over it)
//   - scripts and styles moved to shared, cached files under /assets
//   - images, post bodies, 3D models and videos copied next to it
//   - sitemap.xml, robots.txt and 404.html
// Page titles, descriptions and text come from prototype/routes.json, which
// scripts/snapshot-routes.mjs records from the rendered pages (run it after every prototype update).
//
// No dependencies: Vercel runs this with plain node and no npm install.
import fs from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://onebasehealth.com';
const OUT = 'proto-dist';
const A = OUT + '/assets';
const SRC = 'prototype/onebase-prototype.html';

const must = (s, find, n = 1) => { const c = s.split(find).length - 1; if (c !== n) throw new Error(`expected ${n} of ${JSON.stringify(find.slice(0, 80))}, found ${c}`); };
const swap = (s, find, to, n = 1) => { must(s, find, n); return s.split(find).join(to); };
const escH = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let page = fs.readFileSync(SRC, 'utf8');

/* ---- 1. the prototype's preview settings become the site's ---- */
page = swap(page, '<meta name="robots" content="noindex, nofollow"><title>OneBase Site Prototype</title>', '__HEAD__');
page = swap(page, '<main id="app"></main>', '<main id="app">__PRE__</main>');
page = swap(page, "window.OB_SITE = false; const OB_ROOT = '';", "window.OB_SITE = true; const OB_ROOT = '/';");
// Every page sits at its own path, so asset addresses must be absolute.
page = page.replace(/(["'(])assets\/(img|blog|parts|posts|models)\//g, '$1/assets/$2/');
must(page, '<header class="site">');

/* ---- 2. assets ---- */
fs.rmSync(OUT, { recursive: true, force: true });
for (const d of ['img', 'blog', 'parts', 'posts', 'models']) fs.mkdirSync(`${A}/${d}`, { recursive: true });
const copyDir = (from, to, test = () => true) => { if (!fs.existsSync(from)) return 0; let n = 0; for (const f of fs.readdirSync(from)) if (test(f) && fs.statSync(path.join(from, f)).isFile()) { fs.copyFileSync(path.join(from, f), path.join(to, f)); n++; } return n; };
const count = {
  img: copyDir('public/images/src', A + '/img', f => /\.(jpg|png|webp)$/.test(f)),
  blog: copyDir('public/images/blog', A + '/blog'),
  parts: copyDir('public/images/parts', A + '/parts'),
  posts: copyDir('prototype/posts', A + '/posts', f => f.endsWith('.html')),
  models: copyDir('public/models', A + '/models', f => f.endsWith('.glb')),
};
fs.mkdirSync(OUT + '/video', { recursive: true }); count.video = copyDir('public/video', OUT + '/video');
/* the tab icon: the logo's mark on its own, square (the full wordmark was being squashed into the tab) */
const ICONS = ['favicon.svg', 'favicon-96.png', 'apple-touch-icon.png'];
for (const f of ICONS) { if (!fs.existsSync('public/' + f)) throw new Error('missing icon: public/' + f); fs.copyFileSync('public/' + f, OUT + '/' + f); }

// Fail the build, rather than ship a broken picture, if the page names a file that is not there.
const missing = [...new Set([...page.matchAll(/\/assets\/(img|blog|parts|models)\/[A-Za-z0-9_.-]+\.(?:jpg|png|webp|glb)/g)].map(m => m[0]))].filter(u => !fs.existsSync(OUT + u));
if (missing.length) throw new Error('files named in the page but missing from the repo:\n  ' + missing.join('\n  '));

/* ---- 3. scripts and styles into shared files ---- */
const ver = Date.now().toString(36);
// Scripts are lifted out first, so that a "<style>" written inside a script's own text is left alone.
const scripts = [];
page = page.replace(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g, (m, attrs, body) => { scripts.push({ module: /type="module"/.test(attrs || ''), body }); if (attrs && !/^\s*type="module"\s*$/.test(attrs)) throw new Error('unexpected script tag: <script' + attrs + '>'); return `\u0000${scripts.length - 1}\u0000`; });
let css = ''; let firstCss = true;
page = page.replace(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/g, (m, body) => { css += body + '\n'; const tag = firstCss ? `<link rel="stylesheet" href="/assets/app.css?v=${ver}">` : ''; firstCss = false; return tag; });
fs.writeFileSync(A + '/app.css', css);
// Each script keeps its own file, its order and its place in the page, so it runs exactly as it does inline.
// (They are not joined: a function declared in a later script would then replace an earlier one before either ran.)
let jsN = 0, mvN = 0;
page = page.replace(/\u0000(\d+)\u0000/g, (m, i) => { const s = scripts[+i];
  const name = s.module ? (mvN++ ? `mv-${mvN}.js` : 'mv.js') : (jsN++ ? `app-${jsN}.js` : 'app.js');
  fs.writeFileSync(`${A}/${name}`, s.body); return `<script${s.module ? ' type="module"' : ''} src="/assets/${name}?v=${ver}"></script>`; });
if (/\u0000|<style[\s>]/.test(page)) throw new Error('an inline script or style was left in the page');

/* ---- 4. one file per page ---- */
const routes = JSON.parse(fs.readFileSync('prototype/routes.json', 'utf8'));
const posts = Object.fromEntries(fs.readdirSync('prototype/posts').filter(f => f.endsWith('.html')).map(f => [f.slice(0, -5), fs.readFileSync('prototype/posts/' + f, 'utf8')]));
function headFor(r) {
  const url = ORIGIN + (r.path === '/' ? '/' : r.path);
  const img = ORIGIN + (r.post && r.post.hero ? r.post.hero : '/assets/img/hero-bg.jpg');
  const ld = r.path === '/' ? { '@context': 'https://schema.org', '@type': 'Organization', name: 'OneBase Health', url: ORIGIN, logo: ORIGIN + '/assets/img/onebase-logo-black.png', telephone: '+1-208-408-1801' }
    : r.post ? { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: r.post.title, description: r.desc, datePublished: r.post.iso, dateModified: r.post.updated, author: { '@type': 'Person', name: r.post.author }, publisher: { '@type': 'Organization', name: 'OneBase Health' }, image: img, mainEntityOfPage: url } : null;
  return `<title>${escH(r.title)}</title><meta name="description" content="${escH(r.desc)}">` + (r.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`)
    + `<meta property="og:type" content="${r.post ? 'article' : 'website'}"><meta property="og:site_name" content="OneBase Health"><meta property="og:title" content="${escH(r.title)}"><meta property="og:description" content="${escH(r.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${img}"><meta name="twitter:card" content="summary_large_image">`
    + `<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png"><link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg"><link rel="apple-touch-icon" href="/apple-touch-icon.png">` + (ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : '');
}
// A post's page carries the article itself; the app reads it from #obPrerender instead of fetching it again.
const preFor = (r) => r.post && posts[r.post.id] ? `<article><h1>${escH(r.post.title)}</h1><p>${escH(r.post.author)} · ${escH(r.post.date)}</p><div id="obPrerender">${posts[r.post.id]}</div></article>` : r.pre || '';
const shell = (r) => '<!doctype html><html lang="en"><head>' + page.replace('__HEAD__', () => headFor(r)).replace('__PRE__', () => `<div class="wrap" style="padding-block:48px">${preFor(r)}</div>`).replace('<header class="site">', '</head><body><header class="site">') + '</body></html>';
for (const r of routes) { const f = OUT + (r.path === '/' ? '' : r.path) + '/index.html'; fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, shell(r)); }
fs.writeFileSync(OUT + '/404.html', shell({ path: '/404', noindex: true, title: 'Page not found · OneBase Health', desc: 'This page does not exist.', pre: '<h1>Page not found</h1><p><a href="/">Go to the home page</a></p>' }));

/* ---- 5. sitemap and robots ---- */
const today = new Date().toISOString().slice(0, 10);
const listed = routes.filter(r => !r.noindex);
fs.writeFileSync(OUT + '/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + listed.map(r => `  <url><loc>${ORIGIN}${r.path === '/' ? '/' : r.path}</loc><lastmod>${r.post ? r.post.updated : today}</lastmod></url>`).join('\n') + '\n</urlset>\n');
fs.writeFileSync(OUT + '/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
console.log(`wrote ${OUT}: ${routes.length} pages + sitemap.xml, robots.txt, 404.html; files copied:`, JSON.stringify(count));
