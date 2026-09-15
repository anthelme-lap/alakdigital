import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/core/database/supabase_client';

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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function resolveUser(supabaseUserId: string, fallbackEmail: string): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('email, role')
    .eq('id', supabaseUserId)
    .single();

  if (error || !data) {
    return null;
  }

  return { id: supabaseUserId, email: data.email ?? fallbackEmail, role: data.role as AdminRole };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        if (active) setLoading(false);
        return;
      }
      const resolved = await resolveUser(session.user.id, session.user.email ?? '');
      if (active) {
        setUser(resolved);
        setLoading(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      const resolved = await resolveUser(session.user.id, session.user.email ?? '');
      setUser(resolved);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return { error: 'Email ou mot de passe incorrect.' };
    }

    const resolved = await resolveUser(data.user.id, data.user.email ?? '');
    if (!resolved) {
      await supabase.auth.signOut();
      return { error: 'Ce compte ne dispose pas des droits admin.' };
    }

    setUser(resolved);
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
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
