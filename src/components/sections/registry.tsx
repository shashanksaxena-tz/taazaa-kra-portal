import React from 'react';
import { ResponsibilitiesView } from '../roles/ResponsibilitiesView';
import { KraKpiView } from '../performance/KraKpiView';
import { LevelsView } from '../career/LevelsView';
import { CompetenciesView } from '../career/CompetenciesView';
import { RaciMatrixView } from '../kras/RaciMatrixView';
import { FrameworksView } from '../kras/FrameworksView';

/**
 * Key format: `${SectionId}.${subTabId}`. Absent key => caller renders EmptyState.
 * 'roles.charters' is intentionally absent: App.tsx composes HeroSection + DepartmentTabs
 * + RoleGrid inline for that one entry, since it needs the onSelectRole callback wired
 * to the role-detail modal at the App level.
 */
export const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  'roles.responsibilities': ResponsibilitiesView,
  'performance.kra-kpi': KraKpiView,
  'career.levels': LevelsView,
  'career.competencies': CompetenciesView,
  'accountability.raci': RaciMatrixView,
  'resources.frameworks': FrameworksView,
};
