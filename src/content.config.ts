import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const modality = z.enum(['air', 'ice', 'heat', 'light']);

const products = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),              // model name, e.g. "AirFit" (rendered as "OneBase AirFit")
    modality,
    category: z.enum(['hbot', 'cold-therapy', 'sauna', 'red-light']),
    order: z.number().default(0),
    tagline: z.string(),
    description: z.string(),
    sizes: z.array(z.object({ id: z.string(), label: z.string(), note: z.string().optional() })).default([]),
    colours: z.array(z.string()).default([]),
    pressures: z.array(z.string()).default([]),
    highlights: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    electrical: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    certifications: z.array(z.string()).default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    channels: z.object({
      direct: z.boolean().default(true),
      precor: z.boolean().default(false), // available through Precor (US commercial fitness)
    }).default({}),
    fromPriceUSD: z.number().optional(),  // shown as "from" only where OneBase publishes pricing
    status: z.enum(['available', 'coming-soon']).default('available'),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const solutions = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/solutions' }),
  schema: z.object({
    label: z.string(),
    order: z.number().default(0),
    heroHeading: z.string(),
    heroImage: z.string().optional(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    valueProps: z.array(z.object({ title: z.string(), body: z.string() })),
    features: z.array(z.object({ title: z.string(), body: z.string(), image: z.string().optional() })),
    modalities: z.array(modality).default([]),
    precorChannel: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('OneBase Health'),
    category: z.enum(['education', 'news', 'contrast-therapy', 'red-light', 'science-research']).default('education'),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/team' }),
  schema: z.object({
    people: z.array(z.object({ name: z.string(), role: z.string(), group: z.enum(['founders', 'medical', 'engineering', 'commercial', 'operations']) })),
  }),
});

const parts = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/parts' }),
  schema: z.object({
    items: z.array(z.object({
      sku: z.string(),
      name: z.string(),
      fits: z.string().optional(),
      priceUSD: z.number(),
      image: z.string().optional(),
      stripePaymentLink: z.string().optional(), // set per SKU from the Stripe dashboard
      description: z.string().optional(),
    })),
  }),
});

export const collections = { products, solutions, posts, team, parts };
