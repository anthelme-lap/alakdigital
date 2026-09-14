import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/features/auth/presentation/contexts/auth_context';
import { Logo } from '@/shared/layouts/logo';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setLoading(false);
      return;
    }

    navigate('/admin');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-ink-950 overflow-hidden">
      <div className="absolute inset-0 grid-bg-dark opacity-20" />
      <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-primary-600/15 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary-600/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md px-6"
      >
        <div className="rounded-3xl border border-white/10 bg-ink-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-6">
              <Logo dark />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500/15 border border-primary-500/20 mb-4">
              <Lock className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">Espace Admin</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-sm text-ink-400">Connectez-vous pour accéder au tableau de bord</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alak-digital.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-ink-500 transition-all duration-200 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-ink-500 transition-all duration-200 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white font-semibold text-sm transition-all duration-300 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-ink-500">
                Compte de demonstration : <span className="text-ink-300 font-mono">admin@alak-digital.com</span>
              </p>
              <p className="text-xs text-ink-500">
                Mot de passe : <span className="text-ink-300 font-mono">Admin123!</span>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
