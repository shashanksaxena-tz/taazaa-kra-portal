import React from 'react';
import { useKRA } from '../../context/KRAContext';

export const ExploreByFunctionGrid: React.FC = () => {
  const { portalData, setActiveDepartmentId, setActiveTab } = useKRA();

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Explore by Function</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {portalData.departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => { setActiveDepartmentId(dept.id); setActiveTab('roles', 'charters'); }}
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 transition-colors text-center"
          >
            <div className="text-sm font-bold text-slate-900 dark:text-white">{dept.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
