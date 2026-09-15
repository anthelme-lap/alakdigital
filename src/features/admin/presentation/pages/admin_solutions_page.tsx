import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSolutions, insertSolution, updateSolution, deleteSolution } from '@/features/content/infrastructure/content_api';
import { Button } from '@/shared/ui';
import type { Solution } from '@/features/solutions/domain/entities/solution';

type View = 'list' | 'edit';

interface SolutionFormData {
  name: string;
  slug: string;
  tagline: string;
  category: string;
  problem: string;
  target: string;
  description: string;
  features: string;
  technologies: string;
}

function toFormData(s: Solution): SolutionFormData {
  return {
    name: s.name,
    slug: s.slug,
    tagline: s.tagline,
    category: s.category,
    problem: s.problem,
    target: s.target,
    description: s.description,
    features: s.features.join(', '),
    technologies: s.technologies.join(', '),
  };
}

function emptyForm(): SolutionFormData {
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
  };
}

const inputClass =
  'w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';
const textareaClass = inputClass.replace('h-11', '');

export function AdminSolutionsPage() {
  const queryClient = useQueryClient();
  const { data: solutions = [] } = useQuery({ queryKey: ['solutions'], queryFn: fetchSolutions });
  const insertMutation = useMutation({
    mutationFn: insertSolution,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solutions'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Solution>) => updateSolution(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solutions'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteSolution,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solutions'] }),
  });
  const [view, setView] = useState<View>('list');
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [deleteConfirm, setDeleteConfirm] = useState<Solution | null>(null);
  const [formData, setFormData] = useState<SolutionFormData>(emptyForm());

  const categories = useMemo(() => {
    if (!solutions) return ['Tous'];
    return ['Tous', ...Array.from(new Set(solutions.map((s) => s.category)))];
  }, [solutions]);

  const filtered = useMemo(() => {
    if (!solutions) return [];
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
    setFormData(toFormData(solution));
    setView('edit');
  }

  function handleCreate() {
    setEditingSolution(null);
    setFormData(emptyForm());
    setView('edit');
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: formData.name,
      slug: formData.slug,
      tagline: formData.tagline,
      category: formData.category,
      problem: formData.problem,
      target: formData.target,
      description: formData.description,
      features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (editingSolution) {
      updateMutation.mutate({ id: editingSolution.id, ...payload });
    } else {
      insertMutation.mutate(payload);
    }
    setView('list');
  }

  if (view === 'edit') {
    return (
      <div className="max-w-4xl mx-auto">
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

        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Nom *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="GaragePro" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Slug *</label>
                <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="garagepro" className={`${inputClass} font-mono`} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Categorie *</label>
                <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="SaaS Automotive" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-2">Cible *</label>
                <input type="text" required value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} placeholder="Garages automobiles" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Slogan *</label>
              <input type="text" required value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} placeholder="SaaS de gestion de garage" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Description *</label>
              <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description de la solution" className={textareaClass} />
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <h3 className="font-semibold text-ink-900">Contexte</h3>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Probleme *</label>
              <textarea required rows={2} value={formData.problem} onChange={(e) => setFormData({ ...formData, problem: e.target.value })} placeholder="Quel probleme la solution resout-elle ?" className={textareaClass} />
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <h3 className="font-semibold text-ink-900">Details techniques</h3>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Fonctionnalites (virgule)</label>
              <input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Gestion des reparations, Facturation, Stock" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Technologies (virgule)</label>
              <input type="text" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} placeholder="React, Laravel, MySQL" className={inputClass} />
            </div>
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
          <h2 className="text-2xl font-bold text-ink-900">Solutions</h2>
          <p className="text-sm text-ink-500 mt-1">Gelez toutes les solutions metier</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          Nouvelle solution
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une solution..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:border-ink-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white">
          <Lightbulb className="h-12 w-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 mb-4">Aucune solution trouvee</p>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            Creer une solution
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((solution, i) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }}
              className="rounded-2xl border border-ink-100 bg-white p-5 hover:border-ink-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1">
                  <Link to={`/solutions`} className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 transition-all" title="Voir">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button onClick={() => handleEdit(solution)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all" title="Modifier">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteConfirm(solution)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <span className="inline-block px-2 py-0.5 rounded bg-ink-100 text-ink-600 text-[10px] font-bold uppercase tracking-wide mb-2">
                {solution.category}
              </span>
              <h3 className="text-sm font-bold text-ink-900 mb-1">{solution.name}</h3>
              <p className="text-xs text-ink-500 line-clamp-2 mb-3">{solution.tagline}</p>
              <p className="text-xs text-ink-400">
                Cible : <span className="text-ink-600 font-medium">{solution.target}</span>
              </p>
            </motion.div>
          ))}
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
                  <h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer la solution ?</h3>
                  <p className="text-sm text-ink-500">
                    Etes-vous sur de vouloir supprimer « {deleteConfirm.name} » ? Cette action est irreversible.
                  </p>
                </div>
                <button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="primary" size="md" onClick={() => { deleteMutation.mutate(deleteConfirm.id); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700 !shadow-red-600/20">
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
