import React, { useEffect, useRef } from 'react';
import { useKRA } from '../../context/KRAContext';
import { Search, X, Command, Briefcase, Layers, TrendingUp, Target } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    portalData,
    searchQuery,
    setSearchQuery,
    selectedLevel,
    setSelectedLevel,
  } = useKRA();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const totalRoles = portalData.departments.reduce((acc, d) => acc + d.roles.length, 0);
  const totalDepts = portalData.departments.length;

  const levels = [
    { label: 'All Levels', value: 'all' },
    { label: 'Associate (L1)', value: 'Associate (L1)' },
    { label: 'Mid-Level (L2)', value: 'Mid-Level (L2)' },
    { label: 'Senior (L3)', value: 'Senior (L3)' },
    { label: 'Lead (L4)', value: 'Lead (L4)' },
    { label: 'Management (L4-L5)', value: 'Management (L4-L5)' },
    { label: 'Principal (L5)', value: 'Principal / Architect (L5)' },
    { label: 'Director (L6)', value: 'Executive / Director (L6)' },
  ];

  // Keyboard shortcut listener (⌘K or / to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative overflow-hidden py-10 sm:py-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-orange-50/30 via-white to-slate-50/50 dark:from-[#0B0E28] dark:via-[#07091E] dark:to-[#07091E]">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-[#FF5B22]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#29E8AE]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Asymmetrical Hero: Wide Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-8">
          
          {/* Left Column: Heading, Subtitle & Search (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Taazaa Eyebrow with Gradient Line */}
            <div className="inline-flex items-center gap-2.5">
              <div className="heading-label-line" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5B22] dark:text-[#29E8AE]">
                TAAZAA EMPLOYEE RELATIONS & GOVERNANCE
              </span>
            </div>

            {/* Massive Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Fresh Role Charters. <br />
              <span className="bg-gradient-to-r from-[#FF5B22] via-[#FF7A45] to-[#29E8AE] bg-clip-text text-transparent">
                Measurable Outcomes.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
              Standardizing organizational KRAs, transparent competencies, and clear growth ladders across all software engineering, quality, design, and delivery functions.
            </p>

            {/* Search Input Box */}
            <div className="relative max-w-2xl pt-2">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by role, skill, accountability, or metric (e.g. Lead Architect, QA Automation)..."
                  className="w-full pl-12 pr-20 py-4 text-sm sm:text-base rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF5B22] dark:focus:border-[#FF5B22] shadow-sm transition-colors"
                />
                <div className="absolute right-4 flex items-center gap-1.5 font-mono">
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700">
                      <Command className="w-3 h-3" /> K
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 4-Box Metric Bento (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-[#FF5B22]/50 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <Briefcase className="w-6 h-6 text-[#FF5B22]" />
                <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Total</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white group-hover:text-[#FF5B22] transition-colors tracking-tight">
                {totalRoles}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Role Charters
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-[#29E8AE]/50 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <Layers className="w-6 h-6 text-[#29E8AE]" />
                <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Pillars</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white group-hover:text-[#29E8AE] transition-colors tracking-tight">
                0{totalDepts}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Solution Areas
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-[#FF5B22]/50 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-6 h-6 text-[#FF5B22]" />
                <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Levels</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white group-hover:text-[#FF5B22] transition-colors tracking-tight">
                L1–L6
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Growth Pathways
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-[#29E8AE]/50 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-6 h-6 text-[#29E8AE]" />
                <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Target</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white group-hover:text-[#29E8AE] transition-colors tracking-tight">
                100%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Measurable OKRs
              </div>
            </div>
          </div>

        </div>

        {/* Experience Level Filter Pills: Full Row */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-start gap-2 flex-wrap select-none">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2 font-mono">
            Filter Level:
          </span>
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.value;
            return (
              <button
                key={lvl.value}
                onClick={() => setSelectedLevel(lvl.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-[0.94] ${
                  isSelected
                    ? 'bg-[#FF5B22] text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
