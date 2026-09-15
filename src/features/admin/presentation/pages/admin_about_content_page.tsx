import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit3, Trash2, X, Save, ArrowLeft, Award, Target } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchMissionVision, updateMissionVision as updateMissionVisionApi,
  fetchPillars, insertPillar, updatePillar as updatePillarApi, deletePillar as deletePillarApi,
} from '@/features/content/infrastructure/content_api';
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui';
import { missionVisionSchema, type MissionVisionFormValues, pillarSchema, type PillarFormValues } from '../forms/about_content_schema';
import type { MissionVision, AboutPillar } from '@/features/content/domain/entities/content';

const iconOptions = ['Target', 'Eye', 'Award', 'Rocket', 'Compass', 'Star', 'Shield', 'Zap', 'Heart', 'Sparkles'];
const iconSelectOptions = iconOptions.map((ic) => ({ value: ic, label: ic }));

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

interface MissionVisionFormProps {
  defaultValues: MissionVisionFormValues;
  onSubmit: (values: MissionVisionFormValues) => void;
  onCancel: () => void;
  loading: boolean;
}

function MissionVisionForm({ defaultValues, onSubmit, onCancel, loading }: MissionVisionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MissionVisionFormValues>({
    resolver: zodResolver(missionVisionSchema),
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
                <Target className="h-5 w-5 text-primary-600" /> Contenu
              </CardTitle>
              <CardDescription>Informations de la section mission / vision</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Icône" options={iconSelectOptions} error={errors.icon?.message} {...register('icon')} />
              <Input label="Label *" placeholder="Notre mission" error={errors.label?.message} {...register('label')} />
            </div>
            <Input label="Titre *" error={errors.title?.message} {...register('title')} />
            <Textarea label="Description *" rows={3} error={errors.description?.message} {...register('description')} />
            <Textarea
              label="Points"
              rows={4}
              placeholder={'Point 1\nPoint 2'}
              hint="Un point par ligne"
              error={errors.points?.message}
              {...register('points')}
            />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>Modification de la section</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Label', value: values.label || null },
              { label: 'Titre', value: values.title || null },
              { label: 'Icône', value: values.icon || null },
              { label: 'Points', value: values.points ? String(values.points.split('\n').filter((p) => p.trim()).length) : null },
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

function MissionTab() {
  const queryClient = useQueryClient();
  const { data: missionVision = [] } = useQuery({ queryKey: ['missionVision'], queryFn: fetchMissionVision });
  const updateMissionVisionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MissionVision> }) => updateMissionVisionApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['missionVision'] }),
  });
  const [editing, setEditing] = useState<MissionVision | null>(null);

  function handleEdit(mv: MissionVision) { setEditing(mv); }

  function handleSave(values: MissionVisionFormValues) {
    if (!editing) return;
    updateMissionVisionMutation.mutate({
      id: editing.id,
      data: {
        icon: values.icon,
        label: values.label,
        title: values.title,
        description: values.description,
        points: (values.points ?? '').split('\n').map((p) => p.trim()).filter(Boolean),
      },
    });
    setEditing(null);
  }

  if (editing) {
    return (
      <div>
        <button
          onClick={() => setEditing(null)}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-ink-900">Modifier « {editing.label} »</h3>
          <p className="text-sm text-ink-500 mt-1">{editing.title}</p>
        </div>

        <MissionVisionForm
          defaultValues={{
            icon: editing.icon,
            label: editing.label,
            title: editing.title,
            description: editing.description,
            points: editing.points.join('\n'),
          }}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
          loading={updateMissionVisionMutation.isPending}
        />
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

interface PillarFormProps {
  defaultValues: PillarFormValues;
  onSubmit: (values: PillarFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function PillarForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: PillarFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PillarFormValues>({
    resolver: zodResolver(pillarSchema),
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
                <Award className="h-5 w-5 text-primary-600" /> Pilier
              </CardTitle>
              <CardDescription>Informations du pilier</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <Select label="Icône" options={iconSelectOptions} error={errors.icon?.message} {...register('icon')} />
            <Input label="Titre *" placeholder="Expertise" error={errors.title?.message} {...register('title')} />
            <Textarea label="Description *" rows={3} error={errors.description?.message} {...register('description')} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification du pilier' : 'Nouveau pilier'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Titre', value: values.title || null },
              { label: 'Icône', value: values.icon || null },
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

function PillarsTab() {
  const queryClient = useQueryClient();
  const { data: pillars = [] } = useQuery({ queryKey: ['pillars'], queryFn: fetchPillars });
  const addPillarMutation = useMutation({
    mutationFn: (p: { icon: string; title: string; description: string }) => insertPillar(p),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pillars'] }),
  });
  const updatePillarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AboutPillar> }) => updatePillarApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pillars'] }),
  });
  const deletePillarMutation = useMutation({
    mutationFn: (id: string) => deletePillarApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pillars'] }),
  });
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<AboutPillar | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AboutPillar | null>(null);

  function handleEdit(p: AboutPillar) { setEditing(p); setView('edit'); }
  function handleCreate() { setEditing(null); setView('edit'); }
  function handleSave(values: PillarFormValues) {
    const payload = { icon: values.icon, title: values.title, description: values.description };
    if (editing) {
      updatePillarMutation.mutate({ id: editing.id, data: payload });
    } else {
      addPillarMutation.mutate(payload);
    }
    setView('list');
  }

  if (view === 'edit') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-ink-900">{editing ? 'Modifier le pilier' : 'Nouveau pilier'}</h3>
          <p className="text-sm text-ink-500 mt-1">{editing ? editing.title : 'Ajoutez un nouveau pilier'}</p>
        </div>

        <PillarForm
          defaultValues={editing ? { icon: editing.icon, title: editing.title, description: editing.description } : { icon: 'Target', title: '', description: '' }}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={addPillarMutation.isPending || updatePillarMutation.isPending}
          isEdit={!!editing}
        />
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
              <div className="flex gap-3 mt-6"><Button variant="primary" size="md" onClick={() => { deletePillarMutation.mutate(deleteConfirm.id); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700">Supprimer</Button><Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>Annuler</Button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
