import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Save, ArrowLeft, Target } from 'lucide-react';
import { useContentStore } from '@/features/content/presentation/store/content_store';
import { Button } from '@/shared/ui';
import type { ExpertiseDomain } from '@/features/content/domain/entities/content';

const inputClass = 'w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';
const iconOptions = ['Code2', 'Smartphone', 'Server', 'Database', 'Cloud', 'GitBranch', 'Shield', 'Cpu', 'Layers', 'Globe'];

interface FormData { icon: string; label: string; description: string; technologies: string; }
const emptyForm: FormData = { icon: 'Code2', label: '', description: '', technologies: '' };
const toFormData = (e: ExpertiseDomain): FormData => ({ icon: e.icon, label: e.label, description: e.description, technologies: e.technologies.join(', ') });

export function AdminExpertiseContentPage() {
  const expertise = useContentStore((s) => s.expertise);
  const addExpertise = useContentStore((s) => s.addExpertise);
  const updateExpertise = useContentStore((s) => s.updateExpertise);
  const deleteExpertise = useContentStore((s) => s.deleteExpertise);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<ExpertiseDomain | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ExpertiseDomain | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  function handleEdit(e: ExpertiseDomain) { setEditing(e); setFormData(toFormData(e)); setView('edit'); }
  function handleCreate() { setEditing(null); setFormData(emptyForm); setView('edit'); }
  function handleSave(e: React.FormEvent) { e.preventDefault(); const payload = { icon: formData.icon, label: formData.label, description: formData.description, technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean) }; if (editing) updateExpertise(editing.id, payload); else addExpertise(payload); setView('list'); }

  if (view === 'edit') {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <h2 className="text-2xl font-bold text-ink-900 mb-6">{editing ? 'Modifier le domaine' : 'Nouveau domaine'}</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Icône</label><select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className={inputClass}>{iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Label *</label><input type="text" required value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Frontend" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Description *</label><textarea required rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description courte" className={inputClass.replace('h-11', '')} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Technologies (virgule)</label><input type="text" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} placeholder="React, TypeScript, Vite" className={inputClass} /></div>
          </div>
          <div className="flex gap-3"><Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button><Button type="button" variant="outline" size="md" onClick={() => setView('list')}>Annuler</Button></div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-ink-900">Expertise</h2><p className="text-sm text-ink-500 mt-1">Gérez les domaines d'expertise</p></div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouveau domaine</Button>
      </div>
      {expertise.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white"><Target className="h-12 w-12 text-ink-300 mx-auto mb-3" /><p className="text-ink-500 mb-4">Aucun domaine</p><Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Ajouter</Button></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expertise.map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5 group">
              <div className="flex items-start justify-between mb-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Target className="h-5 w-5" /></div>
                <div className="flex items-center gap-1"><button onClick={() => handleEdit(e)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button><button onClick={() => setDeleteConfirm(e)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button></div></div>
              <h3 className="text-sm font-bold text-ink-900 mb-1">{e.label}</h3><p className="text-xs text-ink-500 line-clamp-2 mb-3">{e.description}</p>
              <div className="flex flex-wrap gap-1">{e.technologies.slice(0, 4).map((t) => <span key={t} className="px-2 py-0.5 rounded bg-ink-100 text-ink-600 text-[10px] font-semibold">{t}</span>)}{e.technologies.length > 4 && <span className="px-2 py-0.5 rounded bg-ink-100 text-ink-400 text-[10px] font-semibold">+{e.technologies.length - 4}</span>}</div>
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500"><Trash2 className="h-6 w-6" /></div><div className="flex-1"><h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer ?</h3><p className="text-sm text-ink-500">Supprimer « {deleteConfirm.label} » ?</p></div><button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400"><X className="h-5 w-5" /></button></div>
              <div className="flex gap-3 mt-6"><Button variant="primary" size="md" onClick={() => { deleteExpertise(deleteConfirm.id); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700">Supprimer</Button><Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>Annuler</Button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
