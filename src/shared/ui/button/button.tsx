import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 shadow-lg shadow-secondary-600/20 hover:shadow-secondary-600/30',
  outline: 'border border-ink-300 text-ink-800 hover:border-ink-800 hover:bg-ink-50 bg-transparent',
  ghost: 'text-ink-700 hover:bg-ink-100 bg-transparent',
  white: 'bg-white text-ink-900 hover:bg-ink-100 shadow-lg shadow-black/10',
  dark: 'bg-ink-900 text-white hover:bg-ink-800 shadow-lg shadow-ink-900/20',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-6 text-sm rounded-xl gap-2',
  lg: 'h-14 px-8 text-base rounded-xl gap-2.5',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

type ButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { to?: undefined };
type AnchorProps = BaseProps & Omit<LinkProps, keyof BaseProps> & { to: string };

const baseClass =
  'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 whitespace-nowrap';

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | AnchorProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      className = '',
      ...rest
    } = props;

    const classes = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

    const content = (
      <>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {rightIcon}
      </>
    );

    if ('to' in props && props.to !== undefined) {
      const { to, ...linkRest } = rest as Omit<AnchorProps, keyof BaseProps>;
      return (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} to={to} className={classes} {...linkRest}>
          {content}
        </Link>
      );
    }

    const buttonRest = rest as Omit<ButtonProps, keyof BaseProps>;
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} disabled={loading || buttonRest.disabled} {...buttonRest}>
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
