import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  X,
  ArrowLeft,
  Save,
  Lightbulb,
  Info,
  Target,
  Layers,
  Hash,
  ExternalLink,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSolutions, insertSolution, updateSolution, deleteSolution } from '@/features/content/infrastructure/content_api';
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/shared/ui';
import { solutionSchema, type SolutionFormValues } from '../forms/solution_schema';
import type { Solution } from '@/features/solutions/domain/entities/solution';

type View = 'list' | 'edit' | 'detail';

function toFormData(s: Solution): SolutionFormValues {
  return {
    name: s.name,
    slug: s.slug,
    tagline: s.tagline,
    category: s.category,
    problem: s.problem,
    target: s.target,
    description: s.description,
    features: toCommaList(s.features),
    technologies: toCommaList(s.technologies),
    link: s.link,
  };
}

function emptyForm(): SolutionFormValues {
  return {
    name: '',
    slug: '',
    tagline: '',
    category: '',
    problem: '',
    target: '',
    description: '',
    features: '',
    technologies: '',
    link: '',
  };
}

function toCommaList(arr: string[]): string {
  return arr.join(', ');
}

function fromCommaList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

interface SolutionFormProps {
  defaultValues: SolutionFormValues;
  onSubmit: (values: SolutionFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function SolutionForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: SolutionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionSchema),
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
              <CardDescription>Informations generales de la solution</CardDescription>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nom *" placeholder="Garage Manager" error={errors.name?.message} {...register('name')} />
            <Input label="Slug *" placeholder="garagepro" className="font-mono" error={errors.slug?.message} {...register('slug')} />
            <Input label="Categorie *" placeholder="SaaS Automotive" error={errors.category?.message} {...register('category')} />
            <Input label="Cible *" placeholder="Garages automobiles" error={errors.target?.message} {...register('target')} />
            <Input label="Slogan *" placeholder="SaaS de gestion de garage" className="sm:col-span-2" error={errors.tagline?.message} {...register('tagline')} />
          </div>
          <div className="mt-4">
            <Textarea label="Description *" rows={3} placeholder="Description de la solution" error={errors.description?.message} {...register('description')} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Target className="h-5 w-5 text-primary-600" /> Contexte
              </CardTitle>
              <CardDescription>Le probleme resolu par la solution</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <Textarea label="Probleme *" rows={2} placeholder="Quel probleme la solution resout-elle ?" error={errors.problem?.message} {...register('problem')} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Layers className="h-5 w-5 text-primary-600" /> Details techniques
              </CardTitle>
              <CardDescription>Fonctionnalites et stack utilisees</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <Input label="Fonctionnalites (virgule)" placeholder="Gestion des reparations, Facturation, Stock" error={errors.features?.message} {...register('features')} />
            <Input label="Technologies (virgule)" placeholder="React, Laravel, MySQL" error={errors.technologies?.message} {...register('technologies')} />
            <Input label="Lien du site" type="url" placeholder="https://exemple.com" error={errors.link?.message} {...register('link')} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Recapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification de la solution' : 'Nouvelle solution'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Nom', value: values.name || null },
              { label: 'Categorie', value: values.category || null },
              { label: 'Cible', value: values.target || null },
              { label: 'Slug', value: values.slug || null },
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

interface SolutionDetailViewProps {
  solution: Solution;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SolutionDetailView({ solution, onBack, onEdit, onDelete }: SolutionDetailViewProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Retour a la liste
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">{solution.name}</h2>
          <p className="text-sm text-ink-500 mt-1">{solution.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          {solution.link && (
            <a href={solution.link} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="md" leftIcon={<ExternalLink className="h-4 w-4" />}>
                Voir le site
              </Button>
            </a>
          )}
          <Button variant="primary" size="md" leftIcon={<Edit3 className="h-4 w-4" />} onClick={onEdit}>
            Modifier
          </Button>
          <Button variant="outline" size="md" leftIcon={<Trash2 className="h-4 w-4" />} onClick={onDelete} className="!text-red-600 !border-red-200 hover:!bg-red-50">
            Supprimer
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Info className="h-5 w-5 text-primary-600" /> Identite
              </CardTitle>
              <CardDescription>Informations generales de la solution</CardDescription>
            </div>
          </CardHeader>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">Nom</dt>
              <dd className="text-sm font-medium text-ink-900">{solution.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">Slug</dt>
              <dd className="text-sm font-medium text-ink-900 font-mono">{solution.slug}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">Categorie</dt>
              <dd className="text-sm font-medium text-ink-900">{solution.category}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">Cible</dt>
              <dd className="text-sm font-medium text-ink-900">{solution.target}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">Slogan</dt>
              <dd className="text-sm font-medium text-ink-900">{solution.tagline}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">Description</dt>
              <dd className="text-sm text-ink-700 whitespace-pre-line">{solution.description}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Target className="h-5 w-5 text-primary-600" /> Contexte
              </CardTitle>
              <CardDescription>Le probleme resolu par la solution</CardDescription>
            </div>
          </CardHeader>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">Probleme</dt>
            <dd className="text-sm text-ink-700 whitespace-pre-line">{solution.problem}</dd>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Layers className="h-5 w-5 text-primary-600" /> Details techniques
              </CardTitle>
              <CardDescription>Fonctionnalites et stack utilisees</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-2">Fonctionnalites</dt>
              <dd>
                {solution.features.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {solution.features.map((feature) => (
                      <Badge key={feature} variant="neutral">{feature}</Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-ink-300">-</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-2">Technologies</dt>
              <dd>
                {solution.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {solution.technologies.map((tech) => (
                      <Badge key={tech} variant="primary">{tech}</Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-ink-300">-</span>
                )}
              </dd>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Hash className="h-5 w-5 text-primary-600" /> Metadonnees
              </CardTitle>
              <CardDescription>Informations systeme</CardDescription>
            </div>
          </CardHeader>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">Identifiant</dt>
            <dd className="text-sm font-medium text-ink-900 font-mono">{solution.id}</dd>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminSolutionsPage() {
  const queryClient = useQueryClient();
  const { data: solutions = [] } = useQuery({ queryKey: ['solutions'], queryFn: fetchSolutions });
  const insertMutation = useMutation({ mutationFn: insertSolution, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solutions'] }) });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Solution>) => updateSolution(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solutions'] }),
  });
  const deleteMutation = useMutation({ mutationFn: deleteSolution, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solutions'] }) });

  const [view, setView] = useState<View>('list');
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [viewingSolution, setViewingSolution] = useState<Solution | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [deleteConfirm, setDeleteConfirm] = useState<Solution | null>(null);

  const categories = useMemo(() => {
    if (!solutions) return ['Tous'];
    return ['Tous', ...Array.from(new Set(solutions.map((s) => s.category)))];
  }, [solutions]);

  const filtered = useMemo(() => {
    let result = solutions;
    if (activeCategory !== 'Tous') result = result.filter((s) => s.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q));
    }
    return result;
  }, [solutions, activeCategory, searchQuery]);

  function handleEdit(solution: Solution) {
    setEditingSolution(solution);
    setView('edit');
  }

  function handleView(solution: Solution) {
    setViewingSolution(solution);
    setView('detail');
  }

  function handleCreate() {
    setEditingSolution(null);
    setView('edit');
  }

  function handleSave(values: SolutionFormValues) {
    const payload = {
      name: values.name,
      slug: values.slug,
      tagline: values.tagline,
      category: values.category,
      problem: values.problem,
      target: values.target,
      description: values.description,
      features: fromCommaList(values.features ?? ''),
      technologies: fromCommaList(values.technologies ?? ''),
      link: values.link ?? '',
    };
    if (editingSolution) {
      updateMutation.mutate({ id: editingSolution.id, ...payload });
    } else {
      insertMutation.mutate(payload);
    }
    setView('list');
  }

  if (view === 'detail' && viewingSolution) {
    return (
      <SolutionDetailView
        solution={viewingSolution}
        onBack={() => setView('list')}
        onEdit={() => handleEdit(viewingSolution)}
        onDelete={() => setDeleteConfirm(viewingSolution)}
      />
    );
  }

  if (view === 'edit') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour a la liste
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-900">
            {editingSolution ? 'Modifier la solution' : 'Nouvelle solution'}
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            {editingSolution ? editingSolution.name : 'Ajoutez une nouvelle solution metier'}
          </p>
        </div>

        <SolutionForm
          defaultValues={editingSolution ? toFormData(editingSolution) : emptyForm()}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={insertMutation.isPending || updateMutation.isPending}
          isEdit={!!editingSolution}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-ink-900">Solutions</h2><p className="text-sm text-ink-500 mt-1">Gérez toutes les solutions métier</p></div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouvelle solution</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher une solution..." className="w-full h-11 pl-11 pr-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:border-ink-300'}`}>{cat}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white">
          <Lightbulb className="h-12 w-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 mb-4">Aucune solution trouvée</p>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Créer une solution</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((solution, i) => (
            <motion.div key={solution.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5 hover:border-ink-200 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600"><Lightbulb className="h-5 w-5" /></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleView(solution)} className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 transition-all" title="Voir"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => handleEdit(solution)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all" title="Modifier"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteConfirm(solution)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <span className="inline-block px-2 py-0.5 rounded bg-ink-100 text-ink-600 text-[10px] font-bold uppercase tracking-wide mb-2">{solution.category}</span>
              <h3 className="text-sm font-bold text-ink-900 mb-1">{solution.name}</h3>
              <p className="text-xs text-ink-500 line-clamp-2 mb-3">{solution.tagline}</p>
              <p className="text-xs text-ink-400">Cible : <span className="text-ink-600 font-medium">{solution.target}</span></p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 flex-shrink-0"><Trash2 className="h-6 w-6" /></div>
                <div className="flex-1"><h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer la solution ?</h3><p className="text-sm text-ink-500">Êtes-vous sûr de vouloir supprimer « {deleteConfirm.name} » ? Cette action est irréversible.</p></div>
                <button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="primary" size="md" onClick={() => { deleteMutation.mutate(deleteConfirm.id); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700">Supprimer</Button>
                <Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
