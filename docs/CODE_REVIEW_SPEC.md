# Code Review Remediation Spec

Branch: `code-review/improvements`
Source: full code review of `main` (KRA portal — React 18 + Vite SPA, localStorage-backed, GitHub Contents API commits from client).
Goal: merge this branch back to `main` with every P0/P1 finding fixed, verified by typecheck + new test suite + build.

## Status legend

- [x] DONE (already in working tree, uncommitted — commit as-is after verification)
- [ ] TODO (this spec's execution scope)

## Findings & Fixes

### F1 — Secrets persisted in localStorage (P0, security)
**Finding:** GitHub PAT (`taazaa_github_config`) and admin session were stored in
`localStorage` — readable by any XSS payload and persisted across browser restarts.
**Fix:** PAT moves to `sessionStorage` only (`taazaa_github_config:token`); admin
session moves to `sessionStorage`. `GitHubConfig.token` becomes optional;
`gatewayUrl` field added for future server-held-token mode.
- [x] `src/services/storageService.ts`
- [x] `src/types/index.ts`

### F2 — Fabricated version history (P0, data integrity)
**Finding:** `generateDefaultVersions()` invented four fake historical KRA versions
(v2026.08 … v2024.01) presented as real appraisal baselines.
**Fix:** Single honest "Bundled Baseline" version generated from actual dataset +
migration filter that drops legacy fabricated IDs from existing localStorage.
- [x] `src/services/storageService.ts`
- [x] R1: hardcoded `'v2026.08'` fallbacks remain in `src/context/KRAContext.tsx:89,439`
  and `src/components/ui/Navbar.tsx:179`. Replace with `DEFAULT_VERSION_ID`.

### F3 — Vulnerable dependency (P0, supply chain)
**Finding:** `xlsx@0.18.5` from npm carries known ReDoS/prototype-pollution CVEs.
**Fix:** pinned to official SheetJS CDN tarball `xlsx-0.20.3`.
- [x] `package.json`

### F4 — No linting, tests, or CI (P1, quality gates)
**Finding:** Zero test infrastructure, zero linting, no CI pipeline.
**Fix:** ESLint flat config (`typescript-eslint`, react-hooks, react-refresh),
Vitest + jsdom + Testing Library, GitHub Actions workflow running lint → test → build.
- [x] `eslint.config.js`, `.github/workflows/ci.yml`, devDeps installed
- [x] R2: `package.json` is **missing `lint` and `test` scripts** — CI would fail.
- [x] R3: `src/test/setup.ts` referenced by vitest config does not exist yet.
- [x] R4: write unit tests: `src/utils` (base64 roundtrip incl. unicode, slugify,
  sha256), `src/services/storageService` (baseline generation, legacy migration,
  token never written to localStorage).

### F5 — Magic strings scattered (P2)
**Finding:** storage keys, version IDs, paths duplicated across services/components.
**Fix:** centralized `src/constants.ts` (`STORAGE_KEYS`, `SCHEMA_VERSION`,
`DEFAULT_VERSION_ID`, `DEFAULT_COMMIT_PATH`).
- [x] constants created and wired into storageService
- [x] R5: adopt `DEFAULT_VERSION_ID` at the three call sites listed in F2/R1.

### F6 — Duplicated, subtly-buggy Base64 encoder (P1, correctness)
**Finding:** `githubService.utf8ToBase64` uses a hand-rolled
`encodeURIComponent` trick; a cleaner TextEncoder-based version now exists in
`src/utils/index.ts` but the old duplicate is still live.
**Fix:** delete the local copy; import shared util. Also convert `catch (err: any)`
to typed unknown-catch using shared `errorMessage()`.
- [x] R6: `src/services/githubService.ts:12-18,49,128`

### F7 — Default admin passcode leaked in production UI (P1, security)
**Finding:** `AdminLoginModal.tsx:31,76,98` prints "taazaa2026" to end users,
including production builds.
**Fix:** demo-passcode hints gated behind `import.meta.env.DEV`.
- [x] R7: `src/components/admin/AdminLoginModal.tsx`

### Explicitly out of scope
- Server-side commit gateway implementation (type scaffolded via `gatewayUrl`; separate issue).
- Replacing SHA-256 passcode auth with real identity provider.
- Design/UI changes of any kind.
