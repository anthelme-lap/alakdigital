import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Save, ArrowLeft, Award, Target, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMissionVision, updateMissionVision as updateMissionVisionApi,
  fetchPillars, insertPillar, updatePillar as updatePillarApi, deletePillar as deletePillarApi,
} from '@/features/content/infrastructure/content_api';
import { Button } from '@/shared/ui';
import type { MissionVision, AboutPillar } from '@/features/content/domain/entities/content';

const inputClass = 'w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';
const textareaClass = inputClass.replace('h-11', '');
const iconOptions = ['Target', 'Eye', 'Award', 'Rocket', 'Compass', 'Star', 'Shield', 'Zap', 'Heart', 'Sparkles'];

type Tab = 'mission' | 'pillars';

export function AdminAboutContentPage() {
  const [tab, setTab] = useState<Tab>('mission');
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-ink-900">Page À propos</h2><p className="text-sm text-ink-500 mt-1">Gérez le contenu de la page À propos</p></div>
      <div className="flex items-center gap-2 border-b border-ink-100">
        <button onClick={() => setTab('mission')} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${tab === 'mission' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-500 hover:text-ink-900'}`}><Target className="h-4 w-4" /> Mission & Vision</button>
        <button onClick={() => setTab('pillars')} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${tab === 'pillars' ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-500 hover:text-ink-900'}`}><Award className="h-4 w-4" /> Piliers</button>
      </div>
      {tab === 'mission' && <MissionTab />}
      {tab === 'pillars' && <PillarsTab />}
    </div>
  );
}

function MissionTab() {
  const queryClient = useQueryClient();
  const { data: missionVision = [] } = useQuery({ queryKey: ['missionVision'], queryFn: fetchMissionVision });
  const updateMissionVisionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MissionVision> }) => updateMissionVisionApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['missionVision'] }),
  });
  const updateMissionVision = (id: string, data: Partial<MissionVision>) => updateMissionVisionMutation.mutate({ id, data });
  const [editing, setEditing] = useState<MissionVision | null>(null);
  const [formData, setFormData] = useState({ icon: '', label: '', title: '', description: '', points: '' });

  function handleEdit(mv: MissionVision) { setEditing(mv); setFormData({ icon: mv.icon, label: mv.label, title: mv.title, description: mv.description, points: mv.points.join('\n') }); }
  function handleSave(e: React.FormEvent) { e.preventDefault(); if (!editing) return; updateMissionVision(editing.id, { icon: formData.icon, label: formData.label, title: formData.title, description: formData.description, points: formData.points.split('\n').map((p) => p.trim()).filter(Boolean) }); setEditing(null); }

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setEditing(null)} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <h3 className="text-xl font-bold text-ink-900 mb-6">Modifier « {editing.label} »</h3>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Icône</label><select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className={inputClass}>{iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Label *</label><input type="text" required value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Notre mission" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Titre *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Description *</label><textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={textareaClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Points (un par ligne)</label><textarea rows={4} value={formData.points} onChange={(e) => setFormData({ ...formData, points: e.target.value })} placeholder="Point 1&#10;Point 2" className={textareaClass} /></div>
          </div>
          <div className="flex gap-3"><Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button><Button type="button" variant="outline" size="md" onClick={() => setEditing(null)}>Annuler</Button></div>
        </form>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {missionVision.map((mv, i) => (
        <motion.div key={mv.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }} className="rounded-2xl border border-ink-100 bg-white p-5">
          <div className="flex items-start justify-between mb-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Target className="h-5 w-5" /></div><button onClick={() => handleEdit(mv)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button></div>
          <span className="text-xs font-semibold uppercase text-primary-600">{mv.label}</span>
          <h3 className="text-sm font-bold text-ink-900 mt-1 mb-2">{mv.title}</h3>
          <p className="text-xs text-ink-500 line-clamp-3">{mv.description}</p>
          <div className="mt-3 space-y-1">{mv.points.map((p) => <p key={p} className="text-xs text-ink-600 flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary-500" /> {p}</p>)}</div>
        </motion.div>
      ))}
    </div>
  );
}

function PillarsTab() {
  const queryClient = useQueryClient();
  const { data: pillars = [] } = useQuery({ queryKey: ['pillars'], queryFn: fetchPillars });
  const addPillar = useMutation({
    mutationFn: (p: { icon: string; title: string; description: string }) => insertPillar(p),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pillars'] }),
  }).mutate;
  const updatePillarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AboutPillar> }) => updatePillarApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pillars'] }),
  });
  const updatePillar = (id: string, data: Partial<AboutPillar>) => updatePillarMutation.mutate({ id, data });
  const deletePillar = useMutation({
    mutationFn: (id: string) => deletePillarApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pillars'] }),
  }).mutate;
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<AboutPillar | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AboutPillar | null>(null);
  const [formData, setFormData] = useState({ icon: 'Target', title: '', description: '' });

  function handleEdit(p: AboutPillar) { setEditing(p); setFormData({ icon: p.icon, title: p.title, description: p.description }); setView('edit'); }
  function handleCreate() { setEditing(null); setFormData({ icon: 'Target', title: '', description: '' }); setView('edit'); }
  function handleSave(e: React.FormEvent) { e.preventDefault(); const payload = { icon: formData.icon, title: formData.title, description: formData.description }; if (editing) updatePillar(editing.id, payload); else addPillar(payload); setView('list'); }

  if (view === 'edit') {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <h3 className="text-xl font-bold text-ink-900 mb-6">{editing ? 'Modifier le pilier' : 'Nouveau pilier'}</h3>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Icône</label><select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className={inputClass}>{iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Titre *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Expertise" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Description *</label><textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={textareaClass} /></div>
          </div>
          <div className="flex gap-3"><Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button><Button type="button" variant="outline" size="md" onClick={() => setView('list')}>Annuler</Button></div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouveau pilier</Button></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="flex items-start justify-between mb-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Award className="h-5 w-5" /></div>
              <div className="flex items-center gap-1"><button onClick={() => handleEdit(p)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button><button onClick={() => setDeleteConfirm(p)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button></div></div>
            <h3 className="text-sm font-bold text-ink-900 mb-1">{p.title}</h3><p className="text-xs text-ink-500 line-clamp-3">{p.description}</p>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500"><Trash2 className="h-6 w-6" /></div><div className="flex-1"><h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer ?</h3><p className="text-sm text-ink-500">Supprimer « {deleteConfirm.title} » ?</p></div><button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400"><X className="h-5 w-5" /></button></div>
              <div className="flex gap-3 mt-6"><Button variant="primary" size="md" onClick={() => { deletePillar(deleteConfirm.id); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700">Supprimer</Button><Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>Annuler</Button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
