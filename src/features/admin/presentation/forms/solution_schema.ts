import { z } from 'zod';

export const solutionSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z
    .string()
    .min(1, 'Slug requis')
    .regex(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement'),
  category: z.string().min(1, 'Catégorie requise'),
  target: z.string().min(1, 'Cible requise'),
  tagline: z.string().min(1, 'Slogan requis'),
  description: z.string().min(1, 'Description requise'),
  problem: z.string().min(1, 'Problème requis'),
  features: z.string().optional().or(z.literal('')),
  technologies: z.string().optional().or(z.literal('')),
  link: z.string().optional().or(z.literal('')),
});

export type SolutionFormValues = z.infer<typeof solutionSchema>;
