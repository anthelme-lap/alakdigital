import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, y = 30, className = '' }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerContainer({ children, className = '', delay = 0 }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  dark?: boolean;
}

export function FeatureCard({ icon: Icon, title, description, dark = false }: FeatureCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={`group relative p-6 rounded-2xl border transition-all duration-500 ${
        dark
          ? 'bg-white/5 border-white/10 hover:bg-white/10'
          : 'bg-white border-ink-100 hover:border-primary-200 hover:shadow-premium'
      }`}
    >
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${
        dark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white'
      }`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-ink-900'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${dark ? 'text-ink-400' : 'text-ink-500'}`}>{description}</p>
    </motion.div>
  );
}
