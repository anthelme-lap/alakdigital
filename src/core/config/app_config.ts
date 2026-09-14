export const APP_CONFIG = {
  name: 'ALAK DIGITAL',
  tagline: 'Software Studio & Digital Partner',
  url: 'https://alak-digital.com',
  email: 'contact@alak-digital.com',
  phone: '+225 07 00 00 00 00',
  whatsapp: '+225 07 00 00 00 00',
  address: 'Abidjan, Côte d\'Ivoire',
  social: {
    linkedin: 'https://linkedin.com/company/alak-digital',
    facebook: 'https://facebook.com/alakdigital',
    instagram: 'https://instagram.com/alakdigital',
    github: 'https://github.com/alak-digital',
  },
} as const;

export const NAV_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Réalisations', to: '/projects' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Expertise', to: '/expertise' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
] as const;

export const API_BASE_URL = '/api' as const;
