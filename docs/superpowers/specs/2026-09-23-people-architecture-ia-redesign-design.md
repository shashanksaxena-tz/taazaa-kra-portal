# Taazaa People Architecture Portal — IA Redesign & Data Audit

**Status:** Approved by user (chat), pending written-spec review
**Date:** 2026-09-23

## Intent

The portal currently mixes real content (extracted from department `.docx`/`.pdf` source documents) with content that appears to have been invented beyond what those documents say, and it inconsistently calls the same concept "OKR" in some places and "KRA" in others. The user wants:

1. Every piece of displayed content to be traceable to an actual source document. Anything not present in the documents is removed or shown as an explicit empty/"not documented yet" state — never invented or interpolated.
2. All "OKR" terminology unified to "KRA" — in UI text **and** in code (types, fields, JSON keys, variables).
3. The whole site restructured under a new 7-section IA (below), inspired by a provided homepage screenshot for visual style/layout — not literally copied where the mockup's content isn't backed by real data.

## Source of truth

All content must trace to the existing department folders in the repo root: `Engineering/`, `QA/`, `Design Team/`, `Product Team/`, `Program Management/` (~30 `.docx`/`.pdf` files total). These are the same documents `src/data/kras.json` was originally built from (per `README.md`), though the referenced ingestion script (`scripts/build_kras_dataset.py`) no longer exists in the repo — so the current JSON must be treated as possibly drifted and re-verified, not trusted as-is.

## Target Information Architecture

```
├── Home (new dashboard-style landing page)
├── Roles
│   ├── Role Charters       (real — existing role browse/grid + detail modal, kept)
│   ├── Responsibilities    (real — aggregated from each role's responsibilities field)
│   └── Role Expectations   (empty-state unless audit finds distinct "expectations" text)
├── Accountability
│   ├── RACI                (real — existing RACI matrix view, moved here)
│   ├── Decision Rights     (empty-state — no per-role decision-rights data exists;
│   │                        do NOT relabel RACI's "Accountable" column as this)
│   └── Governance          (empty-state unless OD docs define governance explicitly)
├── Performance
│   ├── KRA & KPI           (real — existing metrics field, renamed from OKR)
│   ├── Performance Standards (empty-state unless docs cover it)
│   └── Review Framework    (empty-state unless docs cover it)
├── Career
│   ├── Career Architecture (empty-state unless docs describe a leveling framework)
│   ├── Levels              (real — derived from each role's level/experience band)
│   ├── Competencies        (real — existing competencies field)
│   └── Promotion Criteria  (empty-state unless audit finds "next-level expectation" text)
├── Development
│   ├── Skills                    (empty-state — no source docs found covering this)
│   ├── Development Plans         (empty-state)
│   └── Leadership Development    (empty-state)
├── How We Work
│   ├── Global Working Norms (empty-state unless found during audit)
│   ├── Communication        (empty-state unless found during audit)
│   ├── Decision Making      (empty-state unless found during audit)
│   └── Collaboration        (empty-state unless found during audit)
└── Resources
    ├── Templates    (empty-state — none found)
    ├── Frameworks   (real — existing frameworks view, per-department OD docs)
    └── FAQs         (empty-state — none found)
```

Features not in this list (Role Comparator, Admin/GitHub-sync workspace, Excel import/export) stay as they are today, reachable as before, just relabeled for the KRA rename — they are not part of the top-level nav restructure.

Each empty-state sub-tab uses one shared, reusable "not documented yet" component (on-brand, links to the existing "Suggest a change" footer action) rather than bespoke placeholder markup per page.

## Architecture decisions

### Navigation: extend the existing tab-based state model (not react-router)

The app has no router today (`App.tsx` switches on a single `activeTab` string from `KRAContext`). We extend this pattern rather than introducing `react-router`:
- `KRAContext`'s `activeTab` union grows to: `'home' | 'roles' | 'accountability' | 'performance' | 'career' | 'development' | 'how-we-work' | 'resources' | 'admin'` (plus existing raci/frameworks folded into accountability/resources respectively).
- Each top-level section that has sub-tabs gets its own `activeSubTab` state (per-section, defaulting to that section's first sub-item).
- `Navbar.tsx` is rewritten to render the 7-section top nav (+ Home) with sub-nav/dropdown per section.
- Rejected alternative: real URL routing via `react-router`. Would give bookmarkable URLs but adds a dependency, requires GitHub Pages hash-routing/basename handling, and nothing in this request needs deep-linking. Not worth the added risk for this pass.

### Terminology rename: OKR → KRA, everywhere

Renamed in both UI text and code — type names, field names, JSON keys, variables:
- `MetricOKR` → `MetricKRA`, `metricsAndOkrs` → `metricsAndKras` in `src/types/index.ts`, `src/schemas.ts`.
- `src/data/kras.json` role entries: `metricsAndOkrs` key → `metricsAndKras`.
- `src/services/excelService.ts` (import/export column headers/labels) updated to match.
- All UI components currently matching `grep -rli okr src` (`AdminPanel.tsx`, `FeatureGuideModal.tsx`, `ImportGuide.tsx`, `RoleEditorModal.tsx`, `DepartmentTabs.tsx`, `RoleCard.tsx`, `RoleComparatorModal.tsx`, `RoleDetailModal.tsx`, `RoleGrid.tsx`, `Footer.tsx`, `HeroSection.tsx`) — replace "OKR" text with "KRA".
- Existing tests referencing OKR terms/old tab set updated in the same pass so the suite stays green.
- `raciMatrix`/`RaciItem` types are untouched — not OKR-related.
- After the rename, re-grep to confirm zero "OKR" occurrences remain in `src/` (source document filenames under the department folders are historical documents, not renamed).

### Data audit: full per-role re-extraction, delegated per department

Because this is read-heavy across ~30 documents and the current JSON may have drifted from source, every role is fully re-extracted rather than spot-checked:
- One subagent per department (Engineering, QA, Design Team, Product Team, Program Management), run in parallel, each tasked with: open every source doc for that department, and for each role currently in `kras.json` belonging to that department, rebuild `mission`, `summary`, `accountabilities`, `responsibilities`, `competencies`, `metricsAndKras`, and `careerPath` strictly from what's written in that role's doc. Any field with no textual basis in the source doc becomes an empty array/string — never invented. Each agent also flags anything currently in the JSON with no basis in its department's docs.
- The 5 department outputs are merged back into `kras.json`, followed by a schema-validation pass and an id/slug-stability check (existing ids/slugs preserved so nothing referencing them breaks).
- `raciMatrix` re-verified against `Program Management/RACI Matrix - Delivery Manager vs Program Manager.docx` — kept scoped to only the 4 roles that doc covers, not padded to others.
- `frameworks` (feeding Resources → Frameworks) re-verified against the `Tz_OrgDesign_*.docx` / `Delivery_OD_Doc_Final.docx` documents rather than assumed correct.

## Homepage

Recreated from the provided screenshot's layout and visual style (top nav, hero, stat-card row, "I want to...", "Explore by Function", right-side role-preview panel) with four deliberate departures, each following directly from "never fabricate data":

1. **Stat cards & role-preview tabs** show only real, computed numbers (role count, department/"solution area" count = the actual 5 departments present in the data, % of roles with KRAs defined, etc.). Any stat/tab from the mockup with no backing data is dropped or relabeled — e.g. no fabricated "100% Decision Rights."
2. **"Explore by Function" grid** shows only the 5 departments that exist in the data (Engineering, QA, Design/UI-UX, Product, Program Management) — not the 10 shown in the mockup (Sales, Marketing, Finance, Operations, People/HR have no source documents in this repo).
3. **"What's New" panel** — the mockup's changelog is fabricated content; replaced with real metadata already present in `kras.json` (`version`, `lastUpdated`) instead of invented changelog bullets.
4. **Hero illustration** — an original abstract graphic in the existing brand palette/style (not a copy of the mockup's stock illustration asset).

The right-side role-preview panel shows a real role from the audited data (not the mockup's "Program Lead – L4," which doesn't exist in this roster), rendering only the tabs that role actually has data for.

## Testing & rollout

- Update the 6 existing test files affected by the rename/IA changes (`AdminLoginModal.test.tsx`, `FeatureGuideModal.test.tsx`, `ImportGuide.test.tsx`, `RoleDetailModal.test.tsx`, `excelService.test.ts`, `excelService.roundtrip.test.ts`) so the suite passes after the changes, not left broken.
- Admin panel (`RoleEditorModal.tsx`) and Excel import/export (`excelService.ts`) get the same KRA relabeling as part of the rename — admins see "KRA & KPI" fields, not stale "OKR" labels. This is the same rename, not new scope.
- After the audit + rename + IA rebuild: run the full test suite, run `npm run build`, and manually walk every nav section (including empty-state ones) to confirm no broken states and zero leftover "OKR" text anywhere in the UI.

## Out of scope

- Role Comparator and Admin/GitHub-sync workspace: unchanged in behavior/placement, only relabeled for the rename.
- No new routing library, no new external content sources beyond the department docs already in the repo.
- No fabricated content anywhere the empty-state applies — this spec explicitly favors visible gaps over invented completeness.
