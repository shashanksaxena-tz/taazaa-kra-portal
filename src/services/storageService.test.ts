import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from './storageService';
import { STORAGE_KEYS, DEFAULT_VERSION_ID } from '../constants';
import type { PortalData } from '../types';

const baseData: PortalData = {
  lastUpdated: '2026-08-01',
  departments: [
    {
      id: 'eng',
      name: 'Engineering',
      roles: [
        {
          id: 'role-eng-senior',
          title: 'Senior Engineer',
          departmentId: 'eng',
          level: 'Senior',
          summary: 'Ships features.',
          kras: [],
          competencies: [],
          metrics: [],
        },
      ],
    },
  ],
  raciMatrix: [],
} as unknown as PortalData;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('getInitialData', () => {
  it('generates a single honest baseline version from bundled data', () => {
    const data = storageService.getInitialData();
    expect(data.versions).toHaveLength(1);
    expect(data.versions![0].id).toBe(DEFAULT_VERSION_ID);
    expect(data.activeVersionId).toBe(DEFAULT_VERSION_ID);
  });

  it('drops legacy fabricated version history from stored data', () => {
    localStorage.setItem(
      STORAGE_KEYS.krasData,
      JSON.stringify({
        ...baseData,
        versions: [
          { id: 'v2026.08', name: 'fake' },
          { id: 'v2024.01', name: 'fake' },
        ],
      })
    );
    const data = storageService.getInitialData();
    const ids = (data.versions ?? []).map((v) => v.id);
    expect(ids).not.toContain('v2026.08');
    expect(ids).not.toContain('v2024.01');
    expect(ids[0]).toBe(DEFAULT_VERSION_ID);
  });

  it('falls back to bundled dataset on corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEYS.krasData, '{not json');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const data = storageService.getInitialData();
    expect(Array.isArray(data.departments)).toBe(true);
    expect(warn).toHaveBeenCalled();
  });

  it('never mutates the bundled default module', () => {
    storageService.resetToDefault();
    const a = storageService.resetToDefault();
    a.departments.push({ id: 'x', name: 'X', roles: [] } as never);
    const b = storageService.getInitialData();
    expect(b.versions).toHaveLength(1);
  });
});

describe('saveGitHubConfig', () => {
  it('persists config to localStorage but token only to sessionStorage', () => {
    storageService.saveGitHubConfig({
      owner: 'acme',
      repo: 'portal',
      branch: 'main',
      filePath: 'src/data/kras.json',
      token: 'ghp_secret',
    });
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEYS.githubConfig)!);
    expect(persisted.token).toBeUndefined();
    expect(sessionStorage.getItem(`${STORAGE_KEYS.githubConfig}:token`)).toBe('ghp_secret');
  });

  it('roundtrips token through get/save within the session', () => {
    storageService.saveGitHubConfig({
      owner: 'acme',
      repo: 'portal',
      branch: 'main',
      filePath: 'src/data/kras.json',
      token: 'tok123',
    });
    expect(storageService.getGitHubConfig().token).toBe('tok123');
  });
});

describe('admin session', () => {
  it('stores session in sessionStorage, not localStorage', () => {
    storageService.saveAdminSession({ isAuthenticated: true, username: 'admin', role: 'admin' });
    expect(localStorage.getItem(STORAGE_KEYS.adminSession)).toBeNull();
    expect(storageService.getAdminSession()?.username).toBe('admin');
    storageService.clearAdminSession();
    expect(storageService.getAdminSession().isAuthenticated).toBe(false);
  });
});
