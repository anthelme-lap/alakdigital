import { supabase } from '@/core/database/supabase_client';
import type { AdminRole } from '@/features/auth/presentation/contexts/auth_context';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  createdAt: string;
}

type AdminUserRow = {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  created_at: string;
};

function mapAdminUser(r: AdminUserRow): AdminUser {
  return { id: r.id, email: r.email, fullName: r.full_name, role: r.role, createdAt: r.created_at };
}

export interface CreateAdminUserPayload {
  email: string;
  password: string;
  fullName: string;
  role: AdminRole;
}

async function invokeEdgeFunction<T>(method: 'POST' | 'DELETE', body: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke('admin-users', { method, body });
  if (error) {
    const message = (data as { message?: string } | null)?.message ?? error.message;
    throw new Error(message);
  }
  return data as T;
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as AdminUserRow[]).map(mapAdminUser);
}

export async function createAdminUser(payload: CreateAdminUserPayload): Promise<AdminUser> {
  const created = await invokeEdgeFunction<{ id: string; email: string; fullName: string; role: AdminRole }>(
    'POST',
    payload,
  );
  return { ...created, createdAt: new Date().toISOString() };
}

export async function deleteAdminUser(id: string): Promise<void> {
  await invokeEdgeFunction<{ id: string }>('DELETE', { id });
}
