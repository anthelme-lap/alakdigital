import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

const sizeClasses = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
};

export function Container({ children, className = '', size = 'default' }: ContainerProps) {
  return <div className={`mx-auto w-full ${sizeClasses[size]} container-px ${className}`}>{children}</div>;
}
