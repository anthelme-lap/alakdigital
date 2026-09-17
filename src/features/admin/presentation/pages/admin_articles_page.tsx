import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Info,
  FileEdit,
  Tag,
  User,
  Star,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArticles, insertArticle, updateArticle, deleteArticle } from '@/features/content/infrastructure/content_api';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, Badge, ImageUpload, RichTextEditor } from '@/shared/ui';
import { articleSchema, type ArticleFormValues } from '../forms/article_schema';
import type { BlogArticle } from '@/features/blog/domain/entities/article';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

type View = 'list' | 'edit' | 'detail';

function toFormData(article: BlogArticle): ArticleFormValues {
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

function emptyForm(): ArticleFormValues {
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

function fromCommaList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

interface ArticleFormProps {
  defaultValues: ArticleFormValues;
  onSubmit: (values: ArticleFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function ArticleForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: ArticleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues,
    mode: 'onChange',
  });

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Info className="h-5 w-5 text-primary-600" /> Identite
              </CardTitle>
              <CardDescription>Titre, slug et resume de l'article</CardDescription>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Titre *" placeholder="Titre de l'article" className="sm:col-span-2" error={errors.title?.message} {...register('title')} />
            <Input label="Slug *" placeholder="mon-article" className="font-mono" error={errors.slug?.message} {...register('slug')} />
            <Input label="Categorie *" placeholder="Developpement Web" error={errors.category?.message} {...register('category')} />
          </div>
          <div className="mt-4">
            <Textarea label="Extrait *" rows={3} placeholder="Resume court de l'article" error={errors.excerpt?.message} {...register('excerpt')} />
          </div>
          <div className="mt-4">
            <ImageUpload
              label="Image de couverture"
              folder="articles"
              value={values.coverImage ?? ''}
              onChange={(url) => setValue('coverImage', url, { shouldValidate: true })}
              error={errors.coverImage?.message}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <FileEdit className="h-5 w-5 text-primary-600" /> Contenu
              </CardTitle>
              <CardDescription>Corps de l'article</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <RichTextEditor
              value={values.content ?? ''}
              onChange={(html) => setValue('content', html, { shouldValidate: true })}
              placeholder="Redigez le contenu de l'article..."
              error={errors.content?.message}
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Tag className="h-5 w-5 text-primary-600" /> Metadonnees
              </CardTitle>
              <CardDescription>Auteur, temps de lecture, tags et mise en avant</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Auteur *" placeholder="Konan A." error={errors.author?.message} {...register('author')} />
              <Input label="Role" placeholder="Lead Developer" error={errors.authorRole?.message} {...register('authorRole')} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Temps de lecture" placeholder="6 min" error={errors.readingTime?.message} {...register('readingTime')} />
              <Input label="Tags (virgule)" placeholder="TypeScript, Web, Qualite" error={errors.tags?.message} {...register('tags')} />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-pressed={values.featured}
                onClick={() => setValue('featured', !values.featured, { shouldValidate: true })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${values.featured ? 'bg-primary-600' : 'bg-ink-200'}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${values.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <button
                type="button"
                onClick={() => setValue('featured', !values.featured, { shouldValidate: true })}
                className="text-sm font-medium text-ink-700"
              >
                Mettre a la une
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Recapitulatif</CardTitle>
              <CardDescription>{isEdit ? "Modification de l'article" : 'Nouvel article'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Titre', value: values.title || null },
              { label: 'Categorie', value: values.category || null },
              { label: 'Auteur', value: values.author || null },
              { label: 'Lecture', value: values.readingTime || null },
              { label: 'A la une', value: values.featured ? 'Oui' : 'Non' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-ink-500">{label}</dt>
                <dd className="max-w-[60%] truncate text-right font-medium text-ink-900">
                  {value ?? <span className="text-ink-300">-</span>}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 space-y-2">
            <Button type="submit" variant="primary" size="md" fullWidth loading={loading} leftIcon={!loading ? <Save className="h-4 w-4" /> : undefined}>
              Enregistrer
            </Button>
            <Button type="button" variant="outline" size="md" fullWidth onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </Card>
      </div>
    </form>
  );
}

interface ArticleDetailViewProps {
  article: BlogArticle;
  onBack: () => void;
  onEdit: (article: BlogArticle) => void;
  onDelete: (article: BlogArticle) => void;
}

function ArticleDetailView({ article, onBack, onEdit, onDelete }: ArticleDetailViewProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-ink-900">{article.title}</h2>
            {article.featured && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-50 text-accent-600 text-xs font-bold uppercase tracking-wide">
                <Star className="h-3 w-3" /> À la une
              </span>
            )}
          </div>
          <p className="text-sm text-ink-500 mt-1">{article.excerpt}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" leftIcon={<Edit3 className="h-4 w-4" />} onClick={() => onEdit(article)}>
            Modifier
          </Button>
          <Button variant="outline" size="md" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(article)} className="!text-red-600 !border-red-200 hover:!bg-red-50">
            Supprimer
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Info className="h-5 w-5 text-primary-600" /> Identité
              </CardTitle>
              <CardDescription>Titre, slug et resume de l'article</CardDescription>
            </div>
          </CardHeader>
          {article.coverImage && (
            <div className="mb-4 rounded-xl overflow-hidden border border-ink-100 max-h-80">
              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Titre</dt>
              <dd className="text-sm font-medium text-ink-900 mt-1">{article.title}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Slug</dt>
              <dd className="text-sm font-medium text-ink-900 mt-1 font-mono">{article.slug}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Catégorie</dt>
              <dd className="text-sm font-medium text-ink-900 mt-1">{article.category}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Date</dt>
              <dd className="text-sm font-medium text-ink-900 mt-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(article.date)}
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Extrait</dt>
            <dd className="text-sm text-ink-700 mt-1 leading-relaxed">{article.excerpt}</dd>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <User className="h-5 w-5 text-primary-600" /> Métadonnées
              </CardTitle>
              <CardDescription>Auteur, temps de lecture, tags et mise en avant</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Auteur</dt>
                <dd className="text-sm font-medium text-ink-900 mt-1">{article.author}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Rôle</dt>
                <dd className="text-sm font-medium text-ink-900 mt-1">{article.authorRole || <span className="text-ink-300">-</span>}</dd>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Temps de lecture
                </dt>
                <dd className="text-sm font-medium text-ink-900 mt-1">{article.readingTime}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">À la une</dt>
                <dd className="text-sm font-medium text-ink-900 mt-1">{article.featured ? 'Oui' : 'Non'}</dd>
              </div>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 flex items-center gap-1.5 mb-2">
                <Tag className="h-3.5 w-3.5" /> Tags
              </dt>
              <div className="flex flex-wrap gap-2">
                {article.tags.length === 0 ? (
                  <span className="text-sm text-ink-300">-</span>
                ) : (
                  article.tags.map((tag) => (
                    <Badge key={tag} variant="primary">{tag}</Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <FileEdit className="h-5 w-5 text-primary-600" /> Contenu
              </CardTitle>
              <CardDescription>Corps de l'article</CardDescription>
            </div>
          </CardHeader>
          <div className="article-content rounded-xl border border-ink-100 p-5 max-w-none prose prose-sm" dangerouslySetInnerHTML={{ __html: article.content }} />
        </Card>
      </div>
    </div>
  );
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
  const [viewingArticle, setViewingArticle] = useState<BlogArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [deleteConfirm, setDeleteConfirm] = useState<BlogArticle | null>(null);

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
    setView('edit');
  }

  function handleView(article: BlogArticle) {
    setViewingArticle(article);
    setView('detail');
  }

  function handleCreate() {
    setEditingArticle(null);
    setView('edit');
  }

  async function handleSave(values: ArticleFormValues) {
    const payload = {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      category: values.category,
      author: values.author,
      authorRole: values.authorRole ?? '',
      readingTime: values.readingTime ?? '',
      coverImage: values.coverImage ?? '',
      featured: values.featured,
      content: values.content,
      tags: fromCommaList(values.tags ?? ''),
      date: editingArticle ? editingArticle.date : new Date().toISOString().split('T')[0],
      authorBio: editingArticle ? editingArticle.authorBio : '',
    };
    try {
      if (editingArticle) {
        await updateMutation.mutateAsync({ id: editingArticle.id, ...payload });
      } else {
        await insertMutation.mutateAsync(payload);
      }
      setView('list');
    } catch {
      // on reste sur le formulaire d'edition en cas d'echec de l'enregistrement
    }
  }

  function handleDelete() {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  }

  if (view === 'edit') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-900">
            {editingArticle ? "Modifier l'article" : 'Nouvel article'}
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            {editingArticle ? editingArticle.title : 'Créez un nouvel article pour le blog'}
          </p>
        </div>

        <ArticleForm
          defaultValues={editingArticle ? toFormData(editingArticle) : emptyForm()}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={insertMutation.isPending || updateMutation.isPending}
          isEdit={!!editingArticle}
        />
      </div>
    );
  }

  if (view === 'detail' && viewingArticle) {
    return (
      <ArticleDetailView
        article={viewingArticle}
        onBack={() => setView('list')}
        onEdit={(article) => {
          setEditingArticle(article);
          setView('edit');
        }}
        onDelete={(article) => setDeleteConfirm(article)}
      />
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
                        <button
                          onClick={() => handleView(article)}
                          className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
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
