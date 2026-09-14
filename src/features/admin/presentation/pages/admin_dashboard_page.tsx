import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  Users,
  Eye,
  ArrowUpRight,
  Clock,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/features/auth/presentation/contexts/auth_context';
import { useArticles } from '@/features/blog/presentation/queries/use_articles';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: articles, isLoading } = useArticles();

  const totalArticles = articles?.length ?? 0;
  const publishedArticles = articles?.filter((a) => !a.tags.includes('draft'))?.length ?? 0;
  const featuredArticles = articles?.filter((a) => a.featured)?.length ?? 0;
  const categories = new Set(articles?.map((a) => a.category));
  const recentArticles = articles?.slice(0, 5) ?? [];

  const stats = [
    {
      label: 'Articles publiés',
      value: publishedArticles,
      icon: FileText,
      color: 'bg-primary-50 text-primary-600',
      trend: '+2 ce mois',
    },
    {
      label: 'Articles à la une',
      value: featuredArticles,
      icon: TrendingUp,
      color: 'bg-accent-50 text-accent-600',
      trend: 'Mis en avant',
    },
    {
      label: 'Catégories',
      value: categories.size,
      icon: Eye,
      color: 'bg-secondary-50 text-secondary-600',
      trend: 'Diversifié',
    },
    {
      label: 'Total articles',
      value: totalArticles,
      icon: Users,
      color: 'bg-ink-100 text-ink-600',
      trend: 'Base de contenu',
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-ink-900 mb-1">
          Bonjour, {user?.email?.split('@')[0] ?? 'Admin'}
        </h2>
        <p className="text-sm text-ink-500">Voici un aperçu de votre espace d'administration.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="p-5 rounded-2xl border border-ink-100 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-ink-400">{stat.trend}</span>
            </div>
            <p className="text-3xl font-bold text-ink-900 mb-1">{stat.value}</p>
            <p className="text-sm text-ink-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl border border-ink-100 bg-white overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-ink-100">
          <div>
            <h3 className="text-lg font-bold text-ink-900">Articles récents</h3>
            <p className="text-sm text-ink-500">Les derniers articles publiés</p>
          </div>
          <Link
            to="/admin/articles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Voir tout <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-ink-400 text-sm">Chargement...</div>
        ) : recentArticles.length === 0 ? (
          <div className="p-8 text-center text-ink-400 text-sm">Aucun article</div>
        ) : (
          <div className="divide-y divide-ink-100">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                to={`/admin/articles`}
                className="flex items-center gap-4 p-4 hover:bg-ink-50/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-ink-100 flex-shrink-0">
                  <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-ink-900 truncate">{article.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ink-400">
                    <span className="px-2 py-0.5 rounded bg-ink-100 text-ink-600 font-medium">{article.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(article.date)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readingTime}</span>
                  </div>
                </div>
                {article.featured && (
                  <span className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-accent-50 text-accent-600 text-[10px] font-bold uppercase tracking-wide">
                    À la une
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <div className="p-6 rounded-2xl border border-ink-100 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink-900">Gérer les articles</h3>
              <p className="text-sm text-ink-500">Créer, modifier et organiser le contenu</p>
            </div>
          </div>
          <Link
            to="/admin/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Accéder <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl border border-ink-100 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink-900">Voir le site</h3>
              <p className="text-sm text-ink-500">Consulter le blog public</p>
            </div>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-600 hover:text-secondary-700"
          >
            Accéder <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
