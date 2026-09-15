import { z } from 'zod';

export const valueSchema = z.object({
  icon: z.string().min(1, 'Icône requise'),
  title: z.string().min(1, 'Titre requis'),
  description: z.string().min(1, 'Description requise'),
});

export type ValueFormValues = z.infer<typeof valueSchema>;
