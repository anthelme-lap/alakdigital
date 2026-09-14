import { motion } from 'framer-motion';
import { Search, Compass, PenTool, Code, CheckCircle, Rocket, LifeBuoy } from 'lucide-react';
import { Section, SectionHeading } from '@/shared/ui';

const steps = [
  { num: '01', icon: Search, title: 'Analyse', desc: 'Compréhension du besoin et des objectifs.' },
  { num: '02', icon: Compass, title: 'Cadrage', desc: 'Fonctionnalités, contraintes, utilisateurs et architecture.' },
  { num: '03', icon: PenTool, title: 'UX/UI', desc: "Conception de l'expérience et des interfaces." },
  { num: '04', icon: Code, title: 'Développement', desc: 'Développement frontend, backend et mobile.' },
  { num: '05', icon: CheckCircle, title: 'Tests', desc: 'Tests fonctionnels, techniques et de performance.' },
  { num: '06', icon: Rocket, title: 'Déploiement', desc: 'Mise en production et infrastructure.' },
  { num: '07', icon: LifeBuoy, title: 'Suivi', desc: 'Maintenance et évolutions.' },
];

export function MethodologySection() {
  return (
    <Section className="bg-ink-50/50">
      <SectionHeading
        center
        eyebrow="Méthodologie"
        title="De l'idée à la mise en production"
        subtitle="Un processus structuré en 7 étapes pour transformer votre vision en produit digital fiable et performant."
      />

      <div className="mt-16 relative">
        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary-200 to-transparent" />

        <div className="space-y-4 lg:space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`relative lg:grid lg:grid-cols-2 lg:gap-16 ${i % 2 === 0 ? '' : ''}`}
            >
              <div className={`lg:flex lg:items-center ${i % 2 === 0 ? 'lg:justify-end' : 'lg:order-2'}`}>
                <div className={`group flex items-start gap-5 p-6 rounded-2xl bg-white border border-ink-100 hover:border-primary-200 hover:shadow-premium transition-all duration-300 max-w-md ${i % 2 === 0 ? 'lg:text-right lg:flex-row-reverse' : ''}`}>
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary-500 font-mono mb-1">{step.num}</div>
                    <h3 className="text-lg font-bold text-ink-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-ink-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex lg:items-center lg:justify-center">
                <div className="h-4 w-4 rounded-full bg-white border-4 border-primary-500 shadow-glow relative z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
