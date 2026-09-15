import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, X, Save, ArrowLeft, Users, ShieldCheck, UserCog } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminUsers, createAdminUser, deleteAdminUser, type AdminUser } from '@/features/admin/infrastructure/admin_users_api';
import { useAuth } from '@/features/auth/presentation/contexts/auth_context';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/shared/ui';
import { adminUserSchema, type AdminUserFormValues } from '../forms/admin_user_schema';

type View = 'list' | 'create';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface UserFormProps {
  onSubmit: (values: AdminUserFormValues) => void;
  onCancel: () => void;
  loading: boolean;
  errorMessage: string | null;
}

function UserForm({ onSubmit, onCancel, loading, errorMessage }: UserFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: { fullName: '', email: '', password: '', role: 'admin' },
    mode: 'onChange',
  });

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <UserCog className="h-5 w-5 text-primary-600" /> Identite
              </CardTitle>
              <CardDescription>Informations du compte admin</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            {errorMessage && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{errorMessage}</p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Nom complet *" placeholder="Konan A." error={errors.fullName?.message} {...register('fullName')} />
              <Input label="Email *" type="email" placeholder="nom@alak-digital.com" error={errors.email?.message} {...register('email')} />
            </div>
            <Input label="Mot de passe *" type="password" placeholder="8 caracteres minimum" hint="A communiquer manuellement au nouvel utilisateur" error={errors.password?.message} {...register('password')} />
            <Select
              label="Role *"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'superadmin', label: 'Superadmin' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div>
              <CardTitle>Recapitulatif</CardTitle>
              <CardDescription>Nouvel utilisateur</CardDescription>
            </div>
          </CardHeader>

          <dl className="space-y-2 text-sm">
            {[
              { label: 'Nom', value: values.fullName || null },
              { label: 'Email', value: values.email || null },
              { label: 'Role', value: values.role === 'superadmin' ? 'Superadmin' : 'Admin' },
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
              Creer
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

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const { data: users = [] } = useQuery({ queryKey: ['adminUsers'], queryFn: fetchAdminUsers });

  const [view, setView] = useState<View>('list');
  const [deleteConfirm, setDeleteConfirm] = useState<AdminUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setErrorMessage(null);
      setView('list');
    },
    onError: (error: Error) => setErrorMessage(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });

  function handleCreate() {
    setErrorMessage(null);
    setView('create');
  }

  function handleSave(values: AdminUserFormValues) {
    createMutation.mutate(values);
  }

  if (view === 'create') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour a la liste
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-900">Nouvel utilisateur</h2>
          <p className="text-sm text-ink-500 mt-1">Ajoutez un compte admin ou superadmin</p>
        </div>

        <UserForm onSubmit={handleSave} onCancel={() => setView('list')} loading={createMutation.isPending} errorMessage={errorMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">Utilisateurs</h2>
          <p className="text-sm text-ink-500 mt-1">Gerez les comptes ayant acces a l'administration</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          Nouvel utilisateur
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white">
          <Users className="h-12 w-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 mb-4">Aucun utilisateur</p>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
            Creer un utilisateur
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500">Nom</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500 hidden sm:table-cell">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500 hidden md:table-cell">Cree le</th>
                  <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                    className="hover:bg-ink-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-ink-900">{u.fullName}</p>
                      <p className="text-xs text-ink-400 sm:hidden">{u.email}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-ink-500">{u.email}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {u.role === 'superadmin' ? (
                        <Badge variant="dark" size="sm">
                          <ShieldCheck className="h-3 w-3" /> Superadmin
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">Admin</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-ink-500">{formatDate(u.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDeleteConfirm(u)}
                          disabled={u.id === currentUser?.id}
                          title={u.id === currentUser?.id ? 'Vous ne pouvez pas supprimer votre propre compte' : 'Supprimer'}
                          className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 flex-shrink-0">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ink-900 mb-1">Supprimer cet utilisateur ?</h3>
                  <p className="text-sm text-ink-500">
                    Etes-vous sur de vouloir revoquer l'acces de « {deleteConfirm.fullName} » ? Cette action est irreversible.
                  </p>
                </div>
                <button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-ink-100 text-ink-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => { deleteMutation.mutate(deleteConfirm.id); setDeleteConfirm(null); }}
                  className="!bg-red-600 hover:!bg-red-700 !shadow-red-600/20"
                >
                  Supprimer
                </Button>
                <Button variant="outline" size="md" onClick={() => setDeleteConfirm(null)}>
                  Annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
