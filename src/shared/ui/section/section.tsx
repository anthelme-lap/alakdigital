import type { ReactNode } from 'react';
import { Container } from '@/shared/ui/container/container';
import { Badge } from '@/shared/ui/badge/badge';

interface SectionProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export function Section({ children, className = '', dark = false, id, size = 'default' }: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${dark ? 'bg-ink-900 text-white' : ''} ${className}`}>
      <Container size={size}>{children}</Container>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  dark = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`${center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <div className={`mb-4 ${center ? 'flex justify-center' : ''}`}>
          <Badge variant={dark ? 'dark' : 'primary'} size="sm">
            {eyebrow}
          </Badge>
        </div>
      )}
      <h2 className={`text-display-sm font-bold text-balance ${dark ? 'text-white' : 'text-ink-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-ink-300' : 'text-ink-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
