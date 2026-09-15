import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Save, ArrowLeft, BarChart3, Image, TrendingUp, Users, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchHeroSlides, insertHeroSlide, updateHeroSlide as updateHeroSlideApi, deleteHeroSlide as deleteHeroSlideApi,
  fetchStats, insertStat, updateStat as updateStatApi, deleteStat as deleteStatApi,
  fetchClients, insertClient, updateClient as updateClientApi, deleteClient as deleteClientApi,
  fetchWhyUs, insertWhyUs, updateWhyUs as updateWhyUsApi, deleteWhyUs as deleteWhyUsApi,
} from '@/features/content/infrastructure/content_api';
import { Button } from '@/shared/ui';
import type { HeroSlide, Stat, Client, WhyUsReason } from '@/features/content/domain/entities/content';

const inputClass = 'w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';
const textareaClass = inputClass.replace('h-11', '');

type Tab = 'hero' | 'stats' | 'clients' | 'whyUs';

export function AdminHomepagePage() {
  const [tab, setTab] = useState<Tab>('hero');
  const tabs = [
    { key: 'hero' as Tab, label: 'Hero', icon: Image },
    { key: 'stats' as Tab, label: 'Statistiques', icon: BarChart3 },
    { key: 'clients' as Tab, label: 'Clients', icon: Users },
    { key: 'whyUs' as Tab, label: 'Pourquoi nous', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-ink-900">Page d'accueil</h2><p className="text-sm text-ink-500 mt-1">Gérez le contenu de la page d'accueil</p></div>
      <div className="flex items-center gap-2 border-b border-ink-100">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${tab === t.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-500 hover:text-ink-900'}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'hero' && <HeroTab />}
      {tab === 'stats' && <StatsTab />}
      {tab === 'clients' && <ClientsTab />}
      {tab === 'whyUs' && <WhyUsTab />}
    </div>
  );
}

function HeroTab() {
  const queryClient = useQueryClient();
  const { data: heroSlides = [] } = useQuery({ queryKey: ['heroSlides'], queryFn: fetchHeroSlides });
  const addHeroSlide = useMutation({
    mutationFn: (h: Omit<HeroSlide, 'id' | 'sort_order'>) => insertHeroSlide(h),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['heroSlides'] }),
  }).mutate;
  const updateHeroSlideMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HeroSlide> }) => updateHeroSlideApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['heroSlides'] }),
  });
  const updateHeroSlide = (id: string, data: Partial<HeroSlide>) => updateHeroSlideMutation.mutate({ id, data });
  const deleteHeroSlide = useMutation({
    mutationFn: (id: string) => deleteHeroSlideApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['heroSlides'] }),
  }).mutate;
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    eyebrow: '', title: '', highlight: '', subtitle: '', cta_label: '', cta_to: '', accent: 'primary', mockup: 'dashboard',
  });

  function handleEdit(s: HeroSlide) { setEditing(s); setFormData({ eyebrow: s.eyebrow, title: s.title, highlight: s.highlight, subtitle: s.subtitle, cta_label: s.cta_label, cta_to: s.cta_to, accent: s.accent, mockup: s.mockup }); setView('edit'); }
  function handleCreate() { setEditing(null); setFormData({ eyebrow: '', title: '', highlight: '', subtitle: '', cta_label: '', cta_to: '/', accent: 'primary', mockup: 'dashboard' }); setView('edit'); }
  function handleSave(e: React.FormEvent) { e.preventDefault(); const payload = { ...formData }; if (editing) updateHeroSlide(editing.id, payload); else addHeroSlide(payload); setView('list'); }

  if (view === 'edit') {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <h3 className="text-xl font-bold text-ink-900 mb-6">{editing ? 'Modifier le slide' : 'Nouveau slide'}</h3>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Sur-titre *</label><input type="text" required value={formData.eyebrow} onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })} placeholder="Applications Web" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Titre *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Nous concevons les" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Texte mis en avant *</label><input type="text" required value={formData.highlight} onChange={(e) => setFormData({ ...formData, highlight: e.target.value })} placeholder="solutions digitales" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Sous-titre *</label><textarea required rows={2} value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Description..." className={textareaClass} /></div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-ink-700 mb-2">Label du bouton</label><input type="text" value={formData.cta_label} onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })} placeholder="Voir nos réalisations" className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-ink-700 mb-2">Lien du bouton</label><input type="text" value={formData.cta_to} onChange={(e) => setFormData({ ...formData, cta_to: e.target.value })} placeholder="/projects" className={inputClass} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-ink-700 mb-2">Couleur d'accent</label><select value={formData.accent} onChange={(e) => setFormData({ ...formData, accent: e.target.value })} className={inputClass}><option value="primary">Primary</option><option value="secondary">Secondary</option></select></div>
              <div><label className="block text-sm font-medium text-ink-700 mb-2">Mockup</label><select value={formData.mockup} onChange={(e) => setFormData({ ...formData, mockup: e.target.value })} className={inputClass}><option value="dashboard">Dashboard</option><option value="mobile">Mobile</option><option value="saas">SaaS</option></select></div>
            </div>
          </div>
          <div className="flex gap-3"><Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button><Button type="button" variant="outline" size="md" onClick={() => setView('list')}>Annuler</Button></div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouveau slide</Button></div>
      <div className="grid sm:grid-cols-2 gap-4">
        {heroSlides.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="flex items-start justify-between mb-3"><span className="px-2.5 py-1 rounded-md bg-ink-100 text-ink-600 text-xs font-semibold">{s.eyebrow}</span>
              <div className="flex items-center gap-1"><button onClick={() => handleEdit(s)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button><button onClick={() => setDeleteConfirm(s)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button></div></div>
            <p className="text-sm font-bold text-ink-900">{s.title} <span className="text-primary-600">{s.highlight}</span></p>
            <p className="text-xs text-ink-500 line-clamp-2 mt-1">{s.subtitle}</p>
          </motion.div>
        ))}
      </div>
      <DeleteConfirm deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} onDelete={() => deleteHeroSlide(deleteConfirm!.id)} label={deleteConfirm?.title} />
    </div>
  );
}

function StatsTab() {
  const queryClient = useQueryClient();
  const { data: stats = [] } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  const addStat = useMutation({
    mutationFn: (stat: { value: number; suffix: string; label: string }) => insertStat(stat),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stats'] }),
  }).mutate;
  const updateStatMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Stat> }) => updateStatApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stats'] }),
  });
  const updateStat = (id: string, data: Partial<Stat>) => updateStatMutation.mutate({ id, data });
  const deleteStat = useMutation({
    mutationFn: (id: string) => deleteStatApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stats'] }),
  }).mutate;
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<Stat | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Stat | null>(null);
  const [formData, setFormData] = useState({ value: 0, suffix: '', label: '' });

  function handleEdit(s: Stat) { setEditing(s); setFormData({ value: s.value, suffix: s.suffix, label: s.label }); setView('edit'); }
  function handleCreate() { setEditing(null); setFormData({ value: 0, suffix: '+', label: '' }); setView('edit'); }
  function handleSave(e: React.FormEvent) { e.preventDefault(); const payload = { value: Number(formData.value), suffix: formData.suffix, label: formData.label }; if (editing) updateStat(editing.id, payload); else addStat(payload); setView('list'); }

  if (view === 'edit') {
    return (
      <div className="max-w-md mx-auto">
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <h3 className="text-xl font-bold text-ink-900 mb-6">{editing ? 'Modifier la stat' : 'Nouvelle stat'}</h3>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Valeur *</label><input type="number" required value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Suffixe</label><input type="text" value={formData.suffix} onChange={(e) => setFormData({ ...formData, suffix: e.target.value })} placeholder="+" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Label *</label><input type="text" required value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} placeholder="Projets livrés" className={inputClass} /></div>
          </div>
          <div className="flex gap-3"><Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button><Button type="button" variant="outline" size="md" onClick={() => setView('list')}>Annuler</Button></div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouvelle stat</Button></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="flex items-start justify-between mb-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><TrendingUp className="h-5 w-5" /></div>
              <div className="flex items-center gap-1"><button onClick={() => handleEdit(s)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button><button onClick={() => setDeleteConfirm(s)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button></div></div>
            <p className="text-3xl font-bold text-ink-900">{s.value}<span className="text-primary-500">{s.suffix}</span></p><p className="text-xs text-ink-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <DeleteConfirm deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} onDelete={() => deleteStat(deleteConfirm!.id)} label={deleteConfirm?.label} />
    </div>
  );
}

function ClientsTab() {
  const queryClient = useQueryClient();
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: fetchClients });
  const addClient = useMutation({
    mutationFn: (c: { name: string }) => insertClient(c),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  }).mutate;
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => updateClientApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });
  const updateClient = (id: string, data: Partial<Client>) => updateClientMutation.mutate({ id, data });
  const deleteClient = useMutation({
    mutationFn: (id: string) => deleteClientApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  }).mutate;
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<Client | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  function handleEdit(c: Client) { setEditing(c); setFormData({ name: c.name }); setView('edit'); }
  function handleCreate() { setEditing(null); setFormData({ name: '' }); setView('edit'); }
  function handleSave(e: React.FormEvent) { e.preventDefault(); const payload = { name: formData.name }; if (editing) updateClient(editing.id, payload); else addClient(payload); setView('list'); }

  if (view === 'edit') {
    return (
      <div className="max-w-md mx-auto">
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <h3 className="text-xl font-bold text-ink-900 mb-6">{editing ? 'Modifier le client' : 'Nouveau client'}</h3>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5"><div><label className="block text-sm font-medium text-ink-700 mb-2">Nom *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="EventFlow CI" className={inputClass} /></div></div>
          <div className="flex gap-3"><Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button><Button type="button" variant="outline" size="md" onClick={() => setView('list')}>Annuler</Button></div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouveau client</Button></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {clients.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5 flex items-center justify-between">
            <p className="text-sm font-bold text-ink-900">{c.name}</p>
            <div className="flex items-center gap-1"><button onClick={() => handleEdit(c)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button><button onClick={() => setDeleteConfirm(c)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button></div>
          </motion.div>
        ))}
      </div>
      <DeleteConfirm deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} onDelete={() => deleteClient(deleteConfirm!.id)} label={deleteConfirm?.name} />
    </div>
  );
}

function WhyUsTab() {
  const queryClient = useQueryClient();
  const { data: whyUs = [] } = useQuery({ queryKey: ['whyUs'], queryFn: fetchWhyUs });
  const addWhyUs = useMutation({
    mutationFn: (w: { icon: string; title: string; description: string }) => insertWhyUs(w),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whyUs'] }),
  }).mutate;
  const updateWhyUsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WhyUsReason> }) => updateWhyUsApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whyUs'] }),
  });
  const updateWhyUs = (id: string, data: Partial<WhyUsReason>) => updateWhyUsMutation.mutate({ id, data });
  const deleteWhyUs = useMutation({
    mutationFn: (id: string) => deleteWhyUsApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whyUs'] }),
  }).mutate;
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<WhyUsReason | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<WhyUsReason | null>(null);
  const [formData, setFormData] = useState({ icon: 'Layers', title: '', description: '' });
  const iconOptions = ['Layers', 'TrendingUp', 'Target', 'Sparkles', 'LifeBuoy', 'Award', 'Zap', 'Shield', 'Heart', 'Compass'];

  function handleEdit(w: WhyUsReason) { setEditing(w); setFormData({ icon: w.icon, title: w.title, description: w.description }); setView('edit'); }
  function handleCreate() { setEditing(null); setFormData({ icon: 'Layers', title: '', description: '' }); setView('edit'); }
  function handleSave(e: React.FormEvent) { e.preventDefault(); const payload = { icon: formData.icon, title: formData.title, description: formData.description }; if (editing) updateWhyUs(editing.id, payload); else addWhyUs(payload); setView('list'); }

  if (view === 'edit') {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <h3 className="text-xl font-bold text-ink-900 mb-6">{editing ? 'Modifier la raison' : 'Nouvelle raison'}</h3>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 space-y-5">
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Icône</label><select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className={inputClass}>{iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Titre *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Expertise complète" className={inputClass} /></div>
            <div><label className="block text-sm font-medium text-ink-700 mb-2">Description *</label><textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description..." className={textareaClass} /></div>
          </div>
          <div className="flex gap-3"><Button type="submit" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button><Button type="button" variant="outline" size="md" onClick={() => setView('list')}>Annuler</Button></div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouvelle raison</Button></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {whyUs.map((w, i) => (
          <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="flex items-start justify-between mb-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Sparkles className="h-5 w-5" /></div>
              <div className="flex items-center gap-1"><button onClick={() => handleEdit(w)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button><button onClick={() => setDeleteConfirm(w)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button></div></div>
            <h3 className="text-sm font-bold text-ink-900 mb-1">{w.title}</h3><p className="text-xs text-ink-500 line-clamp-3">{w.description}</p>
          </motion.div>
        ))}
      </div>
      <DeleteConfirm deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} onDelete={() => deleteWhyUs(deleteConfirm!.id)} label={deleteConfirm?.title} />
    </div>
  );
}

function DeleteConfirm({ deleteConfirm, setDeleteConfirm, onDelete, label }: { deleteConfirm: { id: string } | null; setDeleteConfirm: (v: null) => void; onDelete: () => void; label?: string }) {
  return (
    <AnimatePresence>
      {deleteConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500"><Trash2 className="h-6 w-6" /></div><div className="flex-1"><h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer ?</h3><p className="text-sm text-ink-500">Supprimer « {label} » ?</p></div><button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400"><X className="h-5 w-5" /></button></div>
            <div className="flex gap-3 mt-6"><Button variant="primary" size="md" onClick={() => { onDelete(); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700">Supprimer</Button><Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>Annuler</Button></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
