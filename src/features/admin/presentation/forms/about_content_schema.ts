import { z } from 'zod';

export const missionVisionSchema = z.object({
  icon: z.string().min(1, 'Icône requise'),
  label: z.string().min(1, 'Label requis'),
  title: z.string().min(1, 'Titre requis'),
  description: z.string().min(1, 'Description requise'),
  points: z.string().optional().or(z.literal('')),
});

export type MissionVisionFormValues = z.infer<typeof missionVisionSchema>;

export const pillarSchema = z.object({
  icon: z.string().min(1, 'Icône requise'),
  title: z.string().min(1, 'Titre requis'),
  description: z.string().min(1, 'Description requise'),
});

export type PillarFormValues = z.infer<typeof pillarSchema>;

export const companyStorySchema = z.object({
  year: z.string().min(1, 'Année requise'),
  paragraph_1: z.string().min(1, 'Paragraphe 1 requis'),
  paragraph_2: z.string().min(1, 'Paragraphe 2 requis'),
});

export type CompanyStoryFormValues = z.infer<typeof companyStorySchema>;
