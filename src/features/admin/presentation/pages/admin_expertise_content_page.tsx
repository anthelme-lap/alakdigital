import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit3, Trash2, X, Save, ArrowLeft, Target, Info } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchExpertise, insertExpertise, updateExpertise as updateExpertiseApi, deleteExpertise as deleteExpertiseApi,
} from '@/features/content/infrastructure/content_api';
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui';
import { expertiseSchema, type ExpertiseFormValues } from '../forms/expertise_schema';
import type { ExpertiseDomain } from '@/features/content/domain/entities/content';

type View = 'list' | 'edit';

const iconOptions = ['Code2', 'Smartphone', 'Server', 'Database', 'Cloud', 'GitBranch', 'Shield', 'Cpu', 'Layers', 'Globe'];
const iconSelectOptions = iconOptions.map((ic) => ({ value: ic, label: ic }));

function toFormData(e: ExpertiseDomain): ExpertiseFormValues {
  return { icon: e.icon, label: e.label, description: e.description, technologies: e.technologies.join(', ') };
}

function emptyForm(): ExpertiseFormValues {
  return { icon: 'Code2', label: '', description: '', technologies: '' };
}

function fromCommaList(value: string): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

interface ExpertiseFormProps {
  defaultValues: ExpertiseFormValues;
  onSubmit: (values: ExpertiseFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function ExpertiseForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: ExpertiseFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExpertiseFormValues>({
    resolver: zodResolver(expertiseSchema),
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
              <CardDescription>Informations du domaine d'expertise</CardDescription>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Icône" options={iconSelectOptions} error={errors.icon?.message} {...register('icon')} />
            <Input label="Label *" placeholder="Frontend" error={errors.label?.message} {...register('label')} />
            <Input
              label="Technologies (virgule)"
              placeholder="React, TypeScript, Vite"
              className="sm:col-span-2"
              error={errors.technologies?.message}
              {...register('technologies')}
            />
          </div>
          <div className="mt-4">
            <Textarea label="Description *" rows={2} placeholder="Description courte" error={errors.description?.message} {...register('description')} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification du domaine' : 'Nouveau domaine'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Label', value: values.label || null },
              { label: 'Icône', value: values.icon || null },
              { label: 'Technologies', value: values.technologies || null },
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

export function AdminExpertiseContentPage() {
  const queryClient = useQueryClient();
  const { data: expertise = [] } = useQuery({ queryKey: ['expertise'], queryFn: fetchExpertise });
  const insertMutation = useMutation({
    mutationFn: (e: { icon: string; label: string; description: string; technologies: string[] }) => insertExpertise(e),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expertise'] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpertiseDomain> }) => updateExpertiseApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expertise'] }),
  });
  const deleteExpertise = useMutation({
    mutationFn: (id: string) => deleteExpertiseApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expertise'] }),
  }).mutate;
  const [view, setView] = useState<View>('list');
  const [editing, setEditing] = useState<ExpertiseDomain | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ExpertiseDomain | null>(null);

  function handleEdit(e: ExpertiseDomain) { setEditing(e); setView('edit'); }
  function handleCreate() { setEditing(null); setView('edit'); }

  function handleSave(values: ExpertiseFormValues) {
    const payload = {
      icon: values.icon,
      label: values.label,
      description: values.description,
      technologies: fromCommaList(values.technologies ?? ''),
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      insertMutation.mutate(payload);
    }
    setView('list');
  }

  if (view === 'edit') {
    return (
      <div>
        <button onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-900">{editing ? 'Modifier le domaine' : 'Nouveau domaine'}</h2>
          <p className="text-sm text-ink-500 mt-1">{editing ? editing.label : "Ajoutez un nouveau domaine d'expertise"}</p>
        </div>

        <ExpertiseForm
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
