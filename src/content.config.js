import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const edition = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/editions" }),
	schema: z.object({
    year: z.number(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    photos: z.array(z.string()).optional(),
    pdfVinsAveugle: z.string().optional(),
    pdfVinsTable: z.string().optional(),
    pdfVinsOfferts: z.string().optional(),
	}),
});

export const collections = { edition };


