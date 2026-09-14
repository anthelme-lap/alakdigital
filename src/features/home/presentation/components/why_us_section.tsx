import { Layers, TrendingUp, Target, Sparkles, LifeBuoy } from 'lucide-react';
import { Section, SectionHeading } from '@/shared/ui';
import { StaggerContainer, StaggerItem } from '@/shared/components/reveal';

const reasons = [
  {
    icon: Layers,
    title: 'Expertise complète',
    desc: 'Un seul partenaire pour le web, mobile, backend et infrastructure. Plus besoin de coordonner plusieurs prestataires.',
  },
  {
    icon: TrendingUp,
    title: 'Architecture évolutive',
    desc: 'Les solutions sont conçues pour évoluer avec votre croissance, sans refonte majeure.',
  },
  {
    icon: Target,
    title: 'Vision produit',
    desc: 'Nous construisons des produits, pas seulement des écrans. Chaque décision technique sert vos objectifs métier.',
  },
  {
    icon: Sparkles,
    title: 'Approche sur mesure',
    desc: 'Chaque projet répond à un besoin concret. Pas de template, pas de solution générique.',
  },
  {
    icon: LifeBuoy,
    title: 'Accompagnement',
    desc: 'Nous accompagnons le client avant et après le lancement. La maintenance et l\'évolution font partie du service.',
  },
];

export function WhyUsSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Pourquoi ALAK DIGITAL"
        title="Pourquoi choisir ALAK DIGITAL ?"
        subtitle="Nous combinons expertise technique, vision produit et accompagnement pour livrer des solutions qui font la différence."
      />

      <StaggerContainer className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((reason) => (
          <StaggerItem key={reason.title}>
            <div className="group h-full p-8 rounded-2xl border border-ink-100 bg-white hover:shadow-premium transition-all duration-500">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/20">
                <reason.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-ink-900 mb-2">{reason.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{reason.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
