import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const fieldClasses =
  'w-full rounded-xl border bg-white px-4 text-sm text-ink-900 placeholder:text-ink-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-ink-50 disabled:text-ink-500';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${fieldClasses} h-12 ${error ? 'border-red-400 focus:border-red-500' : 'border-ink-200 focus:border-primary-500'} ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`${fieldClasses} py-3 ${error ? 'border-red-400 focus:border-red-500' : 'border-ink-200 focus:border-primary-500'} ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`${fieldClasses} h-12 ${error ? 'border-red-400 focus:border-red-500' : 'border-ink-200 focus:border-primary-500'} ${className}`}
          {...props}
        >
          <option value="">Sélectionnez...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';
