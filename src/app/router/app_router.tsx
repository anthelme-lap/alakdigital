import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/shared/layouts';
import { FullPageLoader } from '@/shared/ui';
import { ProtectedRoute } from '@/features/auth/presentation/components/protected_route';
import { AdminLayout } from '@/features/admin/presentation/layouts/admin_layout';

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

const LoginPage = lazy(() => import('@/features/auth/presentation/pages/login_page').then((m) => ({ default: m.LoginPage })));
const AdminDashboardPage = lazy(() => import('@/features/admin/presentation/pages/admin_dashboard_page').then((m) => ({ default: m.AdminDashboardPage })));
const AdminArticlesPage = lazy(() => import('@/features/admin/presentation/pages/admin_articles_page').then((m) => ({ default: m.AdminArticlesPage })));
const AdminProjectsPage = lazy(() => import('@/features/admin/presentation/pages/admin_projects_page').then((m) => ({ default: m.AdminProjectsPage })));
const AdminServicesPage = lazy(() => import('@/features/admin/presentation/pages/admin_services_page').then((m) => ({ default: m.AdminServicesPage })));
const AdminSolutionsPage = lazy(() => import('@/features/admin/presentation/pages/admin_solutions_page').then((m) => ({ default: m.AdminSolutionsPage })));
const AdminTeamPage = lazy(() => import('@/features/admin/presentation/pages/admin_team_page').then((m) => ({ default: m.AdminTeamPage })));
const AdminValuesPage = lazy(() => import('@/features/admin/presentation/pages/admin_values_page').then((m) => ({ default: m.AdminValuesPage })));
const AdminExpertiseContentPage = lazy(() => import('@/features/admin/presentation/pages/admin_expertise_content_page').then((m) => ({ default: m.AdminExpertiseContentPage })));
const AdminMessagesPage = lazy(() => import('@/features/admin/presentation/pages/admin_messages_page').then((m) => ({ default: m.AdminMessagesPage })));
const AdminQuotationsPage = lazy(() => import('@/features/admin/presentation/pages/admin_quotations_page').then((m) => ({ default: m.AdminQuotationsPage })));
const AdminHomepagePage = lazy(() => import('@/features/admin/presentation/pages/admin_homepage_page').then((m) => ({ default: m.AdminHomepagePage })));
const AdminAboutContentPage = lazy(() => import('@/features/admin/presentation/pages/admin_about_content_page').then((m) => ({ default: m.AdminAboutContentPage })));
const AdminUsersPage = lazy(() => import('@/features/admin/presentation/pages/admin_users_page').then((m) => ({ default: m.AdminUsersPage })));
const ProfilePage = lazy(() => import('@/features/profile/presentation/pages/profile_page').then((m) => ({ default: m.ProfilePage })));

export function AppRouter() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="solutions" element={<AdminSolutionsPage />} />
          <Route path="team" element={<AdminTeamPage />} />
          <Route path="values" element={<AdminValuesPage />} />
          <Route path="expertise-content" element={<AdminExpertiseContentPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="quotations" element={<AdminQuotationsPage />} />
          <Route path="homepage" element={<AdminHomepagePage />} />
          <Route path="about-content" element={<AdminAboutContentPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="users"
            element={
              <ProtectedRoute requireRole="superadmin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<MainLayout />}>
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
        </Route>
      </Routes>
    </Suspense>
  );
}
