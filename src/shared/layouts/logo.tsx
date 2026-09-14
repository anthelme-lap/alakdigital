interface LogoProps {
  dark?: boolean;
  className?: string;
}

export function Logo({ dark = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/alak_1.png"
        alt="ALAK Digital"
        width="36"
        height="36"
        className="h-9 w-9 rounded-xl object-cover flex-shrink-0"
      />
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
