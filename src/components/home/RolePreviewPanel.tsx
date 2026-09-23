import React from 'react';
import { Download, Printer, MoreHorizontal } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';
import type { RoleCharter } from '../../types';

interface RolePreviewPanelProps {
  onSelectRole: (role: RoleCharter) => void;
}

/** Roles with the richest real, doc-sourced content, in preference order. */
const FEATURED_ROLE_IDS = ['program-manager', 'senior-software-engineer-sse', 'lead-software-engineer-lse'];

export const RolePreviewPanel: React.FC<RolePreviewPanelProps> = ({ onSelectRole }) => {
  const { portalData } = useKRA();
  const allRoles = portalData.departments.flatMap((d) => d.roles.map((r) => ({ ...r, departmentName: d.name })));
  const featured =
    FEATURED_ROLE_IDS.map((id) => allRoles.find((r) => r.id === id)).find(Boolean) ?? allRoles[0];

  if (!featured) return null;

  const hasAccountabilities = featured.accountabilities.length > 0;
  const hasResponsibilities = featured.responsibilities.length > 0;
  const hasKras = featured.metricsAndKras.length > 0;
  const hasCompetencies =
    (featured.competencies?.behavioral?.length || 0) +
      (featured.competencies?.technical?.length || 0) +
      (featured.competencies?.domain?.length || 0) >
    0;

  const tabs = [
    { label: 'Overview', has: hasAccountabilities || hasKras },
    { label: 'Responsibilities', has: hasResponsibilities },
    { label: 'KRA & KPI', has: hasKras },
    { label: 'Competencies', has: hasCompetencies },
  ].filter((t) => t.has);

  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden">
      <div className="p-5 pb-0">
        <div className="text-xs text-slate-400 mb-2">
          Roles <span className="mx-1">›</span> {featured.title}
        </div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{featured.title}</h3>
            {featured.level && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300">
                {featured.level}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onSelectRole(featured)} title="Download charter" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => onSelectRole(featured)} title="Print charter" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={() => onSelectRole(featured)} title="More" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
        {(featured.mission || featured.summary) && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {featured.mission || featured.summary}
          </p>
        )}
        <div className="mt-3 text-[11px] text-slate-400">
          Function <span className="text-slate-600 dark:text-slate-300 font-semibold">{featured.departmentName}</span>
        </div>

        {tabs.length > 0 && (
          <div className="flex items-center gap-4 mt-4 border-b border-slate-100 dark:border-slate-800">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => onSelectRole(featured)}
                className={`pb-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${
                  i === 0
                    ? 'text-brand-600 dark:text-brand-400 border-brand-500'
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {tabs.length === 0 ? (
        <div className="p-5 text-xs text-slate-400">No documented content available for a preview yet.</div>
      ) : (
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {hasAccountabilities && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">What You Own</h4>
              <ul className="space-y-1.5">
                {featured.accountabilities.slice(0, 5).map((item, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex gap-1.5">
                    <span className="text-brand-500">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasKras && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">How Success is Measured (KRA &amp; KPI)</h4>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-1.5 pr-2 font-semibold">Outcome Area</th>
                    <th className="pb-1.5 pr-2 font-semibold">Metric</th>
                    <th className="pb-1.5 font-semibold">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {featured.metricsAndKras.slice(0, 4).map((m, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
                      <td className="py-1.5 pr-2">{m.outcomeArea}</td>
                      <td className="py-1.5 pr-2">{m.metric}</td>
                      <td className="py-1.5 font-semibold text-slate-900 dark:text-white">{m.target || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="px-5 pb-5">
        <button
          onClick={() => onSelectRole(featured)}
          className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:underline"
        >
          View full charter →
        </button>
      </div>
    </div>
  );
};
