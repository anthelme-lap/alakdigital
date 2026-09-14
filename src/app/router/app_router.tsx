import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/shared/layouts';
import { FullPageLoader } from '@/shared/ui';

const HomePage = lazy(() => import('@/features/home/presentation/pages/home_page').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('@/features/about/presentation/pages/about_page').then((m) => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('@/features/services/presentation/pages/services_page').then((m) => ({ default: m.ServicesPage })));
const ProjectsPage = lazy(() => import('@/features/projects/presentation/pages/projects_page').then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('@/features/projects/presentation/pages/project_detail_page').then((m) => ({ default: m.ProjectDetailPage })));
const SolutionsPage = lazy(() => import('@/features/solutions/presentation/pages/solutions_page').then((m) => ({ default: m.SolutionsPage })));
const ExpertisePage = lazy(() => import('@/features/expertise/presentation/pages/expertise_page').then((m) => ({ default: m.ExpertisePage })));
const BlogPage = lazy(() => import('@/features/blog/presentation/pages/blog_page').then((m) => ({ default: m.BlogPage })));
const ArticleDetailPage = lazy(() => import('@/features/blog/presentation/pages/blog_page').then((m) => ({ default: m.ArticleDetailPage })));
const ContactPage = lazy(() => import('@/features/contact/presentation/pages/contact_page').then((m) => ({ default: m.ContactPage })));
const QuotationPage = lazy(() => import('@/features/quotation/presentation/pages/quotation_page').then((m) => ({ default: m.QuotationPage })));
const NotFoundPage = lazy(() => import('@/features/home/presentation/pages/not_found_page').then((m) => ({ default: m.NotFoundPage })));

export function AppRouter() {
  return (
    <MainLayout>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/expertise" element={<ExpertisePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<ArticleDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/quotation" element={<QuotationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}
