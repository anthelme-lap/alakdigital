import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Badge } from '@/shared/ui';
import { Section } from '@/shared/ui';
import { CtaSection } from '@/shared/components/cta_section';
import { useProjects } from '@/features/projects/presentation/queries/use_projects';

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary-600/20 blur-[120px]" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-4">Réalisations</p>
            <h1 className="text-display-lg font-extrabold text-balance">
              Des projets qui <span className="text-gradient-light">font la différence</span>
            </h1>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-2xl">
              Découvrez nos réalisations: applications web, mobiles, plateformes SaaS et solutions
              métiers conçues pour des entreprises et organisations.
            </p>
          </motion.div>
        </Container>
      </section>

      <Section>
        {isLoading ? (
          <div className="text-center py-20 text-ink-400">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects?.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-ink-100 bg-white hover:shadow-premium-lg transition-all duration-500"
                >
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-ink-900 to-ink-800 overflow-hidden">
                    <div className="absolute inset-0 grid-bg-dark opacity-20" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      <div className="text-2xl font-display font-extrabold text-white mb-2">{project.name}</div>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="primary" size="sm">{project.sector}</Badge>
                      <span className="text-xs text-ink-400">{project.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-ink-900 mb-2 group-hover:text-primary-600 transition-colors">{project.name}</h3>
                    <p className="text-sm text-ink-500 leading-relaxed mb-4">{project.tagline}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[11px] font-medium text-ink-500 bg-ink-50 px-2 py-1 rounded-md">{tech}</span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary-600 group-hover:gap-3 transition-all">
                      Voir l'étude de cas <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      <CtaSection />
    </>
  );
}
