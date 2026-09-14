import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  className?: string;
}

export function Loader({ size = 24, className = '' }: LoaderProps) {
  return <Loader2 className={`animate-spin text-primary-500 ${className}`} style={{ width: size, height: size }} />;
}

export function FullPageLoader({ label = 'Chargement...' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Loader size={32} />
      <p className="text-sm text-ink-400">{label}</p>
    </div>
  );
}
