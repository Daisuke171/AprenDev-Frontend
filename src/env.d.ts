/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE: string;
  readonly PUBLIC_WS_URL: string;
  // Agrega aquí otras variables que uses...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}