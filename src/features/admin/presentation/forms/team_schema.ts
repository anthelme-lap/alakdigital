import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  role: z.string().min(1, 'Rôle requis'),
  image: z.string().optional().or(z.literal('')),
  tools: z.string().optional().or(z.literal('')),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
