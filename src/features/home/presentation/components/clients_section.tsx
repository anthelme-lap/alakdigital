import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchClients } from '@/features/content/infrastructure/content_api';

export function ClientsSection() {
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: fetchClients });
  const names = clients.map((c) => c.name);

  if (names.length === 0) return null;

  return (
    <section className="border-y border-ink-100 bg-ink-50/50 py-12">
      <div className="mx-auto max-w-8xl container-px">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-ink-400 mb-8">
          Ils nous font confiance
        </p>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex items-center gap-16"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {[...names, ...names].map((client, i) => (
              <div
                key={i}
                className="flex-shrink-0 text-xl font-display font-bold text-ink-300 hover:text-ink-600 transition-colors duration-300 whitespace-nowrap"
              >
                {client}
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink-50 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink-50 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
