import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Section, SectionHeading } from '@/shared/ui';
import { Reveal } from '@/shared/components/reveal';
import { fetchExpertise } from '@/features/content/infrastructure/content_api';
import * as Icons from 'lucide-react';

export function ExpertiseSection() {
  const { data: expertise = [] } = useQuery({ queryKey: ['expertise-home'], queryFn: fetchExpertise });
  const [active, setActive] = useState(0);

  if (expertise.length === 0) return null;

  const safeActive = Math.min(active, expertise.length - 1);
  const current = expertise[safeActive];
  const CurrentIcon = (Icons as Record<string, typeof Icons.Code2>)[current.icon] ?? Icons.Code2;

  return (
    <Section dark>
      <div className="absolute inset-0 grid-bg-dark opacity-20 pointer-events-none" />
      <div className="relative">
        <SectionHeading
          dark
          center
          eyebrow="Expertise technique"
          title="Une expertise complète, du produit à l'infrastructure"
          subtitle="Nous maîtrisons l'ensemble de la chaîne technologique pour concevoir, développer et déployer des solutions robustes et évolutives."
        />

        <div className="mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-start">
          <div className="space-y-2">
            {expertise.map((group, i) => {
              const Icon = (Icons as Record<string, typeof Icons.Code2>)[group.icon] ?? Icons.Code2;
              return (
                <Reveal key={group.id} delay={i * 0.05}>
                  <button
                    onClick={() => setActive(i)}
                    className={`group w-full flex items-center gap-4 p-4 lg:p-5 rounded-2xl border transition-all duration-300 text-left ${
                      safeActive === i
                        ? 'bg-white/10 border-primary-500/50 shadow-[0_0_30px_-8px_rgba(253,50,12,0.3)]'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0 ${
                        safeActive === i
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/5 text-ink-400 group-hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-base font-bold transition-colors ${safeActive === i ? 'text-white' : 'text-ink-200 group-hover:text-white'}`}>
                        {group.label}
                      </div>
                      <div className="text-xs text-ink-500 mt-0.5 hidden sm:block">{group.description}</div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${
                        safeActive === i ? 'text-primary-400 translate-x-0' : 'text-ink-600 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                    />
                  </button>
                </Reveal>
              );
            })}
          </div>

          <div className="relative min-h-[280px] lg:min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative h-full"
              >
                <div className="relative p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 overflow-hidden">
                  <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 text-primary-400">
                        <CurrentIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{current.label}</div>
                        <div className="text-sm text-ink-400">{current.description}</div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {current.technologies.map((tech, i) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 hover:border-primary-500/30 transition-colors cursor-default"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-6">
                      <div>
                        <div className="text-2xl font-extrabold text-white font-display">{current.technologies.length}+</div>
                        <div className="text-xs text-ink-500 mt-0.5">Technologies maîtrisées</div>
                      </div>
                      <div className="h-10 w-px bg-white/10" />
                      <div>
                        <div className="text-2xl font-extrabold text-white font-display">100%</div>
                        <div className="text-xs text-ink-500 mt-0.5">Niveau d'expertise</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
