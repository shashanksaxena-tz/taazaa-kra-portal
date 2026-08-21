import React, { useEffect, useRef } from 'react';
import { useKRA } from '../../context/KRAContext';
import { 
  Search, 
  X, 
  Command, 
  Briefcase, 
  Layers, 
  TrendingUp, 
  Target,
  History,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    portalData,
    searchQuery,
    setSearchQuery,
    selectedLevel,
    setSelectedLevel,
    activeVersion,
    isHistoricalVersion,
    switchVersion,
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
    <div className="relative overflow-hidden py-8 sm:py-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Historical Version Time-Travel Notice Banner */}
        {isHistoricalVersion && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold">
                  Time-Travel Active: Viewing Archive "{activeVersion?.name}"
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Effective Date: <strong>{activeVersion?.effectiveDate}</strong> • Archived on {activeVersion?.createdAt?.split('T')[0]}. This is a read-only historical snapshot.
                </p>
              </div>
            </div>

            <button
              onClick={() => portalData.versions?.[0] && switchVersion(portalData.versions[0].id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap active:scale-[0.96]"
            >
              <span>Switch to Live Active Version</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Asymmetrical Hero: Wide Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-8">
          
          {/* Left Column: Heading, Subtitle & Search (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5">
              <div className="heading-label-line" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                TAAZAA EMPLOYEE RELATIONS & GOVERNANCE
              </span>
            </div>

            {/* Massive Headline */}
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Fresh Role Charters. <br />
              <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-accent-cyan bg-clip-text text-transparent">
                Measurable Outcomes.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
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
                  className="w-full pl-12 pr-16 sm:pr-20 py-3.5 sm:py-4 text-xs sm:text-base rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 shadow-sm transition-colors"
                />
                <div className="absolute right-3 sm:right-4 flex items-center gap-1.5 font-mono">
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
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-brand-500/50 transition-colors group">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-400">Total</span>
              </div>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors tracking-tight">
                {totalRoles}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Role Charters
              </div>
            </div>

            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-accent-cyan/50 transition-colors group">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-accent-cyan" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-400">Pillars</span>
              </div>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white group-hover:text-accent-cyan transition-colors tracking-tight">
                0{totalDepts}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Solution Areas
              </div>
            </div>

            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-brand-500/50 transition-colors group">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-400">Levels</span>
              </div>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors tracking-tight">
                L1–L6
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Growth Pathways
              </div>
            </div>

            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-accent-cyan/50 transition-colors group">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-accent-cyan" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-400">Target</span>
              </div>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white group-hover:text-accent-cyan transition-colors tracking-tight">
                100%
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Measurable OKRs
              </div>
            </div>
          </div>

        </div>

        {/* Experience Level Filter Pills: Full Row */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-start gap-1.5 sm:gap-2 flex-wrap select-none">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2 font-mono">
            Filter Level:
          </span>
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.value;
            return (
              <button
                key={lvl.value}
                onClick={() => setSelectedLevel(lvl.value)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all active:scale-[0.94] ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
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
