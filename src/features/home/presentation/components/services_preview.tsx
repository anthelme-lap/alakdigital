import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading } from '@/shared/ui';
import { Reveal, StaggerContainer, StaggerItem } from '@/shared/components/reveal';
import { useServices } from '@/features/services/presentation/queries/use_services';
import { getServiceIcon } from '@/features/services/domain/entities/service';

export function ServicesPreview() {
  const { data: services } = useServices();

  if (!services || services.length === 0) return null;

  return (
    <Section>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
        <SectionHeading
          eyebrow="Nos services"
          title="Une expertise complète, du produit à l'infrastructure"
          subtitle="Nous couvrons toute la chaîne digitale: conception, design, développement, backend, mobile, infrastructure et déploiement."
        />
        <Link
          to="/services"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex-shrink-0"
        >
          Tous les services
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => {
          const Icon = getServiceIcon(service.icon);
          return (
            <StaggerItem key={service.id}>
              <Link
                to="/services"
                className="group block h-full p-8 rounded-2xl border border-ink-100 bg-white hover:border-primary-200 hover:shadow-premium transition-all duration-500"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-ink-900 mb-2">{service.name}</h3>
                <p className="text-sm text-ink-500 leading-relaxed mb-5">{service.tagline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {service.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[11px] font-medium text-ink-500 bg-ink-50 px-2.5 py-1 rounded-md">
                      {tech}
                    </span>
                  ))}
                  {service.technologies.length > 3 && (
                    <span className="text-[11px] font-medium text-ink-400 px-2.5 py-1">
                      +{service.technologies.length - 3}
                    </span>
                  )}
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </Section>
  );
}
