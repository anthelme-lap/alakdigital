import type { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { ScrollToTop } from './scroll_to_top';

interface LayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
