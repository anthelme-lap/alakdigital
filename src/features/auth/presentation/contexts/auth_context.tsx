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

const AUTH_TIMEOUT_MS = 8000;

class AuthTimeoutError extends Error {}

function withTimeout<T>(promise: PromiseLike<T>, ms = AUTH_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new AuthTimeoutError('Auth call timed out')), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });
}

/**
 * supabase-js peut rester bloque indefiniment (ni resolue ni rejetee) si une
 * session/refresh token en localStorage est corrompue ou perimee. On efface
 * toute cle sb-* pour forcer un etat propre plutot que de laisser l'appelant
 * geler indefiniment.
 */
function clearStaleSession() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('sb-'))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // localStorage indisponible (mode prive strict, etc.) -- rien a nettoyer
  }
}

async function resolveUser(supabaseUserId: string, fallbackEmail: string): Promise<AuthUser | null> {
  try {
    const { data, error } = await withTimeout(
      supabase.from('admin_users').select('email, role').eq('id', supabaseUserId).single(),
    );

    if (error || !data) {
      return null;
    }

    return { id: supabaseUserId, email: data.email ?? fallbackEmail, role: data.role as AdminRole };
  } catch (err) {
    if (err instanceof AuthTimeoutError) clearStaleSession();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    withTimeout(supabase.auth.getSession())
      .then(async ({ data: { session } }) => {
        if (!session?.user) {
          if (active) setLoading(false);
          return;
        }
        const resolved = await resolveUser(session.user.id, session.user.email ?? '');
        if (active) {
          setUser(resolved);
          setLoading(false);
        }
      })
      .catch(async (err) => {
        if (err instanceof AuthTimeoutError) {
          clearStaleSession();
          await supabase.auth.signOut().catch(() => {});
        }
        if (active) {
          setUser(null);
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
    try {
      const { data, error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }));

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
    } catch (err) {
      if (err instanceof AuthTimeoutError) {
        clearStaleSession();
        await supabase.auth.signOut().catch(() => {});
        return { error: 'Session precedente invalide, nettoyee. Reessaie de te connecter.' };
      }
      return { error: 'Une erreur est survenue. Reessaie.' };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    clearStaleSession();
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
