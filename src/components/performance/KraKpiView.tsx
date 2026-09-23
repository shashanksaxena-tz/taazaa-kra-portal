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
    <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 py-10">
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
                  <th className="pb-2 pr-4">Weight</th>
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
                    <td className="py-2 pr-4">{m.weight || '—'}</td>
                    <td className="py-2 pr-4">{m.target || '—'}</td>
                    <td className="py-2 pr-4">{m.sourceData || '—'}</td>
                    <td className="py-2">{m.frequency || '—'}</td>
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
