import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  Edit3,
  Trash2,
  Eye,
  X,
  ArrowLeft,
  Save,
  FileText,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArticles, insertArticle, updateArticle, deleteArticle } from '@/features/content/infrastructure/content_api';
import { Button } from '@/shared/ui';
import type { BlogArticle } from '@/features/blog/domain/entities/article';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

type View = 'list' | 'edit';

interface EditFormData {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  readingTime: string;
  coverImage: string;
  featured: boolean;
  content: string;
  tags: string;
}

function toFormData(article: BlogArticle): EditFormData {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    author: article.author,
    authorRole: article.authorRole,
    readingTime: article.readingTime,
    coverImage: article.coverImage,
    featured: article.featured,
    content: article.content,
    tags: article.tags.join(', '),
  };
}

function emptyForm(): EditFormData {
  return {
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    author: '',
    authorRole: '',
    readingTime: '5 min',
    coverImage: '',
    featured: false,
    content: '',
    tags: '',
  };
}

export function AdminArticlesPage() {
  const queryClient = useQueryClient();
  const { data: articles = [] } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });
  const insertMutation = useMutation({
    mutationFn: insertArticle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<BlogArticle>) => updateArticle(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
  const [view, setView] = useState<View>('list');
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [deleteConfirm, setDeleteConfirm] = useState<BlogArticle | null>(null);
  const [formData, setFormData] = useState<EditFormData>(emptyForm());

  const categories = useMemo(() => {
    return ['Tous', ...Array.from(new Set(articles.map((a) => a.category)))];
  }, [articles]);

  const filtered = useMemo(() => {
    let result = articles;
    if (activeCategory !== 'Tous') {
      result = result.filter((a) => a.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q),
      );
    }
    return result;
  }, [articles, activeCategory, searchQuery]);

  function handleEdit(article: BlogArticle) {
    setEditingArticle(article);
    setFormData(toFormData(article));
    setView('edit');
  }

  function handleCreate() {
    setEditingArticle(null);
    setFormData(emptyForm());
    setView('edit');
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      category: formData.category,
      author: formData.author,
      authorRole: formData.authorRole,
      readingTime: formData.readingTime,
      coverImage: formData.coverImage,
      featured: formData.featured,
      content: formData.content,
      tags,
      date: editingArticle ? editingArticle.date : new Date().toISOString().split('T')[0],
      authorBio: editingArticle ? editingArticle.authorBio : '',
    };
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, ...payload });
    } else {
      insertMutation.mutate(payload);
    }
    setView('list');
  }

  function handleDelete() {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  }

  if (view === 'edit') {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setView('list')}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-ink-900">
              {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              {editingArticle ? editingArticle.title : 'Créez un nouvel article pour le blog'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Titre *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de l'article"
                className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="mon-article"
                  className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Catégorie *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Développement Web"
                  className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Extrait *</label>
              <textarea
                required
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Résumé court de l'article"
                className="w-full px-4 py-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Image de couverture</label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://images.pexels.com/..."
                className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              {formData.coverImage && (
                <div className="mt-3 rounded-xl overflow-hidden border border-ink-100 max-h-48">
                  <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <h3 className="font-semibold text-ink-900">Informations auteur</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Auteur *</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Konan A."
                  className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Rôle</label>
                <input
                  type="text"
                  value={formData.authorRole}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  placeholder="Lead Developer"
                  className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Temps de lecture</label>
                <input
                  type="text"
                  value={formData.readingTime}
                  onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                  placeholder="6 min"
                  className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="TypeScript, Web, Qualité"
                  className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <h3 className="font-semibold text-ink-900">Contenu</h3>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Contenu HTML *</label>
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="<p>Votre contenu...</p>"
                className="w-full px-4 py-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 font-mono"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                  formData.featured ? 'bg-primary-600' : 'bg-ink-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                    formData.featured ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-ink-700">Mettre à la une</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>
              Enregistrer
            </Button>
            <Button type="button" variant="outline" size="md" onClick={() => setView('list')}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">Articles</h2>
          <p className="text-sm text-ink-500 mt-1">Gérez tous les articles du blog</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          Nouvel article
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un article..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-ink-900 text-white'
                  : 'bg-white text-ink-600 border border-ink-200 hover:border-ink-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white">
          <FileText className="h-12 w-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 mb-4">Aucun article trouvé</p>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            Créer un article
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500">Article</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500 hidden md:table-cell">Catégorie</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500 hidden lg:table-cell">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500 hidden sm:table-cell">Lecture</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500">Statut</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((article, i) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                    className="hover:bg-ink-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-ink-100 flex-shrink-0">
                          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="text-sm font-semibold text-ink-900 truncate">{article.title}</p>
                          <p className="text-xs text-ink-400 truncate">{article.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded-md bg-ink-100 text-ink-600 text-xs font-semibold">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="flex items-center gap-1.5 text-sm text-ink-500">
                        <Calendar className="h-3.5 w-3.5" /> {formatDate(article.date)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="flex items-center gap-1.5 text-sm text-ink-500">
                        <Clock className="h-3.5 w-3.5" /> {article.readingTime}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {article.featured ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-50 text-accent-600 text-xs font-bold uppercase tracking-wide">
                          <TrendingUp className="h-3 w-3" /> À la une
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wide">
                          Publié
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/blog/${article.slug}`}
                          className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"
                          title="Modifier"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(article)}
                          className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 flex-shrink-0">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer l'article ?</h3>
                  <p className="text-sm text-ink-500">
                    Êtes-vous sûr de vouloir supprimer « {deleteConfirm.title} » ? Cette action est irréversible.
                  </p>
                </div>
                <button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="primary" size="md" onClick={handleDelete} className="!bg-red-600 hover:!bg-red-700 !shadow-red-600/20">
                  Supprimer
                </Button>
                <Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>
                  Annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
