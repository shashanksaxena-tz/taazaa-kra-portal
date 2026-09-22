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
      .filter((r) =>
        (r.competencies?.behavioral?.length || 0) +
          (r.competencies?.technical?.length || 0) +
          (r.competencies?.domain?.length || 0) >
        0
      )
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
            {GROUPS.map(({ key, label }) => {
              const items = role.competencies?.[key] || [];
              if (items.length === 0) return null;
              return (
                <div key={key} className="mb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
                  <ul className="mt-1 list-disc list-inside text-sm text-slate-600 dark:text-slate-300">
                    {items.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
