import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Code2,
  Smartphone,
  Layers,
  LayoutDashboard,
  Monitor,
  Server,
  TrendingUp,
  Users,
  CheckCircle2,
  Bell,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Container, Button, Badge } from '@/shared/ui';
import { fetchHeroSlides } from '@/features/content/infrastructure/content_api';

export function Hero() {
  const { data: slides = [] } = useQuery({ queryKey: ['heroSlides'], queryFn: fetchHeroSlides });
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const goTo = useCallback((index: number) => setCurrent((index + slides.length) % slides.length), [slides.length]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (!autoPlay || slides.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [autoPlay, slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-white pt-10 pb-16 lg:pt-14 lg:pb-20"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className="absolute inset-0 grid-bg opacity-50" />
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.accent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4"
          style={{
            backgroundColor: slide.accent === 'primary' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(249, 115, 22, 0.1)',
          }}
        />
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary-100/20 blur-[120px] translate-y-1/4 -translate-x-1/4" />

      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[420px]">
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <div className="mb-5 inline-flex">
                  <Badge variant={slide.accent === 'primary' ? 'primary' : 'secondary'} size="md">
                    <span className={`h-2 w-2 rounded-full ${slide.accent === 'primary' ? 'bg-primary-500' : 'bg-secondary-500'} animate-pulse`} />
                    {slide.eyebrow}
                  </Badge>
                </div>

                <h1 className="text-display-xl font-extrabold text-ink-900 text-balance">
                  {slide.title}{' '}
                  <span className={slide.accent === 'primary' ? 'text-gradient' : 'bg-gradient-to-r from-secondary-600 to-secondary-400 bg-clip-text text-transparent'}>
                    {slide.highlight}
                  </span>
                </h1>

                <p className="mt-5 text-base lg:text-lg text-ink-500 leading-relaxed max-w-xl">
                  {slide.subtitle}
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button to="/quotation" variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Démarrer un projet
                  </Button>
                  <Button to={slide.cta_to} variant="outline" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {slide.cta_label}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center gap-3">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="group relative"
                >
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-primary-600' : 'w-6 bg-ink-200 group-hover:bg-ink-300'}`} />
                </button>
              ))}
              <span className="ml-3 text-xs font-mono text-ink-400">
                {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="relative z-10 hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                {slide.mockup === 'dashboard' && <DashboardMockup />}
                {slide.mockup === 'mobile' && <MobileMockup />}
                {slide.mockup === 'saas' && <SaasMockup />}
              </motion.div>
            </AnimatePresence>

            {slides.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-ink-200 shadow-premium text-ink-600 hover:bg-ink-900 hover:text-white hover:border-ink-900 transition-all duration-300 z-20"
                  aria-label="Slide précédent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-ink-200 shadow-premium text-ink-600 hover:bg-ink-900 hover:text-white hover:border-ink-900 transition-all duration-300 z-20"
                  aria-label="Slide suivant"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="relative h-[420px]">
      <motion.div
        className="absolute top-0 right-0 w-[360px] rounded-2xl bg-ink-900 p-4 shadow-premium-lg border border-ink-800"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-auto text-[10px] text-ink-500 font-mono">dashboard.alak.io</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-primary-400" />
              <span className="text-xs text-white font-medium">Analytics Dashboard</span>
            </div>
            <span className="text-xs text-secondary-400 font-mono">+24%</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['12K', '3.4K', '89%'].map((v, i) => (
              <div key={i} className="rounded-lg bg-white/5 p-2.5 text-center">
                <div className="text-sm font-bold text-white">{v}</div>
                <div className="text-[9px] text-ink-500 mt-0.5">Métrique {i + 1}</div>
              </div>
            ))}
          </div>
          <div className="h-24 rounded-lg bg-gradient-to-br from-primary-600/20 to-secondary-600/20 p-3 flex items-end">
            <div className="flex items-end gap-1.5 w-full h-full">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-primary-600 to-secondary-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-32 left-0 w-[220px] rounded-xl bg-white p-3 shadow-premium-lg border border-ink-100"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50">
            <Code2 className="h-4 w-4 text-primary-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-ink-900">Frontend</div>
            <div className="text-[10px] text-ink-400">React + TypeScript</div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-lg bg-ink-50">
            <span className="text-[10px] text-ink-600">Build Status</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-ink-50">
            <span className="text-[10px] text-ink-600">Performance</span>
            <span className="text-[10px] font-mono text-green-600">98/100</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MobileMockup() {
  return (
    <div className="relative h-[420px] flex items-center justify-center">
      <motion.div
        className="relative w-[230px] rounded-[2.5rem] bg-ink-900 p-3 shadow-premium-lg border border-ink-800"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-full bg-ink-700 z-10" />
        <div className="rounded-[2rem] bg-gradient-to-br from-primary-600 to-secondary-600 p-4 aspect-[9/16] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-5 mt-3">
            <Smartphone className="h-5 w-5 text-white" />
            <Bell className="h-4 w-4 text-white/70" />
          </div>
          <div className="text-xs text-white/70 font-medium">Bienvenue</div>
          <div className="text-xl font-bold text-white mb-4">EventFlow</div>
          <div className="space-y-2 mb-4">
            <div className="rounded-xl bg-white/15 p-3">
              <div className="text-[10px] text-white/60">Événement à venir</div>
              <div className="text-sm font-bold text-white mt-0.5">Tech Summit 2024</div>
            </div>
            <div className="rounded-xl bg-white/15 p-3">
              <div className="text-[10px] text-white/60">Billets disponibles</div>
              <div className="text-sm font-bold text-white mt-0.5">250 places</div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="h-10 rounded-xl bg-white flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary-600" />
              <span className="text-xs font-bold text-primary-600">Acheter un billet</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-8 right-0 w-[180px] rounded-2xl bg-white p-3 shadow-premium-lg border border-ink-100"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-50">
            <TrendingUp className="h-4 w-4 text-secondary-600" />
          </div>
          <div className="text-xs font-bold text-ink-900">Téléchargements</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-ink-500">iOS</span>
            <span className="text-[10px] font-mono text-green-600">+18%</span>
          </div>
          <div className="h-1.5 rounded-full bg-ink-100">
            <div className="h-full w-3/4 rounded-full bg-primary-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-ink-500">Android</span>
            <span className="text-[10px] font-mono text-green-600">+32%</span>
          </div>
          <div className="h-1.5 rounded-full bg-ink-100">
            <div className="h-full w-5/6 rounded-full bg-secondary-500" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-0 w-[170px] rounded-xl bg-ink-900 p-3 shadow-premium-lg border border-ink-800"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="text-[10px] text-ink-500 font-mono mb-2">flutter.dev</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
            <CheckCircle2 className="h-3 w-3 text-green-400" />
            <span className="text-[10px] text-white">Cross-platform</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
            <CheckCircle2 className="h-3 w-3 text-green-400" />
            <span className="text-[10px] text-white">Push notifications</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
            <CheckCircle2 className="h-3 w-3 text-green-400" />
            <span className="text-[10px] text-white">Offline mode</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SaasMockup() {
  return (
    <div className="relative h-[420px]">
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[380px] rounded-2xl bg-ink-900 p-4 shadow-premium-lg border border-ink-800"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500/20">
            <Layers className="h-4 w-4 text-primary-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Garage Manager</div>
            <div className="text-[10px] text-ink-500">SaaS Platform</div>
          </div>
          <Server className="ml-auto h-4 w-4 text-green-500" />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: 'Tenants actifs', value: '30+' },
            { label: 'Revenus/mois', value: '2.4M' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white/5 p-2.5">
              <div className="text-sm font-bold text-white">{stat.value}</div>
              <div className="text-[9px] text-ink-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {[
            { name: 'Garage Nord', status: 'Active', color: 'green' },
            { name: 'Auto Plus CI', status: 'Active', color: 'green' },
            { name: 'Cocody Motors', status: 'Trial', color: 'amber' },
          ].map((tenant) => (
            <div key={tenant.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-ink-500" />
                <span className="text-[10px] text-white">{tenant.name}</span>
              </div>
              <span className={`text-[10px] font-mono ${tenant.color === 'green' ? 'text-green-400' : 'text-amber-400'}`}>{tenant.status}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 w-[200px] rounded-xl bg-white p-3 shadow-premium-lg border border-ink-100"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-50">
            <TrendingUp className="h-4 w-4 text-secondary-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-ink-900">Croissance MRR</div>
            <div className="text-[10px] text-ink-400">+15% ce mois</div>
          </div>
        </div>
        <div className="flex items-end gap-1 h-16 mt-2">
          {[30, 45, 40, 60, 55, 75, 70, 90].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary-500 to-secondary-400" style={{ height: `${h}%` }} />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-0 w-[180px] rounded-xl bg-white p-3 shadow-premium-lg border border-ink-100"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Monitor className="h-4 w-4 text-primary-600" />
          <div className="text-xs font-bold text-ink-900">Multi-tenant</div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between p-2 rounded-lg bg-ink-50">
            <span className="text-[10px] text-ink-600">Isolation données</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-ink-50">
            <span className="text-[10px] text-ink-600">Facturation auto</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-ink-50">
            <span className="text-[10px] text-ink-600">RBAC</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
