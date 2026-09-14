import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { Footer } from './footer';
import { ScrollToTop } from './scroll_to_top';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-20"><Outlet /></main>
      <Footer />
    </div>
  );
}
