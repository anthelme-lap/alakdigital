import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z
    .string()
    .min(1, 'Slug requis')
    .regex(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement'),
  tagline: z.string().min(1, 'Slogan requis'),
  description: z.string().min(1, 'Description requise'),
  icon: z.string().min(1, 'Icône requise'),
  features: z.string().optional().or(z.literal('')),
  technologies: z.string().optional().or(z.literal('')),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
