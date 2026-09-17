import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail,
  Phone,
  Pencil,
  Save,
  X,
  ShieldCheck,
  Calendar,
  Camera,
  Trash2,
  KeyRound,
} from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, Badge, Loader } from '@/shared/ui';
import { USER_TYPE_LABELS } from '../../domain/entities/profile';
import {
  useMyProfile,
  useUpdateMyProfile,
  useUpdateMyAvatar,
  useDeleteMyAvatar,
  useChangeMyPassword,
} from '../queries/use_profile';
import {
  profileInfoSchema,
  passwordSchema,
  type ProfileInfoFormValues,
  type PasswordFormValues,
} from '../forms/profile_schema';

function getInitials(prenom: string, nom: string) {
  return `${prenom[0] ?? ''}${nom[0] ?? ''}`.toUpperCase() || '?';
}

function formatDate(date: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-ink-400">{icon}</span>
      <div>
        <p className="text-xs text-ink-500">{label}</p>
        <p className="text-sm font-medium text-ink-900">{value}</p>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useMyProfile();
  const updateProfile = useUpdateMyProfile();
  const updateAvatar = useUpdateMyAvatar();
  const deleteAvatar = useDeleteMyAvatar();
  const changePassword = useChangeMyPassword();

  const [editing, setEditing] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const infoForm = useForm<ProfileInfoFormValues>({
    resolver: zodResolver(profileInfoSchema),
    values: profile
      ? { prenom: profile.prenom, nom: profile.nom, email: profile.email, telephone: profile.telephone ?? '' }
      : undefined,
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size={32} />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="text-center py-20 rounded-2xl border border-ink-100 bg-white">
        <p className="text-ink-500 mb-4">Impossible de charger le profil.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Réessayer
        </Button>
      </div>
    );
  }

  const roleLabel = profile.typeUtilisateur ? USER_TYPE_LABELS[profile.typeUtilisateur] : null;

  async function handleSaveInfo(values: ProfileInfoFormValues) {
    setInfoError(null);
    try {
      await updateProfile.mutateAsync(values);
      setEditing(false);
    } catch (e) {
      setInfoError(e instanceof Error ? e.message : "Echec de la mise a jour du profil.");
    }
  }

  async function handleAvatarFile(file: File | undefined) {
    if (!file) return;
    setAvatarError(null);
    try {
      await updateAvatar.mutateAsync(file);
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : "Echec du televersement de la photo.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDeleteAvatar() {
    setAvatarError(null);
    try {
      await deleteAvatar.mutateAsync();
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : 'Echec de la suppression de la photo.');
    }
  }

  async function handleChangePassword(values: PasswordFormValues) {
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      setPasswordSuccess(true);
    } catch (e) {
      setPasswordError(e instanceof Error ? e.message : 'Echec du changement de mot de passe.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink-900">Mon profil</h2>
        <p className="text-sm text-ink-500 mt-1">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Coordonnées liées à votre compte</CardDescription>
              </div>
              {!editing && (
                <Button variant="outline" size="sm" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(true)}>
                  Modifier
                </Button>
              )}
            </CardHeader>

            {editing ? (
              <form onSubmit={infoForm.handleSubmit(handleSaveInfo)} className="space-y-4">
                {infoError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{infoError}</p>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Prénom *" error={infoForm.formState.errors.prenom?.message} {...infoForm.register('prenom')} />
                  <Input label="Nom *" error={infoForm.formState.errors.nom?.message} {...infoForm.register('nom')} />
                </div>
                <Input label="Email *" type="email" error={infoForm.formState.errors.email?.message} {...infoForm.register('email')} />
                <Input label="Téléphone" error={infoForm.formState.errors.telephone?.message} {...infoForm.register('telephone')} />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" size="md" loading={updateProfile.isPending} leftIcon={!updateProfile.isPending ? <Save className="h-4 w-4" /> : undefined}>
                    Enregistrer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    leftIcon={<X className="h-4 w-4" />}
                    onClick={() => {
                      setEditing(false);
                      setInfoError(null);
                      infoForm.reset();
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={profile.email} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Téléphone" value={profile.telephone} />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  <KeyRound className="h-5 w-5 text-primary-600" /> Sécurité
                </CardTitle>
                <CardDescription>Modifier votre mot de passe</CardDescription>
              </div>
            </CardHeader>

            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
              {passwordError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  Mot de passe mis à jour.
                </p>
              )}
              <Input
                label="Mot de passe actuel *"
                type="password"
                error={passwordForm.formState.errors.currentPassword?.message}
                {...passwordForm.register('currentPassword')}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Nouveau mot de passe *"
                  type="password"
                  hint="8 caractères minimum"
                  error={passwordForm.formState.errors.newPassword?.message}
                  {...passwordForm.register('newPassword')}
                />
                <Input
                  label="Confirmer *"
                  type="password"
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  {...passwordForm.register('confirmPassword')}
                />
              </div>
              <Button type="submit" variant="primary" size="md" loading={changePassword.isPending}>
                Mettre à jour le mot de passe
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative">
                {profile.urlPhoto ? (
                  <img src={profile.urlPhoto} alt={profile.nomComplet} className="h-20 w-20 rounded-full object-cover border border-ink-100" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600 text-xl font-bold">
                    {getInitials(profile.prenom, profile.nom)}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={updateAvatar.isPending}
                  title="Changer la photo"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white shadow-md hover:bg-primary-700 disabled:opacity-50"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleAvatarFile(e.target.files?.[0])}
                />
              </div>

              <div className="text-center">
                <p className="font-semibold text-ink-900">{profile.nomComplet}</p>
                <p className="text-sm text-ink-500">{profile.email}</p>
              </div>

              {roleLabel && (
                <Badge variant={profile.typeUtilisateur === 'site_super_admin' ? 'dark' : 'neutral'}>
                  <ShieldCheck className="h-3 w-3" /> {roleLabel}
                </Badge>
              )}

              {profile.urlPhoto && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  loading={deleteAvatar.isPending}
                  onClick={handleDeleteAvatar}
                  className="!text-red-600 hover:!bg-red-50"
                >
                  Retirer la photo
                </Button>
              )}

              {avatarError && <p className="text-xs text-red-500 text-center">{avatarError}</p>}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-600" /> Dates clés
                </CardTitle>
              </div>
            </CardHeader>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Membre depuis</dt>
                <dd className="font-medium text-ink-900">{formatDate(profile.dateCreation)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Statut</dt>
                <dd className="font-medium text-ink-900">{profile.actif ? 'Actif' : 'Inactif'}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
