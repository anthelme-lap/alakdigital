import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'neutral' | 'dark' | 'success';
type Size = 'sm' | 'md';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
  accent: 'bg-accent-50 text-accent-700 border-accent-200',
  neutral: 'bg-ink-100 text-ink-700 border-ink-200',
  dark: 'bg-ink-900 text-white border-ink-900',
  success: 'bg-green-50 text-green-700 border-green-200',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-[11px] px-2.5 py-1 rounded-md',
  md: 'text-xs px-3 py-1.5 rounded-lg',
};

interface BadgeProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'primary', size = 'md', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-semibold tracking-wide uppercase ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
