import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Edit3, Trash2, Eye, X, Save, Lightbulb,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSolutions, insertSolution, updateSolution, deleteSolution } from '@/features/content/infrastructure/content_api';
import { Button } from '@/shared/ui';
import { FormDrawer, DrawerField, drawerInputClass, drawerTextareaClass } from '@/features/admin/presentation/components/form_drawer';
import type { Solution } from '@/features/solutions/domain/entities/solution';

interface SolutionFormData {
  name: string; slug: string; tagline: string; category: string;
  problem: string; target: string; description: string;
  features: string; technologies: string;
}

function toFormData(s: Solution): SolutionFormData {
  return { name: s.name, slug: s.slug, tagline: s.tagline, category: s.category, problem: s.problem, target: s.target, description: s.description, features: s.features.join(', '), technologies: s.technologies.join(', ') };
}
function emptyForm(): SolutionFormData {
  return { name: '', slug: '', tagline: '', category: '', problem: '', target: '', description: '', features: '', technologies: '' };
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Solution | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [deleteConfirm, setDeleteConfirm] = useState<Solution | null>(null);
  const [formData, setFormData] = useState<SolutionFormData>(emptyForm());

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

  function handleEdit(s: Solution) { setEditing(s); setFormData(toFormData(s)); setDrawerOpen(true); }
  function handleCreate() { setEditing(null); setFormData(emptyForm()); setDrawerOpen(true); }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: formData.name, slug: formData.slug, tagline: formData.tagline,
      category: formData.category, problem: formData.problem, target: formData.target,
      description: formData.description,
      features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (editing) updateMutation.mutate({ id: editing.id, ...payload });
    else insertMutation.mutate(payload);
    setDrawerOpen(false);
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
                  <Link to="/solutions" className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 transition-all" title="Voir"><Eye className="h-4 w-4" /></Link>
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

      <FormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Modifier la solution' : 'Nouvelle solution'}
        subtitle={editing ? editing.name : 'Ajoutez une nouvelle solution métier'}
        footer={
          <>
            <Button type="submit" form="solution-form" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button>
            <Button type="button" variant="outline" size="md" onClick={() => setDrawerOpen(false)}>Annuler</Button>
          </>
        }
      >
        <form id="solution-form" onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <DrawerField label="Nom" required><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="GaragePro" className={drawerInputClass} /></DrawerField>
              <DrawerField label="Slug" required><input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="garagepro" className={`${drawerInputClass} font-mono`} /></DrawerField>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <DrawerField label="Catégorie" required><input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="SaaS Automotive" className={drawerInputClass} /></DrawerField>
              <DrawerField label="Cible" required><input type="text" required value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} placeholder="Garages automobiles" className={drawerInputClass} /></DrawerField>
            </div>
            <DrawerField label="Slogan" required><input type="text" required value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} placeholder="SaaS de gestion de garage" className={drawerInputClass} /></DrawerField>
            <DrawerField label="Description" required><textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description de la solution" className={drawerTextareaClass} /></DrawerField>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-5 space-y-5">
            <h3 className="font-semibold text-ink-900">Contexte</h3>
            <DrawerField label="Problème" required><textarea required rows={2} value={formData.problem} onChange={(e) => setFormData({ ...formData, problem: e.target.value })} placeholder="Quel problème la solution résout-elle ?" className={drawerTextareaClass} /></DrawerField>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-5 space-y-5">
            <h3 className="font-semibold text-ink-900">Détails techniques</h3>
            <DrawerField label="Fonctionnalités (séparées par des virgules)"><input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Gestion des réparations, Facturation, Stock" className={drawerInputClass} /></DrawerField>
            <DrawerField label="Technologies (séparées par des virgules)"><input type="text" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} placeholder="React, Laravel, MySQL" className={drawerInputClass} /></DrawerField>
          </div>
        </form>
      </FormDrawer>

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
