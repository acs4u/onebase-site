export const site = {
  name: 'OneBase Health',
  legalEntity: 'Waylen Allen Limited',
  url: 'https://onebasehealth.com',
  tagline: 'The world’s easiest therapy system.',
  description: 'Connected commercial recovery equipment — hyperbaric chambers, dry cold therapy rooms, infrared saunas and red light — engineered in-house, medically led, and run from one software platform.',
  phoneUS: '(208) 408-1801',
  phoneUSHref: 'tel:+12084081801',
  salesEmail: 'sales@onebasehealth.com',
  serviceEmail: 'customerservice@onebasehealth.com',
  bookingUrl: 'https://meetings.hubspot.com/jett-moody/meet-with-jett-moody',
  hubspot: { portalId: '20568937', region: 'na1', formId: '' }, // TODO: paste the enquiry form GUID from HubSpot
  gtmId: 'GTM-T433HTQJ',
  social: {
    instagram: 'https://www.instagram.com/onebasehealth/',
    youtube: 'https://www.youtube.com/@onebasehealth',
    linkedin: 'https://www.linkedin.com/company/onebasehealth/',
    facebook: 'https://facebook.com/onebasehealth',
  },
  // Flip to true once the Precor partnership is public.
  precorAnnounced: false,
};

export const modalities = {
  air:   { key: 'air',   label: 'Air',   category: 'hbot',         name: 'HBOT Chambers',      path: '/products/hbot',         blurb: 'Hyperbaric oxygen therapy from 1.3 to 2.0 ATA. Soft-shell, hard-shell and walk-in rooms.' },
  ice:   { key: 'ice',   label: 'Ice',   category: 'cold-therapy', name: 'Cold Therapy',       path: '/products/cold-therapy', blurb: 'Dry, electric cold rooms for 2 to 8 people. No water, no ice, no nitrogen.' },
  heat:  { key: 'heat',  label: 'Heat',  category: 'sauna',        name: 'Infrared Saunas',    path: '/products/sauna',        blurb: 'Full-spectrum, low-EMF infrared in Yakisugi cedar or Hemlock. Plug-and-play.' },
  light: { key: 'light', label: 'Light', category: 'red-light',    name: 'Red Light Therapy',  path: '/products/red-light',    blurb: 'Modular panels and a 41,600-LED full-body bed. 633 to 940 nm.' },
} as const;

export type ModalityKey = keyof typeof modalities;

export const categoryToModality: Record<string, ModalityKey> = {
  'hbot': 'air', 'cold-therapy': 'ice', 'sauna': 'heat', 'red-light': 'light',
};

export const nav = [
  { label: 'Products', href: '/products', children: Object.values(modalities).map(m => ({ label: m.name, href: m.path })) },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Software', href: '/software' },
  { label: 'Partners', href: '/partners' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export const trustedBy = [
  'HealthFit', '10X Longevity', 'Hype Wellness', 'The Covery', 'Hume', 'Infinity IV & Wellness', 'Los Angeles FC', 'Revital Health',
];

export const productName = (name: string, size?: string) => `OneBase ${name}${size ? ' ' + size : ''}`;
