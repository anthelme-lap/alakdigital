import { motion } from 'framer-motion';
import { Code2, Smartphone, Server, Database, Cloud, Cpu, GitBranch, Shield } from 'lucide-react';
import { Container, Section, SectionHeading, Badge } from '@/shared/ui';
import { CtaSection } from '@/shared/components/cta_section';
import { StaggerContainer, StaggerItem } from '@/shared/components/reveal';

const expertise = [
  {
    icon: Code2,
    label: 'Frontend',
    desc: 'Des interfaces modernes, performantes et accessibles.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    icon: Smartphone,
    label: 'Mobile',
    desc: 'Des applications natives et cross-platform fluides.',
    technologies: ['Flutter', 'Dart', 'Android', 'iOS'],
  },
  {
    icon: Server,
    label: 'Backend',
    desc: 'Des API robustes et une architecture logicielle solide.',
    technologies: ['FastAPI', 'Laravel', 'Python', 'PHP', 'Node.js'],
  },
  {
    icon: Database,
    label: 'Data',
    desc: 'Des bases de données optimisées et fiables.',
    technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
  },
  {
    icon: Cloud,
    label: 'Infrastructure',
    desc: 'Déploiement, conteneurisation et orchestration.',
    technologies: ['Docker', 'Nginx', 'VPS', 'Cloud', 'Linux'],
  },
  {
    icon: GitBranch,
    label: 'CI/CD',
    desc: 'Automatisation du build, test et déploiement.',
    technologies: ['GitHub Actions', 'CI/CD Pipelines', 'Automated Testing'],
  },
  {
    icon: Shield,
    label: 'Sécurité',
    desc: 'Authentification, chiffrement et bonnes pratiques.',
    technologies: ['JWT', 'OAuth2', 'SSL/TLS', 'CORS', 'Rate Limiting'],
  },
  {
    icon: Cpu,
    label: 'Architecture',
    desc: 'Clean Architecture, microservices et design patterns.',
    technologies: ['Clean Architecture', 'DDD', 'Microservices', 'API REST', 'SaaS Multi-tenant'],
  },
];

export function ExpertisePage() {
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
          {expertise.map((item) => (
            <StaggerItem key={item.label}>
              <div className="group h-full p-8 rounded-2xl border border-ink-100 bg-white hover:shadow-premium transition-all duration-500">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-ink-900 mb-2">{item.label}</h3>
                    <p className="text-sm text-ink-500 leading-relaxed mb-4">{item.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <span key={tech} className="text-xs font-medium text-ink-600 bg-ink-50 px-2.5 py-1 rounded-md">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      <CtaSection />
    </>
  );
}
