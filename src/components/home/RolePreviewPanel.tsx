import React from 'react';
import { Download, Printer, MoreHorizontal } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';
import type { RoleCharter } from '../../types';

interface RolePreviewPanelProps {
  onSelectRole: (role: RoleCharter) => void;
}

/** Roles with the richest real, doc-sourced content (incl. a documented KRA weight), in preference order. */
const FEATURED_ROLE_IDS = ['product-manager-pm', 'program-manager', 'senior-software-engineer-sse'];

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

  const infoChips = [
    { label: 'Function', value: featured.departmentName },
    { label: 'Experience', value: featured.experienceYears },
  ].filter((c) => c.value);

  const visibleKras = featured.metricsAndKras.slice(0, 8);
  const weightTotal = visibleKras.every((m) => m.weight)
    ? visibleKras.reduce((sum, m) => sum + parseInt(m.weight!, 10), 0)
    : null;

  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden">
      <div className="p-6 pb-0">
        <div className="text-xs text-slate-400 mb-3">
          Roles <span className="mx-1.5">›</span> {featured.title}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{featured.title}</h3>
            {featured.level && (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300">
                {featured.level}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onSelectRole(featured)} title="Download charter" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => onSelectRole(featured)} title="Print charter" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={() => onSelectRole(featured)} title="More" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {(featured.mission || featured.summary) && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            {featured.mission || featured.summary}
          </p>
        )}

        {infoChips.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {infoChips.map((chip) => (
              <div key={chip.label} className="flex flex-col gap-0.5 px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 min-w-[110px]">
                <span className="text-[10px] uppercase tracking-wide text-slate-400">{chip.label}</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{chip.value}</span>
              </div>
            ))}
          </div>
        )}

        {tabs.length > 0 && (
          <div className="flex items-center gap-6 mt-5 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => onSelectRole(featured)}
                className={`pb-3 text-sm font-semibold whitespace-nowrap shrink-0 border-b-2 -mb-px transition-colors ${
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
        <div className="p-6 text-sm text-slate-400">No documented content available for a preview yet.</div>
      ) : (
        <div className="p-6 space-y-6">
          {hasAccountabilities && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">What You Own</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                {featured.accountabilities.slice(0, 6).map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                    <span className="text-brand-500 mt-0.5">•</span> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasKras && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">How Success is Measured (KRA &amp; KPI)</h4>
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-xs table-fixed min-w-[560px] px-1">
                  <colgroup>
                    <col className="w-[20%]" />
                    <col className="w-[28%]" />
                    <col className="w-[12%]" />
                    <col className="w-[40%]" />
                  </colgroup>
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-2 pr-3 font-semibold">KRA</th>
                      <th className="pb-2 pr-3 font-semibold">KPI</th>
                      <th className="pb-2 pr-3 font-semibold">Weight</th>
                      <th className="pb-2 font-semibold">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleKras.map((m, i) => (
                      <tr key={i} className="border-b border-slate-50 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 align-top">
                        <td className="py-2.5 pr-3" title={m.outcomeArea}>
                          <span className="line-clamp-2">{m.outcomeArea}</span>
                        </td>
                        <td className="py-2.5 pr-3" title={m.metric}>
                          <span className="line-clamp-2">{m.metric}</span>
                        </td>
                        <td className="py-2.5 pr-3">{m.weight || '—'}</td>
                        <td className="py-2.5 font-semibold text-slate-900 dark:text-white" title={m.target}>
                          <span className="line-clamp-2">{m.target || '—'}</span>
                        </td>
                      </tr>
                    ))}
                    {weightTotal !== null && (
                      <tr className="text-slate-900 dark:text-white font-bold">
                        <td className="py-2.5 pr-3" colSpan={2}>Total</td>
                        <td className="py-2.5 pr-3">{weightTotal}%</td>
                        <td className="py-2.5" />
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="px-6 pb-6">
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
