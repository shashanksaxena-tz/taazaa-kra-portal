import defaultData from '../data/kras.json';
import { PortalData, GitHubConfig, AdminSession, KRAVersion } from '../types';
import { STORAGE_KEYS, SCHEMA_VERSION, DEFAULT_VERSION_ID, DEFAULT_COMMIT_PATH } from '../constants';

interface StoredGitHubConfig extends Omit<GitHubConfig, 'token'> {
  schemaVersion?: number;
}

/** One real snapshot generated from the bundled dataset — no fabricated history. */
const generateBaselineVersion = (baseData: PortalData): KRAVersion => ({
  id: DEFAULT_VERSION_ID,
  versionNumber: 'v1.0',
  name: 'Bundled Baseline',
  effectiveDate: baseData.lastUpdated || new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
  createdBy: 'ER Governance Team',
  notes: 'Initial baseline generated from the bundled dataset.',
  departments: structuredClone(baseData.departments),
  raciMatrix: structuredClone(baseData.raciMatrix ?? []),
});

const withBaseline = (data: PortalData): PortalData => {
  const next = structuredClone(data);
  if (!next.versions || next.versions.length === 0) {
    next.versions = [generateBaselineVersion(next)];
    next.activeVersionId = DEFAULT_VERSION_ID;
  } else if (!next.activeVersionId || !next.versions.some((v) => v.id === next.activeVersionId)) {
    // Repair dangling active pointer (e.g. after migration drops a version).
    next.activeVersionId = next.versions[0]?.id || DEFAULT_VERSION_ID;
  }
  return next;
};

/** Legacy fabricated version ids injected by pre-review builds. */
const LEGACY_VERSION_IDS = ['v2026.08', 'v2026.01', 'v2025.12', 'v2024.01'];

/**
 * Shared normalization applied to data from ANY source (localStorage, JSON import).
 * Drops fabricated legacy versions, repairs the baseline + active pointer, and
 * stamps the current schema version.
 */
export const normalizePortalData = (data: PortalData): PortalData => {
  const next = structuredClone(data);
  if (Array.isArray(next.versions)) {
    next.versions = next.versions.filter(
      (v) => v.id === DEFAULT_VERSION_ID || !LEGACY_VERSION_IDS.includes(v.id)
    );
  }
  const migrated = withBaseline(next);
  migrated.schemaVersion = SCHEMA_VERSION;
  return migrated;
};

export const storageService = {
  getInitialData(): PortalData {
    let data: PortalData;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.krasData);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.departments) && parsed.departments.length > 0) {
          data = parsed;
        } else {
          data = structuredClone(defaultData) as PortalData;
        }
      } else {
        data = structuredClone(defaultData) as PortalData;
      }
    } catch (e) {
      console.warn('Failed to load data from localStorage, using default bundled dataset', e);
      data = structuredClone(defaultData) as PortalData;
    }

    return normalizePortalData(data);
  },

  saveData(data: PortalData): boolean {
    try {
      localStorage.setItem(
        STORAGE_KEYS.krasData,
        JSON.stringify({ ...data, schemaVersion: SCHEMA_VERSION })
      );
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      return false;
    }
  },

  resetToDefault(): PortalData {
    localStorage.removeItem(STORAGE_KEYS.krasData);
    return withBaseline(structuredClone(defaultData) as PortalData);
  },

  exportJSON(data: PortalData): void {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `taazaa-kras-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /** Config (without token) persists in localStorage; token lives in sessionStorage only. */
  getGitHubConfig(): GitHubConfig {
    const defaultConfig: StoredGitHubConfig = {
      owner: 'shashanksaxena-tz',
      repo: 'taazaa-kra-portal',
      branch: 'main',
      filePath: DEFAULT_COMMIT_PATH,
      schemaVersion: SCHEMA_VERSION,
    };
    let config: StoredGitHubConfig = defaultConfig;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.githubConfig);
      if (saved) {
        config = { ...defaultConfig, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error reading github config', e);
    }

    const sessionToken = sessionStorage.getItem(`${STORAGE_KEYS.githubConfig}:token`) || '';
    const { schemaVersion: _sv, ...rest } = config;
    return { ...rest, token: sessionToken } as GitHubConfig;
  },

  saveGitHubConfig(config: GitHubConfig): void {
    const { token, ...persistable } = config;
    localStorage.setItem(STORAGE_KEYS.githubConfig, JSON.stringify(persistable));
    if (token) {
      sessionStorage.setItem(`${STORAGE_KEYS.githubConfig}:token`, token);
    } else {
      sessionStorage.removeItem(`${STORAGE_KEYS.githubConfig}:token`);
    }
  },

  getAdminSession(): AdminSession {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.adminSession);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading admin session', e);
    }
    return { isAuthenticated: false, username: '', role: 'editor' };
  },

  saveAdminSession(session: AdminSession): void {
    sessionStorage.setItem(STORAGE_KEYS.adminSession, JSON.stringify(session));
  },

  clearAdminSession(): void {
    sessionStorage.removeItem(STORAGE_KEYS.adminSession);
  },
};
