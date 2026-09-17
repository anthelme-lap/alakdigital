import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyProfile,
  updateMyProfile,
  updateMyAvatar,
  deleteMyAvatar,
  changeMyPassword,
} from '@/app/di';
import type { Profile } from '../../domain/entities/profile';
import type { ChangePasswordInput, UpdateProfileInput } from '../../domain/repositories/ProfileRepository';

const PROFILE_KEY = ['profile', 'me'];

export function useMyProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => getMyProfile.execute(),
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateMyProfile.execute(input),
    onSuccess: (profile: Profile) => queryClient.setQueryData(PROFILE_KEY, profile),
  });
}

export function useUpdateMyAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => updateMyAvatar.execute(file),
    onSuccess: (profile: Profile) => queryClient.setQueryData(PROFILE_KEY, profile),
  });
}

export function useDeleteMyAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteMyAvatar.execute(),
    onSuccess: (profile: Profile) => queryClient.setQueryData(PROFILE_KEY, profile),
  });
}

export function useChangeMyPassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changeMyPassword.execute(input),
  });
}
