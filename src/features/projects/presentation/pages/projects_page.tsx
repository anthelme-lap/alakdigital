import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Calendar, Building2, TrendingUp } from 'lucide-react';
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

  const featured = (projects ?? []).filter((p) => p.featured);
  const rest = useMemo(() => {
    const all = projects ?? [];
    if (filter === 'all') return all.filter((p) => !p.featured);
    return all.filter((p) => p.sector === filter);
  }, [projects, filter]);

  const filteredFeatured = useMemo(() => {
    if (filter === 'all') return featured;
    return featured.filter((p) => p.sector === filter);
  }, [featured, filter]);

  const showFeatured = filteredFeatured.length > 0;
  const showRest = rest.length > 0;

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
            <div className="flex flex-wrap items-center gap-2 mb-12">
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

            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {showFeatured && (
                  <div className="mb-16 space-y-6">
                    {filteredFeatured.map((project, i) => (
                      <FeaturedRow key={project.id} project={project} index={i} />
                    ))}
                  </div>
                )}

                {showRest && (
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400 mb-6">
                      {showFeatured ? 'Autres réalisations' : 'Toutes nos réalisations'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {rest.map((project, i) => (
                        <CompactCard key={project.id} project={project} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {!showFeatured && !showRest && (
                  <div className="text-center py-20 text-ink-400">
                    Aucun projet dans ce secteur pour le moment.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </Section>

      <CtaSection />
    </>
  );
}

function FeaturedRow({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-ink-100 bg-white hover:shadow-premium-lg transition-all duration-500"
      >
        <div
          className={`relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-ink-900 ${
            reversed ? 'lg:order-2' : ''
          }`}
        >
          <img
            src="/alak_1.png"
            alt={project.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <Badge variant="primary" size="sm">
              {project.sector}
            </Badge>
            <span className="text-xs font-medium text-white/80 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-md">
              {project.year}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <h3 className="text-2xl lg:text-3xl font-display font-extrabold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors">
            {project.name}
          </h3>
          <p className="text-base text-ink-500 leading-relaxed mb-6">{project.tagline}</p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-medium text-ink-500 bg-ink-50 px-2.5 py-1 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {project.results.map((r) => (
              <div key={r.label} className="p-3 rounded-xl bg-ink-50/60 text-center">
                <p className="text-xl font-extrabold text-primary-600">{r.value}</p>
                <p className="text-[10px] text-ink-400 leading-tight mt-1">{r.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-ink-50">
            <div className="flex items-center gap-4 text-xs text-ink-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-secondary-500" />
                {project.client}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-secondary-500" />
                {project.duration}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:gap-2.5 transition-all">
              Voir l'étude de cas <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CompactCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link
        to={`/projects/${project.slug}`}
        className="group block h-full overflow-hidden rounded-2xl border border-ink-100 bg-white hover:shadow-premium-lg transition-all duration-500"
      >
        <div className="relative h-32 overflow-hidden bg-ink-900">
          <img
            src="/alak_1.png"
            alt={project.name}
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant="primary" size="sm">
              {project.sector}
            </Badge>
          </div>
          <h3 className="absolute bottom-3 left-4 right-4 text-lg font-display font-extrabold text-white">
            {project.name}
          </h3>
        </div>

        <div className="p-5">
          <p className="text-sm text-ink-500 leading-relaxed mb-3 line-clamp-1">{project.tagline}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-medium text-ink-500 bg-ink-50 px-2 py-1 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-ink-50">
            <span className="flex items-center gap-1.5 text-xs text-ink-400">
              <TrendingUp className="h-3.5 w-3.5 text-secondary-500" />
              {project.client}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
