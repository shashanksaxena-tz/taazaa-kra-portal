import { describe, it, expect } from 'vitest';
import data from './kras.json';

describe('kras.json summary field (no fabricated department boilerplate)', () => {
  it('no role summary matches the fabricated "Key role in <dept> driving technical delivery..." template', () => {
    const boilerplate = /^Key role in .+ driving technical delivery, quality, and stakeholder value\.$/;
    for (const dept of data.departments) {
      for (const role of dept.roles) {
        expect(role.summary).not.toMatch(boilerplate);
      }
    }
  });

  it('the unsourced qa/senior-quality-assurance-lead role has no invented sourceDoc attribution', () => {
    const qa = data.departments.find((d) => d.id === 'qa');
    const role = qa?.roles.find((r) => r.id === 'senior-quality-assurance-lead');
    expect(role?.sourceDoc).toBeFalsy();
    expect(role?.summary).toBe('');
  });
});
