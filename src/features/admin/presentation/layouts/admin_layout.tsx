import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Wrench,
  Lightbulb,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Users,
  Mail,
  FileCheck,
  BarChart3,
  Award,
  Target,
  UserCog,
  ChevronDown,
  ChevronLeft,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '@/features/auth/presentation/contexts/auth_context';
import { useMyProfile } from '@/features/profile/presentation/queries/use_profile';
import { Logo } from '@/shared/layouts/logo';
import { Button } from '@/shared/ui';

const navItems = [
  { label: 'Tableau de bord', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Articles', to: '/admin/articles', icon: FileText, end: false },
  { label: 'Projets', to: '/admin/projects', icon: FolderKanban, end: false },
  { label: 'Services', to: '/admin/services', icon: Wrench, end: false },
  { label: 'Solutions', to: '/admin/solutions', icon: Lightbulb, end: false },
  { label: 'Équipe', to: '/admin/team', icon: Users, end: false },
  { label: 'Valeurs', to: '/admin/values', icon: Award, end: false },
  { label: 'Expertise', to: '/admin/expertise-content', icon: Target, end: false },
  { label: 'Accueil', to: '/admin/homepage', icon: BarChart3, end: false },
  { label: 'À propos', to: '/admin/about-content', icon: Award, end: false },
  { label: 'Messages', to: '/admin/messages', icon: Mail, end: false },
  { label: 'Devis', to: '/admin/quotations', icon: FileCheck, end: false },
];

const superadminNavItems = [
  { label: 'Utilisateurs', to: '/admin/users', icon: UserCog, end: false },
];

function UserMenu({ initials, onSignOut }: { initials: string; onSignOut: () => void }) {
  const { data: profile } = useMyProfile();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = profile?.nomComplet ?? profile?.email ?? '';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-ink-50 transition-colors"
      >
        {profile?.urlPhoto ? (
          <img src={profile.urlPhoto} alt={displayName} className="h-8 w-8 rounded-lg object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex-shrink-0">
            {initials}
          </div>
        )}
        {displayName && (
          <span className="hidden sm:block text-sm font-medium text-ink-800 max-w-[140px] truncate">{displayName}</span>
        )}
        <ChevronDown className={`hidden sm:block h-4 w-4 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-xl border border-ink-100 bg-white shadow-lg overflow-hidden z-30"
          >
            <Link
              to="/admin/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
            >
              <UserCircle className="h-4 w-4 text-ink-400" /> Profil
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const visibleNavItems = user?.role === 'superadmin' ? [...navItems, ...superadminNavItems] : navItems;

  async function handleSignOut() {
    setConfirmSignOutOpen(false);
    setMobileSidebarOpen(false);
    await signOut();
    navigate('/admin/login');
  }

  const userEmail = user?.email ?? '';
  const initials = userEmail
    .split('@')[0]
    .split('.')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const currentTitle = visibleNavItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )?.label ?? 'Admin';

  return (
    <div className="min-h-screen bg-ink-50 flex">
      <aside
        className={`hidden lg:flex flex-shrink-0 flex-col bg-ink-950 text-white fixed inset-y-0 left-0 z-30 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between h-20 px-5 border-b border-white/10">
          {!sidebarCollapsed && (
            <Link to="/admin">
              <Logo dark />
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            title={sidebarCollapsed ? 'Afficher la barre latérale' : 'Masquer la barre latérale'}
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-ink-400 hover:text-white hover:bg-white/10 transition-colors ${
              sidebarCollapsed ? 'mx-auto' : ''
            }`}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-6 space-y-1">
          {!sidebarCollapsed && (
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-wider text-ink-600">Contenu</p>
          )}
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={sidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'text-ink-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-3">
          <Link
            to="/"
            title={sidebarCollapsed ? 'Voir le site' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:text-white hover:bg-white/5 transition-all duration-200 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && 'Voir le site'}
          </Link>
        </div>

        <div className="p-3 border-t border-white/10">
          <Link
            to="/admin/profile"
            title={sidebarCollapsed ? userEmail : undefined}
            className={`flex items-center gap-3 px-3 py-2 mb-2 rounded-xl hover:bg-white/5 transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400 text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{userEmail}</p>
                <p className="text-[10px] text-ink-500">Administrateur</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setConfirmSignOutOpen(true)}
            title={sidebarCollapsed ? 'Déconnexion' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && 'Déconnexion'}
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <header className="sticky top-0 z-20 bg-white border-b border-ink-100 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-ink-600 hover:bg-ink-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-bold text-ink-900">{currentTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-ink-500 hover:text-primary-600 transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Voir le site
            </Link>
            <UserMenu initials={initials} onSignOut={() => setConfirmSignOutOpen(true)} />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-ink-950 text-white flex flex-col"
            >
              <div className="flex items-center justify-between h-20 px-5 border-b border-white/10">
                <Link to="/admin" onClick={() => setMobileSidebarOpen(false)}>
                  <Logo dark />
                </Link>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-ink-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-6 space-y-1">
                {visibleNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-ink-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={() => setConfirmSignOutOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmSignOutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setConfirmSignOutOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 flex-shrink-0">
                  <LogOut className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ink-900 mb-1">Se déconnecter ?</h3>
                  <p className="text-sm text-ink-500">Vous devrez vous reconnecter pour accéder à l'administration.</p>
                </div>
                <button onClick={() => setConfirmSignOutOpen(false)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<LogOut className="h-4 w-4" />}
                  onClick={handleSignOut}
                  className="!bg-red-600 hover:!bg-red-700 !shadow-red-600/20"
                >
                  Déconnexion
                </Button>
                <Button variant="outline" size="md" onClick={() => setConfirmSignOutOpen(false)}>
                  Annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
