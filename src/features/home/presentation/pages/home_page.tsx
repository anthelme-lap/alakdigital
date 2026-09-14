import { Hero } from '../components/hero';
import { ClientsSection } from '../components/clients_section';
import { ServicesPreview } from '../components/services_preview';
import { ExpertiseSection } from '../components/expertise_section';
import { MethodologySection } from '../components/methodology_section';
import { ProjectsPreview } from '../components/projects_preview';
import { WhyUsSection } from '../components/why_us_section';
import { StatsSection } from '../components/stats_section';
import { CtaSection } from '@/shared/components/cta_section';

export function HomePage() {
  return (
    <>
      <Hero />
      <ClientsSection />
      <ServicesPreview />
      <ExpertiseSection />
      <MethodologySection />
      <ProjectsPreview />
      <StatsSection />
      <WhyUsSection />
      <CtaSection />
    </>
  );
}
