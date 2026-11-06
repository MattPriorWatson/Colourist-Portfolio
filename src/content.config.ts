import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    order: z.number(),
    thumbnail: z.string(),
    video: z.object({ provider: z.enum(["youtube", "vimeo"]), id: z.string() }),
    year: z.string().optional(),
    role: z.string().optional(),
    bio: z.string().optional(),
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
    awards: z.array(z.object({ year: z.string(), name: z.string(), note: z.string().optional() })).default([]),
  }),
});
export const collections = { projects };