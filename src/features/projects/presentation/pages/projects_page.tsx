import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Badge } from '@/shared/ui';
import { Section } from '@/shared/ui';
import { CtaSection } from '@/shared/components/cta_section';
import { useProjects } from '@/features/projects/presentation/queries/use_projects';
import type { Project } from '@/features/projects/domain/entities/project';

type FilterKey = 'all' | string;

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const [filter, setFilter] = useState<FilterKey>('all');

  const sectors = useMemo(() => {
    const set = new Set<string>();
    projects?.forEach((p) => set.add(p.sector));
    return ['all', ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (filter === 'all') return projects ?? [];
    return (projects ?? []).filter((p) => p.sector === filter);
  }, [projects, filter]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary-600/20 blur-[120px]" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-4">
              Réalisations
            </p>
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
          <>
            <div className="flex flex-wrap items-center gap-2 mb-10">
              {sectors.map((sector) => {
                const active = filter === sector;
                const label = sector === 'all' ? 'Tous les projets' : sector;
                return (
                  <button
                    key={sector}
                    onClick={() => setFilter(sector)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      active
                        ? 'bg-ink-900 text-white shadow-lg'
                        : 'bg-ink-50 text-ink-500 hover:bg-ink-100 hover:text-ink-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[300px]">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-ink-400">
                Aucun projet dans ce secteur pour le moment.
              </div>
            )}
          </>
        )}
      </Section>

      <CtaSection />
    </>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isFeatured = project.featured;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className={isFeatured ? 'md:col-span-2 md:row-span-2' : ''}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group relative block h-full overflow-hidden rounded-2xl border border-ink-100 bg-white hover:shadow-premium-lg transition-all duration-500"
      >
        <div className="relative h-full flex flex-col">
          <div className={`relative overflow-hidden ${isFeatured ? 'flex-1' : 'h-36'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900 to-ink-800" />
            <div className="absolute inset-0 grid-bg-dark opacity-20" />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-100 ${
                isFeatured ? 'opacity-70' : 'opacity-40'
              }`}
            />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {project.sector}
              </Badge>
              <span className="text-xs font-medium text-white/70 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md">
                {project.year}
              </span>
            </div>

            {isFeatured && (
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-secondary-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  Vedette
                </span>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4">
              <h3
                className={`font-display font-extrabold text-white ${
                  isFeatured ? 'text-3xl' : 'text-lg'
                }`}
              >
                {project.name}
              </h3>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 group-hover:w-20" />
            </div>
          </div>

          <div className={`p-5 ${isFeatured ? 'flex-1' : ''}`}>
            <p
              className={`text-sm text-ink-500 leading-relaxed mb-4 ${
                isFeatured ? 'line-clamp-2' : 'line-clamp-1'
              }`}
            >
              {project.tagline}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.slice(0, isFeatured ? 5 : 3).map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-medium text-ink-500 bg-ink-50 px-2 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>

            {isFeatured && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {project.results.map((r) => (
                  <div key={r.label} className="text-center p-2 rounded-xl bg-ink-50/50">
                    <p className="text-lg font-extrabold text-primary-600">{r.value}</p>
                    <p className="text-[10px] text-ink-400 leading-tight mt-0.5">{r.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink-50">
              <span className="flex items-center gap-1.5 text-xs text-ink-400">
                <TrendingUp className="h-3.5 w-3.5 text-secondary-500" />
                {project.client}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                Voir <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
