import { describe, it, expect } from 'vitest';
import { computePortalStats } from './portalStats';
import type { PortalData } from '../types';

const emptyPortal: PortalData = {
  organization: 'Taazaa', portalTitle: '', portalSubtitle: '', lastUpdated: '2026-01-01', version: '1.0.0',
  departments: [], raciMatrix: [],
};

describe('computePortalStats', () => {
  it('returns all zeros for an empty portal without dividing by zero', () => {
    const stats = computePortalStats(emptyPortal);
    expect(stats).toEqual({
      roleCount: 0,
      departmentCount: 0,
      levelCount: 0,
      percentRolesWithKras: 0,
      percentRolesWithResponsibilities: 0,
    });
  });

  it('computes real counts from a populated portal', () => {
    const portal: PortalData = {
      ...emptyPortal,
      departments: [
        {
          id: 'engineering', name: 'Engineering', tagline: '', description: '', icon: '', color: '', badgeColor: '',
          roles: [
            {
              id: 'r1', title: 'A', departmentId: 'engineering', level: 'L1', experienceYears: '', mission: '', summary: '',
              accountabilities: [], responsibilities: ['x'],
              competencies: { behavioral: [], technical: [], domain: [] },
              metricsAndKras: [{ outcomeArea: 'o', metric: 'm', target: 't', sourceData: 's', frequency: 'f' }],
              careerPath: { previousRoles: [], nextRoles: [] },
            },
            {
              id: 'r2', title: 'B', departmentId: 'engineering', level: 'L2', experienceYears: '', mission: '', summary: '',
              accountabilities: [], responsibilities: [],
              competencies: { behavioral: [], technical: [], domain: [] },
              metricsAndKras: [],
              careerPath: { previousRoles: [], nextRoles: [] },
            },
          ],
        },
      ],
    };
    const stats = computePortalStats(portal);
    expect(stats.roleCount).toBe(2);
    expect(stats.departmentCount).toBe(1);
    expect(stats.levelCount).toBe(2);
    expect(stats.percentRolesWithKras).toBe(50);
    expect(stats.percentRolesWithResponsibilities).toBe(50);
  });
});
