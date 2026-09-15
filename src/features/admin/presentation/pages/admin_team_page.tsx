import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit3, Trash2, Eye, X, Save, Users, ArrowLeft, UserCircle, Tag } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTeam, insertTeamMember, updateTeamMember, deleteTeamMember } from '@/features/content/infrastructure/content_api';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, Badge, ImageUpload } from '@/shared/ui';
import { teamSchema, type TeamFormValues } from '../forms/team_schema';
import type { TeamMember } from '@/features/content/domain/entities/content';

type View = 'list' | 'edit' | 'detail';

function toFormData(m: TeamMember): TeamFormValues {
  return {
    name: m.name,
    role: m.role,
    image: m.image,
    tools: m.tools.join(', '),
  };
}

function emptyForm(): TeamFormValues {
  return { name: '', role: '', image: '', tools: '' };
}

function fromCommaList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

interface TeamMemberFormProps {
  defaultValues: TeamFormValues;
  onSubmit: (values: TeamFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

function TeamMemberForm({ defaultValues, onSubmit, onCancel, loading, isEdit = false }: TeamMemberFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
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
                <UserCircle className="h-5 w-5 text-primary-600" /> Identité
              </CardTitle>
              <CardDescription>Informations du membre de l'équipe</CardDescription>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nom *" placeholder="Kouassi Aristide" error={errors.name?.message} {...register('name')} />
            <Input label="Rôle *" placeholder="Lead Developer" error={errors.role?.message} {...register('role')} />
            <Input
              label="Outils (virgule)"
              placeholder="React, TypeScript, Docker"
              className="sm:col-span-2"
              error={errors.tools?.message}
              {...register('tools')}
            />
          </div>
          <div className="mt-4">
            <ImageUpload
              label="Photo"
              folder="team"
              value={values.image ?? ''}
              onChange={(url) => setValue('image', url, { shouldValidate: true })}
              error={errors.image?.message}
            />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>{isEdit ? 'Modification du membre' : 'Nouveau membre'}</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Nom', value: values.name || null },
              { label: 'Rôle', value: values.role || null },
              { label: 'Outils', value: values.tools || null },
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

interface TeamMemberDetailViewProps {
  member: TeamMember;
  onBack: () => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

function TeamMemberDetailView({ member, onBack, onEdit, onDelete }: TeamMemberDetailViewProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">{member.name}</h2>
          <p className="text-sm text-ink-500 mt-1">{member.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" leftIcon={<Edit3 className="h-4 w-4" />} onClick={() => onEdit(member)}>
            Modifier
          </Button>
          <Button variant="outline" size="md" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(member)} className="!text-red-600 !border-red-200 hover:!bg-red-50">
            Supprimer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <UserCircle className="h-5 w-5 text-primary-600" /> Identité
            </CardTitle>
            <CardDescription>Informations du membre de l'équipe</CardDescription>
          </div>
        </CardHeader>

        {member.image && (
          <div className="mb-4 rounded-xl overflow-hidden border border-ink-100 max-h-80">
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          </div>
        )}

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Nom</dt>
            <dd className="text-sm font-medium text-ink-900 mt-1">{member.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">Rôle</dt>
            <dd className="text-sm font-medium text-ink-900 mt-1">{member.role}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400 flex items-center gap-1.5 mb-2">
            <Tag className="h-3.5 w-3.5" /> Outils
          </dt>
          <div className="flex flex-wrap gap-2">
            {member.tools.length === 0 ? (
              <span className="text-sm text-ink-300">-</span>
            ) : (
              member.tools.map((tool) => (
                <Badge key={tool} variant="primary">{tool}</Badge>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function AdminTeamPage() {
  const queryClient = useQueryClient();
  const { data: team = [] } = useQuery({ queryKey: ['team'], queryFn: fetchTeam });
  const insertMutation = useMutation({ mutationFn: insertTeamMember, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }) });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<TeamMember>) => updateTeamMember(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }),
  });
  const deleteMutation = useMutation({ mutationFn: deleteTeamMember, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }) });

  const [view, setView] = useState<View>('list');
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<TeamMember | null>(null);

  function handleEdit(m: TeamMember) {
    setEditing(m);
    setView('edit');
  }

  function handleView(m: TeamMember) {
    setViewingMember(m);
    setView('detail');
  }

  function handleCreate() {
    setEditing(null);
    setView('edit');
  }

  function handleSave(values: TeamFormValues) {
    const payload = {
      name: values.name,
      role: values.role,
      image: values.image ?? '',
      tools: fromCommaList(values.tools ?? ''),
    };
    if (editing) updateMutation.mutate({ id: editing.id, ...payload });
    else insertMutation.mutate(payload);
    setView('list');
  }

  if (view === 'detail' && viewingMember) {
    return (
      <TeamMemberDetailView
        member={viewingMember}
        onBack={() => setView('list')}
        onEdit={handleEdit}
        onDelete={(m) => setDeleteConfirm(m)}
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
          <h2 className="text-2xl font-bold text-ink-900">{editing ? 'Modifier le membre' : 'Nouveau membre'}</h2>
          <p className="text-sm text-ink-500 mt-1">{editing ? editing.name : "Ajoutez un membre à l'équipe"}</p>
        </div>

        <TeamMemberForm
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
        <div><h2 className="text-2xl font-bold text-ink-900">Équipe</h2><p className="text-sm text-ink-500 mt-1">Gérez les membres de l'équipe</p></div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Nouveau membre</Button>
      </div>

      {team.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white"><Users className="h-12 w-12 text-ink-300 mx-auto mb-3" /><p className="text-ink-500 mb-4">Aucun membre</p><Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>Ajouter</Button></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3) }} className="rounded-2xl border border-ink-100 bg-white p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-ink-100 flex-shrink-0"><img src={m.image} alt={m.name} className="h-full w-full object-cover" /></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleView(m)} className="p-2 rounded-lg text-ink-400 hover:text-primary-600 hover:bg-primary-50 transition-all"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => handleEdit(m)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteConfirm(m)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-ink-900">{m.name}</h3>
              <p className="text-xs text-primary-600 font-medium mb-3">{m.role}</p>
              <div className="flex flex-wrap gap-1">{m.tools.map((t) => <span key={t} className="px-2 py-0.5 rounded bg-ink-100 text-ink-600 text-[10px] font-semibold">{t}</span>)}</div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500"><Trash2 className="h-6 w-6" /></div><div className="flex-1"><h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer ce membre ?</h3><p className="text-sm text-ink-500">Supprimer « {deleteConfirm.name} » ?</p></div><button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400"><X className="h-5 w-5" /></button></div>
              <div className="flex gap-3 mt-6"><Button variant="primary" size="md" onClick={() => { deleteMutation.mutate(deleteConfirm.id); setDeleteConfirm(null); }} className="!bg-red-600 hover:!bg-red-700">Supprimer</Button><Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>Annuler</Button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
