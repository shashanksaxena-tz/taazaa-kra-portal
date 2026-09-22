export type SectionId =
  | 'home' | 'roles' | 'accountability' | 'performance'
  | 'career' | 'development' | 'how-we-work' | 'resources';

/** SectionId minus 'home' — the sections that actually appear in NAVIGATION and have sub-tabs. */
export type NavSectionId = Exclude<SectionId, 'home'>;

export interface SubTabConfig {
  id: string;
  label: string;
  /** Shown by EmptyState when no registry component is registered for this sub-tab. */
  emptyDescription: string;
}

export interface SectionConfig {
  id: NavSectionId;
  label: string;
  subTabs: SubTabConfig[];
}

export const NAVIGATION: SectionConfig[] = [
  { id: 'roles', label: 'Roles', subTabs: [
    { id: 'charters', label: 'Role Charters', emptyDescription: '' },
    { id: 'responsibilities', label: 'Responsibilities', emptyDescription: '' },
    { id: 'expectations', label: 'Role Expectations', emptyDescription: 'No distinct role-expectations content was found in the source documents for this practice yet.' },
  ]},
  { id: 'accountability', label: 'Accountability', subTabs: [
    { id: 'raci', label: 'RACI', emptyDescription: '' },
    { id: 'decision-rights', label: 'Decision Rights', emptyDescription: 'No per-role decision-rights data exists in the source documents yet. See RACI for documented accountable/responsible/consulted/informed roles.' },
    { id: 'governance', label: 'Governance', emptyDescription: 'No governance framework content was found in the source documents yet.' },
  ]},
  { id: 'performance', label: 'Performance', subTabs: [
    { id: 'kra-kpi', label: 'KRA & KPI', emptyDescription: '' },
    { id: 'standards', label: 'Performance Standards', emptyDescription: 'No performance-standards content was found in the source documents yet.' },
    { id: 'review-framework', label: 'Review Framework', emptyDescription: 'No review-framework content was found in the source documents yet.' },
  ]},
  { id: 'career', label: 'Career', subTabs: [
    { id: 'architecture', label: 'Career Architecture', emptyDescription: 'No dedicated career-architecture framework was found in the source documents yet. See Levels for the level bands already documented per role.' },
    { id: 'levels', label: 'Levels', emptyDescription: '' },
    { id: 'competencies', label: 'Competencies', emptyDescription: '' },
    { id: 'promotion-criteria', label: 'Promotion Criteria', emptyDescription: 'No promotion-criteria content was found in the source documents yet.' },
  ]},
  { id: 'development', label: 'Development', subTabs: [
    { id: 'skills', label: 'Skills', emptyDescription: 'No dedicated skills-development content was found in the source documents yet.' },
    { id: 'plans', label: 'Development Plans', emptyDescription: 'No development-plan content was found in the source documents yet.' },
    { id: 'leadership', label: 'Leadership Development', emptyDescription: 'No leadership-development content was found in the source documents yet.' },
  ]},
  { id: 'how-we-work', label: 'How We Work', subTabs: [
    { id: 'norms', label: 'Global Working Norms', emptyDescription: 'No global working-norms content was found in the source documents yet.' },
    { id: 'communication', label: 'Communication', emptyDescription: 'No communication-standards content was found in the source documents yet.' },
    { id: 'decision-making', label: 'Decision Making', emptyDescription: 'No decision-making framework content was found in the source documents yet.' },
    { id: 'collaboration', label: 'Collaboration', emptyDescription: 'No collaboration-standards content was found in the source documents yet.' },
  ]},
  { id: 'resources', label: 'Resources', subTabs: [
    { id: 'templates', label: 'Templates', emptyDescription: 'No templates were found in the source documents yet.' },
    { id: 'frameworks', label: 'Frameworks', emptyDescription: '' },
    { id: 'faqs', label: 'FAQs', emptyDescription: 'No FAQ content was found in the source documents yet.' },
  ]},
];

export function getSection(id: NavSectionId): SectionConfig {
  const section = NAVIGATION.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown section id: ${id}`);
  return section;
}

export function getDefaultSubTab(id: NavSectionId): string {
  return getSection(id).subTabs[0].id;
}
