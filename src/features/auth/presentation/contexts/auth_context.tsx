import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const ADMIN_EMAIL = 'admin@alak-digital.com';
const ADMIN_PASSWORD = 'Admin123!';
const STORAGE_KEY = 'alak_admin_session';

interface FictitiousUser {
  email: string;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: FictitiousUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FictitiousUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    await new Promise((r) => setTimeout(r, 400));

    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const u: FictitiousUser = { email: ADMIN_EMAIL, name: 'Konan A.', role: 'Administrateur' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
      return { error: null };
    }

    return { error: 'Email ou mot de passe incorrect.' };
  }

  async function signOut() {
    localStorage.removeItem(STORAGE_KEY);
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
