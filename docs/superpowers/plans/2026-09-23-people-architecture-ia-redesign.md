# People Architecture IA Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Taazaa portal's content so every displayed fact traces to a source `.docx`/`.pdf`, unify OKR→KRA terminology everywhere (code + UI), and restructure the site into the 7-section IA (Roles / Accountability / Performance / Career / Development / How We Work / Resources) plus a new dashboard-style Home page inspired by the provided screenshot's visual style.

**Architecture:** Extend the existing tab-based state model (`KRAContext.activeTab`) with a config-driven navigation registry (`src/config/navigation.ts` + `src/components/sections/registry.tsx`) so any sub-tab without a registered real-data component automatically falls back to a shared `EmptyState`. This keeps every "no source data" page a one-line config entry instead of a bespoke component, and lets a future developer add real content later by just registering a component — no router, no new dependency.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide icons, Vitest (existing test runner — confirm via `package.json` `scripts.test`).

**Spec:** `docs/superpowers/specs/2026-09-23-people-architecture-ia-redesign-design.md`

## Global Constraints

- Every fact shown in the UI must trace to a document in `Engineering/`, `QA/`, `Design Team/`, `Product Team/`, or `Program Management/`. No invented content. Where a source doc doesn't cover something, render the shared `EmptyState`, never a fabricated value.
- "OKR" is renamed to "KRA" everywhere: type names, field names, JSON keys, variable names, UI text. Zero case-insensitive `okr` matches allowed in `src/` after this plan (verified by grep in the final task), except historical document filenames under the department folders (not touched).
- No new runtime dependency (no `react-router` or similar) — navigation stays state-based per the approved design.
- Role Comparator and the Admin/GitHub-sync workspace are relabeled only (KRA terms), not moved or restructured.
- Existing role `id`/slug values are preserved during the content audit so nothing referencing them (localStorage-persisted state, tests) breaks.
- All new components follow existing Tailwind class conventions already used in `src/components/kras/*` (brand-500/600, slate palette, dark: variants, rounded-2xl/3xl cards) — match, don't invent a new visual language outside the homepage.

## Review Focus

- A role whose source doc has **zero** usable text for a required field (e.g. no "Competencies" section at all) must render that field as an empty list in the UI, not throw or render `undefined`/`[object Object]`.
- Switching `activeTab` to a section with sub-tabs must always resolve a valid default `activeSubTab` (first entry in that section's config) — never leave `activeSubTab` pointing at a sub-tab id from the previously-viewed section.
- The Home page's computed stats (`portalStats.ts`) must not divide by zero when `departments` or `roles` is empty (defensive test with an empty `PortalData`), since an admin could delete all departments via the existing Admin panel.
- Legacy `localStorage` data saved before this change (`activeTab: 'raci'` or `'frameworks'`, or `metricsAndOkrs` field name) must not crash the app on load — the rename/nav migration must handle old persisted shapes gracefully (existing `schemaVersion`/`normalizePortalData` migration path already exists in `storageService`; extend it rather than assuming a clean slate).
- RACI matrix and Frameworks views moving under new parent sections must still be reachable by any existing direct callers (e.g. `handleEditInAdmin`, footer links) — grep all `setActiveTab(` call sites after the rename and update them to the new section/sub-tab pair.

---

## Task 1: Content audit — re-extract all role data from source documents

**Files:**
- Create (scratchpad, not committed): `/private/tmp/claude-502/.../scratchpad/audit/{engineering,qa,design,product,program-management}.json`
- Modify: `src/data/kras.json`
- Create (kept, for future re-runs): `scripts/audit_report.md` — summary of what was removed/changed per role

**Interfaces:**
- Produces: an updated `src/data/kras.json` matching the existing `PortalData` shape (see `src/types/index.ts`) — same `id`/slug values, `mission`, `summary`, `accountabilities`, `responsibilities`, `competencies`, `metricsAndOkrs` (renamed to `metricsAndKras` in Task 2 — keep the old key name in this task's output; Task 2 renames it), `careerPath` per role, plus corrected `raciMatrix` and department `frameworks`.

- [ ] **Step 1: Dispatch 5 parallel department-audit agents**

Launch one `Agent` call per department in a single message (parallel), each with this prompt shape (fill in `<DEPT_FOLDER>` and the list of that department's roles read from the current `src/data/kras.json`):

```
Read every .docx/.pdf file in "<DEPT_FOLDER>" (use a docx-to-text extraction
method available to you, e.g. python-docx or a document reader tool).
For each of these roles: <list of {id, title} from kras.json for this dept>,
find its matching source document (match by title/level) and rebuild these
fields STRICTLY from what the document says, in this exact JSON shape:

{
  "id": "<existing id, unchanged>",
  "mission": "<1-2 sentences from the doc, or empty string if not stated>",
  "summary": "<from the doc, or empty string>",
  "accountabilities": ["<bullet from doc>", ...],   // [] if none in doc
  "responsibilities": ["<bullet from doc>", ...],   // [] if none in doc
  "competencies": { "behavioral": [...], "technical": [...], "domain": [...] }, // each [] if not covered
  "metricsAndOkrs": [ { "outcomeArea": "...", "metric": "...", "target": "...", "sourceData": "...", "frequency": "..." }, ... ], // [] if not covered
  "careerPath": { "previousRoles": [{"id": "...", "title": "..."}], "nextRoles": [...] }, // [] if not covered
  "flaggedRemovals": ["<short note on anything currently in our JSON with no basis in the doc>", ...]
}

Do NOT invent, infer, or interpolate anything not textually present in the
document. If a field has no coverage in the doc, use an empty string/array,
never a placeholder sentence. Also identify whether the doc contains any
distinct "Role Expectations", "Decision Rights", "Governance", "Performance
Standards", "Review Framework", "Career Architecture" / leveling framework,
"Promotion Criteria" / next-level-expectations, "Skills", "Development
Plans", "Leadership Development", "Working Norms"/"Communication"/"Decision
Making"/"Collaboration" content, or "Templates"/"FAQs" — report verbatim
excerpts if so, under a top-level "extraSections" object keyed by that
label, else omit the key entirely.

Also read the department's OD/framework doc(s) if present (e.g.
Tz_OrgDesign_*.docx, Delivery_OD_Doc_Final.docx) and report their framework
entries in the same strict, doc-only way as: { "title": "...", "summary":
"...", "source": "<filename>" }.

Write your complete JSON result to
/private/tmp/claude-502/-Users-shashanksaxena-Downloads-Taazaa-ER-copy/<session>/scratchpad/audit/<dept-slug>.json
and report back a short list of what you flagged as unsupported.
```

- [ ] **Step 2: Merge the 5 audit files into `src/data/kras.json`**

For each department in the existing JSON, replace each role's `mission`, `summary`, `accountabilities`, `responsibilities`, `competencies`, `metricsAndOkrs`, `careerPath` with the audited values (matched by `id`). Replace `raciMatrix` with the audited RACI data (still scoped to the 4 roles the source RACI doc covers). Replace each department's `frameworks` array with the audited framework entries. Preserve every other existing field (`title`, `departmentId`, `level`, `experienceYears`, `sourceDoc`, department `name`/`tagline`/`description`/`icon`/`color`/`badgeColor`) unchanged.

- [ ] **Step 3: Validate the merged JSON against the schema**

Run:
```bash
npx tsx -e "
import { portalDataSchema } from './src/schemas';
import data from './src/data/kras.json';
const result = portalDataSchema.safeParse(data);
if (!result.success) { console.error(result.error.format()); process.exit(1); }
console.log('valid, roles:', data.departments.flatMap((d: any) => d.roles).length);
"
```
Expected: prints `valid, roles: <same count as before>` — the audit must not add/drop roles, only correct their content.

- [ ] **Step 4: Write `scripts/audit_report.md`**

One section per department, listing every `flaggedRemovals` entry and every `extraSections` finding from the 5 agent outputs, so Task 5–8's empty-state decisions are made from this report rather than re-reading documents.

- [ ] **Step 5: Commit**

```bash
git add src/data/kras.json scripts/audit_report.md
git commit -m "content: re-extract all role/RACI/framework data strictly from source documents

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2: Rename OKR → KRA across code and data

**Files:**
- Modify: `src/types/index.ts`, `src/schemas.ts`, `src/services/excelService.ts`, `src/data/kras.json`
- Modify: `src/components/admin/AdminPanel.tsx`, `src/components/admin/FeatureGuideModal.tsx`, `src/components/admin/ImportGuide.tsx`, `src/components/admin/RoleEditorModal.tsx`, `src/components/kras/DepartmentTabs.tsx`, `src/components/kras/RoleCard.tsx`, `src/components/kras/RoleComparatorModal.tsx`, `src/components/kras/RoleDetailModal.tsx`, `src/components/kras/RoleGrid.tsx`, `src/components/ui/Footer.tsx`, `src/components/ui/HeroSection.tsx`
- Modify: `src/services/excelService.test.ts`, `src/services/excelService.roundtrip.test.ts`, `src/components/kras/RoleDetailModal.test.tsx`, `src/components/admin/FeatureGuideModal.test.tsx`, `src/components/admin/ImportGuide.test.tsx`

**Interfaces:**
- Consumes: `src/data/kras.json` as rebuilt by Task 1 (still has `metricsAndOkrs` key at this point).
- Produces: `MetricKRA` (type, was `MetricOKR`), `metricsAndKras: MetricKRA[]` (field, was `metricsAndOkrs`) on `RoleCharter` — every later task and the UI use these names.

- [ ] **Step 1: Rename the type and field in `src/types/index.ts`**

```typescript
export interface MetricKRA {
  outcomeArea: string;
  metric: string;
  target: string;
  sourceData: string;
  frequency: string;
}
```
And on `RoleCharter`, change `metricsAndOkrs: MetricOKR[];` to `metricsAndKras: MetricKRA[];`.

- [ ] **Step 2: Update `src/schemas.ts`**

Find the Zod (or equivalent) schema field currently named `metricsAndOkrs` and rename it to `metricsAndKras`, matching the new `MetricKRA` shape (same fields, just the schema key name changes).

- [ ] **Step 3: Update `src/services/excelService.ts` and its two test files**

Rename every `metricsAndOkrs` reference, and any column header / label string containing "OKR" (e.g. `"OKR Outcome Area"` → `"KRA Outcome Area"`, `"OKRs"` → `"KRAs"`) to match. Update `excelService.test.ts` and `excelService.roundtrip.test.ts` assertions that reference the old field name or header text to the new names.

- [ ] **Step 4: Bulk-rename in `src/data/kras.json`**

```bash
node -e "
const fs = require('fs');
const path = 'src/data/kras.json';
const raw = fs.readFileSync(path, 'utf8');
const renamed = raw.replaceAll('\"metricsAndOkrs\"', '\"metricsAndKras\"');
fs.writeFileSync(path, renamed);
console.log('renamed', (raw.match(/metricsAndOkrs/g) || []).length, 'occurrences');
"
```

- [ ] **Step 5: Update UI text in the 11 listed components**

For each file, replace visible/label OKR text with KRA equivalents (e.g. `"Quarterly OKRs"` → `"Quarterly KRAs"`, `"OKR & Metric Editor"` → `"KRA & Metric Editor"`, `okrText` prop/var names → `kraText`), and any `.metricsAndOkrs` property access → `.metricsAndKras`. Also update `RoleDetailModal.test.tsx` and `FeatureGuideModal.test.tsx`/`ImportGuide.test.tsx` assertions/text matchers referencing the old strings.

- [ ] **Step 6: Verify zero remaining "OKR" in `src/`**

```bash
grep -rli okr src | sort
```
Expected: empty output.

- [ ] **Step 7: Run the test suite and build**

```bash
npm test -- --run
npm run build
```
Expected: all tests pass, build succeeds with no TypeScript errors (a leftover `MetricOKR`/`metricsAndOkrs` reference anywhere will fail the build — that's the safety net for this rename).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: rename OKR terminology to KRA across types, schema, services, data, and UI

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 3: Navigation config, section registry, and shared EmptyState component

**Files:**
- Create: `src/config/navigation.ts`
- Create: `src/components/shared/EmptyState.tsx`
- Create: `src/components/shared/EmptyState.test.tsx`
- Create: `src/components/sections/registry.tsx`

**Interfaces:**
- Produces: `SectionId` (union type), `NAVIGATION: SectionConfig[]`, `getSection(id: SectionId): SectionConfig`, `getDefaultSubTab(id: SectionId): string` — consumed by Task 4 (`KRAContext`, `Navbar`) and Task 6 (`App.tsx`).
- Produces: `EmptyState` component with props `{ title: string; description?: string; onSuggestChange?: () => void }`.
- Produces: `SECTION_REGISTRY: Record<string, React.ComponentType>` keyed by `` `${SectionId}.${subTabId}` `` — consumed by Task 6. Any key absent from this map means Task 6 renders `EmptyState` using that sub-tab's config `label`/`emptyDescription`.

- [ ] **Step 1: Write `src/config/navigation.ts`**

```typescript
export type SectionId =
  | 'home' | 'roles' | 'accountability' | 'performance'
  | 'career' | 'development' | 'how-we-work' | 'resources';

export interface SubTabConfig {
  id: string;
  label: string;
  /** Shown by EmptyState when no registry component is registered for this sub-tab. */
  emptyDescription: string;
}

export interface SectionConfig {
  id: SectionId;
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

export function getSection(id: SectionId): SectionConfig {
  const section = NAVIGATION.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown section id: ${id}`);
  return section;
}

export function getDefaultSubTab(id: SectionId): string {
  return getSection(id).subTabs[0].id;
}
```

(Task 1's `scripts/audit_report.md` `extraSections` findings decide, at implementation time, which `emptyDescription` entries above get flipped to real registry components in Task 5 instead — if the audit found real content for e.g. "Role Expectations", add its component to the registry in Task 5 rather than leaving it here.)

- [ ] **Step 2: Write `src/components/shared/EmptyState.tsx`**

```tsx
import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  onSuggestChange?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, onSuggestChange }) => (
  <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-16 flex flex-col items-center text-center">
    <div className="w-full max-w-xl p-10 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">{title}</h2>
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
      )}
      {onSuggestChange && (
        <button
          onClick={onSuggestChange}
          className="mt-6 text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:underline"
        >
          Suggest a change
        </button>
      )}
    </div>
  </div>
);
```

- [ ] **Step 3: Write `src/components/shared/EmptyState.test.tsx`**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="Not documented" description="No source coverage yet." />);
    expect(screen.getByText('Not documented')).toBeInTheDocument();
    expect(screen.getByText('No source coverage yet.')).toBeInTheDocument();
  });

  it('calls onSuggestChange when the button is clicked', () => {
    const onSuggestChange = vi.fn();
    render(<EmptyState title="Not documented" onSuggestChange={onSuggestChange} />);
    fireEvent.click(screen.getByText('Suggest a change'));
    expect(onSuggestChange).toHaveBeenCalledTimes(1);
  });

  it('omits the suggest-change button when no handler is passed', () => {
    render(<EmptyState title="Not documented" />);
    expect(screen.queryByText('Suggest a change')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the new test**

```bash
npm test -- --run src/components/shared/EmptyState.test.tsx
```
Expected: 3 passing tests.

- [ ] **Step 5: Write `src/components/sections/registry.tsx` (empty scaffold, filled in Task 5)**

```tsx
import React from 'react';

/** Key format: `${SectionId}.${subTabId}`. Absent key => caller renders EmptyState. */
export const SECTION_REGISTRY: Record<string, React.ComponentType<{ onSelectRole?: (role: any) => void }>> = {};
```

- [ ] **Step 6: Commit**

```bash
git add src/config/navigation.ts src/components/shared/EmptyState.tsx src/components/shared/EmptyState.test.tsx src/components/sections/registry.tsx
git commit -m "feat: add config-driven navigation + shared EmptyState for undocumented sections

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 4: KRAContext navigation state + Navbar rewrite

**Files:**
- Modify: `src/context/KRAContext.tsx`
- Modify: `src/components/ui/Navbar.tsx`

**Interfaces:**
- Consumes: `SectionId`, `NAVIGATION`, `getDefaultSubTab` from `src/config/navigation.ts` (Task 3).
- Produces: `activeTab: SectionId`, `activeSubTab: string`, `setActiveTab: (tab: SectionId, subTab?: string) => void`, `setActiveSubTab: (subTab: string) => void` on `KRAContextType` — consumed by Task 6 (`App.tsx`) and Task 7 (Home page's internal links).

- [ ] **Step 1: Update `KRAContextType` and state in `src/context/KRAContext.tsx`**

Replace:
```typescript
activeTab: 'kras' | 'raci' | 'frameworks' | 'admin';
```
with:
```typescript
activeTab: SectionId | 'admin';
activeSubTab: string;
```
Replace the `setActiveTab` signature:
```typescript
setActiveTab: (tab: SectionId | 'admin', subTab?: string) => void;
setActiveSubTab: (subTab: string) => void;
```
Import `SectionId, getDefaultSubTab` from `'../config/navigation'`.

- [ ] **Step 2: Update state initialization and setter implementation**

```typescript
const [activeTab, setActiveTabState] = useState<SectionId | 'admin'>('home');
const [activeSubTab, setActiveSubTab] = useState<string>('charters');

const setActiveTab = (tab: SectionId | 'admin', subTab?: string) => {
  setActiveTabState(tab);
  if (tab !== 'admin') {
    setActiveSubTab(subTab ?? getDefaultSubTab(tab));
  }
};
```
Add `activeSubTab, setActiveSubTab` to the context value object returned by the provider.

- [ ] **Step 3: Handle legacy persisted `activeTab` values defensively**

In `storageService`'s existing migration path (or, if `activeTab` isn't persisted, skip this step — check `storageService.ts` for whether `activeTab` is ever read from `localStorage`; if it's pure in-memory `useState` with no persistence, this step is a no-op — confirm by grepping `activeTab` in `storageService.ts` and note the result in the commit message instead of adding dead code).

- [ ] **Step 4: Rewrite `src/components/ui/Navbar.tsx` nav items**

Replace the hardcoded tab buttons with a map over `NAVIGATION` (imported from `src/config/navigation.ts`), rendering "Home" first (not part of `NAVIGATION`, handled as a literal), then each section as a top-level button; on click call `setActiveTab(section.id)`. Add a lightweight dropdown (reuse existing dropdown/menu pattern already in this file if one exists, else a simple `absolute` positioned panel shown on hover/focus matching existing Tailwind conventions) listing that section's `subTabs`; clicking a sub-tab calls `setActiveTab(section.id, subTab.id)`. Keep the existing search icon, notification icon, and admin/compare entry points untouched — only the primary nav item list and click handlers change.

- [ ] **Step 5: Update all other `setActiveTab(` call sites**

```bash
grep -rn "setActiveTab(" src --include=*.tsx --include=*.ts
```
For each call site outside `Navbar.tsx` (e.g. `App.tsx`'s `handleEditInAdmin`, footer links), update the argument to the new `(SectionId | 'admin', subTab?)` signature — e.g. a footer link that used to do `setActiveTab('raci')` becomes `setActiveTab('accountability', 'raci')`; one that did `setActiveTab('frameworks')` becomes `setActiveTab('resources', 'frameworks')`; one that did `setActiveTab('kras')` becomes `setActiveTab('roles', 'charters')`. `setActiveTab('admin')` call sites are unchanged.

- [ ] **Step 6: Build to catch any missed call site**

```bash
npm run build
```
Expected: succeeds — a stale 2-tuple call against the new signature is still valid TypeScript (the `subTab` param is optional), so this step is a sanity check that no other type errors were introduced, not a strict signature check. Manually re-grep Step 5's list against the diff to confirm every one was updated.

- [ ] **Step 7: Commit**

```bash
git add src/context/KRAContext.tsx src/components/ui/Navbar.tsx
git commit -m "feat: add section/sub-tab navigation state and rewire Navbar to the new IA

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 5: Real-content section view components

**Files:**
- Create: `src/components/roles/ResponsibilitiesView.tsx`
- Create: `src/components/performance/KraKpiView.tsx`
- Create: `src/components/career/LevelsView.tsx`
- Create: `src/components/career/CompetenciesView.tsx`
- Modify: `src/components/kras/RaciMatrixView.tsx` (rename OKR text already done in Task 2; no structural change needed — just re-verify it renders standalone without the old `activeTab === 'raci'` assumption)
- Modify: `src/components/kras/FrameworksView.tsx` (same — re-verify standalone)
- Modify: `src/components/sections/registry.tsx`

**Interfaces:**
- Consumes: `PortalData`/`RoleCharter` from `src/types/index.ts`, `useKRA()` from `src/context/KRAContext.tsx`.
- Produces: 6 registry entries — `roles.charters` (existing `RoleGrid`+`DepartmentTabs`+`HeroSection` composed inline in `App.tsx`, not a new file — listed here for completeness of the registry map built in Step 6), `roles.responsibilities`, `performance.kra-kpi`, `career.levels`, `career.competencies`, `accountability.raci`, `resources.frameworks`.

- [ ] **Step 1: Write `src/components/roles/ResponsibilitiesView.tsx`**

```tsx
import React, { useState } from 'react';
import { useKRA } from '../../context/KRAContext';
import { EmptyState } from '../shared/EmptyState';

export const ResponsibilitiesView: React.FC = () => {
  const { portalData } = useKRA();
  const [query, setQuery] = useState('');

  const rows = portalData.departments.flatMap((d) =>
    d.roles
      .filter((r) => r.responsibilities.length > 0)
      .map((r) => ({ department: d.name, role: r.title, responsibilities: r.responsibilities }))
  ).filter((row) => row.role.toLowerCase().includes(query.toLowerCase()));

  if (rows.length === 0) {
    return <EmptyState title="No documented responsibilities" description="No role in the current dataset has responsibilities captured from its source document yet." />;
  }

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Responsibilities by Role</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by role..."
          className="mt-4 w-full sm:w-80 px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rows.map((row) => (
          <div key={row.role} className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">{row.department}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-3">{row.role}</h3>
            <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-600 dark:text-slate-300">
              {row.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Write `src/components/performance/KraKpiView.tsx`**

```tsx
import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { EmptyState } from '../shared/EmptyState';

export const KraKpiView: React.FC = () => {
  const { portalData } = useKRA();
  const rolesWithKras = portalData.departments.flatMap((d) =>
    d.roles.filter((r) => r.metricsAndKras.length > 0).map((r) => ({ department: d.name, role: r }))
  );

  if (rolesWithKras.length === 0) {
    return <EmptyState title="No documented KRAs" description="No role in the current dataset has KRA & KPI data captured from its source document yet." />;
  }

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">KRA &amp; KPI by Role</h1>
      <div className="space-y-8">
        {rolesWithKras.map(({ department, role }) => (
          <div key={role.id} className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">{department}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-4">{role.title}</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="pb-2 pr-4">Outcome Area</th>
                  <th className="pb-2 pr-4">Metric</th>
                  <th className="pb-2 pr-4">Target</th>
                  <th className="pb-2 pr-4">Source</th>
                  <th className="pb-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {role.metricsAndKras.map((m, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                    <td className="py-2 pr-4">{m.outcomeArea}</td>
                    <td className="py-2 pr-4">{m.metric}</td>
                    <td className="py-2 pr-4">{m.target}</td>
                    <td className="py-2 pr-4">{m.sourceData}</td>
                    <td className="py-2">{m.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Write `src/components/career/LevelsView.tsx`**

```tsx
import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { EmptyState } from '../shared/EmptyState';

export const LevelsView: React.FC = () => {
  const { portalData } = useKRA();
  const allRoles = portalData.departments.flatMap((d) => d.roles.map((r) => ({ ...r, departmentName: d.name })));
  const levels = Array.from(new Set(allRoles.map((r) => r.level))).sort();

  if (levels.length === 0) {
    return <EmptyState title="No documented levels" description="No role in the current dataset has a level assigned yet." />;
  }

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Career Levels</h1>
      <div className="space-y-6">
        {levels.map((level) => (
          <div key={level} className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{level}</h3>
            <div className="flex flex-wrap gap-2">
              {allRoles.filter((r) => r.level === level).map((r) => (
                <span key={r.id} className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                  {r.title} <span className="text-slate-400">· {r.departmentName}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Write `src/components/career/CompetenciesView.tsx`**

```tsx
import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { EmptyState } from '../shared/EmptyState';

const GROUPS: Array<{ key: 'behavioral' | 'technical' | 'domain'; label: string }> = [
  { key: 'behavioral', label: 'Behavioral' },
  { key: 'technical', label: 'Technical & Functional' },
  { key: 'domain', label: 'Domain & Delivery' },
];

export const CompetenciesView: React.FC = () => {
  const { portalData } = useKRA();
  const rolesWithCompetencies = portalData.departments.flatMap((d) =>
    d.roles
      .filter((r) => r.competencies.behavioral.length + r.competencies.technical.length + r.competencies.domain.length > 0)
      .map((r) => ({ department: d.name, role: r }))
  );

  if (rolesWithCompetencies.length === 0) {
    return <EmptyState title="No documented competencies" description="No role in the current dataset has competencies captured from its source document yet." />;
  }

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Competencies by Role</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rolesWithCompetencies.map(({ department, role }) => (
          <div key={role.id} className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">{department}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-4">{role.title}</h3>
            {GROUPS.map(({ key, label }) => role.competencies[key].length > 0 && (
              <div key={key} className="mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
                <ul className="mt-1 list-disc list-inside text-sm text-slate-600 dark:text-slate-300">
                  {role.competencies[key].map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 5: Verify `RaciMatrixView` and `FrameworksView` still render standalone**

Both already read from `useKRA()`/`portalData` directly with no dependency on the old `activeTab` string, per their current source (confirmed in earlier exploration) — no code change needed, just re-read both files to confirm no `activeTab ===` check exists inside them. If either does contain one, remove it (they shouldn't need to know which tab is active — that's `App.tsx`'s job).

- [ ] **Step 6: Populate `src/components/sections/registry.tsx`**

```tsx
import React from 'react';
import { ResponsibilitiesView } from '../roles/ResponsibilitiesView';
import { KraKpiView } from '../performance/KraKpiView';
import { LevelsView } from '../career/LevelsView';
import { CompetenciesView } from '../career/CompetenciesView';
import { RaciMatrixView } from '../kras/RaciMatrixView';
import { FrameworksView } from '../kras/FrameworksView';

/** Key format: `${SectionId}.${subTabId}`. Absent key => caller renders EmptyState.
 *  'roles.charters' is intentionally absent: App.tsx composes HeroSection + DepartmentTabs
 *  + RoleGrid inline for that one entry, since it needs the onSelectRole callback wired
 *  to the role-detail modal at the App level. */
export const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  'roles.responsibilities': ResponsibilitiesView,
  'performance.kra-kpi': KraKpiView,
  'career.levels': LevelsView,
  'career.competencies': CompetenciesView,
  'accountability.raci': RaciMatrixView,
  'resources.frameworks': FrameworksView,
};
```

- [ ] **Step 7: Commit**

```bash
git add src/components/roles/ResponsibilitiesView.tsx src/components/performance/KraKpiView.tsx src/components/career/LevelsView.tsx src/components/career/CompetenciesView.tsx src/components/sections/registry.tsx
git commit -m "feat: add real-content views for Responsibilities, KRA & KPI, Levels, Competencies and register them

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 6: Rewire App.tsx to the registry-driven IA

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `NAVIGATION`, `getSection` from `src/config/navigation.ts`; `SECTION_REGISTRY` from `src/components/sections/registry.tsx`; `EmptyState` from `src/components/shared/EmptyState.tsx`; `activeTab`/`activeSubTab` from `useKRA()` (Task 4).

- [ ] **Step 1: Replace the `<main>` block's tab switch**

```tsx
{activeTab === 'roles' && activeSubTab === 'charters' && (
  <>
    <HeroSection />
    <DepartmentTabs />
    <RoleGrid onSelectRole={handleSelectRole} />
  </>
)}

{activeTab !== 'admin' && activeTab !== 'home' && !(activeTab === 'roles' && activeSubTab === 'charters') && (() => {
  const key = `${activeTab}.${activeSubTab}`;
  const Registered = SECTION_REGISTRY[key];
  if (Registered) return <Registered />;
  const subTab = getSection(activeTab).subTabs.find((s) => s.id === activeSubTab);
  return (
    <EmptyState
      title={subTab?.label ?? 'Not documented yet'}
      description={subTab?.emptyDescription}
      onSuggestChange={() => window.open('mailto:safeguarddevtz@taazaa.com?subject=Suggest a change', '_blank')}
    />
  );
})()}

{activeTab === 'home' && <HomePage onSelectRole={handleSelectRole} />}

{activeTab === 'admin' && <AdminPanel />}
```

(The `onSuggestChange` mailto target is a placeholder destination — replace with whatever address/form the existing footer's "Suggest a change" link already points to; grep `Suggest a change` in `src/components/ui/Footer.tsx` first and reuse that exact handler instead of introducing a second, possibly-inconsistent one.)

- [ ] **Step 2: Import the new pieces**

Add imports for `SECTION_REGISTRY`, `getSection`, `EmptyState`, and `HomePage` (from Task 7 — this import will be added once Task 7 creates the file; until then, temporarily stub `HomePage` as `() => <div />` so this task's build passes standalone, then remove the stub in Task 7).

- [ ] **Step 3: Update `activeDepartmentId`-based default department logic if needed**

No change expected — `selectedDepartment` logic in `App.tsx` is independent of `activeTab`. Re-read after Step 1's edit to confirm no stale reference to the old `activeTab === 'kras'` check remains anywhere else in the file (`grep -n "activeTab ===" src/App.tsx`).

- [ ] **Step 4: Run the test suite and build**

```bash
npm test -- --run
npm run build
```
Expected: all tests pass (any test rendering `<App />` and asserting on the old default tab's content needs its assertion updated to expect the Home page by default — update it here if the suite surfaces one), build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: drive App.tsx section rendering from the navigation registry

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 7: Home page

**Files:**
- Create: `src/utils/portalStats.ts`
- Create: `src/utils/portalStats.test.ts`
- Create: `src/components/home/HeroPanel.tsx`
- Create: `src/components/home/StatsRow.tsx`
- Create: `src/components/home/QuickActionsRow.tsx`
- Create: `src/components/home/ExploreByFunctionGrid.tsx`
- Create: `src/components/home/RolePreviewPanel.tsx`
- Create: `src/components/home/HomePage.tsx`
- Modify: `src/App.tsx` (remove the Task 6 `HomePage` stub, wire the real import)

**Interfaces:**
- Consumes: `PortalData` (Task 1/2's audited, renamed shape), `useKRA()`.
- Produces: `HomePage` component with props `{ onSelectRole: (role: RoleCharter) => void }`, imported by `App.tsx`.

- [ ] **Step 1: Write the failing tests for `portalStats.ts`**

```typescript
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
            { id: 'r1', title: 'A', departmentId: 'engineering', level: 'L1', experienceYears: '', mission: '', summary: '', accountabilities: [], responsibilities: ['x'], competencies: { behavioral: [], technical: [], domain: [] }, metricsAndKras: [{ outcomeArea: 'o', metric: 'm', target: 't', sourceData: 's', frequency: 'f' }], careerPath: { previousRoles: [], nextRoles: [] } },
            { id: 'r2', title: 'B', departmentId: 'engineering', level: 'L2', experienceYears: '', mission: '', summary: '', accountabilities: [], responsibilities: [], competencies: { behavioral: [], technical: [], domain: [] }, metricsAndKras: [], careerPath: { previousRoles: [], nextRoles: [] } },
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
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
npm test -- --run src/utils/portalStats.test.ts
```
Expected: FAIL — `computePortalStats` is not defined / module not found.

- [ ] **Step 3: Implement `src/utils/portalStats.ts`**

```typescript
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
```

- [ ] **Step 4: Run it to confirm it passes**

```bash
npm test -- --run src/utils/portalStats.test.ts
```
Expected: 2 passing tests.

- [ ] **Step 5: Write `src/components/home/HeroPanel.tsx`**

```tsx
import React from 'react';
import { Search } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';

export const HeroPanel: React.FC = () => {
  const { searchQuery, setSearchQuery, setActiveTab } = useKRA();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          How We <span className="text-brand-500">Work</span>.<br />
          How We <span className="text-indigo-500">Perform</span>.<br />
          How We <span className="text-emerald-500">Grow</span>.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md">
          A single source of truth for roles, accountability, performance, and career growth at Taazaa.
        </p>
        <div className="mt-6 flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, skill, function or keyword..."
              className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <button
            onClick={() => setActiveTab('roles', 'charters')}
            className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-brand-500/10 via-indigo-500/10 to-emerald-500/10 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 150" className="w-3/4 h-3/4" aria-hidden="true">
          <rect x="20" y="80" width="45" height="45" rx="8" fill="currentColor" className="text-brand-500/70" />
          <rect x="80" y="55" width="45" height="70" rx="8" fill="currentColor" className="text-indigo-500/70" />
          <rect x="140" y="90" width="35" height="35" rx="8" fill="currentColor" className="text-emerald-500/70" />
          <circle cx="42" cy="60" r="12" fill="currentColor" className="text-slate-400/60" />
          <circle cx="102" cy="35" r="12" fill="currentColor" className="text-slate-400/60" />
          <circle cx="157" cy="70" r="12" fill="currentColor" className="text-slate-400/60" />
        </svg>
      </div>
    </div>
  );
};
```

- [ ] **Step 6: Write `src/components/home/StatsRow.tsx`**

```tsx
import React from 'react';
import { Users, Layers, Target, Building2 } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';
import { computePortalStats } from '../../utils/portalStats';

export const StatsRow: React.FC = () => {
  const { portalData, setActiveTab } = useKRA();
  const stats = computePortalStats(portalData);

  const cards = [
    { icon: Users, value: stats.roleCount, label: 'Roles Defined', onClick: () => setActiveTab('roles', 'charters') },
    { icon: Layers, value: stats.levelCount, label: 'Career Levels', onClick: () => setActiveTab('career', 'levels') },
    { icon: Target, value: `${stats.percentRolesWithKras}%`, label: 'Roles with Defined KRAs', onClick: () => setActiveTab('performance', 'kra-kpi') },
    { icon: Building2, value: stats.departmentCount, label: 'Practice Areas', onClick: () => setActiveTab('roles', 'charters') },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
      {cards.map(({ icon: Icon, value, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="text-left p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 transition-colors"
        >
          <Icon className="w-5 h-5 text-brand-500 mb-3" />
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
        </button>
      ))}
    </div>
  );
};
```

- [ ] **Step 7: Write `src/components/home/QuickActionsRow.tsx`**

```tsx
import React from 'react';
import { UserSearch, TrendingUp, Compass } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';

export const QuickActionsRow: React.FC = () => {
  const { setActiveTab } = useKRA();
  const actions = [
    { icon: UserSearch, title: 'Find My Role', description: 'Understand your responsibilities, expectations and success measures.', onClick: () => setActiveTab('roles', 'charters') },
    { icon: TrendingUp, title: 'Understand My Performance', description: 'See KRAs, KPIs, targets and performance standards.', onClick: () => setActiveTab('performance', 'kra-kpi') },
    { icon: Compass, title: 'Explore My Career', description: 'Discover career levels, competencies and growth opportunities.', onClick: () => setActiveTab('career', 'levels') },
  ];

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">I want to...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map(({ icon: Icon, title, description, onClick }) => (
          <button
            key={title}
            onClick={onClick}
            className="text-left p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 transition-colors"
          >
            <Icon className="w-5 h-5 text-brand-500 mb-3" />
            <div className="font-bold text-slate-900 dark:text-white">{title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 8: Write `src/components/home/ExploreByFunctionGrid.tsx`**

```tsx
import React from 'react';
import { useKRA } from '../../context/KRAContext';

export const ExploreByFunctionGrid: React.FC = () => {
  const { portalData, setActiveDepartmentId, setActiveTab } = useKRA();

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Explore by Function</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {portalData.departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => { setActiveDepartmentId(dept.id); setActiveTab('roles', 'charters'); }}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 transition-colors text-center"
          >
            <div className="text-sm font-bold text-slate-900 dark:text-white">{dept.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

(Only the real departments present in `portalData.departments` render — no hardcoded list of 10 functions, so this automatically stays correct if an admin adds/removes a department later.)

- [ ] **Step 9: Write `src/components/home/RolePreviewPanel.tsx`**

```tsx
import React from 'react';
import { useKRA } from '../../context/KRAContext';
import type { RoleCharter } from '../../types';

interface RolePreviewPanelProps {
  onSelectRole: (role: RoleCharter) => void;
}

export const RolePreviewPanel: React.FC<RolePreviewPanelProps> = ({ onSelectRole }) => {
  const { portalData } = useKRA();
  const allRoles = portalData.departments.flatMap((d) => d.roles.map((r) => ({ ...r, departmentName: d.name })));
  const featured = allRoles[0];

  if (!featured) return null;

  const tabs = [
    { label: 'Responsibilities', has: featured.responsibilities.length > 0 },
    { label: 'KRA & KPI', has: featured.metricsAndKras.length > 0 },
    { label: 'Competencies', has: featured.competencies.behavioral.length + featured.competencies.technical.length + featured.competencies.domain.length > 0 },
  ].filter((t) => t.has);

  return (
    <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90">
      <span className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">{featured.departmentName}</span>
      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{featured.title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{featured.mission}</p>
      <div className="flex gap-2 mt-4 flex-wrap">
        {tabs.map((t) => (
          <span key={t.label} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{t.label}</span>
        ))}
      </div>
      <button
        onClick={() => onSelectRole(featured)}
        className="mt-5 text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:underline"
      >
        View full charter
      </button>
    </div>
  );
};
```

- [ ] **Step 10: Write `src/components/home/HomePage.tsx`**

```tsx
import React from 'react';
import { HeroPanel } from './HeroPanel';
import { StatsRow } from './StatsRow';
import { QuickActionsRow } from './QuickActionsRow';
import { ExploreByFunctionGrid } from './ExploreByFunctionGrid';
import { RolePreviewPanel } from './RolePreviewPanel';
import { useKRA } from '../../context/KRAContext';
import type { RoleCharter } from '../../types';

interface HomePageProps {
  onSelectRole: (role: RoleCharter) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectRole }) => {
  const { portalData } = useKRA();

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HeroPanel />
          <StatsRow />
          <QuickActionsRow />
          <ExploreByFunctionGrid />
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-3">
            v{portalData.version} · Last updated {portalData.lastUpdated}
          </div>
          <RolePreviewPanel onSelectRole={onSelectRole} />
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 11: Wire the real `HomePage` into `App.tsx`, remove the Task 6 stub**

Replace the temporary `HomePage` stub import from Task 6 with `import { HomePage } from './components/home/HomePage';`.

- [ ] **Step 12: Run the full test suite and build**

```bash
npm test -- --run
npm run build
```
Expected: all tests pass, build succeeds.

- [ ] **Step 13: Commit**

```bash
git add src/utils/portalStats.ts src/utils/portalStats.test.ts src/components/home/ src/App.tsx
git commit -m "feat: build the Home dashboard page with real computed stats and a live role preview

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 8: Final verification pass

**Files:**
- No new files — this task is verification and any last-mile fixes it surfaces.

- [ ] **Step 1: Full-text grep for stray OKR references**

```bash
grep -rli okr src
```
Expected: empty output. If not empty, fix the remaining file(s) and re-run.

- [ ] **Step 2: Confirm every `NAVIGATION` sub-tab renders something (real view or `EmptyState`) with no runtime error**

```bash
npm run dev &
sleep 3
curl -sf http://localhost:5173 > /dev/null && echo "dev server up"
kill %1
```
Then manually click through every top-nav section and every sub-tab in a browser (or via the `run` skill's app-launch pattern) confirming: (a) no console errors, (b) sections with real data show it, (c) sections without real data show the `EmptyState` with its configured description, (d) the Home page's stat numbers match `computePortalStats` applied to the current `kras.json` by spot-checking one number (e.g. role count) against `grep -c '"id":' src/data/kras.json`'s rough count within the departments array.

- [ ] **Step 3: Run the full test suite one more time**

```bash
npm test -- --run
```
Expected: all green.

- [ ] **Step 4: Run the production build**

```bash
npm run build
```
Expected: succeeds with no TypeScript errors, no console warnings about unused old exports (`MetricOKR`, etc. — confirms Task 2's rename left nothing dangling).

- [ ] **Step 5: Final commit (if Steps 1–4 required any fixes)**

```bash
git add -A
git commit -m "fix: final verification pass — close remaining IA/rename gaps

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

If no fixes were needed, skip this step — nothing to commit.
