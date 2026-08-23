import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitBranch, Users, PlusCircle, Edit3, Building2, Table2, Upload, Github, Lock, Sun } from 'lucide-react';

interface GuideEntry {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const guide: GuideEntry[] = [
  {
    icon: <Users className="w-4 h-4" />,
    title: 'Viewing & finding roles',
    body: 'Use Search (matches titles, skills, missions), the FILTER LEVEL buttons (L1–L6) or Solution Area tiles to narrow charters. Click "View KRA" on any card for the full six-tab charter: Overview, Accountabilities, Responsibilities, OKRs & Metrics, Competencies and Career Ladder. Export PDF prints an executive charter.',
  },
  {
    icon: <Table2 className="w-4 h-4" />,
    title: 'Comparing roles',
    body: 'Click the compare icon on up to 3 role cards, then press Compare in the top bar. The Comparative Matrix shows progression and accountability side by side. Click a selected card\'s icon again to remove it. Maximum of 3 roles at once.',
  },
  {
    icon: <GitBranch className="w-4 h-4" />,
    title: 'Versions & snapshots',
    body: 'Admin Panel → Version History → "Create Version Snapshot" freezes the current departments + RACI so you can time-travel later. The newest snapshot becomes Active. Switch versions any time from the top-bar selector (admins only). Snapshots cannot be deleted — create them deliberately, e.g. before a big restructure.',
  },
  {
    icon: <PlusCircle className="w-4 h-4" />,
    title: 'Adding a role',
    body: 'Admin Panel → "Add Role Charter". Fill Basic Info, Accountabilities & Duties, Skills & Values and OKRs & Targets, then save. The role appears instantly in its department and persists locally. Bulk-add many roles via Excel import instead.',
  },
  {
    icon: <Edit3 className="w-4 h-4" />,
    title: 'Editing or deleting a role',
    body: 'Open any charter and use Edit (admin mode required). Changes save immediately to local storage and can be published later. Deleting asks for confirmation and removes the charter from its department.',
  },
  {
    icon: <Building2 className="w-4 h-4" />,
    title: 'Departments',
    body: 'Departments are fully configurable. Admin Panel → Roles tab: "+ Dept" creates one, "Delete" removes an empty one, and any spreadsheet import can introduce new departments — unmatched Department names in a sheet become new departments automatically. Roles are assigned to departments and can be moved by editing them.',
  },
  {
    icon: <Upload className="w-4 h-4" />,
    title: 'Excel / CSV vs JSON imports',
    body: 'Excel/CSV MERGES roles into departments (safe, nothing is deleted). JSON REPLACES everything — you will be asked to confirm, so export a JSON backup first. Full column formats are documented inside every downloaded template\'s Instructions sheet and in the Excel/CSV Sync tab.',
  },
  {
    icon: <Github className="w-4 h-4" />,
    title: 'Publishing to GitHub',
    body: 'Admin Panel → GitHub CI/CD. Configure owner/repo/token, Verify Access, then Publish. This writes src/data/kras.json to the repository; GitHub Pages redeploys automatically within minutes. Your token lives in session storage only — it never touches disk.',
  },
  {
    icon: <Lock className="w-4 h-4" />,
    title: 'Admin access',
    body: 'Everything behind the passcode gate: editing, importing, publishing and version switching. The session lasts only as long as the browser tab. Default demo passcode works in development; production deployments override it via the VITE_ADMIN_PASSCODE_SHA256 environment variable.',
  },
  {
    icon: <Sun className="w-4 h-4" />,
    title: 'Theme',
    body: 'The sun/moon toggle switches light/dark mode. Your choice is remembered per browser.',
  },
];

export const FeatureGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Feature guide"
        >
          <button
            onClick={onClose}
            aria-label="Close feature guide"
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white pr-8">
              Portal Feature Guide
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Everything the ER team can do here, explained in plain language.
            </p>

            <div className="space-y-2">
              {guide.map((entry, i) => (
                <div
                  key={entry.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    aria-expanded={openIdx === i}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left bg-slate-50/60 dark:bg-slate-800/40"
                  >
                    <span className="text-brand-600 dark:text-brand-400">{entry.icon}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 flex-1">
                      {entry.title}
                    </span>
                  </button>
                  {openIdx === i && (
                    <p className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {entry.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
