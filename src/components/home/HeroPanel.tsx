import React from 'react';
import { Search } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';
import heroIllustration from '../../assets/hero-illustration.webp';

export const HeroPanel: React.FC = () => {
  const { searchQuery, setSearchQuery, setActiveTab } = useKRA();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          How We <span className="text-brand-500">Work</span>.<br />
          How We <span className="text-indigo-500">Perform</span>.<br />
          How We <span className="text-brand-500">Grow</span>.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-300 max-w-md">
          A single source of truth for roles, accountability, performance, and career growth at Taazaa.
        </p>
        <div className="mt-6 flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
            aria-label="Search"
            className="flex items-center justify-center w-11 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/3] flex items-center justify-center">
        <img
          src={heroIllustration}
          alt="Illustration of three colleagues collaborating on ascending platforms, representing growth and teamwork"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};
