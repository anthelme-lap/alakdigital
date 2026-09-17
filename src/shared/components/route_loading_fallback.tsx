import { useEffect } from 'react';
import { FullPageLoader } from '@/shared/ui';
import { usePageLoadingStore } from '@/shared/hooks/use_page_loading_store';

/** Fallback de Suspense pour les routes lazy : signale le chargement du
 * chunk a la barre de progression globale en plus d'afficher le loader. */
export function RouteLoadingFallback() {
  useEffect(() => {
    usePageLoadingStore.getState().start();
    return () => usePageLoadingStore.getState().finish();
  }, []);

  return <FullPageLoader />;
}
