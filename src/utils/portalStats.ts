import { PortalData } from '../types';

export interface PortalStats {
  roleCount: number;
  departmentCount: number;
  levelCount: number;
  percentRolesWithKras: number;
  percentRolesWithResponsibilities: number;
}

export function computePortalStats(portalData: PortalData): PortalStats {
  const allRoles = portalData.departments.flatMap((d) => d.roles);
  const roleCount = allRoles.length;
  const departmentCount = portalData.departments.length;
  const levelCount = new Set(allRoles.map((r) => r.level)).size;

  const pct = (predicate: (r: (typeof allRoles)[number]) => boolean) =>
    roleCount === 0 ? 0 : Math.round((allRoles.filter(predicate).length / roleCount) * 100);

  return {
    roleCount,
    departmentCount,
    levelCount,
    percentRolesWithKras: pct((r) => r.metricsAndKras.length > 0),
    percentRolesWithResponsibilities: pct((r) => r.responsibilities.length > 0),
  };
}
