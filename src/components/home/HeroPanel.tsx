import React from 'react';
import { Search } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';

export const HeroPanel: React.FC = () => {
  const { searchQuery, setSearchQuery, setActiveTab } = useKRA();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          How We <span className="text-brand-500">Work</span>.<br />
          How We <span className="text-indigo-500">Perform</span>.<br />
          How We <span className="text-emerald-500">Grow</span>.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md">
          A single source of truth for roles, accountability, performance, and career growth at Taazaa.
        </p>
        <div className="mt-6 flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, skill, function or keyword..."
              className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <button
            onClick={() => setActiveTab('roles', 'charters')}
            className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-brand-500/10 via-indigo-500/10 to-emerald-500/10 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 150" className="w-3/4 h-3/4" aria-hidden="true">
          <rect x="20" y="80" width="45" height="45" rx="8" fill="currentColor" className="text-brand-500/70" />
          <rect x="80" y="55" width="45" height="70" rx="8" fill="currentColor" className="text-indigo-500/70" />
          <rect x="140" y="90" width="35" height="35" rx="8" fill="currentColor" className="text-emerald-500/70" />
          <circle cx="42" cy="60" r="12" fill="currentColor" className="text-slate-400/60" />
          <circle cx="102" cy="35" r="12" fill="currentColor" className="text-slate-400/60" />
          <circle cx="157" cy="70" r="12" fill="currentColor" className="text-slate-400/60" />
        </svg>
      </div>
    </div>
  );
};
