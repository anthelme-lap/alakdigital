import { useRef, useState } from 'react';
import { ImagePlus, Loader2, AlertCircle } from 'lucide-react';
import { uploadImage } from '@/features/admin/infrastructure/storage_api';

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  error?: string;
  hint?: string;
}

export function ImageUpload({ label, value, onChange, folder, error, hint }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Echec du televersement.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const displayError = error ?? uploadError ?? undefined;

  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-ink-700">{label}</label>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 disabled:cursor-not-allowed ${
          displayError ? 'border-red-300' : 'border-ink-200 hover:border-primary-400'
        } ${value ? 'bg-ink-50' : 'bg-ink-50/50'}`}
      >
        {value ? (
          <img src={value} alt="Apercu" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-ink-400">
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs font-medium">Cliquez pour televerser une image</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          </div>
        )}

        {value && !uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-opacity hover:opacity-100 hover:bg-ink-950/40">
            <span className="text-xs font-semibold text-white">Changer l'image</span>
          </div>
        )}
      </button>

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ou collez une URL d'image"
        className="mt-2 w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-xs text-ink-700 placeholder:text-ink-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
      />

      {displayError ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3.5 w-3.5" /> {displayError}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}
