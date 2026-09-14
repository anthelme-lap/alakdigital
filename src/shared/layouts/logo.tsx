interface LogoProps {
  dark?: boolean;
  className?: string;
}

export function Logo({ dark = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="36"
        height="36"
        className="rounded-xl shadow-lg flex-shrink-0"
        role="img"
        aria-label="ALAK Digital"
      >
        <rect width="64" height="64" rx="14" fill="#0f172a" />
        <path d="M16 46V18h6l10 16V18h6v28h-6L22 30v16h-6z" fill="#3186fc" />
        <circle cx="44" cy="22" r="4" fill="#14b8a6" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className={`font-display text-base font-extrabold tracking-tight ${dark ? 'text-white' : 'text-ink-900'}`}>
          ALAK
        </span>
        <span className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${dark ? 'text-ink-300' : 'text-ink-400'}`}>
          Digital
        </span>
      </div>
    </div>
  );
}
