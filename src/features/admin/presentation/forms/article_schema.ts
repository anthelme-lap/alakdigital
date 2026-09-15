import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  slug: z
    .string()
    .min(1, 'Slug requis')
    .regex(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement'),
  excerpt: z.string().min(1, 'Extrait requis'),
  category: z.string().min(1, 'Catégorie requise'),
  author: z.string().min(1, 'Auteur requis'),
  authorRole: z.string().optional().or(z.literal('')),
  readingTime: z.string().optional().or(z.literal('')),
  coverImage: z.string().optional().or(z.literal('')),
  featured: z.boolean(),
  content: z.string().min(1, 'Contenu requis'),
  tags: z.string().optional().or(z.literal('')),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
