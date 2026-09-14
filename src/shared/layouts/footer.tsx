import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Instagram, Github, MessageCircle, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { APP_CONFIG } from '@/core/config/app_config';
import { Logo } from './logo';

const footerLinks = {
  Entreprise: [
    { label: 'À propos', to: '/about' },
    { label: 'Réalisations', to: '/projects' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ],
  Services: [
    { label: 'Développement Web', to: '/services' },
    { label: 'Applications Mobiles', to: '/services' },
    { label: 'Plateformes SaaS', to: '/services' },
    { label: 'API & Backend', to: '/services' },
    { label: 'DevOps & Cloud', to: '/services' },
  ],
  Solutions: [
    { label: 'Nos produits', to: '/solutions' },
    { label: 'Plateformes métiers', to: '/solutions' },
    { label: 'Demande de devis', to: '/quotation' },
  ],
  Légal: [
    { label: 'Mentions légales', to: '/' },
    { label: 'Confidentialité', to: '/' },
  ],
};

const socialLinks = [
  { Icon: Linkedin, href: APP_CONFIG.social.linkedin, label: 'LinkedIn' },
  { Icon: Facebook, href: APP_CONFIG.social.facebook, label: 'Facebook' },
  { Icon: Instagram, href: APP_CONFIG.social.instagram, label: 'Instagram' },
  { Icon: Github, href: APP_CONFIG.social.github, label: 'GitHub' },
  { Icon: MessageCircle, href: `https://wa.me/${APP_CONFIG.whatsapp.replace(/\s/g, '')}`, label: 'WhatsApp' },
];

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="grid-bg-dark absolute inset-0 opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-8xl container-px py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-5">
              <Logo dark />
            </div>
            <p className="text-sm leading-relaxed text-ink-400 max-w-sm">
              Conception et développement de solutions digitales performantes pour les entreprises et
              organisations. Du produit à l'infrastructure.
            </p>
            <div className="mt-6 space-y-2.5">
              <a href={`mailto:${APP_CONFIG.email}`} className="flex items-center gap-3 text-sm text-ink-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-primary-400" /> {APP_CONFIG.email}
              </a>
              <a href={`tel:${APP_CONFIG.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-ink-400 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-primary-400" /> {APP_CONFIG.phone}
              </a>
              <p className="flex items-center gap-3 text-sm text-ink-400">
                <MapPin className="h-4 w-4 text-primary-400" /> {APP_CONFIG.address}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-ink-400 hover:text-white transition-colors link-underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} {APP_CONFIG.name}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-ink-400 hover:bg-primary-600 hover:text-white transition-all duration-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { ArrowUpRight };
