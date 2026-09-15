import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/features/auth/presentation/contexts/auth_context';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img src="/alak_1.png" alt="ALAK Digital" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950/95 via-ink-900/80 to-ink-950/95" />
        <div className="absolute inset-0 grid-bg-dark opacity-15" />
        <div className="absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-secondary-600/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <img src="/alak_1.png" alt="ALAK Digital" className="h-10 w-10 rounded-xl object-cover" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold text-white">ALAK</span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink-300">Digital</span>
            </div>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-300">Espace d'administration</span>
            </div>
            <h2 className="text-4xl font-display font-extrabold text-white leading-tight mb-4">
              Construire le digital de demain, aujourd'hui.
            </h2>
            <p className="text-base text-ink-300 leading-relaxed">
              Accédez à votre espace pour gérer vos contenus, articles, projets et demandes clients.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md">
            {[
              { label: 'Projets livrés', value: '50+' },
              { label: 'Clients satisfaits', value: '95%' },
              { label: "Années d'expérience", value: '8' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs text-ink-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-ink-50 px-6 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary-100/40 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[200px] w-[200px] rounded-full bg-secondary-100/30 blur-[80px]" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <img src="/alak_1.png" alt="ALAK Digital" className="h-10 w-10 rounded-xl object-cover" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold text-ink-900">ALAK</span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ink-400">Digital</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 border border-primary-100 mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">Espace Admin</span>
          </div>

          <h1 className="text-3xl font-display font-extrabold text-ink-900 mb-2">Bon retour</h1>
          <p className="text-sm text-ink-500 mb-8">Connectez-vous pour accéder au tableau de bord</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 20 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 overflow-hidden">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-ink-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@alak-digital.com"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-2">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-ink-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors">
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="group w-full h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-ink-900 text-white font-semibold text-sm transition-all duration-300 hover:bg-ink-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl relative overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-primary-600/0 via-primary-600/0 to-primary-600/0 group-hover:from-primary-600/20 group-hover:via-primary-600/0 group-hover:to-primary-600/0 transition-all duration-500" />
              {loading ? (
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-700 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Retour au site
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
