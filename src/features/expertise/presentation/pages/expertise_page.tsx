import { motion } from 'framer-motion';
import { Container, Section, SectionHeading } from '@/shared/ui';
import { CtaSection } from '@/shared/components/cta_section';
import { StaggerContainer, StaggerItem } from '@/shared/components/reveal';
import { useContentStore } from '@/features/content/presentation/store/content_store';
import * as Icons from 'lucide-react';

export function ExpertisePage() {
  const expertise = useContentStore((s) => s.expertise);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-4">Expertise technique</p>
            <h1 className="text-display-lg font-extrabold text-balance">
              Une maîtrise complète de <span className="text-gradient-light">la chaîne technologique</span>
            </h1>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-2xl">
              Du frontend à l'infrastructure, nous maîtrisons les technologies modernes pour
              concevoir des solutions robustes, performantes et évolutives.
            </p>
          </motion.div>
        </Container>
      </section>

      <Section>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expertise.map((item) => {
            const Icon = (Icons as Record<string, typeof Icons.Code2>)[item.icon] ?? Icons.Code2;
            return (
              <StaggerItem key={item.id}>
                <div className="group h-full p-8 rounded-2xl border border-ink-100 bg-white hover:shadow-premium transition-all duration-500">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-ink-900 mb-2">{item.label}</h3>
                      <p className="text-sm text-ink-500 leading-relaxed mb-4">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech) => (
                          <span key={tech} className="text-xs font-medium text-ink-600 bg-ink-50 px-2.5 py-1 rounded-md">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Section>

      <CtaSection />
    </>
  );
}
