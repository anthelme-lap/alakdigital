/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL absolue de l'API alak-api, ex: http://localhost:8000/api/v1 */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
