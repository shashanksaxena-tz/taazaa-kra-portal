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
          {/* Ground shadows */}
          <ellipse cx="95" cy="253" rx="58" ry="9" fill="#0f172a" opacity="0.07" />
          <ellipse cx="222" cy="268" rx="68" ry="10" fill="#0f172a" opacity="0.07" />
          <ellipse cx="328" cy="238" rx="42" ry="8" fill="#0f172a" opacity="0.07" />

          {/* Ascending platform blocks */}
          <rect x="40" y="192" width="110" height="58" rx="12" fill="#A7F3D0" />
          <rect x="150" y="138" width="112" height="112" rx="14" fill="#6366F1" />
          <rect x="272" y="172" width="88" height="78" rx="12" fill="#10B981" />

          {/* Plants — left */}
          <path d="M20 214 Q9 196 18 178 Q31 197 24 216 Z" fill="#059669" />
          <path d="M12 220 Q-3 206 1 186 Q19 198 18 222 Z" fill="#34D399" />
          {/* Plants — right */}
          <path d="M378 208 Q367 190 376 172 Q389 191 382 210 Z" fill="#059669" />
          <path d="M370 214 Q356 200 360 180 Q378 192 376 216 Z" fill="#34D399" />

          {/* Person 1 — seated with laptop, left block */}
          <g transform="translate(95,178)">
            <ellipse cx="0" cy="52" rx="19" ry="6" fill="#0f172a" opacity="0.08" />
            <path d="M-15 20 Q-15 6 0 6 Q15 6 15 20 L15 40 L-15 40 Z" fill="#059669" />
            <circle cx="0" cy="-8" r="13" fill="#FBCFA0" />
            <path d="M-13 -12 Q-13 -24 0 -24 Q13 -24 13 -12 Q13 -18 0 -18 Q-13 -18 -13 -12 Z" fill="#1E293B" />
            <rect x="-18" y="30" width="36" height="16" rx="3" fill="#1E293B" />
            <rect x="-15" y="20" width="30" height="12" rx="2" fill="#334155" />
          </g>

          {/* Person 2 — standing, passing the cube, center */}
          <g transform="translate(196,118)">
            <ellipse cx="0" cy="72" rx="20" ry="6" fill="#0f172a" opacity="0.08" />
            <path d="M-17 20 Q-17 4 0 4 Q17 4 17 20 L17 62 L-17 62 Z" fill="#4338CA" />
            <circle cx="0" cy="-14" r="14" fill="#FBCFA0" />
            <path d="M-14 -18 Q-14 -31 0 -31 Q14 -31 14 -18 Q14 -25 0 -25 Q-14 -25 -14 -18 Z" fill="#1E293B" />
            <rect x="12" y="12" width="24" height="24" rx="5" fill="#A78BFA" transform="rotate(20 12 12)" />
          </g>

          {/* Person 3 — receiving, right block */}
          <g transform="translate(305,142)">
            <ellipse cx="0" cy="64" rx="18" ry="6" fill="#0f172a" opacity="0.08" />
            <path d="M-16 18 Q-16 2 0 2 Q16 2 16 18 L16 56 L-16 56 Z" fill="#7C3AED" />
            <circle cx="0" cy="-16" r="13" fill="#FBCFA0" />
            <path d="M-13 -20 Q-13 -33 0 -33 Q13 -33 13 -20 Q13 -27 0 -27 Q-13 -27 -13 -20 Z" fill="#1E293B" />
          </g>
        </svg>
      </div>
    </div>
  );
};
