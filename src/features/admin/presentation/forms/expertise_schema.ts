import { z } from 'zod';

export const expertiseSchema = z.object({
  icon: z.string().min(1, 'Icône requise'),
  label: z.string().min(1, 'Label requis'),
  description: z.string().min(1, 'Description requise'),
  technologies: z.string().optional().or(z.literal('')),
});

export type ExpertiseFormValues = z.infer<typeof expertiseSchema>;
