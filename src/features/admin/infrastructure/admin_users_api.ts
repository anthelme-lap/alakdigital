import { apiClient } from '@/core/http/api_client';
import type { AdminRole } from '@/features/auth/presentation/contexts/auth_context';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  createdAt: string;
}

type UserResponse = {
  id: string;
  nom: string;
  email: string;
  type_utilisateur: string | null;
  date_creation: string | null;
};

function roleToTypeUtilisateur(role: AdminRole): string {
  return role === 'superadmin' ? 'site_super_admin' : 'site_admin';
}

function typeUtilisateurToRole(type: string | null): AdminRole {
  return type === 'site_super_admin' ? 'superadmin' : 'admin';
}

function mapAdminUser(r: UserResponse): AdminUser {
  return {
    id: r.id,
    email: r.email,
    fullName: r.nom,
    role: typeUtilisateurToRole(r.type_utilisateur),
    createdAt: r.date_creation ?? '',
  };
}

export interface CreateAdminUserPayload {
  email: string;
  password: string;
  fullName: string;
  role: AdminRole;
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const rows = await apiClient.get<UserResponse[]>('/admin/site-admins');
  return rows.map(mapAdminUser);
}

export async function createAdminUser(payload: CreateAdminUserPayload): Promise<AdminUser> {
  const created = await apiClient.post<UserResponse>('/admin/site-admins', {
    email: payload.email,
    mot_de_passe: payload.password,
    nom: payload.fullName,
    role: roleToTypeUtilisateur(payload.role),
  });
  return mapAdminUser(created);
}

export async function deleteAdminUser(id: string): Promise<void> {
  await apiClient.delete(`/admin/site-admins/${id}`);
}
