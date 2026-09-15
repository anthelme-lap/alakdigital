import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FormDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
}

export function FormDrawer({ open, onClose, title, subtitle, children, footer }: FormDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-ink-50 z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100 bg-white">
              <div>
                <h2 className="text-lg font-bold text-ink-900">{title}</h2>
                {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-ink-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {children}
            </div>

            <div className="px-6 py-4 border-t border-ink-100 bg-white flex items-center gap-3">
              {footer}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function DrawerField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-2">
        {label}
        {required && <span className="text-primary-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

export const drawerInputClass =
  'w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';
export const drawerTextareaClass = drawerInputClass.replace('h-11 ', '');
