import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageLoadingStore } from '@/shared/hooks/use_page_loading_store';

/** Signale un chargement pendant au moins la duree d'une transition de route,
 * meme quand la page visee est deja en cache (pas de chunk a telecharger). */
export function RouteChangeProgress() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    usePageLoadingStore.getState().start();
    const timeout = window.setTimeout(() => {
      usePageLoadingStore.getState().finish();
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  return null;
}

export function PageProgressBar() {
  const loading = usePageLoadingStore((s) => s.loading);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    let hideTimeout: number | undefined;

    if (loading) {
      setVisible(true);
      setCompleting(false);
      setProgress(15);
      interval = window.setInterval(() => {
        setProgress((p) => (p < 85 ? p + (85 - p) * 0.15 : p));
      }, 200);
    } else {
      setProgress(100);
      setCompleting(true);
      hideTimeout = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
        setCompleting(false);
      }, 400);
    }

    return () => {
      if (interval) window.clearInterval(interval);
      if (hideTimeout) window.clearTimeout(hideTimeout);
    };
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-[3px] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 shadow-[0_0_8px_rgba(253,50,12,0.5)]"
        style={{
          width: `${progress}%`,
          opacity: completing ? 0 : 1,
          transition: completing ? 'width 200ms ease-out, opacity 300ms ease-out 150ms' : 'width 300ms ease-out',
        }}
      />
    </div>
  );
}
