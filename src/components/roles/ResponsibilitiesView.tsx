import React, { useState } from 'react';
import { useKRA } from '../../context/KRAContext';
import { EmptyState } from '../shared/EmptyState';

export const ResponsibilitiesView: React.FC = () => {
  const { portalData } = useKRA();
  const [query, setQuery] = useState('');

  const rows = portalData.departments.flatMap((d) =>
    d.roles
      .filter((r) => r.responsibilities.length > 0)
      .map((r) => ({ department: d.name, role: r.title, responsibilities: r.responsibilities }))
  ).filter((row) => row.role.toLowerCase().includes(query.toLowerCase()));

  if (rows.length === 0) {
    return <EmptyState title="No documented responsibilities" description="No role in the current dataset has responsibilities captured from its source document yet." />;
  }

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Responsibilities by Role</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by role..."
          className="mt-4 w-full sm:w-80 px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rows.map((row) => (
          <div key={row.role} className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">{row.department}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-3">{row.role}</h3>
            <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-600 dark:text-slate-300">
              {row.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
