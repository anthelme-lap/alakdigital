import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { NAV_LINKS, APP_CONFIG } from '@/core/config/app_config';
import { useScrollPosition } from '@/shared/hooks/use_ui';
import { useUiStore } from '@/shared/hooks/use_ui_store';
import { Button } from '@/shared/ui';
import { Logo } from './logo';

export function Header() {
  const scrolled = useScrollPosition(20);
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl border-b border-ink-100 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-8xl container-px">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
            <Link to="/" onClick={closeMobileMenu} aria-label={`${APP_CONFIG.name} — Accueil`}>
              <Logo dark={!scrolled && location.pathname === '/'} />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive: active }) =>
                    `relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      active || isActive(link.to)
                        ? 'text-primary-600'
                        : scrolled
                          ? 'text-ink-600 hover:text-ink-900'
                          : 'text-ink-600 hover:text-ink-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Button to="/quotation" variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Démarrer un projet
              </Button>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-ink-100 transition-colors"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={closeMobileMenu} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between h-20 px-5 border-b border-ink-100">
                <Logo />
                <button onClick={closeMobileMenu} className="p-2 rounded-lg hover:bg-ink-100">
                  <X className="h-6 w-6 text-ink-700" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className={({ isActive: active }) =>
                      `flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                        active || isActive(link.to)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-ink-700 hover:bg-ink-50'
                      }`
                    }
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 opacity-40" />
                  </NavLink>
                ))}
              </nav>
              <div className="p-5 border-t border-ink-100">
                <Button to="/quotation" fullWidth size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={closeMobileMenu}>
                  Démarrer un projet
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
