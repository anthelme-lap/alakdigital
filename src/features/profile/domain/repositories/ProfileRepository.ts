import type { Profile } from '../entities/profile';

export interface UpdateProfileInput {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileRepository {
  getMe(): Promise<Profile>;
  updateMe(input: UpdateProfileInput): Promise<Profile>;
  updateAvatar(file: File, onProgress?: (percent: number) => void): Promise<Profile>;
  deleteAvatar(): Promise<Profile>;
  changePassword(input: ChangePasswordInput): Promise<void>;
}
