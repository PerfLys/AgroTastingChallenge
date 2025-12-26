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
      titleFr: z.string(),
      titleEn: z.string(),
      partnersDescriptionFr: z.string().optional(),
      partnersDescriptionEn: z.string().optional(),
      partnersIntroFr: z.string().optional(),
      partnersIntroEn: z.string().optional(),
      partnersList: z.array(
        z.object({
          name: z.string(),
          slug: z.string(),
          logo: z.string().optional(),
          websiteUrl: z.string().optional(),
          descriptionFr: z.string().optional(),
          descriptionEn: z.string().optional(),
        })
      ).optional(),
    }),
  ]),
});

const settingsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    socialLinks: z.array(
      z.object({
        platform: z.enum([
          'email',
          'instagram',
          'linkedin',
          'facebook',
          'x',
          'github',
          'youtube',
        ]),
        label: z.string().optional(),
        url: z.string(),
      })
    ).optional(),
  }),
});

export const collections = {
  editions: editionsCollection,
  pages: pagesCollection,
  settings: settingsCollection,
};
