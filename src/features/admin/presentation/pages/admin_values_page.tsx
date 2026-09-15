import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Save, Award } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchValues, insertValue, updateValue, deleteValue } from '@/features/content/infrastructure/content_api';
import { Button } from '@/shared/ui';
import { FormDrawer, DrawerField, drawerInputClass, drawerTextareaClass } from '@/features/admin/presentation/components/form_drawer';
import type { Value } from '@/features/content/domain/entities/content';

const iconOptions = ['Award', 'Zap', 'Shield', 'Target', 'Heart', 'Compass', 'Star', 'Sparkles', 'CheckCircle2', 'Rocket'];

interface FormData { icon: string; title: string; description: string; }
const emptyForm: FormData = { icon: 'Award', title: '', description: '' };
const toFormData = (v: Value): FormData => ({ icon: v.icon, title: v.title, description: v.description });

export function AdminValuesPage() {
  const queryClient = useQueryClient();
  const { data: values = [] } = useQuery({ queryKey: ['values'], queryFn: fetchValues });
  const insertMutation = useMutation({ mutationFn: insertValue, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['values'] }) });
  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Value>) => updateValue(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['values'] }),
  });
  const deleteMutation = useMutation({ mutationFn: deleteValue, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['values'] }) });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Value | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Value | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  function handleEdit(v: Value) { setEditing(v); setFormData(toFormData(v)); setDrawerOpen(true); }
  function handleCreate() { setEditing(null); setFormData(emptyForm); setDrawerOpen(true); }
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = { icon: formData.icon, title: formData.title, description: formData.description };
    if (editing) updateMutation.mutate({ id: editing.id, ...payload });
    else insertMutation.mutate(payload);
    setDrawerOpen(false);
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
                <div className="flex items-center gap-1"><button onClick={() => handleEdit(v)} className="p-2 rounded-lg text-ink-400 hover:text-secondary-600 hover:bg-secondary-50 transition-all"><Edit3 className="h-4 w-4" /></button><button onClick={() => setDeleteConfirm(v)} className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button></div></div>
              <h3 className="text-sm font-bold text-ink-900 mb-1">{v.title}</h3><p className="text-xs text-ink-500 line-clamp-3">{v.description}</p>
            </motion.div>
          ))}
        </div>
      )}

      <FormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Modifier la valeur' : 'Nouvelle valeur'}
        subtitle={editing ? editing.title : 'Ajoutez une nouvelle valeur'}
        footer={
          <>
            <Button type="submit" form="value-form" variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>Enregistrer</Button>
            <Button type="button" variant="outline" size="md" onClick={() => setDrawerOpen(false)}>Annuler</Button>
          </>
        }
      >
        <form id="value-form" onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 space-y-5">
            <DrawerField label="Icône"><select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className={drawerInputClass}>{iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}</select></DrawerField>
            <DrawerField label="Titre" required><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Excellence" className={drawerInputClass} /></DrawerField>
            <DrawerField label="Description" required><textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description de la valeur" className={drawerTextareaClass} /></DrawerField>
          </div>
        </form>
      </FormDrawer>

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
