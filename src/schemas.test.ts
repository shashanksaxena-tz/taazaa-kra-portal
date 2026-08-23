import { describe, it, expect } from 'vitest';
import { portalDataSchema } from './schemas';

const validDepartment = {
  id: 'eng',
  name: 'Engineering',
  roles: [
    {
      id: 'role-1',
      title: 'Software Engineer',
      departmentId: 'eng',
    },
  ],
};

describe('portalDataSchema', () => {
  it('accepts a minimal valid payload and applies field defaults', () => {
    const result = portalDataSchema.safeParse({
      departments: [validDepartment],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.departments[0].roles).toHaveLength(1);
      expect(result.data.raciMatrix).toEqual([]);
      expect(result.data.versions).toEqual([]);
    }
  });

  it('rejects payloads with zero departments', () => {
    const result = portalDataSchema.safeParse({ departments: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/at least one department/i);
    }
  });

  it('rejects a role without a title', () => {
    const result = portalDataSchema.safeParse({
      departments: [{ id: 'eng', name: 'Engineering', roles: [{ id: 'r1', departmentId: 'eng' }] }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a department without a name', () => {
    const result = portalDataSchema.safeParse({
      departments: [{ id: 'eng', roles: [] }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a version entry missing its effective date', () => {
    const result = portalDataSchema.safeParse({
      departments: [validDepartment],
      versions: [{ id: 'v-x', versionNumber: 'vX', name: 'Broken', effectiveDate: '' }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.match(/effective date/i))).toBe(true);
    }
  });

  it('normalizes nullish arrays into empty arrays', () => {
    const result = portalDataSchema.safeParse({
      departments: [{ id: 'eng', name: 'E', roles: [], accountabilities: null }],
      raciMatrix: null,
      versions: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.departments[0].roles).toEqual([]);
      expect(result.data.raciMatrix).toEqual([]);
      expect(result.data.versions).toEqual([]);
    }
  });

  it('fills RACI cells with empty strings when omitted', () => {
    const result = portalDataSchema.safeParse({
      departments: [validDepartment],
      raciMatrix: [{ activity: 'Code Review' }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.raciMatrix[0]).toMatchObject({
        activity: 'Code Review',
        deliveryManager: '',
        techLead: '',
        programManager: '',
        productManager: '',
      });
    }
  });
});
