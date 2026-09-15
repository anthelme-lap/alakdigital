import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, FolderKanban, Wrench, Lightbulb, ArrowUpRight, Calendar, Eye,
  Users, BarChart3, Mail, FileCheck, Star, Award, Target, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/features/auth/presentation/contexts/auth_context';
import { useQuery } from '@tanstack/react-query';
import {
  fetchArticles, fetchProjects, fetchServices, fetchSolutions,
  fetchMessages, fetchQuotations, fetchTeam,
} from '@/features/content/infrastructure/content_api';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface StatCardProps {
  label: string; value: number; icon: typeof FileText; color: string; trend: string; to: string; delay: number;
}
function StatCard({ label, value, icon: Icon, color, trend, to, delay }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <Link to={to} className="block p-5 rounded-2xl border border-ink-100 bg-white hover:border-ink-200 hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div>
          <ArrowUpRight className="h-4 w-4 text-ink-300 group-hover:text-ink-600 transition-colors" />
        </div>
        <p className="text-3xl font-bold text-ink-900 mb-1">{value}</p>
        <p className="text-sm text-ink-500">{label}</p>
        <p className="text-xs font-medium text-ink-400 mt-2">{trend}</p>
      </Link>
    </motion.div>
  );
}

interface RecentRowProps {
  title: string; subtitle: string; badge: string; date?: string; to: string; delay: number;
}
function RecentRow({ title, subtitle, badge, date, to, delay }: RecentRowProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Link to={to} className="flex items-center gap-4 p-4 hover:bg-ink-50/50 transition-colors">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-ink-900 truncate">{title}</h4>
          <div className="flex items-center gap-3 mt-1 text-xs text-ink-400">
            <span className="px-2 py-0.5 rounded bg-ink-100 text-ink-600 font-medium">{badge}</span>
            <span>{subtitle}</span>
            {date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(date)}</span>}
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-300 flex-shrink-0" />
      </Link>
    </motion.div>
  );
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: articles = [] } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: fetchServices });
  const { data: solutions = [] } = useQuery({ queryKey: ['solutions'], queryFn: fetchSolutions });
  const { data: messages = [] } = useQuery({ queryKey: ['messages'], queryFn: fetchMessages });
  const { data: quotations = [] } = useQuery({ queryKey: ['quotations'], queryFn: fetchQuotations });
  const { data: team = [] } = useQuery({ queryKey: ['team'], queryFn: fetchTeam });

  const totalArticles = articles.length;
  const featuredArticles = articles.filter((a) => a.featured).length;
  const totalProjects = projects.length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const totalServices = services.length;
  const totalSolutions = solutions.length;
  const newMessages = messages.filter((m) => m.status === 'new').length;
  const newQuotations = quotations.filter((q) => q.status === 'new').length;

  const recentArticles = articles.slice(0, 3);
  const recentProjects = projects.slice(0, 3);

  const sections = [
    { label: 'Articles', to: '/admin/articles', icon: FileText, count: totalArticles },
    { label: 'Projets', to: '/admin/projects', icon: FolderKanban, count: totalProjects },
    { label: 'Services', to: '/admin/services', icon: Wrench, count: totalServices },
    { label: 'Solutions', to: '/admin/solutions', icon: Lightbulb, count: totalSolutions },
    { label: 'Équipe', to: '/admin/team', icon: Users, count: team.length },
    { label: 'Messages', to: '/admin/messages', icon: Mail, count: messages.length },
    { label: 'Devis', to: '/admin/quotations', icon: FileCheck, count: quotations.length },
    { label: 'Accueil', to: '/admin/homepage', icon: BarChart3, count: 0 },
  { label: 'À propos', to: '/admin/about-content', icon: Award, count: 0 },
    { label: 'Expertise', to: '/admin/expertise-content', icon: Target, count: 0 },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-ink-900 mb-1">Bonjour, {user?.name ?? 'Admin'}</h2>
        <p className="text-sm text-ink-500">Voici un aperçu de votre espace d'administration.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Articles" value={totalArticles} icon={FileText} color="bg-primary-50 text-primary-600" trend={`${featuredArticles} à la une`} to="/admin/articles" delay={0} />
        <StatCard label="Projets" value={totalProjects} icon={FolderKanban} color="bg-accent-50 text-accent-600" trend={`${featuredProjects} mis en avant`} to="/admin/projects" delay={0.08} />
        <StatCard label="Services" value={totalServices} icon={Wrench} color="bg-secondary-50 text-secondary-600" trend="Catalogue" to="/admin/services" delay={0.16} />
        <StatCard label="Solutions" value={totalSolutions} icon={Lightbulb} color="bg-green-50 text-green-600" trend="Métiers" to="/admin/solutions" delay={0.24} />
      </div>

      {(newMessages > 0 || newQuotations > 0) && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid sm:grid-cols-2 gap-4">
          {newMessages > 0 && (
            <Link to="/admin/messages" className="flex items-center gap-4 p-5 rounded-2xl border border-primary-200 bg-primary-50 hover:bg-primary-100 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white"><Mail className="h-5 w-5" /></div>
              <div className="flex-1"><p className="text-sm font-bold text-ink-900">{newMessages} nouveau{newMessages > 1 ? 'x' : ''} message{newMessages > 1 ? 's' : ''}</p><p className="text-xs text-ink-500">Cliquez pour consulter</p></div>
              <ArrowUpRight className="h-5 w-5 text-primary-600" />
            </Link>
          )}
          {newQuotations > 0 && (
            <Link to="/admin/quotations" className="flex items-center gap-4 p-5 rounded-2xl border border-secondary-200 bg-secondary-50 hover:bg-secondary-100 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-600 text-white"><FileCheck className="h-5 w-5" /></div>
              <div className="flex-1"><p className="text-sm font-bold text-ink-900">{newQuotations} nouvelle{newQuotations > 1 ? 's' : ''} demande{newQuotations > 1 ? 's' : ''} de devis</p><p className="text-xs text-ink-500">Cliquez pour consulter</p></div>
              <ArrowUpRight className="h-5 w-5 text-secondary-600" />
            </Link>
          )}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-ink-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><FileText className="h-5 w-5" /></div>
              <div><h3 className="text-lg font-bold text-ink-900">Articles récents</h3><p className="text-sm text-ink-500">Derniers articles du blog</p></div>
            </div>
            <Link to="/admin/articles" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">Voir tout <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          {recentArticles.length === 0 ? <div className="p-8 text-center text-ink-400 text-sm">Aucun article</div> : (
            <div className="divide-y divide-ink-100">
              {recentArticles.map((article, i) => <RecentRow key={article.id} title={article.title} subtitle={article.author} badge={article.category} date={article.date} to="/admin/articles" delay={0.3 + i * 0.08} />)}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-ink-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600"><FolderKanban className="h-5 w-5" /></div>
              <div><h3 className="text-lg font-bold text-ink-900">Projets récents</h3><p className="text-sm text-ink-500">Derniers projets réalisés</p></div>
            </div>
            <Link to="/admin/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:text-accent-700 transition-colors">Voir tout <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          {recentProjects.length === 0 ? <div className="p-8 text-center text-ink-400 text-sm">Aucun projet</div> : (
            <div className="divide-y divide-ink-100">
              {recentProjects.map((project, i) => <RecentRow key={project.id} title={project.name} subtitle={project.client} badge={project.sector} to="/admin/projects" delay={0.35 + i * 0.08} />)}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="rounded-2xl border border-ink-100 bg-white p-6">
        <h3 className="text-lg font-bold text-ink-900 mb-4">Accès rapide</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {sections.map((section) => (
            <Link key={section.to} to={section.to} className="flex items-center gap-3 p-4 rounded-xl border border-ink-100 hover:border-ink-200 hover:bg-ink-50/50 transition-all group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-ink-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                <section.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0"><p className="text-sm font-semibold text-ink-900">{section.label}</p><p className="text-xs text-ink-400">{section.count} entrée{section.count > 1 ? 's' : ''}</p></div>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="p-6 rounded-2xl border border-ink-100 bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10"><Eye className="h-6 w-6 text-white" /></div>
          <div className="flex-1"><h3 className="font-bold text-white">Voir le site public</h3><p className="text-sm text-ink-300">Consultez le rendu public de vos contenus</p></div>
          <Link to="/" className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold text-white transition-all">Ouvrir <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </motion.div>
    </div>
  );
}
