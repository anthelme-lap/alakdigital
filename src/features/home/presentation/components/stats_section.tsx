import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Section } from '@/shared/ui';
import { useCountUp } from '@/shared/hooks/use_ui';
import { fetchStats } from '@/features/content/infrastructure/content_api';

export function StatsSection() {
  const { data: stats = [] } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <Section className="py-16 lg:py-20">
      <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
        {stats.map((stat, i) => (
          <StatItem key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} start={inView} delay={i * 100} />
        ))}
      </div>
    </Section>
  );
}

function StatItem({ value, suffix, label, start, delay }: { value: number; suffix: string; label: string; start: boolean; delay: number }) {
  const count = useCountUp(value, 1500, start);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={start ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="text-center"
    >
      <div className="text-4xl lg:text-5xl font-extrabold font-display text-ink-900">
        {count}
        <span className="text-primary-500">{suffix}</span>
      </div>
      <div className="mt-2 text-sm text-ink-400 font-medium">{label}</div>
    </motion.div>
  );
}
