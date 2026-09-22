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
    { label: 'Competencies', has: (featured.competencies?.behavioral?.length || 0) + (featured.competencies?.technical?.length || 0) + (featured.competencies?.domain?.length || 0) > 0 },
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
