import { z } from 'zod';

export const profileInfoSchema = z.object({
  prenom: z.string().min(1, 'Prenom requis'),
  nom: z.string().min(1, 'Nom requis'),
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  telephone: z.string().optional(),
});

export type ProfileInfoFormValues = z.infer<typeof profileInfoSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z.string().min(8, '8 caracteres minimum'),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
