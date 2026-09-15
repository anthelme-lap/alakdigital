import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Building2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Container, Button, Badge, Loader } from '@/shared/ui';
import { CtaSection } from '@/shared/components/cta_section';
import { useProjectBySlug } from '@/features/projects/presentation/queries/use_projects';
import { useProjects } from '@/features/projects/presentation/queries/use_projects';
import { NotFoundPage } from '@/features/home/presentation/pages/not_found_page';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProjectBySlug(slug ?? '');
  const { data: allProjects } = useProjects();

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader size={32} /></div>;
  if (!project) return <NotFoundPage />;

  const otherProjects = allProjects?.filter((p) => p.slug !== project.slug).slice(0, 2) ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 grid-bg-dark opacity-20" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary-600/20 blur-[120px]" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="primary" size="sm" className="bg-primary-500/20 border-primary-500/30 text-primary-300">{project.sector}</Badge>
              <span className="text-sm text-ink-400">{project.year}</span>
            </div>
            <h1 className="text-display-lg font-extrabold text-balance">{project.name}</h1>
            <p className="mt-6 text-xl text-ink-300 leading-relaxed max-w-3xl">{project.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-ink-400"><Building2 className="h-4 w-4 text-primary-400" /> {project.client}</div>
              <div className="flex items-center gap-2 text-sm text-ink-400"><Clock className="h-4 w-4 text-primary-400" /> {project.duration}</div>
              <div className="flex items-center gap-2 text-sm text-ink-400"><Calendar className="h-4 w-4 text-primary-400" /> {project.year}</div>
            </div>
          </motion.div>
        </Container>
      </section>

      {project.image && (
        <Container className="-mt-14 lg:-mt-20 relative z-10">
          <div className="h-64 lg:h-96 w-full overflow-hidden rounded-3xl shadow-premium-lg">
            <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
          </div>
        </Container>
      )}

      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              <div>
                <h2 className="text-2xl font-bold text-ink-900 mb-4">Le projet</h2>
                <p className="text-lg text-ink-600 leading-relaxed">{project.description}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink-900 mb-4">Contexte</h2>
                <p className="text-ink-600 leading-relaxed">{project.problem}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink-900 mb-4">Solution</h2>
                <p className="text-ink-600 leading-relaxed">{project.solution}</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink-900 mb-6">Fonctionnalités</h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 p-4 rounded-xl border border-ink-100 bg-white">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600 text-xs font-bold">✓</div>
                      <span className="text-sm text-ink-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-ink-100 bg-white sticky top-24">
                <h3 className="text-lg font-bold text-ink-900 mb-5">Stack technique</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-xs font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg">{tech}</span>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-4">Services réalisés</h3>
                <ul className="space-y-2 mb-6">
                  {project.services.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-ink-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500" /> {s}
                    </li>
                  ))}
                </ul>
                <Button to="/quotation" fullWidth size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Démarrer un projet similaire
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-ink-50/50">
        <Container>
          <h2 className="text-3xl font-bold text-ink-900 mb-10">Résultats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.results.map((result, i) => (
              <motion.div
                key={result.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white border border-ink-100"
              >
                <div className="text-4xl font-extrabold font-display text-gradient">{result.value}</div>
                <div className="mt-2 text-sm text-ink-500">{result.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {otherProjects.length > 0 && (
        <section className="py-20">
          <Container>
            <h2 className="text-2xl font-bold text-ink-900 mb-8">Autres réalisations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((p) => (
                <Link key={p.id} to={`/projects/${p.slug}`} className="group p-6 rounded-2xl border border-ink-100 bg-white hover:shadow-premium transition-all">
                  <Badge variant="neutral" size="sm">{p.sector}</Badge>
                  <h3 className="text-xl font-bold text-ink-900 mt-3 mb-2 group-hover:text-primary-600 transition-colors">{p.name}</h3>
                  <p className="text-sm text-ink-500">{p.tagline}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaSection />
    </>
  );
}
