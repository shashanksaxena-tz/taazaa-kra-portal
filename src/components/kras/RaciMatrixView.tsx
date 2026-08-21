import React, { useState } from 'react';
import { useKRA } from '../../context/KRAContext';
import { Search } from 'lucide-react';

export const RaciMatrixView: React.FC = () => {
  const { portalData } = useKRA();
  const [filterQuery, setFilterQuery] = useState('');

  const raciData = portalData.raciMatrix || [];

  const filtered = raciData.filter((item) =>
    item.activity.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getRaciBadge = (val: string) => {
    const v = val.toLowerCase();
    if (v.includes('accountable') || v === 'a') {
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 font-extrabold';
    }
    if (v.includes('responsible') || v === 'r') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-extrabold';
    }
    if (v.includes('consulted') || v === 'c') {
      return 'bg-brand-100 text-brand-800 border-brand-200 dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800 font-bold';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700 font-medium';
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-500/10 via-indigo-500/5 to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="heading-label-line" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                GOVERNANCE & ACCOUNTABILITY
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Cross-Functional RACI Governance Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Clarifies operational and strategic accountabilities between Delivery Managers, Program Managers, Technical Leads, and Product Managers.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter activities..."
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* RACI Definition Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-700/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xs">
              R
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              <strong className="text-slate-900 dark:text-white">Responsible</strong>: Executes activity
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-extrabold flex items-center justify-center text-xs">
              A
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              <strong className="text-slate-900 dark:text-white">Accountable</strong>: Owns the outcome
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-brand-100 dark:bg-brand-950/80 text-brand-800 dark:text-brand-300 font-extrabold flex items-center justify-center text-xs">
              C
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              <strong className="text-slate-900 dark:text-white">Consulted</strong>: Provides input
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-extrabold flex items-center justify-center text-xs">
              I
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              <strong className="text-slate-900 dark:text-white">Informed</strong>: Kept updated
            </span>
          </div>
        </div>
      </div>

      {/* RACI Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/90">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 sm:p-5 w-2/5">Operational Touchpoint & Activity</th>
              <th className="p-4 sm:p-5 text-center">Delivery Manager (DM)</th>
              <th className="p-4 sm:p-5 text-center">Program Manager (PgM)</th>
              <th className="p-4 sm:p-5 text-center">Technical Lead (TL)</th>
              <th className="p-4 sm:p-5 text-center">Product Manager (PM)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">
                  {row.activity}
                </td>
                <td className="p-4 sm:p-5 text-center">
                  <span className={`inline-block px-3 py-1 rounded-xl text-xs border ${getRaciBadge(row.deliveryManager)}`}>
                    {row.deliveryManager}
                  </span>
                </td>
                <td className="p-4 sm:p-5 text-center">
                  <span className={`inline-block px-3 py-1 rounded-xl text-xs border ${getRaciBadge(row.programManager)}`}>
                    {row.programManager}
                  </span>
                </td>
                <td className="p-4 sm:p-5 text-center">
                  <span className={`inline-block px-3 py-1 rounded-xl text-xs border ${getRaciBadge(row.techLead)}`}>
                    {row.techLead}
                  </span>
                </td>
                <td className="p-4 sm:p-5 text-center">
                  <span className={`inline-block px-3 py-1 rounded-xl text-xs border ${getRaciBadge(row.productManager)}`}>
                    {row.productManager}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
