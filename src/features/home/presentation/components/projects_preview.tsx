import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Quote } from 'lucide-react';
import { Section, SectionHeading, Badge } from '@/shared/ui';
import { Reveal } from '@/shared/components/reveal';
import { useFeaturedProjects } from '@/features/projects/presentation/queries/use_projects';

export function ProjectsPreview() {
  const { data: projects } = useFeaturedProjects();
  const featured = projects?.slice(0, 3) ?? [];
  const [hovered, setHovered] = useState<number | null>(null);

  if (featured.length === 0) return null;

  return (
    <Section className="bg-ink-50/50">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
        <SectionHeading
          eyebrow="Réalisations"
          title="Des projets qui parlent d'eux-mêmes"
          subtitle="Découvrez quelques-unes de nos réalisations récentes: applications web, mobiles, plateformes SaaS et solutions métiers."
        />
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex-shrink-0"
        >
          Voir tous les projets
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
        {featured.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.1}>
            <Link
              to={`/projects/${project.slug}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative block h-[440px] rounded-3xl overflow-hidden border border-ink-100 bg-white transition-all duration-500 hover:shadow-premium-lg hover:border-primary-200"
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-800" />
                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary-500/20 blur-3xl" />
                      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary-500/15 blur-3xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative h-full flex flex-col p-7">
                <div className="flex items-center justify-between mb-auto">
                  <Badge variant="dark" size="sm" className="bg-white/10 text-white border-white/20">
                    {project.sector}
                  </Badge>
                  <span className="text-xs text-ink-500 font-mono">{project.year}</span>
                </div>

                <div className="my-8">
                  <div className="text-3xl lg:text-4xl font-display font-extrabold text-white mb-2">
                    {project.name}
                  </div>
                  <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
                </div>

                <p className="text-sm text-ink-400 leading-relaxed mb-6 line-clamp-2">
                  {project.tagline}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[11px] font-medium text-ink-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[11px] font-medium text-ink-500 px-2.5 py-1">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    {project.results.slice(0, 2).map((r) => (
                      <div key={r.label}>
                        <div className="text-lg font-bold text-white font-display">{r.value}</div>
                        <div className="text-[10px] text-ink-500">{r.label}</div>
                      </div>
                    ))}
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                      hovered === i
                        ? 'bg-primary-500 text-white rotate-0'
                        : 'bg-white/10 text-ink-400 rotate-[-15deg]'
                    }`}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
