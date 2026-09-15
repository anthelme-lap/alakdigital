import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Save, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTeam, insertTeamMember, updateTeamMember, deleteTeamMember } from '@/features/content/infrastructure/content_api';
import { Button } from '@/shared/ui';
import { FormDrawer, DrawerField, drawerInputClass } from '@/features/admin/presentation/components/form_drawer';
import type { TeamMember } from '@/features/content/domain/entities/content';

interface FormData { name: string; role: string; image: string; tools: string; }
function emptyForm(): FormData { return { name: '', role: '', image: '', tools: '' }; }
function toFormData(m: TeamMember): FormData { return { name: m.name, role: m.role, image: m.image, tools: m.tools.join(', ') }; }

export function AdminTeamPage() {
  const queryClient = useQueryClient();
  const { data: team = [] } = useQuery({ queryKey: ['team'], queryFn: fetchTeam });
  const insertMutation = useMutation({ mutationFn: insertTeamMember, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }) });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<TeamMember>) => updateTeamMember(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }),
  });
  const deleteMutation = useMutation({ mutationFn: deleteTeamMember, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] }) });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm());

  function handleEdit(m: TeamMember) { setEditing(m); setFormData(toFormData(m)); setDrawerOpen(true); }
  function handleCreate() { setEditing(null); setFormData(emptyForm()); setDrawerOpen(true); }
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name: formData.name, role: formData.role, image: formData.image, tools: formData.tools.split(',').map((t) => t.trim()).filter(Boolean) };
    if (editing) updateMutation.mutate({ id: editing.id, ...payload });
    else insertMutation.mutate(payload);
    setDrawerOpen(false);
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

      <FormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Modifier le membre' : 'Nouveau membre'}
        subtitle={editing ? editing.name : 'Ajoutez un membre à l\'équipe'}
        footer={
          <>
            <Button type="submit" form="team-form" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button>
            <Button type="button" variant="outline" size="md" onClick={() => setDrawerOpen(false)}>Annuler</Button>
          </>
        }
      >
        <form id="team-form" onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 space-y-5">
            <DrawerField label="Nom" required><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Kouassi Aristide" className={drawerInputClass} /></DrawerField>
            <DrawerField label="Rôle" required><input type="text" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="Lead Developer" className={drawerInputClass} /></DrawerField>
            <DrawerField label="Photo (URL)">
              <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." className={drawerInputClass} />
              {formData.image && <div className="mt-3 rounded-xl overflow-hidden border border-ink-100 max-h-48"><img src={formData.image} alt="Aperçu" className="w-full h-full object-cover" /></div>}
            </DrawerField>
            <DrawerField label="Outils (séparés par des virgules)"><input type="text" value={formData.tools} onChange={(e) => setFormData({ ...formData, tools: e.target.value })} placeholder="React, TypeScript, Docker" className={drawerInputClass} /></DrawerField>
          </div>
        </form>
      </FormDrawer>

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
