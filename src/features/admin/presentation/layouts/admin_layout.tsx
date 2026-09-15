import { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/features/auth/presentation/contexts/auth_context';
import { Logo } from '@/shared/layouts/logo';

const navItems = [
  { label: 'Tableau de bord', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Articles', to: '/admin/articles', icon: FileText, end: false },
  { label: 'Projets', to: '/admin/projects', icon: FolderKanban, end: false },
  { label: 'Services', to: '/admin/services', icon: Wrench, end: false },
  { label: 'Solutions', to: '/admin/solutions', icon: Lightbulb, end: false },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  async function handleSignOut() {
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

  const currentTitle = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )?.label ?? 'Admin';

  return (
    <div className="min-h-screen bg-ink-50 flex">
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-ink-950 text-white fixed inset-y-0 left-0 z-30">
        <div className="flex items-center justify-between h-20 px-5 border-b border-white/10">
          <Link to="/admin">
            <Logo dark />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-wider text-ink-600">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'text-ink-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </Link>
        </div>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400 text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userEmail}</p>
              <p className="text-[10px] text-ink-500">Administrateur</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600 text-xs font-bold">
              {initials}
            </div>
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
              <nav className="flex-1 px-3 py-6 space-y-1">
                {navItems.map((item) => (
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
                  onClick={handleSignOut}
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
    </div>
  );
}
