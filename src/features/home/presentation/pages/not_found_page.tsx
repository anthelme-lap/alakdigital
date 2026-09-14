import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Container, Button } from '@/shared/ui';

export function NotFoundPage() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-ink-900 text-white">
      <div className="absolute inset-0 grid-bg-dark opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary-600/15 blur-[120px]" />
      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto">
          <div className="text-[120px] lg:text-[180px] font-display font-extrabold leading-none text-gradient-light">404</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mt-4 mb-4">Page introuvable</h1>
          <p className="text-ink-400 leading-relaxed mb-10 max-w-md mx-auto">
            La page que vous recherchez n'existe pas ou a été déplacée. Revenons à l'accueil.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/" variant="primary" size="lg" leftIcon={<Home className="h-5 w-5" />}>Retour à l'accueil</Button>
            <Button to="/contact" variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:border-white/40" leftIcon={<ArrowLeft className="h-5 w-5" />}>Nous contacter</Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
