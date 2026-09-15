import { useQuery } from '@tanstack/react-query';
import { Section, SectionHeading } from '@/shared/ui';
import { StaggerContainer, StaggerItem } from '@/shared/components/reveal';
import { fetchWhyUs } from '@/features/content/infrastructure/content_api';
import * as Icons from 'lucide-react';

export function WhyUsSection() {
  const { data: reasons = [] } = useQuery({ queryKey: ['whyUs'], queryFn: fetchWhyUs });

  if (reasons.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="Pourquoi ALAK DIGITAL"
        title="Pourquoi choisir ALAK DIGITAL ?"
        subtitle="Nous combinons expertise technique, vision produit et accompagnement pour livrer des solutions qui font la différence."
      />

      <StaggerContainer className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((reason) => {
          const Icon = (Icons as unknown as Record<string, typeof Icons.Layers>)[reason.icon] ?? Icons.Layers;
          return (
            <StaggerItem key={reason.id}>
              <div className="group h-full p-8 rounded-2xl border border-ink-100 bg-white hover:shadow-premium transition-all duration-500">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-2">{reason.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{reason.description}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </Section>
  );
}
