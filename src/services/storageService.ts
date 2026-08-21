import defaultData from '../data/kras.json';
import { PortalData, GitHubConfig, AdminSession, KRAVersion } from '../types';

const STORAGE_KEY = 'taazaa_kras_custom_data';
const GITHUB_CONFIG_KEY = 'taazaa_github_config';
const ADMIN_SESSION_KEY = 'taazaa_admin_session';

const generateDefaultVersions = (baseData: any): KRAVersion[] => {
  return [
    {
      id: 'v2026.08',
      versionNumber: 'v2026.08',
      name: 'Current Active (August 2026)',
      effectiveDate: '2026-08',
      createdAt: '2026-08-01T00:00:00Z',
      createdBy: 'ER Governance Team',
      notes: 'Current active production role charters and OKR benchmarks.',
      departments: baseData.departments,
      raciMatrix: baseData.raciMatrix,
    },
    {
      id: 'v2026.01',
      versionNumber: 'v2026.01',
      name: 'Q1 2026 Snapshot (January 2026)',
      effectiveDate: '2026-01',
      createdAt: '2026-01-15T00:00:00Z',
      createdBy: 'ER Governance Team',
      notes: 'Q1 2026 kickoff baseline with updated AI & cloud engineering competencies.',
      departments: baseData.departments,
      raciMatrix: baseData.raciMatrix,
    },
    {
      id: 'v2025.12',
      versionNumber: 'v2025.12',
      name: '2025 Annual Appraisal Baseline',
      effectiveDate: '2025-12',
      createdAt: '2025-12-01T00:00:00Z',
      createdBy: 'HR Talent Strategy',
      notes: 'Historical reference utilized during 2025 year-end appraisal cycles.',
      departments: baseData.departments,
      raciMatrix: baseData.raciMatrix,
    },
    {
      id: 'v2024.01',
      versionNumber: 'v2024.01',
      name: '2024 Foundation Baseline',
      effectiveDate: '2024-01',
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: 'Foundational ER Council',
      notes: 'Original 2024 organizational KRA charter framework.',
      departments: baseData.departments,
      raciMatrix: baseData.raciMatrix,
    },
  ];
};

export const storageService = {
  getInitialData(): PortalData {
    let data: PortalData;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.departments) && parsed.departments.length > 0) {
          data = parsed;
        } else {
          data = defaultData as unknown as PortalData;
        }
      } else {
        data = defaultData as unknown as PortalData;
      }
    } catch (e) {
      console.warn('Failed to load data from localStorage, using default bundled dataset', e);
      data = defaultData as unknown as PortalData;
    }

    // Ensure versions exist
    if (!data.versions || data.versions.length === 0) {
      data.versions = generateDefaultVersions(data);
      data.activeVersionId = 'v2026.08';
    } else if (!data.activeVersionId) {
      data.activeVersionId = data.versions[0]?.id || 'v2026.08';
    }

    return data;
  },

  saveData(data: PortalData): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      return false;
    }
  },

  resetToDefault(): PortalData {
    localStorage.removeItem(STORAGE_KEY);
    const data = defaultData as unknown as PortalData;
    data.versions = generateDefaultVersions(data);
    data.activeVersionId = 'v2026.08';
    return data;
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

  getGitHubConfig(): GitHubConfig {
    const defaultConfig: GitHubConfig = {
      owner: 'shashanksaxena-tz',
      repo: 'taazaa-kra-portal',
      branch: 'main',
      filePath: 'src/data/kras.json',
      token: ''
    };
    try {
      const saved = localStorage.getItem(GITHUB_CONFIG_KEY);
      if (saved) {
        return { ...defaultConfig, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error reading github config', e);
    }
    return defaultConfig;
  },

  saveGitHubConfig(config: GitHubConfig): void {
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
  },

  getAdminSession(): AdminSession {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading admin session', e);
    }
    return { isAuthenticated: false, username: '', role: 'editor' };
  },

  saveAdminSession(session: AdminSession): void {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  },

  clearAdminSession(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};
