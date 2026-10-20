/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_FEATURE_FLAG_MAINTENANCE_MODE?: string;
  readonly VITE_MAINTENANCE_MODE_MESSAGE1?: string;
  readonly VITE_MAINTENANCE_MODE_MESSAGE2?: string;
}
