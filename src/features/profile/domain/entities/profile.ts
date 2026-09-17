export type UserType = 'site_admin' | 'site_super_admin';

export const USER_TYPE_LABELS: Record<UserType, string> = {
  site_admin: 'Administrateur',
  site_super_admin: 'Super administrateur',
};

export interface Profile {
  id: string;
  nom: string;
  prenom: string;
  nomComplet: string;
  email: string;
  telephone: string | null;
  actif: boolean;
  typeUtilisateur: UserType | null;
  urlPhoto: string | null;
  dateCreation: string | null;
}
