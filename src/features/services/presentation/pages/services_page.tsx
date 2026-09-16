import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section, SectionHeading, Container, Button } from '@/shared/ui';
import { CtaSection } from '@/shared/components/cta_section';
import { useServices } from '@/features/services/presentation/queries/use_services';
import { getServiceIcon } from '@/features/services/domain/entities/service';

export function ServicesPage() {
  const { data: services, isLoading } = useServices();

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white min-h-[300px] lg:min-h-[380px] flex items-center">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-4">Nos services</p>
            <h1 className="text-display-lg font-extrabold text-balance">
              Tout ce dont vous avez besoin pour{' '}
              <span className="text-gradient-light">réussir votre transformation digitale</span>
            </h1>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-2xl">
              Du site corporate à la plateforme SaaS, de l'application mobile à l'infrastructure
              cloud — nous couvrons toute la chaîne de développement de vos solutions digitales.
            </p>
          </motion.div>
        </Container>
      </section>

      <Section>
        {isLoading ? (
          <div className="text-center py-20 text-ink-400">Chargement...</div>
        ) : (
          <div className="space-y-8">
            {services?.map((service, i) => {
              const Icon = getServiceIcon(service.icon);
              const reversed = i % 2 === 1;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5 }}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12 rounded-3xl border border-ink-100 bg-white hover:shadow-premium transition-all duration-500 ${reversed ? 'lg:[&>div:first-child]:order-2' : ''}`}
                >
                  <div>
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-ink-900 mb-3">{service.name}</h2>
                    <p className="text-ink-500 leading-relaxed mb-6">{service.description}</p>
                    <ul className="grid grid-cols-2 gap-3 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-ink-700">
                          <Check className="h-4 w-4 text-secondary-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button to="/quotation" variant="outline" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Demander un devis
                    </Button>
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-8 overflow-hidden">
                    <div className="absolute inset-0 grid-bg-dark opacity-20" />
                    <div className="relative h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-6">
                        <Icon className="h-6 w-6 text-primary-400" />
                        <span className="text-sm font-medium text-white">{service.name}</span>
                      </div>
                      <div className="flex-1 space-y-3">
                        {service.technologies.map((tech, j) => (
                          <div key={tech} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-sm text-white font-medium">{tech}</span>
                            <div className="h-2 w-16 rounded-full bg-white/10">
                              <div className="h-full rounded-full bg-gradient-to-r from-primary-400 to-secondary-400" style={{ width: `${70 + j * 8}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Section>

      <CtaSection />
    </>
  );
}
