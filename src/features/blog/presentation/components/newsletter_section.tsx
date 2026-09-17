import { Linkedin, Facebook, Instagram, Github } from 'lucide-react';
import { Container } from '@/shared/ui';
import { APP_CONFIG } from '@/core/config/app_config';

export const blogSocials = [
  { Icon: Linkedin, href: APP_CONFIG.social.linkedin, label: 'LinkedIn' },
  { Icon: Facebook, href: APP_CONFIG.social.facebook, label: 'Facebook' },
  { Icon: Instagram, href: APP_CONFIG.social.instagram, label: 'Instagram' },
  { Icon: Github, href: APP_CONFIG.social.github, label: 'GitHub' },
];

export function NewsletterSection() {
  return (
    <section className="bg-white py-16 border-t border-ink-100">
      <Container size="narrow">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-ink-900">
            Abonnez-vous à <span className="text-primary-600">ALAK</span> Digital
          </h2>
          <p className="text-sm text-ink-500 mt-3">
            Recevez nos derniers articles directement dans votre boîte mail.
          </p>
          <form className="flex flex-col sm:flex-row mt-7 gap-3 sm:gap-0" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 h-12 px-5 rounded-xl sm:rounded-r-none border border-ink-200 bg-ink-50 outline-none focus:border-primary-400 text-sm"
            />
            <button
              type="submit"
              className="h-12 px-8 rounded-xl sm:rounded-l-none bg-ink-900 text-white text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              S'abonner
            </button>
          </form>
          <div className="flex justify-center gap-5 mt-7 text-ink-400">
            {blogSocials.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-primary-600 transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
