import { defineCollection, z } from 'astro:content';

const editionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    year: z.number(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    photos: z.array(z.string()).optional(),
    pdfVinsAveugle: z.string().optional(),
    pdfVinsTable: z.string().optional(),
    pdfVinsOfferts: z.string().optional(),
  }),
});

const pagesCollection = defineCollection({
  type: 'data',
  schema: z.discriminatedUnion('_template', [
    z.object({
      _template: z.literal('home'),
      title: z.string(),
      heroImage: z.string().optional(),
      heroSubtitle: z.string().optional(),
      heroSubtitleEn: z.string().optional(),
      heroTextFr: z.string().optional(),
      heroTextEn: z.string().optional(),
    }),
    z.object({
      _template: z.literal('partenaires'),
      title: z.string(),
      partnersDescription: z.string().optional(),
      partnersIntro: z.string().optional(),
      partnersList: z.array(
        z.object({
          name: z.string().optional(),
          logo: z.string().optional(),
          url: z.string().optional(),
        })
      ).optional(),
    }),
  ]),
});

export const collections = {
  editions: editionsCollection,
  pages: pagesCollection,
};
