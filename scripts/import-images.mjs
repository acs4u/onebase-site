// Pulls product/solution/brand images from the two existing sites into public/images.
// Run from a machine that can reach both domains:  npm run import:images
// Afterwards, replace hero photography with the approved brand images from Canva/Drive.
import fs from 'node:fs/promises';

const BIZ = 'https://business.onebasehealth.com/assets/';
const SHOP = 'https://cdn.shopify.com/s/files/1/0730/4832/6423/files/';

const files = {
  // products (Lovable build assets — hashes are stable for the current deploy)
  'products/icevault-quad-black.png': BIZ + 'bestseller-icevault-quad-BjTBFUhC.webp',
  'products/icevault-octo-black.png': BIZ + 'icevault-oct-black-BnvuJKoi.webp',
  'products/hemlock-quad.png': BIZ + 'bestseller-heat-hemlock-C66TL2S6.webp',
  'products/yakisugi-quad.png': BIZ + 'product-sauna-DqcRtNhM.webp',
  'products/lightbed-black.png': BIZ + 'lightbed-black-rORLPK4a.webp',
  'products/airform-plus-black.png': BIZ + 'hbot-form-plus-black-DOq2cW7a.webp',
  // products (Shopify CDN)
  'products/airfit-mini-black.png': SHOP + 'Sit_Up_L_-_Square.png',
  'products/airflex-black.png': SHOP + 'OneBase-HBOT-Mod-Black-AC-01.png',
  'products/airform-mini-white.png': SHOP + 'OneBase-HBOT-Pro-L-4_4368badb-19ca-43ba-bed4-376b0e840327.png',
  'products/lightpanel-quad.png': SHOP + 'LP_Quad.png',
  'products/airfit-plus-white.png': SHOP + 'Sit_Up_L_-_Square.png',
  'products/airsuite-solo-black.png': SHOP + 'OneBase_Full_Stack.png', // TODO replace with AirSuite render
  // solutions
  'solutions/recovery-wellness-studios.webp': BIZ + 'solution-fitness-cR4xE-Rz.webp',
  'solutions/luxury-hospitality.webp': BIZ + 'solution-boutique-spas-yJY-G_On.webp',
  'solutions/multi-family-housing.webp': BIZ + 'solution-multifamily-nav-C_zB3DeQ.webp',
  'solutions/fitness-centers.webp': BIZ + 'solution-military-C6ADRrRY.webp',
  'solutions/pro-sports-performance.webp': BIZ + 'solution-sports-hero-xefr-qjT.webp',
  'solutions/high-end-real-estate.webp': BIZ + 'solution-realestate-BCS16PbH.webp',
  'solutions/corporate-wellness.webp': BIZ + 'engineers-working-BSCzkfDH.webp',
  'solutions/military-first-responders.webp': BIZ + 'solution-military-C6ADRrRY.webp',
  // brand / misc
  'hero/full-stack.jpg': SHOP + 'Untitled_design2-topaz-sharpen.png',
  'about/engineers-working.webp': BIZ + 'engineers-working-BSCzkfDH.webp',
  'about/dr-scott-sherr.webp': BIZ + 'dr-scott-sherr-D7lPS_c-.webp',
  'software/app-interface.webp': BIZ + 'app-interface-De4lf7Sl.webp',
  'logo-white.webp': BIZ + 'onebase-logo-white-BXQ1_dk4.webp',
  'logo-black.webp': BIZ + 'onebase-logo-v2-black-H8YrcN18.webp',
  'logo.png': SHOP + 'ONEBASE_LOGO_FINAL_RGB_-ADJUSTED-02.png',
  'parts/hbot-masks.png': SHOP + 'Screenshot2026-01-27114410.png',
  'logos/healthfit.webp': BIZ + 'logo-healthfit-BALQFjHl.webp',
  'logos/10x-longevity.webp': BIZ + 'logo-brand2-DrJC1hmC.webp',
  'logos/hype-wellness.webp': BIZ + 'logo-hype-BJdeTPp2.webp',
  'logos/the-covery.webp': BIZ + 'logo-covery-CLjfK0O5.webp',
  'logos/hume.webp': BIZ + 'logo-hume-DTFpM8vG.webp',
  'logos/infinity-iv.webp': BIZ + 'logo-infinity-CsMoIn3a.webp',
  'logos/lafc.webp': BIZ + 'logo-lafc-B54ltw2X.webp',
  'logos/revital.webp': BIZ + 'logo-revital-CaM8eWGu.webp',
};

for (const [dest, src] of Object.entries(files)) {
  const out = `public/images/${dest}`;
  await fs.mkdir(out.substring(0, out.lastIndexOf('/')), { recursive: true });
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error(res.status);
    await fs.writeFile(out, Buffer.from(await res.arrayBuffer()));
    console.log('✓', dest);
  } catch (e) { console.warn('✗', dest, src, e.message); }
}
console.log('Done. Category hero photos (/images/categories/*.jpg) and og-default.jpg still need real photography.');
