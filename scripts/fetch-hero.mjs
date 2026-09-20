// Pulls the four real-session tiles from the current onebasehealth.com hero into public/images/src at build time.
// A tile that is already committed is kept, and a failed download never fails the build (the old hero is the fallback).
import fs from 'node:fs';
const SRC = 'https://onebasehealth.com/cdn/shop/files/Untitled_design2-topaz-sharpen.png';
const W = 4246, H = 2387, Q = 1062;
const tiles = { 'hero-air': 0, 'hero-light': 1, 'hero-ice': 2, 'hero-heat': 3 };
for (const [name, i] of Object.entries(tiles)) {
const out = `public/images/src/${name}.jpg`;
if (fs.existsSync(out)) continue;
const url = `${SRC}?crop=region&crop_left=${i * Q}&crop_top=0&crop_width=${i === 3 ? W - 3 * Q : Q}&crop_height=${H}&width=1000&format=jpg`;
try {
const r = await fetch(url);
if (!r.ok) throw new Error('HTTP ' + r.status);
fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
console.log('fetched', name);
} catch (e) { console.warn('hero tile not fetched:', name, e.message); }
}

