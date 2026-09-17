import type {
  ChangePasswordInput,
  ProfileRepository,
  UpdateProfileInput,
} from '@/features/profile/domain/repositories/ProfileRepository';
import type { Profile } from '@/features/profile/domain/entities/profile';

export class GetMyProfile {
  constructor(private readonly repository: ProfileRepository) {}

  execute(): Promise<Profile> {
    return this.repository.getMe();
  }
}

export class UpdateMyProfile {
  constructor(private readonly repository: ProfileRepository) {}

  execute(input: UpdateProfileInput): Promise<Profile> {
    return this.repository.updateMe(input);
  }
}

export class UpdateMyAvatar {
  constructor(private readonly repository: ProfileRepository) {}

  execute(file: File, onProgress?: (percent: number) => void): Promise<Profile> {
    return this.repository.updateAvatar(file, onProgress);
  }
}

export class DeleteMyAvatar {
  constructor(private readonly repository: ProfileRepository) {}

  execute(): Promise<Profile> {
    return this.repository.deleteAvatar();
  }
}

export class ChangeMyPassword {
  constructor(private readonly repository: ProfileRepository) {}

  execute(input: ChangePasswordInput): Promise<void> {
    return this.repository.changePassword(input);
  }
}
