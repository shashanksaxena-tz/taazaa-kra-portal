export type ExperienceLevel = 
  | 'Associate (L1)'
  | 'Mid-Level (L2)'
  | 'Senior (L3)'
  | 'Lead (L4)'
  | 'Management (L4-L5)'
  | 'Principal / Architect (L5)'
  | 'Executive / Director (L6)';

export interface MetricOKR {
  outcomeArea: string;
  metric: string;
  target: string;
  sourceData: string;
  frequency: string;
}

export interface CompetencyGroup {
  behavioral: string[];
  technical: string[];
  domain: string[];
}

export interface CareerPathNode {
  id: string;
  title: string;
}

export interface CareerPath {
  previousRoles: CareerPathNode[];
  nextRoles: CareerPathNode[];
}

export interface RoleCharter {
  id: string;
  title: string;
  departmentId: string;
  level: string;
  experienceYears: string;
  mission: string;
  summary: string;
  accountabilities: string[];
  responsibilities: string[];
  competencies: CompetencyGroup;
  metricsAndOkrs: MetricOKR[];
  careerPath: CareerPath;
  sourceDoc?: string;
}

export interface DepartmentFramework {
  title: string;
  summary: string;
  source: string;
}

export interface Department {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  badgeColor: string;
  roles: RoleCharter[];
  frameworks?: DepartmentFramework[];
}

export interface RaciItem {
  activity: string;
  deliveryManager: string;
  programManager: string;
  techLead: string;
  productManager: string;
}

export interface KRAVersion {
  id: string;
  versionNumber: string;
  name: string;
  effectiveDate: string; // e.g. "2026-08", "2026-01", "2025-12", "2024-01"
  createdAt: string;
  createdBy: string;
  notes?: string;
  departments: Department[];
  raciMatrix?: RaciItem[];
}

export interface PortalData {
  organization: string;
  portalTitle: string;
  portalSubtitle: string;
  lastUpdated: string;
  version: string;
  departments: Department[];
  raciMatrix: RaciItem[];
  versions?: KRAVersion[];
  activeVersionId?: string;
  /** Bumped when the persisted shape changes; drives localStorage migration. */
  schemaVersion?: number;
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  filePath: string;
  /** Legacy direct mode only. Preferred: gatewayUrl with server-held token. */
  token?: string;
  /** Secure commit gateway endpoint (serverless fn holding the PAT server-side). */
  gatewayUrl?: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  role: 'admin' | 'editor';
}
