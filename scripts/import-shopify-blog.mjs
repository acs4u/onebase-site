// Migrates all Shopify blog articles → src/content/posts/*.md
// Run from a machine that can reach onebasehealth.com:  npm run import:blog
// Sources: Shopify Atom feeds (/blogs/<handle>.atom) — public, no API key needed.
import fs from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';

const SHOP = 'https://onebasehealth.com';
const BLOGS = ['education', 'news', 'contrast-therapy', 'red-light', 'science-research'];
const OUT = 'src/content/posts';
const IMG_OUT = 'public/images/blog';
const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const tag = (xml, t) => { const m = xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)<\\/${t}>`)); return m ? m[1].trim() : ''; };
const cdata = (s) => s.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(IMG_OUT, { recursive: true });
let total = 0;

for (const blog of BLOGS) {
  for (let page = 1; page < 20; page++) {
    const res = await fetch(`${SHOP}/blogs/${blog}.atom?page=${page}`);
    if (!res.ok) break;
    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);
    if (entries.length === 0) break;
    for (const e of entries) {
      const title = unescape(cdata(tag(e, 'title')));
      const link = (e.match(/<link[^>]*href="([^"]+)"/) || [])[1] || '';
      const slug = link.split('/').pop().split('?')[0];
      const published = tag(e, 'published');
      const updated = tag(e, 'updated');
      const author = unescape(tag(tag(e, 'author'), 'name')) || 'OneBase Health';
      const summary = unescape(cdata(tag(e, 'summary'))).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
      let html = cdata(tag(e, 'content'));
      html = unescape(html);

      // Download images to public/images/blog and rewrite src
      const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m => m[1]);
      let hero;
      for (const src of imgs) {
        try {
          const clean = src.startsWith('//') ? 'https:' + src : src;
          const name = path.basename(clean.split('?')[0]).replace(/[^a-zA-Z0-9._-]/g, '_');
          const local = `/images/blog/${slug}--${name}`;
          const buf = Buffer.from(await (await fetch(clean)).arrayBuffer());
          await fs.writeFile('public' + local, buf);
          html = html.split(src).join(local);
          hero ??= local;
        } catch (err) { console.warn('image failed', src, err.message); }
      }

      const md = td.turndown(html);
      const fm = [
        '---',
        `title: ${JSON.stringify(title)}`,
        summary ? `description: ${JSON.stringify(summary)}` : null,
        `pubDate: ${published.slice(0, 10)}`,
        updated ? `updatedDate: ${updated.slice(0, 10)}` : null,
        `author: ${JSON.stringify(author)}`,
        `category: ${blog}`,
        hero ? `heroImage: ${JSON.stringify(hero)}` : null,
        '---', '',
      ].filter(Boolean).join('\n');
      await fs.writeFile(path.join(OUT, `${slug}.md`), fm + md + '\n');
      total++;
      console.log('✓', blog, slug);
    }
  }
}
console.log(`Imported ${total} posts. Old URLs /blogs/<category>/<slug> redirect to /blog/<slug> via astro.config.mjs.`);
