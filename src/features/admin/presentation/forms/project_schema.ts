import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z
    .string()
    .min(1, 'Slug requis')
    .regex(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement'),
  sector: z.string().min(1, 'Secteur requis'),
  client: z.string().min(1, 'Client requis'),
  tagline: z.string().min(1, 'Slogan requis'),
  description: z.string().min(1, 'Description requise'),
  problem: z.string().min(1, 'Problème requis'),
  solution: z.string().min(1, 'Solution requise'),
  technologies: z.string().optional().or(z.literal('')),
  services: z.string().optional().or(z.literal('')),
  features: z.string().optional().or(z.literal('')),
  featured: z.boolean(),
  year: z.string().min(1, 'Année requise'),
  duration: z.string().optional().or(z.literal('')),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
