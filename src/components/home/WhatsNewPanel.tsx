import React from 'react';
import { useKRA } from '../../context/KRAContext';

export const WhatsNewPanel: React.FC = () => {
  const { portalData } = useKRA();

  const updates = [
    'Role, RACI, and framework content re-verified against the original source documents',
    'Navigation reorganized into Roles, Accountability, Performance, Career, Development, How We Work, and Resources',
    'Sections with no documented source content now show an explicit "not documented yet" state instead of placeholder text',
  ];

  return (
    <div className="p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">What's New</h3>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300">
          v{portalData.version}
        </span>
        <span className="text-[11px] text-slate-400">{portalData.lastUpdated}</span>
      </div>
      <ul className="space-y-2">
        {updates.map((update) => (
          <li key={update} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
            {update}
          </li>
        ))}
      </ul>
    </div>
  );
};
