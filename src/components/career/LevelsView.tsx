import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { EmptyState } from '../shared/EmptyState';

export const LevelsView: React.FC = () => {
  const { portalData } = useKRA();
  const allRoles = portalData.departments.flatMap((d) => d.roles.map((r) => ({ ...r, departmentName: d.name })));
  const levels = Array.from(new Set(allRoles.map((r) => r.level))).sort();

  if (levels.length === 0) {
    return <EmptyState title="No documented levels" description="No role in the current dataset has a level assigned yet." />;
  }

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Career Levels</h1>
      <div className="space-y-6">
        {levels.map((level) => (
          <div key={level} className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{level}</h3>
            <div className="flex flex-wrap gap-2">
              {allRoles.filter((r) => r.level === level).map((r) => (
                <span key={r.id} className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                  {r.title} <span className="text-slate-400">· {r.departmentName}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
