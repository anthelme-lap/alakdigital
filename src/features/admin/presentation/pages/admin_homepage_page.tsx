import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit3, Trash2, X, Save, ArrowLeft, BarChart3, Image, TrendingUp, Users, Sparkles, Layout } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchHeroSlides, insertHeroSlide, updateHeroSlide as updateHeroSlideApi, deleteHeroSlide as deleteHeroSlideApi,
  fetchStats, insertStat, updateStat as updateStatApi, deleteStat as deleteStatApi,
  fetchClients, insertClient, updateClient as updateClientApi, deleteClient as deleteClientApi,
  fetchWhyUs, insertWhyUs, updateWhyUs as updateWhyUsApi, deleteWhyUs as deleteWhyUsApi,
} from '@/features/content/infrastructure/content_api';
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui';
import {
  heroSlideSchema, type HeroSlideFormValues,
  statSchema, type StatFormValues, type StatFormInput,
  clientSchema, type ClientFormValues,
  whyUsSchema, type WhyUsFormValues,
} from '../forms/homepage_schema';
import type { HeroSlide, Stat, Client, WhyUsReason } from '@/features/content/domain/entities/content';

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

interface HeroSlideFormProps {
  defaultValues: HeroSlideFormValues;
  onSubmit: (values: HeroSlideFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function HeroSlideForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: HeroSlideFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HeroSlideFormValues>({
    resolver: zodResolver(heroSlideSchema),
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
                <Image className="h-5 w-5 text-primary-600" /> Contenu
              </CardTitle>
              <CardDescription>Textes du slide affiché en Hero</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <Input label="Sur-titre *" placeholder="Applications Web" error={errors.eyebrow?.message} {...register('eyebrow')} />
            <Input label="Titre *" placeholder="Nous concevons les" error={errors.title?.message} {...register('title')} />
            <Input label="Texte mis en avant *" placeholder="solutions digitales" error={errors.highlight?.message} {...register('highlight')} />
            <Textarea label="Sous-titre *" rows={2} placeholder="Description..." error={errors.subtitle?.message} {...register('subtitle')} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Layout className="h-5 w-5 text-primary-600" /> Apparence
              </CardTitle>
              <CardDescription>Bouton d'action et rendu visuel</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Label du bouton" placeholder="Voir nos réalisations" error={errors.cta_label?.message} {...register('cta_label')} />
              <Input label="Lien du bouton" placeholder="/projects" error={errors.cta_to?.message} {...register('cta_to')} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Couleur d'accent"
                options={[
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                ]}
                error={errors.accent?.message}
                {...register('accent')}
              />
              <Select
                label="Mockup"
                options={[
                  { value: 'dashboard', label: 'Dashboard' },
                  { value: 'mobile', label: 'Mobile' },
                  { value: 'saas', label: 'SaaS' },
                ]}
                error={errors.mockup?.message}
                {...register('mockup')}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification du slide' : 'Nouveau slide'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Sur-titre', value: values.eyebrow || null },
              { label: 'Titre', value: values.title || null },
              { label: 'Accent', value: values.accent || null },
              { label: 'Mockup', value: values.mockup || null },
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

function HeroTab() {
  const queryClient = useQueryClient();
  const { data: heroSlides = [] } = useQuery({ queryKey: ['heroSlides'], queryFn: fetchHeroSlides });
  const addHeroSlide = useMutation({
    mutationFn: (h: Omit<HeroSlide, 'id' | 'sort_order'>) => insertHeroSlide(h),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['heroSlides'] }),
  });
  const updateHeroSlideMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HeroSlide> }) => updateHeroSlideApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['heroSlides'] }),
  });
  const deleteHeroSlide = useMutation({
    mutationFn: (id: string) => deleteHeroSlideApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['heroSlides'] }),
  }).mutate;
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<HeroSlide | null>(null);

  function handleEdit(s: HeroSlide) { setEditing(s); setView('edit'); }
  function handleCreate() { setEditing(null); setView('edit'); }
  function handleSave(values: HeroSlideFormValues) {
    const payload = {
      eyebrow: values.eyebrow,
      title: values.title,
      highlight: values.highlight,
      subtitle: values.subtitle,
      cta_label: values.cta_label ?? '',
      cta_to: values.cta_to ?? '',
      accent: values.accent,
      mockup: values.mockup,
    };
    if (editing) updateHeroSlideMutation.mutate({ id: editing.id, data: payload });
    else addHeroSlide.mutate(payload);
    setView('list');
  }

  if (view === 'edit') {
    return (
      <div>
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-ink-900">{editing ? 'Modifier le slide' : 'Nouveau slide'}</h3>
        </div>
        <HeroSlideForm
          defaultValues={editing ? {
            eyebrow: editing.eyebrow, title: editing.title, highlight: editing.highlight, subtitle: editing.subtitle,
            cta_label: editing.cta_label, cta_to: editing.cta_to, accent: editing.accent, mockup: editing.mockup,
          } : { eyebrow: '', title: '', highlight: '', subtitle: '', cta_label: '', cta_to: '/', accent: 'primary', mockup: 'dashboard' }}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={addHeroSlide.isPending || updateHeroSlideMutation.isPending}
          isEdit={!!editing}
        />
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

interface StatFormProps {
  defaultValues: StatFormInput;
  onSubmit: (values: StatFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function StatForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: StatFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StatFormInput, unknown, StatFormValues>({
    resolver: zodResolver(statSchema),
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
                <TrendingUp className="h-5 w-5 text-primary-600" /> Statistique
              </CardTitle>
              <CardDescription>Chiffre clé affiché sur la page d'accueil</CardDescription>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Valeur *" type="number" error={errors.value?.message} {...register('value')} />
            <Input label="Suffixe" placeholder="+" error={errors.suffix?.message} {...register('suffix')} />
            <Input label="Label *" placeholder="Projets livrés" className="sm:col-span-2" error={errors.label?.message} {...register('label')} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification de la stat' : 'Nouvelle stat'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Valeur', value: values.value !== '' && values.value != null ? `${values.value}${values.suffix || ''}` : null },
              { label: 'Label', value: values.label || null },
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

function StatsTab() {
  const queryClient = useQueryClient();
  const { data: stats = [] } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  const addStat = useMutation({
    mutationFn: (stat: { value: number; suffix: string; label: string }) => insertStat(stat),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stats'] }),
  });
  const updateStatMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Stat> }) => updateStatApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stats'] }),
  });
  const deleteStat = useMutation({
    mutationFn: (id: string) => deleteStatApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stats'] }),
  }).mutate;
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<Stat | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Stat | null>(null);

  function handleEdit(s: Stat) { setEditing(s); setView('edit'); }
  function handleCreate() { setEditing(null); setView('edit'); }
  function handleSave(values: StatFormValues) {
    const payload = { value: values.value, suffix: values.suffix ?? '', label: values.label };
    if (editing) updateStatMutation.mutate({ id: editing.id, data: payload });
    else addStat.mutate(payload);
    setView('list');
  }

  if (view === 'edit') {
    return (
      <div>
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-ink-900">{editing ? 'Modifier la stat' : 'Nouvelle stat'}</h3>
        </div>
        <StatForm
          defaultValues={editing ? { value: editing.value, suffix: editing.suffix, label: editing.label } : { value: 0, suffix: '+', label: '' }}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={addStat.isPending || updateStatMutation.isPending}
          isEdit={!!editing}
        />
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

interface ClientFormProps {
  defaultValues: ClientFormValues;
  onSubmit: (values: ClientFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function ClientForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
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
                <Users className="h-5 w-5 text-primary-600" /> Client
              </CardTitle>
              <CardDescription>Logo/nom affiché dans la liste des clients</CardDescription>
            </div>
          </CardHeader>
          <Input label="Nom *" placeholder="EventFlow CI" error={errors.name?.message} {...register('name')} />
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification du client' : 'Nouveau client'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[{ label: 'Nom', value: values.name || null }].map(({ label, value }) => (
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

function ClientsTab() {
  const queryClient = useQueryClient();
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: fetchClients });
  const addClient = useMutation({
    mutationFn: (c: { name: string }) => insertClient(c),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => updateClientApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });
  const deleteClient = useMutation({
    mutationFn: (id: string) => deleteClientApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  }).mutate;
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<Client | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null);

  function handleEdit(c: Client) { setEditing(c); setView('edit'); }
  function handleCreate() { setEditing(null); setView('edit'); }
  function handleSave(values: ClientFormValues) {
    const payload = { name: values.name };
    if (editing) updateClientMutation.mutate({ id: editing.id, data: payload });
    else addClient.mutate(payload);
    setView('list');
  }

  if (view === 'edit') {
    return (
      <div>
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-ink-900">{editing ? 'Modifier le client' : 'Nouveau client'}</h3>
        </div>
        <ClientForm
          defaultValues={editing ? { name: editing.name } : { name: '' }}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={addClient.isPending || updateClientMutation.isPending}
          isEdit={!!editing}
        />
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

const iconOptions = ['Layers', 'TrendingUp', 'Target', 'Sparkles', 'LifeBuoy', 'Award', 'Zap', 'Shield', 'Heart', 'Compass'];

interface WhyUsFormProps {
  defaultValues: WhyUsFormValues;
  onSubmit: (values: WhyUsFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function WhyUsForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: WhyUsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WhyUsFormValues>({
    resolver: zodResolver(whyUsSchema),
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
                <Sparkles className="h-5 w-5 text-primary-600" /> Raison
              </CardTitle>
              <CardDescription>Argument affiché dans la section "Pourquoi nous"</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <Select
              label="Icône"
              options={iconOptions.map((ic) => ({ value: ic, label: ic }))}
              error={errors.icon?.message}
              {...register('icon')}
            />
            <Input label="Titre *" placeholder="Expertise complète" error={errors.title?.message} {...register('title')} />
            <Textarea label="Description *" rows={3} placeholder="Description..." error={errors.description?.message} {...register('description')} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification de la raison' : 'Nouvelle raison'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Icône', value: values.icon || null },
              { label: 'Titre', value: values.title || null },
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

function WhyUsTab() {
  const queryClient = useQueryClient();
  const { data: whyUs = [] } = useQuery({ queryKey: ['whyUs'], queryFn: fetchWhyUs });
  const addWhyUs = useMutation({
    mutationFn: (w: { icon: string; title: string; description: string }) => insertWhyUs(w),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whyUs'] }),
  });
  const updateWhyUsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WhyUsReason> }) => updateWhyUsApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whyUs'] }),
  });
  const deleteWhyUs = useMutation({
    mutationFn: (id: string) => deleteWhyUsApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whyUs'] }),
  }).mutate;
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<WhyUsReason | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<WhyUsReason | null>(null);

  function handleEdit(w: WhyUsReason) { setEditing(w); setView('edit'); }
  function handleCreate() { setEditing(null); setView('edit'); }
  function handleSave(values: WhyUsFormValues) {
    const payload = { icon: values.icon, title: values.title, description: values.description };
    if (editing) updateWhyUsMutation.mutate({ id: editing.id, data: payload });
    else addWhyUs.mutate(payload);
    setView('list');
  }

  if (view === 'edit') {
    return (
      <div>
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Retour</button>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-ink-900">{editing ? 'Modifier la raison' : 'Nouvelle raison'}</h3>
        </div>
        <WhyUsForm
          defaultValues={editing ? { icon: editing.icon, title: editing.title, description: editing.description } : { icon: 'Layers', title: '', description: '' }}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={addWhyUs.isPending || updateWhyUsMutation.isPending}
          isEdit={!!editing}
        />
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
