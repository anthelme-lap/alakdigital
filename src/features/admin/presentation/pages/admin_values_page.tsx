import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit3, Trash2, Eye, X, Save, Award, ArrowLeft, Info, FileText } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchValues, insertValue, updateValue, deleteValue } from '@/features/content/infrastructure/content_api';
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui';
import { valueSchema, type ValueFormValues } from '../forms/value_schema';
import type { Value } from '@/features/content/domain/entities/content';

type View = 'list' | 'edit' | 'detail';

const iconOptions = ['Award', 'Zap', 'Shield', 'Target', 'Heart', 'Compass', 'Star', 'Sparkles', 'CheckCircle2', 'Rocket'];
const iconSelectOptions = iconOptions.map((ic) => ({ value: ic, label: ic }));

function toFormData(v: Value): ValueFormValues {
  return { icon: v.icon, title: v.title, description: v.description };
}

function emptyForm(): ValueFormValues {
  return { icon: 'Award', title: '', description: '' };
}

interface ValueFormProps {
  defaultValues: ValueFormValues;
  onSubmit: (values: ValueFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function ValueForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: ValueFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ValueFormValues>({
    resolver: zodResolver(valueSchema),
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
                <Info className="h-5 w-5 text-primary-600" /> Identité
              </CardTitle>
              <CardDescription>Informations générales de la valeur</CardDescription>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Icône *" options={iconSelectOptions} error={errors.icon?.message} {...register('icon')} />
            <Input label="Titre *" placeholder="Excellence" error={errors.title?.message} {...register('title')} />
          </div>
          <div className="mt-4">
            <Textarea label="Description *" rows={3} placeholder="Description de la valeur" error={errors.description?.message} {...register('description')} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification de la valeur' : 'Nouvelle valeur'}</CardDescription>
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

interface ValueDetailViewProps {
  value: Value;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ValueDetailView({ value, onBack, onEdit, onDelete }: ValueDetailViewProps) {
  const Icon = (Icons as unknown as Record<string, typeof Icons.Award>)[value.icon] ?? Icons.Award;

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </button>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">{value.title}</h2>
          <p className="text-sm text-ink-500 mt-1">Détail de la valeur</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" leftIcon={<Edit3 className="h-4 w-4" />} onClick={onEdit}>
            Modifier
          </Button>
          <Button variant="outline" size="md" leftIcon={<Trash2 className="h-4 w-4" />} onClick={onDelete} className="!text-red-600 !border-red-200 hover:!bg-red-50">
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <Info className="h-5 w-5 text-primary-600" /> Identité
            </CardTitle>
            <CardDescription>Informations générales de la valeur</CardDescription>
          </div>
        </CardHeader>

        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-50 text-primary-600 mb-4">
          <Icon className="h-8 w-8" />
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-ink-400 mb-1">Icône</dt>
            <dd className="text-sm font-medium text-ink-900">{value.icon}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-ink-400 mb-1">Titre</dt>
            <dd className="text-sm font-medium text-ink-900">{value.title}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <dt className="text-xs font-semibold uppercase text-ink-400 mb-1 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Description
          </dt>
          <dd className="text-sm text-ink-700 leading-relaxed">{value.description}</dd>
        </div>
      </Card>
    </div>
  );
}

export function AdminValuesPage() {
  const queryClient = useQueryClient();
  const { data: values = [] } = useQuery({ queryKey: ['values'], queryFn: fetchValues });
  const insertMutation = useMutation({ mutationFn: insertValue, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['values'] }) });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Value>) => updateValue(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['values'] }),
  });
  const deleteMutation = useMutation({ mutationFn: deleteValue, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['values'] }) });

  const [view, setView] = useState<View>('list');
  const [editing, setEditing] = useState<Value | null>(null);
  const [viewingValue, setViewingValue] = useState<Value | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Value | null>(null);

  function handleView(v: Value) {
    setViewingValue(v);
    setView('detail');
  }

  function handleEdit(v: Value) {
    setEditing(v);
    setView('edit');
  }

  function handleCreate() {
    setEditing(null);
    setView('edit');
  }

  function handleSave(values: ValueFormValues) {
    const payload = { icon: values.icon, title: values.title, description: values.description };
    if (editing) updateMutation.mutate({ id: editing.id, ...payload });
    else insertMutation.mutate(payload);
    setView('list');
  }

  if (view === 'detail' && viewingValue) {
    return (
      <ValueDetailView
        value={viewingValue}
        onBack={() => setView('list')}
        onEdit={() => {
          setEditing(viewingValue);
          setView('edit');
        }}
        onDelete={() => setDeleteConfirm(viewingValue)}
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
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-900">
            {editing ? 'Modifier la valeur' : 'Nouvelle valeur'}
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            {editing ? editing.title : 'Ajoutez une nouvelle valeur'}
          </p>
        </div>

        <ValueForm
          defaultValues={editing ? toFormData(editing) : emptyForm()}
          onSubmit={handleSave}
          onCancel={() => setView('list')}
          loading={insertMutation.isPending || updateMutation.isPending}
          isEdit={!!editing}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-ink-900">Valeurs</h2><p className="text-sm text-ink-500 mt-1">Gérez les valeurs affichées sur la page À propos</p></div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouvelle valeur</Button>
      </div>

      {values.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white"><Award className="h-12 w-12 text-ink-300 mx-auto mb-3" /><p className="text-ink-500 mb-4">Aucune valeur</p><Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Ajouter</Button></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5 group">
              <div className="flex items-start justify-between mb-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Award className="h-5 w-5" /></div>
                <div className="flex items-center gap-1"><button onClick={() => handleView(v)} className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 transition-all" title="Voir"><Eye className="h-4 w-4" /></button><button onClick={() => handleEdit(v)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button><button onClick={() => setDeleteConfirm(v)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button></div></div>
              <h3 className="text-sm font-bold text-ink-900 mb-1">{v.title}</h3><p className="text-xs text-ink-500 line-clamp-3">{v.description}</p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500"><Trash2 className="h-6 w-6" /></div><div className="flex-1"><h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer ?</h3><p className="text-sm text-ink-500">Supprimer « {deleteConfirm.title} » ?</p></div><button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400"><X className="h-5 w-5" /></button></div>
              <div className="flex gap-3 mt-6"><Button variant="primary" size="md" onClick={() => { deleteMutation.mutate(deleteConfirm.id); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700">Supprimer</Button><Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>Annuler</Button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
