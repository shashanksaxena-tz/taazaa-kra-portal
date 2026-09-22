import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants';

describe('storageService.getInitialData legacy field migration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('migrates a legacy metricsAndOkrs role field to metricsAndKras on load', () => {
    const legacyPayload = {
      organization: 'Taazaa',
      portalTitle: '',
      portalSubtitle: '',
      lastUpdated: '2026-01-01',
      version: '1.0.0',
      departments: [
        {
          id: 'engineering',
          name: 'Engineering',
          tagline: '',
          description: '',
          icon: '',
          color: '',
          badgeColor: '',
          roles: [
            {
              id: 'role-1',
              title: 'Legacy Role',
              departmentId: 'engineering',
              level: 'L1',
              experienceYears: '',
              mission: '',
              summary: '',
              accountabilities: [],
              responsibilities: [],
              competencies: { behavioral: [], technical: [], domain: [] },
              // Legacy field name from before the OKR -> KRA rename.
              metricsAndOkrs: [{ outcomeArea: 'o', metric: 'm', target: 't', sourceData: 's', frequency: 'f' }],
              careerPath: { previousRoles: [], nextRoles: [] },
            },
          ],
        },
      ],
      raciMatrix: [],
    };
    localStorage.setItem(STORAGE_KEYS.krasData, JSON.stringify(legacyPayload));

    const data = storageService.getInitialData();
    const role = data.departments[0].roles[0] as any;

    expect(role.metricsAndKras).toEqual([
      { outcomeArea: 'o', metric: 'm', target: 't', sourceData: 's', frequency: 'f' },
    ]);
    expect(role.metricsAndOkrs).toBeUndefined();
  });

  it('defaults metricsAndKras to an empty array when a legacy role has neither field', () => {
    const legacyPayload = {
      organization: 'Taazaa',
      portalTitle: '',
      portalSubtitle: '',
      lastUpdated: '2026-01-01',
      version: '1.0.0',
      departments: [
        {
          id: 'engineering',
          name: 'Engineering',
          tagline: '',
          description: '',
          icon: '',
          color: '',
          badgeColor: '',
          roles: [
            {
              id: 'role-2',
              title: 'Bare Legacy Role',
              departmentId: 'engineering',
              level: 'L1',
              experienceYears: '',
              mission: '',
              summary: '',
              accountabilities: [],
              responsibilities: [],
              competencies: { behavioral: [], technical: [], domain: [] },
              careerPath: { previousRoles: [], nextRoles: [] },
            },
          ],
        },
      ],
      raciMatrix: [],
    };
    localStorage.setItem(STORAGE_KEYS.krasData, JSON.stringify(legacyPayload));

    const data = storageService.getInitialData();
    const role = data.departments[0].roles[0] as any;

    expect(role.metricsAndKras).toEqual([]);
  });
});
