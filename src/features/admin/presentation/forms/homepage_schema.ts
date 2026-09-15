import { z } from 'zod';

export const heroSlideSchema = z.object({
  eyebrow: z.string().min(1, 'Sur-titre requis'),
  title: z.string().min(1, 'Titre requis'),
  highlight: z.string().min(1, 'Texte mis en avant requis'),
  subtitle: z.string().min(1, 'Sous-titre requis'),
  cta_label: z.string().optional().or(z.literal('')),
  cta_to: z.string().optional().or(z.literal('')),
  accent: z.string().min(1, "Couleur d'accent requise"),
  mockup: z.string().min(1, 'Mockup requis'),
});

export type HeroSlideFormValues = z.infer<typeof heroSlideSchema>;

export const statSchema = z.object({
  value: z.coerce.number(),
  suffix: z.string().optional().or(z.literal('')),
  label: z.string().min(1, 'Label requis'),
});

export type StatFormValues = z.infer<typeof statSchema>;
export type StatFormInput = z.input<typeof statSchema>;

export const clientSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export const whyUsSchema = z.object({
  icon: z.string().min(1, 'Icône requise'),
  title: z.string().min(1, 'Titre requis'),
  description: z.string().min(1, 'Description requise'),
});

export type WhyUsFormValues = z.infer<typeof whyUsSchema>;
