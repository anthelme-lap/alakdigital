import { z } from 'zod';

export const adminUserSchema = z.object({
  fullName: z.string().min(1, 'Nom requis'),
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(8, '8 caracteres minimum'),
  role: z.enum(['admin', 'superadmin']),
});

export type AdminUserFormValues = z.infer<typeof adminUserSchema>;
