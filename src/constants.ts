/**
 * Central constants — no more magic strings scattered across services/components.
 */

export const STORAGE_KEYS = {
  krasData: 'taazaa_kras_custom_data',
  githubConfig: 'taazaa_github_config',
  adminSession: 'taazaa_admin_session',
  theme: 'taazaa_theme',
} as const;

export const SCHEMA_VERSION = 2;

export const DEFAULT_VERSION_ID = 'v-current';

export const ADMIN = {
  /** SHA-256 hex of the admin passcode. Override via VITE_ADMIN_PASSCODE_SHA256. */
  passcodeSha256:
    import.meta.env.VITE_ADMIN_PASSCODE_SHA256 ??
    // sha256('taazaa2026') — change via env for production deployments
    'ad9033bbb601c6d528b072e2ef1dd6b789e16f8598d233625c6d15e8eca4dd4e',
} as const;

export const MAX_COMPARE_ROLES = 3;
export const TOAST_DURATION_MS = 4500;
export const DEFAULT_COMMIT_PATH = 'src/data/kras.json';
