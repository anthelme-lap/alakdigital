import { apiClient } from '@/core/http/api_client';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

const UPLOAD_ENDPOINTS: Record<string, string> = {
  projects: '/admin/projects/uploads',
  articles: '/admin/articles/uploads',
  team: '/admin/team-members/uploads',
};

interface UploadResponse {
  url: string;
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format non supporte (JPEG, PNG, WEBP, GIF ou SVG uniquement).');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Image trop volumineuse (5 Mo maximum).');
  }

  const endpoint = UPLOAD_ENDPOINTS[folder];
  if (!endpoint) {
    throw new Error(`Aucun endpoint d'upload configure pour le dossier '${folder}'.`);
  }

  const formData = new FormData();
  formData.append('image', file);

  const { url } = await apiClient.upload<UploadResponse>(endpoint, formData);
  return url;
}
