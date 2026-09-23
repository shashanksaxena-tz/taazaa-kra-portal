import React from 'react';
import { Search } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';

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

      <div className="relative aspect-[4/3]">
        <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
          <defs>
            <radialGradient id="heroGlow" cx="55%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.14" />
              <stop offset="55%" stopColor="#6366F1" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="400" height="300" fill="url(#heroGlow)" />

          {/* Ground shadows */}
          <ellipse cx="95" cy="255" rx="60" ry="10" fill="#0f172a" opacity="0.06" />
          <ellipse cx="220" cy="270" rx="70" ry="11" fill="#0f172a" opacity="0.06" />
          <ellipse cx="330" cy="240" rx="45" ry="9" fill="#0f172a" opacity="0.06" />

          {/* Ascending platform blocks */}
          <rect x="40" y="190" width="110" height="60" rx="10" fill="#A7F3D0" />
          <rect x="150" y="140" width="110" height="110" rx="12" fill="#6366F1" opacity="0.85" />
          <rect x="270" y="170" width="90" height="80" rx="10" fill="#10B981" />

          {/* Plants */}
          <g opacity="0.9">
            <path d="M28 200 Q18 180 30 165 Q42 182 32 202 Z" fill="#059669" />
            <path d="M22 208 Q6 196 8 176 Q28 186 26 210 Z" fill="#34D399" />
          </g>
          <g opacity="0.9">
            <path d="M370 195 Q360 176 372 160 Q384 178 374 197 Z" fill="#059669" />
          </g>

          {/* Person 1 — seated with laptop, left block */}
          <g transform="translate(95,175)">
            <ellipse cx="0" cy="46" rx="16" ry="6" fill="#0f172a" opacity="0.08" />
            <rect x="-14" y="10" width="28" height="30" rx="10" fill="#10B981" />
            <circle cx="0" cy="-4" r="12" fill="#FDE9DD" />
            <rect x="-16" y="30" width="32" height="14" rx="4" fill="#0f172a" opacity="0.75" />
          </g>

          {/* Person 2 — standing, passing the cube, center */}
          <g transform="translate(198,120)">
            <ellipse cx="0" cy="66" rx="17" ry="6" fill="#0f172a" opacity="0.08" />
            <rect x="-15" y="8" width="30" height="52" rx="11" fill="#4338CA" />
            <circle cx="0" cy="-8" r="13" fill="#FDE9DD" />
            <rect x="10" y="18" width="22" height="22" rx="5" fill="#F0ABFC" transform="rotate(18 10 18)" />
          </g>

          {/* Person 3 — receiving, right block */}
          <g transform="translate(305,140)">
            <ellipse cx="0" cy="62" rx="16" ry="6" fill="#0f172a" opacity="0.08" />
            <rect x="-14" y="6" width="28" height="50" rx="10" fill="#7C3AED" />
            <circle cx="0" cy="-9" r="12" fill="#FDE9DD" />
          </g>
        </svg>
      </div>
    </div>
  );
};
