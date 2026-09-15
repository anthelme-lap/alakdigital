import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type AdminRole } from '@/features/auth/presentation/contexts/auth_context';
import { Loader } from '@/shared/ui';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: AdminRole;
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <Loader size={40} className="text-primary-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
