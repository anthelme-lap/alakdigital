import { supabase } from '@/core/database/supabase_client';

const BUCKET = 'media';
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format non supporte (JPEG, PNG, WEBP, GIF ou SVG uniquement).');
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Image trop volumineuse (5 Mo maximum).');
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
