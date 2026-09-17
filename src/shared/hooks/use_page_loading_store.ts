import { create } from 'zustand';

interface PageLoadingState {
  count: number;
  loading: boolean;
  start: () => void;
  finish: () => void;
}

/**
 * Compteur plutot que booleen : plusieurs sources (changement de route,
 * chargement d'un chunk lazy) peuvent signaler un chargement en parallele.
 * La barre ne doit disparaitre que quand la derniere source a fini.
 */
export const usePageLoadingStore = create<PageLoadingState>((set) => ({
  count: 0,
  loading: false,
  start: () => set((s) => ({ count: s.count + 1, loading: true })),
  finish: () =>
    set((s) => {
      const count = Math.max(0, s.count - 1);
      return { count, loading: count > 0 };
    }),
}));
