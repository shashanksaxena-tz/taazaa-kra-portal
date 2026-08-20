import defaultData from '../data/kras.json';
import { PortalData, GitHubConfig, AdminSession } from '../types';

const STORAGE_KEY = 'taazaa_kras_custom_data';
const GITHUB_CONFIG_KEY = 'taazaa_github_config';
const ADMIN_SESSION_KEY = 'taazaa_admin_session';

export const storageService = {
  getInitialData(): PortalData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.departments) && parsed.departments.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load data from localStorage, using default bundled dataset', e);
    }
    return defaultData as unknown as PortalData;
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
    return defaultData as unknown as PortalData;
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
      owner: '',
      repo: '',
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
