import { motion } from 'framer-motion';
import { ArrowRight, Target, Users, Check } from 'lucide-react';
import { Container, Button, Badge, Section, SectionHeading } from '@/shared/ui';
import { CtaSection } from '@/shared/components/cta_section';
import { useSolutions } from '@/features/solutions/presentation/queries/use_solutions';

export function SolutionsPage() {
  const { data: solutions, isLoading } = useSolutions();

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[500px] rounded-full bg-secondary-600/20 blur-[120px]" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-400 mb-4">Nos solutions</p>
            <h1 className="text-display-lg font-extrabold text-balance">
              Des produits SaaS prêts à <span className="text-gradient-light">transformer votre business</span>
            </h1>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed">
              ALAK DIGITAL développe ses propres solutions logicielles pour répondre aux besoins
              spécifiques des marchés africains.
            </p>
          </motion.div>
        </Container>
      </section>

      <Section>
        {isLoading ? (
          <div className="text-center py-20 text-ink-400">Chargement...</div>
        ) : (
          <div className="space-y-8">
            {solutions?.map((solution, i) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5 }}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12 rounded-3xl border border-ink-100 bg-white ${i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}
              >
                <div>
                  <Badge variant="secondary" size="sm" className="mb-4">{solution.category}</Badge>
                  <h2 className="text-2xl lg:text-3xl font-bold text-ink-900 mb-3">{solution.name}</h2>
                  <p className="text-ink-500 leading-relaxed mb-6">{solution.description}</p>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-ink-900">Problème résolu</div>
                        <div className="text-sm text-ink-500">{solution.problem}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-ink-900">Cible</div>
                        <div className="text-sm text-ink-500">{solution.target}</div>
                      </div>
                    </div>
                  </div>
                  <Button to="/quotation" variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Demander une démo
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-ink-50">
                    <h3 className="text-sm font-bold text-ink-900 mb-4">Fonctionnalités clés</h3>
                    <ul className="space-y-3">
                      {solution.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-ink-700">
                          <Check className="h-4 w-4 text-secondary-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100">
                    <h3 className="text-sm font-bold text-ink-900 mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {solution.technologies.map((tech) => (
                        <span key={tech} className="text-xs font-semibold text-primary-700 bg-white px-3 py-1.5 rounded-lg shadow-sm">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      <CtaSection />
    </>
  );
}
