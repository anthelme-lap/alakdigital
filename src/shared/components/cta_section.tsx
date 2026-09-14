import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container, Button } from '@/shared/ui';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 grid-bg-dark opacity-30" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-primary-600/20 blur-[100px]" />
      <div className="absolute -bottom-40 right-0 h-80 w-[400px] rounded-full bg-secondary-600/15 blur-[100px]" />

      <Container>
        <div className="relative py-24 lg:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-4">
              Parons-en
            </p>
            <h2 className="text-display-md font-bold text-balance">
              Vous avez un projet digital ?
              <br />
              <span className="text-gradient-light">Parlons-en.</span>
            </h2>
            <p className="mt-6 text-lg text-ink-300 leading-relaxed max-w-2xl mx-auto">
              Expliquez-nous votre besoin et construisons ensemble une solution adaptée à vos
              objectifs.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/quotation" variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Démarrer mon projet
              </Button>
              <Button to="/contact" variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:border-white/40" leftIcon={<MessageCircle className="h-5 w-5" />}>
                Nous contacter
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
