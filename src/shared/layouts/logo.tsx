interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <img
      src="/alak_1.png"
      alt="ALAK Digital"
      width="48"
      height="48"
      className={`h-12 w-12 rounded-xl object-cover flex-shrink-0 ${className}`}
    />
  );
}
