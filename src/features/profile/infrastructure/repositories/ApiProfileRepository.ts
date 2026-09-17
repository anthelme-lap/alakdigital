import { apiClient } from '@/core/http/api_client';
import type { Profile, UserType } from '@/features/profile/domain/entities/profile';
import type {
  ChangePasswordInput,
  ProfileRepository,
  UpdateProfileInput,
} from '@/features/profile/domain/repositories/ProfileRepository';

interface UserResponse {
  id: string;
  nom: string;
  prenom: string;
  nom_complet: string | null;
  email: string;
  telephone: string | null;
  actif: boolean;
  type_utilisateur: string | null;
  url_photo: string | null;
  date_creation: string | null;
}

function mapProfile(r: UserResponse): Profile {
  return {
    id: r.id,
    nom: r.nom,
    prenom: r.prenom,
    nomComplet: r.nom_complet ?? `${r.prenom} ${r.nom}`.trim(),
    email: r.email,
    telephone: r.telephone,
    actif: r.actif,
    typeUtilisateur: (r.type_utilisateur as UserType | null) ?? null,
    urlPhoto: r.url_photo,
    dateCreation: r.date_creation,
  };
}

export class ApiProfileRepository implements ProfileRepository {
  async getMe(): Promise<Profile> {
    const res = await apiClient.get<UserResponse>('/auth/me');
    return mapProfile(res);
  }

  async updateMe(input: UpdateProfileInput): Promise<Profile> {
    const res = await apiClient.patch<UserResponse>('/auth/profile', input);
    return mapProfile(res);
  }

  async updateAvatar(file: File): Promise<Profile> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.upload<UserResponse>('/auth/me/avatar', formData, undefined, 'PUT');
    return mapProfile(res);
  }

  async deleteAvatar(): Promise<Profile> {
    const res = await apiClient.delete<UserResponse>('/auth/avatar');
    return mapProfile(res);
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await apiClient.post('/auth/password/change', {
      mot_de_passe_actuel: input.currentPassword,
      mot_de_passe_nouveau: input.newPassword,
    });
  }
}
