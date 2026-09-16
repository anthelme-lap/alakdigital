import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiClient } from '@/core/http/api_client';
import { tokenStore } from '@/core/auth/token_store';
import { UnauthorizedError } from '@/core/errors/app_error';

export type AdminRole = 'admin' | 'superadmin';

interface AuthUser {
  id: string;
  email: string;
  role: AdminRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

interface UserResponse {
  id: string;
  email: string;
  type_utilisateur: string | null;
}

interface LoginResponse {
  token: string;
  refresh_token: string;
  utilisateur: UserResponse | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function roleFromTypeUtilisateur(type: string | null): AdminRole | null {
  if (type === 'site_super_admin') return 'superadmin';
  if (type === 'site_admin') return 'admin';
  return null;
}

function toAuthUser(u: UserResponse): AuthUser | null {
  const role = roleFromTypeUtilisateur(u.type_utilisateur);
  if (!role) return null;
  return { id: u.id, email: u.email, role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!tokenStore.getAccessToken()) {
        if (active) setLoading(false);
        return;
      }
      try {
        const me = await apiClient.get<UserResponse>('/auth/me');
        if (active) setUser(toAuthUser(me));
      } catch {
        tokenStore.clear();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const data = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        mot_de_passe: password,
      });

      const authUser = data.utilisateur ? toAuthUser(data.utilisateur) : null;
      if (!authUser) {
        return { error: 'Ce compte ne dispose pas des droits admin.' };
      }

      tokenStore.setTokens(data.token, data.refresh_token);
      setUser(authUser);
      return { error: null };
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        return { error: 'Email ou mot de passe incorrect.' };
      }
      return { error: 'Une erreur est survenue. Réessaie.' };
    }
  }

  async function signOut() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // deconnexion cote client de toute facon
    }
    tokenStore.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
