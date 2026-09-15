import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { Container, Section, SectionHeading } from '@/shared/ui';
import { CtaSection } from '@/shared/components/cta_section';
import { Reveal, StaggerContainer, StaggerItem } from '@/shared/components/reveal';
import { fetchValues, fetchMissionVision, fetchTeam, fetchPillars } from '@/features/content/infrastructure/content_api';
import * as Icons from 'lucide-react';

export function AboutPage() {
  const { data: values = [] } = useQuery({ queryKey: ['values'], queryFn: fetchValues });
  const { data: missionVision = [] } = useQuery({ queryKey: ['missionVision'], queryFn: fetchMissionVision });
  const { data: team = [] } = useQuery({ queryKey: ['team'], queryFn: fetchTeam });
  const { data: pillars = [] } = useQuery({ queryKey: ['pillars'], queryFn: fetchPillars });
  const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission');
  const active = missionVision.find((mv) => mv.tab_key === activeTab) ?? missionVision[0];

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-4">À propos</p>
            <h1 className="text-display-lg font-extrabold text-balance">
              Nous transformons les idées en{' '}
              <span className="text-gradient-light">produits digitaux utiles et performants</span>
            </h1>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-3xl">
              ALAK DIGITAL est un Software Studio basé en Côte d'Ivoire qui conçoit, développe et
              déploie des solutions digitales pour les entreprises, institutions et organisations.
            </p>
          </motion.div>
        </Container>
      </section>

      {missionVision.length > 0 && (
        <Section>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <div className="flex flex-col gap-3">
                {missionVision.map((mv) => {
                  const MvIcon = (Icons as Record<string, typeof Icons.Target>)[mv.icon] ?? Icons.Target;
                  return (
                    <button
                      key={mv.id}
                      onClick={() => setActiveTab(mv.tab_key as 'mission' | 'vision')}
                      className={`group flex items-center gap-4 p-5 lg:p-6 rounded-2xl border text-left transition-all duration-300 ${
                        activeTab === mv.tab_key
                          ? 'bg-ink-900 border-primary-500 text-white shadow-premium-lg'
                          : 'bg-white border-ink-100 text-ink-900 hover:border-primary-200 hover:shadow-premium'
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0 ${
                          activeTab === mv.tab_key
                            ? 'bg-primary-500 text-white'
                            : 'bg-primary-50 text-primary-600 group-hover:bg-primary-100'
                        }`}
                      >
                        <MvIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${activeTab === mv.tab_key ? 'text-primary-400' : 'text-ink-400'}`}>
                          {mv.label}
                        </div>
                        <div className={`text-base font-bold leading-tight ${activeTab === mv.tab_key ? 'text-white' : 'text-ink-900'}`}>
                          {mv.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[340px]">
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <div className="relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-ink-50 to-white border border-ink-100 overflow-hidden">
                      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary-500/5 blur-3xl" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                            {(() => {
                              const Icon = (Icons as Record<string, typeof Icons.Target>)[active.icon] ?? Icons.Target;
                              return <Icon className="h-6 w-6" />;
                            })()}
                          </div>
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-primary-600">{active.label}</div>
                            <h2 className="text-2xl font-bold text-ink-900 leading-tight">{active.title}</h2>
                          </div>
                        </div>
                        <p className="text-lg text-ink-600 leading-relaxed mb-8">{active.description}</p>
                        <div className="space-y-3">
                          {active.points.map((point, i) => (
                            <motion.div
                              key={point}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                              className="flex items-center gap-3"
                            >
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white flex-shrink-0">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-ink-700 font-medium">{point}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Section>
      )}

      {values.length > 0 && (
        <Section dark>
          <div className="absolute inset-0 grid-bg-dark opacity-20 pointer-events-none" />
          <div className="relative">
            <SectionHeading dark center eyebrow="Nos valeurs" title="Ce qui nous guide au quotidien" />
            <StaggerContainer className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value) => {
                const Icon = (Icons as Record<string, typeof Icons.Award>)[value.icon] ?? Icons.Award;
                return (
                  <StaggerItem key={value.id}>
                    <div className="group h-full p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                      <p className="text-sm text-ink-400 leading-relaxed">{value.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </Section>
      )}

      {team.length > 0 && (
        <Section>
          <SectionHeading
            center
            eyebrow="L'équipe"
            title="Les personnes derrière ALAK DIGITAL"
            subtitle="Une équipe pluridisciplinaire passionnée, qui combine expertise technique et sens du produit pour livrer des solutions d'exception."
          />

          <StaggerContainer className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <StaggerItem key={member.id}>
                <div className="group relative rounded-3xl overflow-hidden bg-white border border-ink-100 transition-all duration-500 hover:shadow-premium-lg hover:border-primary-200">
                  <div className="relative aspect-square overflow-hidden bg-ink-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-lg font-bold text-white leading-tight">{member.name}</h3>
                      <p className="text-sm text-primary-300 font-medium mt-0.5">{member.role}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-3">
                      Outils & technologies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-[11px] font-medium text-ink-600 bg-ink-50 px-2.5 py-1 rounded-md border border-ink-100 group-hover:border-primary-200 group-hover:text-primary-700 transition-colors"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Section>
      )}

      {pillars.length > 0 && (
        <Section className="bg-ink-50/50">
          <div className="grid lg:grid-cols-3 gap-8">
            {pillars.map((item, i) => {
              const Icon = (Icons as Record<string, typeof Icons.Target>)[item.icon] ?? Icons.Target;
              return (
                <Reveal key={item.id} delay={i * 0.1}>
                  <div className="p-8 rounded-2xl border border-ink-100 bg-white">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold text-ink-900 mb-3">{item.title}</h3>
                    <p className="text-ink-500 leading-relaxed">{item.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Section>
      )}

      <CtaSection />
    </>
  );
}
