interface LogoProps {
  dark?: boolean;
  className?: string;
}

export function Logo({ dark = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 shadow-lg">
        <span className="font-display text-lg font-extrabold text-white">A</span>
        <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-secondary-500 ring-2 ring-white" />
      </div>
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
