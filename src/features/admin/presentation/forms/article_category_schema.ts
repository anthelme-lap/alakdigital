import { z } from 'zod';

export const articleCategorySchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z
    .string()
    .min(1, 'Slug requis')
    .regex(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement'),
});

export type ArticleCategoryFormValues = z.infer<typeof articleCategorySchema>;
