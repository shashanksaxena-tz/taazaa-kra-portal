import React, { useState } from 'react';
import { ChevronDown, FileSpreadsheet, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const columnRules: [string, string][] = [
  ['Role Title', 'Required. Shown on cards and printouts. Leave blank to skip the row.'],
  ['Department', 'Must be one of: Software Engineering, Quality Assurance, UI/UX Design, Product Management, Program & Delivery.'],
  ['Experience Level', 'e.g. "Senior (L3)". Defaults to Mid-Level (L2) when blank.'],
  ['Years of Experience', 'Free text range, e.g. "4-6 Years".'],
  ['Core Mission Statement', 'One paragraph, ~50 words max.'],
  ['Executive Summary', 'Short preview used on cards and the Overview tab.'],
  ['Accountabilities / Responsibilities / Skills', 'Separate multiple items with a pipe: "Owns delivery | Reviews code".'],
  ['OKRs', 'Format: Outcome:Metric:Target:Frequency — joined by pipes. Rows with fewer than 3 colon-parts are skipped.'],
  ['Role ID', 'Optional. Never edit an existing Role ID — changing it creates a NEW role instead of updating.'],
];

interface GuideSectionProps {
  icon: React.ReactNode;
  title: string;
  tone?: 'brand' | 'amber' | 'emerald';
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<GuideSectionProps> = ({ icon, title, tone = 'brand', defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  const tones = {
    brand: 'bg-brand-50 dark:bg-slate-800/60 border-brand-500/20 text-brand-600 dark:text-brand-400',
    amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  };
  return (
    <div className={`rounded-2xl border ${tones[tone].split(' ').slice(0, 3).join(' ')}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-5 py-3.5 text-left"
        aria-expanded={open}
      >
        {icon}
        <span className={`text-xs font-bold flex-1 ${tone === 'brand' ? 'text-brand-600 dark:text-brand-400' : tone === 'amber' ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
    </div>
  );
};

export const ImportGuide: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Excel merge semantics */}
      <Section
        icon={<FileSpreadsheet className="w-4 h-4" />}
        title="How Excel / CSV import works (MERGE — safe)"
        tone="emerald"
        defaultOpen
      >
        <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <li>Download the template below — it includes sample rows and a Valid Values sheet.</li>
          <li>Fill one row per role. Keep the header row untouched; the importer auto-detects it.</li>
          <li>Save and upload. Imported roles are <strong>merged into matching departments</strong> — matched by Role ID.</li>
          <li>A role with an existing Role ID is updated; a new/blank ID creates a new role.</li>
        </ol>
        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          Nothing is deleted by a spreadsheet import — your existing charters stay put.
        </p>
      </Section>

      {/* Column rules */}
      <Section icon={<Info className="w-4 h-4" />} title="Column format reference">
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs">
            <tbody>
              {columnRules.map(([col, rule], i) => (
                <tr key={col} className={i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/50' : ''}>
                  <td className="px-3 py-2 font-bold text-slate-800 dark:text-slate-200 align-top whitespace-nowrap">{col}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
          <div><span className="text-slate-400">Lists →</span> Design systems | Review code | Mentor L2</div>
          <div><span className="text-slate-400">OKRs →</span> Quality:Escaped defects:&lt;2%:Quarterly | Security:Critical vulns:0 open</div>
        </div>
      </Section>

      {/* JSON replace warning */}
      <Section
        icon={<AlertTriangle className="w-4 h-4" />}
        title="JSON import REPLACES everything — read first"
        tone="amber"
      >
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <li>Unlike spreadsheets, a JSON import <strong>replaces ALL data</strong>: roles, departments, RACI matrix and version history.</li>
          <li>You will see a confirmation dialog — read it before accepting.</li>
          <li><strong>Export .JSON as a backup first.</strong> There is no undo once replaced.</li>
          <li>Fabricated legacy versions from old exports are cleaned automatically during import.</li>
        </ul>
      </Section>

      {/* Golden rules */}
      <Section icon={<Info className="w-4 h-4" />} title="Golden rules for bulk edits">
        <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <li>Keep pipe (<code className="font-mono">|</code>) and colon (<code className="font-mono">:</code>) characters out of normal text — they are structural delimiters.</li>
          <li>Create a version snapshot before major restructuring so you can roll back visually.</li>
          <li>Departments are configurable: names in the Department column that don't match an existing one create a NEW department automatically.</li>
          <li>Every RACI activity must have exactly one Accountable.</li>
        </ul>
      </Section>
    </div>
  );
};
