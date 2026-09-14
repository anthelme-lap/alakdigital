import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/presentation/contexts/auth_context';

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
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/alak_1.png"
          alt="ALAK Digital"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950/90 via-ink-900/70 to-ink-950/90" />
        <div className="absolute inset-0 grid-bg-dark opacity-15" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/alak_1.png"
              alt="ALAK Digital"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold text-white">ALAK</span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink-300">
                Digital
              </span>
            </div>
          </Link>

          <div className="max-w-md">
            <h2 className="text-4xl font-display font-extrabold text-white leading-tight mb-4">
              Construire le digital de demain, aujourd'hui.
            </h2>
            <p className="text-base text-ink-300 leading-relaxed">
              Accedez a votre espace d'administration pour gerer vos contenus, articles et
              donnees.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {[
              { label: 'Projets livres', value: '50+' },
              { label: 'Clients satisfaits', value: '95%' },
              { label: "Annees d'experience", value: '8' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs text-ink-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-ink-50 px-6 py-12 relative">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary-100/40 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <img
              src="/alak_1.png"
              alt="ALAK Digital"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold text-ink-900">ALAK</span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink-400">
                Digital
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 border border-primary-100 mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">
              Espace Admin
            </span>
          </div>

          <h1 className="text-3xl font-display font-extrabold text-ink-900 mb-2">
            Bon retour
          </h1>
          <p className="text-sm text-ink-500 mb-8">
            Connectez-vous pour acceder au tableau de bord
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alak-digital.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 transition-all duration-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 transition-all duration-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 text-white font-semibold text-sm transition-all duration-300 hover:bg-ink-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="p-3.5 rounded-xl bg-ink-100/60 border border-ink-100 text-center">
              <p className="text-xs text-ink-400">
                Compte de demonstration :{' '}
                <span className="text-ink-600 font-mono">admin@alak-digital.com</span>
              </p>
              <p className="text-xs text-ink-400">
                Mot de passe : <span className="text-ink-600 font-mono">Admin123!</span>
              </p>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Retour au site
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
