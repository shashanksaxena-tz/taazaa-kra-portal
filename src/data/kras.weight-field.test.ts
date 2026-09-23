import { describe, it, expect } from 'vitest';
import data from './kras.json';

const ROLES_WITH_DOCUMENTED_WEIGHT = new Set([
  'business-analyst-ba',
  'senior-business-analyst-sr-ba',
  'senior-product-manager-sr-pm',
  'product-manager-pm',
]);

describe('kras.json metricsAndKras weight field', () => {
  it('only the roles whose source document states a per-metric weight have any weight value', () => {
    for (const dept of data.departments) {
      for (const role of dept.roles) {
        const hasAnyWeight = role.metricsAndKras.some((m: { weight?: string }) => m.weight);
        if (hasAnyWeight) {
          expect(ROLES_WITH_DOCUMENTED_WEIGHT.has(role.id)).toBe(true);
        }
      }
    }
  });

  it('every populated weight is a plain percentage string, never fabricated filler', () => {
    for (const dept of data.departments) {
      for (const role of dept.roles) {
        for (const m of role.metricsAndKras as Array<{ weight?: string }>) {
          if (m.weight) {
            expect(m.weight).toMatch(/^\d{1,3}%$/);
          }
        }
      }
    }
  });
});
