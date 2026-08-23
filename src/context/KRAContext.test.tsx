import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { KRAProvider, useKRA } from './KRAContext';
import { storageService } from '../services/storageService';
import type { PortalData, RoleCharter, Department } from '../types';

vi.mock('../services/storageService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/storageService')>();
  return {
    ...actual,
    storageService: {
      ...actual.storageService,
      getInitialData: vi.fn(),
      saveData: vi.fn(),
      getAdminSession: vi.fn(() => ({ isAuthenticated: false, username: '', role: 'editor' })),
      saveAdminSession: vi.fn(),
      clearAdminSession: vi.fn(),
      getGitHubConfig: vi.fn(() => ({ owner: '', repo: '', branch: 'main', filePath: 'x', token: '' })),
      saveGitHubConfig: vi.fn(),
      resetToDefault: vi.fn(() => JSON.parse(JSON.stringify(fixture)) as PortalData),
      exportJSON: vi.fn(),
    },
  };
});

const mockedSaveData = vi.mocked(storageService.saveData);

const makeRole = (id: string, title: string): RoleCharter =>
  ({
    id,
    title,
    departmentId: 'eng',
    level: 'Mid-Level (L2)',
    experienceYears: '2-4 Years',
    mission: 'Ship it.',
    kras: [],
  }) as unknown as RoleCharter;

const fixture: PortalData = {
  lastUpdated: '2026-08-01',
  departments: [
    {
      id: 'eng',
      name: 'Engineering',
      roles: [makeRole('role-1', 'Software Engineer')],
    },
    {
      id: 'quality',
      name: 'Quality Assurance & SDET',
      roles: [],
    },
  ],
  raciMatrix: [],
  versions: [
    {
      id: 'v-current',
      versionNumber: 'v1.0',
      name: 'Bundled Baseline',
      effectiveDate: '2026-08',
      createdAt: '2026-08-01T00:00:00Z',
      createdBy: 'test',
      departments: [],
      raciMatrix: [],
    },
  ],
  activeVersionId: 'v-current',
} as unknown as PortalData;

beforeEach(() => {
  mockedSaveData.mockClear();
  vi.mocked(storageService.getInitialData).mockReturnValue(
    JSON.parse(JSON.stringify(fixture)) as PortalData
  );
});

const renderPortal = () => renderHook(() => useKRA(), { wrapper: KRAProvider });

describe('role management', () => {
  it('addRole appends a role to the target department and persists', () => {
    const { result } = renderPortal();
    const role = makeRole('role-new', 'Platform Engineer');
    act(() => result.current.addRole('eng', role));

    const eng = result.current.portalData.departments.find((d) => d.id === 'eng')!;
    expect(eng.roles.map((r) => r.title)).toContain('Platform Engineer');
    expect(mockedSaveData).toHaveBeenCalledTimes(1);
  });

  it('deleteRole removes the role from the department', () => {
    const { result } = renderPortal();
    act(() => result.current.deleteRole('eng', 'role-1'));
    const eng = result.current.portalData.departments.find((d) => d.id === 'eng')!;
    expect(eng.roles).toHaveLength(0);
  });

  it('updateRole replaces the matching role by id', () => {
    const { result } = renderPortal();
    act(() => result.current.updateRole('eng', makeRole('role-1', 'Renamed Engineer')));
    const eng = result.current.portalData.departments.find((d) => d.id === 'eng')!;
    expect(eng.roles[0].title).toBe('Renamed Engineer');
  });

  it('updateDepartmentInfo patches department metadata without touching other departments', () => {
    const { result } = renderPortal();
    act(() =>
      result.current.updateDepartmentInfo('quality', { description: 'Quality first' } as Partial<Department>)
    );
    const quality = result.current.portalData.departments.find((d) => d.id === 'quality')!;
    expect(quality.description).toBe('Quality first');
    expect(result.current.portalData.departments.find((d) => d.id === 'eng')!.name).toBe('Engineering');
  });

  it('addDepartment creates a configurable department with a slugified id', () => {
    const { result } = renderPortal();
    let ok = false;
    act(() => {
      ok = result.current.addDepartment('Customer Success', 'Owns accounts');
    });
    expect(ok).toBe(true);
    const created = result.current.portalData.departments.find((d) => d.id === 'customer-success');
    expect(created?.name).toBe('Customer Success');
    expect(created?.description).toBe('Owns accounts');
    expect(mockedSaveData).toHaveBeenCalled();
  });

  it('addDepartment rejects duplicates and blank names', () => {
    const { result } = renderPortal();
    act(() => result.current.addDepartment('Customer Success'));
    let dup = false;
    act(() => {
      dup = result.current.addDepartment('Customer Success');
    });
    expect(dup).toBe(false);

    let blank = true;
    act(() => {
      blank = result.current.addDepartment('   ');
    });
    expect(blank).toBe(false);
  });

  it('removeDepartment deletes an empty department but refuses one holding roles', () => {
    const { result } = renderPortal();
    act(() => result.current.addDepartment('Temp Dept'));

    let removedForEmpty = true;
    act(() => {
      removedForEmpty = result.current.removeDepartment('eng');
    });
    expect(removedForEmpty).toBe(false);
    expect(result.current.portalData.departments.some((d) => d.id === 'eng')).toBe(true);

    let ok = false;
    act(() => {
      ok = result.current.removeDepartment('temp-dept');
    });
    expect(ok).toBe(true);
    expect(result.current.portalData.departments.some((d) => d.id === 'temp-dept')).toBe(false);
  });
});

describe('version snapshots', () => {
  it('createVersionSnapshot prepends a frozen copy and activates it', () => {
    const { result } = renderPortal();
    const beforeRoles = result.current.portalData.departments[0].roles;

    act(() => result.current.createVersionSnapshot('Q3 Freeze', '2026-09', 'quarterly freeze'));

    const data = result.current.portalData;
    expect(data.versions![0].name).toBe('Q3 Freeze');
    expect(data.versions![0].notes).toBe('quarterly freeze');
    expect(data.activeVersionId).toBe(data.versions![0].id);
    expect(data.activeVersionId).not.toBe('v-current');
    expect(mockedSaveData).toHaveBeenCalled();

    const snapshotCopy = data.versions![0].departments;
    expect(snapshotCopy[0].roles[0].id).toBe(beforeRoles[0].id);
  });

  it('switching back to a prior version restores its data and active pointer', () => {
    const { result } = renderPortal();
    let snapshotId = '';
    act(() => result.current.createVersionSnapshot('Q3 Freeze', '2026-09'));
    snapshotId = result.current.portalData.activeVersionId!;

    act(() => result.current.switchVersion('v-current'));
    expect(result.current.portalData.activeVersionId).toBe('v-current');

    act(() => result.current.switchVersion(snapshotId));
    expect(result.current.activeVersion?.name).toBe('Q3 Freeze');
  });
});

describe('JSON import/export roundtrip', () => {
  it('importJSON accepts a valid portal payload and persists it', () => {
    const { result } = renderPortal();
    const payload = JSON.parse(JSON.stringify(fixture));
    payload.departments.push({ id: 'design', name: 'UI/UX', roles: [] });

    let ok = false;
    act(() => {
      ok = result.current.importJSON(JSON.stringify(payload));
    });
    expect(ok).toBe(true);
    expect(result.current.portalData.departments).toHaveLength(3);
    expect(mockedSaveData).toHaveBeenCalledTimes(1);
    expect(mockedSaveData.mock.calls[0][0].departments.map((d: Department) => d.id)).toContain('design');
  });

  it('importJSON rejects payloads with no departments', () => {
    const { result } = renderPortal();
    let ok = true;
    act(() => {
      ok = result.current.importJSON(JSON.stringify({ departments: [] }));
    });
    expect(ok).toBe(false);
    expect(mockedSaveData).not.toHaveBeenCalled();
  });

  it('importJSON rejects malformed JSON without throwing', () => {
    const { result } = renderPortal();
    let ok = true;
    act(() => {
      ok = result.current.importJSON('{definitely not json');
    });
    expect(ok).toBe(false);
  });

  it('importJSON migrates legacy fabricated versions and repairs the active pointer', () => {
    const { result } = renderPortal();
    const legacyPayload = JSON.parse(JSON.stringify(fixture));
    legacyPayload.versions = [
      { id: 'v2026.08', versionNumber: 'v2026.08', name: 'fake', effectiveDate: '2026-08' },
      { id: 'v2024.01', versionNumber: 'v2024.01', name: 'fake-old', effectiveDate: '2024-01' },
    ];
    legacyPayload.activeVersionId = 'v2026.08';

    let ok = false;
    act(() => {
      ok = result.current.importJSON(JSON.stringify(legacyPayload));
    });

    expect(ok).toBe(true);
    const data = result.current.portalData;
    expect(data.versions!.map((v) => v.id)).not.toContain('v2026.08');
    expect(data.versions!.map((v) => v.id)).not.toContain('v2024.01');
    expect(data.versions!.some((v) => v.id === data.activeVersionId)).toBe(true);
    expect(data.schemaVersion).toBeDefined();
  });

  it('importJSON rejects a payload with an invalid version entry', () => {
    const { result } = renderPortal();
    const badVersion = JSON.parse(JSON.stringify(fixture));
    badVersion.versions = [{ id: '', name: 'no id', effectiveDate: '' }];

    let ok = true;
    act(() => {
      ok = result.current.importJSON(JSON.stringify(badVersion));
    });
    expect(ok).toBe(false);
    expect(mockedSaveData).not.toHaveBeenCalled();
  });
});

describe('reset & theme', () => {
  it('resetToDefaults restores factory data and the baseline version pointer', () => {
    const { result } = renderPortal();
    act(() => result.current.createVersionSnapshot('Q3 Freeze', '2026-09'));
    expect(result.current.portalData.activeVersionId).not.toBe('v-current');

    act(() => result.current.resetToDefaults());
    expect(result.current.portalData.departments).toHaveLength(2);
    expect(result.current.portalData.activeVersionId).toBe('v-current');
    expect(storageService.resetToDefault).toHaveBeenCalled();
  });

  it('toggleDarkMode flips the theme and persists it to localStorage', () => {
    localStorage.setItem('taazaa_theme', 'light');
    const { result } = renderPortal();
    expect(result.current.isDarkMode).toBe(false);

    act(() => result.current.toggleDarkMode());
    expect(result.current.isDarkMode).toBe(true);
    expect(localStorage.getItem('taazaa_theme')).toBe('dark');

    act(() => result.current.toggleDarkMode());
    expect(localStorage.getItem('taazaa_theme')).toBe('light');
  });
});

describe('admin auth', () => {
  it('loginAdmin accepts the configured passcode and stores an admin session', async () => {
    const { result } = renderPortal();
    await act(async () => {
      await result.current.loginAdmin('taazaa2026');
    });
    expect(result.current.adminSession?.isAuthenticated).toBe(true);
    expect(result.current.adminSession?.role).toBe('admin');
    expect(storageService.saveAdminSession).toHaveBeenCalled();
  });

  it('loginAdmin rejects a wrong passcode', async () => {
    const { result } = renderPortal();
    await act(async () => {
      await result.current.loginAdmin('nope');
    });
    expect(result.current.adminSession?.isAuthenticated).toBe(false);
  });
});

describe('comparison cap', () => {
  it('toggleCompareRole never exceeds three concurrent selections', () => {
    const { result } = renderPortal();
    const roles = ['a', 'b', 'c', 'd'].map((i) => makeRole(`r-${i}`, `Role ${i}`));
    act(() => {
      roles.forEach((r) => result.current.toggleCompareRole(r));
    });
    expect(result.current.comparisonRoles).toHaveLength(3);

    act(() => result.current.toggleCompareRole(roles[1]));
    expect(result.current.comparisonRoles.map((r) => r.id)).toEqual(['r-a', 'r-c']);
  });
});
