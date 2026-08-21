import React, { useEffect, useRef } from 'react';
import { useKRA } from '../../context/KRAContext';
import { Search, X, Sparkles, Command, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    { label: 'Principal / Architect (L5)', value: 'Principal / Architect (L5)' },
    { label: 'Executive / Director (L6)', value: 'Executive / Director (L6)' },
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
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-orange-50/40 via-white to-slate-50 dark:from-[#0B0E28] dark:via-[#07091E] dark:to-[#07091E]">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-25 dark:opacity-20">
        <div className="absolute top-6 left-1/4 w-80 h-80 bg-[#FF5B22] rounded-full blur-[100px]" />
        <div className="absolute top-12 right-1/4 w-72 h-72 bg-[#29E8AE] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Taazaa Official Header Label with Gradient Line */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2.5 mb-4"
        >
          <div className="heading-label-line" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF5B22] dark:text-[#29E8AE]">
            TAAZAA EMPLOYEE RELATIONS & GOVERNANCE
          </span>
          <div className="heading-label-line" />
        </motion.div>

        {/* High-Impact Headline (Taazaa brand phrasing) */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-5 leading-tight"
        >
          Fresh Role Charters. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#FF5B22] via-[#FF7A45] to-[#29E8AE] bg-clip-text text-transparent">
            Measurable Outcomes.
          </span>
        </motion.h1>

        {/* Subtitle (<20 words) */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-8"
        >
          Standardizing organizational KRAs, transparent competencies, and clear growth ladders across all software engineering, quality, design, and delivery functions.
        </motion.p>

        {/* Taazaa Real Results Metric Boxes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8"
        >
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm text-left hover:border-[#FF5B22]/50 transition-colors group">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-[#FF5B22] transition-colors tracking-tight">
              {totalRoles}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Role Charters
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-navy-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm text-left hover:border-[#29E8AE]/50 transition-colors group">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-[#29E8AE] transition-colors tracking-tight">
              0{totalDepts}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Solution Areas
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-navy-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm text-left hover:border-[#FF5B22]/50 transition-colors group">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-[#FF5B22] transition-colors tracking-tight">
              L1–L6
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Career Ladders
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-navy-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm text-left hover:border-[#29E8AE]/50 transition-colors group">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-[#29E8AE] transition-colors tracking-tight">
              100%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              OKR & RACI Data
            </div>
          </div>
        </motion.div>

        {/* Global Search Bar with Keyboard Hint */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, skill, accountability, or metric (e.g. Lead Architect, QA Automation, CSAT)..."
              className="w-full pl-12 pr-20 py-3.5 text-sm sm:text-base rounded-2xl bg-white dark:bg-navy-800/90 border-2 border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF5B22] dark:focus:border-[#FF5B22] shadow-lg shadow-[#FF5B22]/5 transition-colors"
            />
            <div className="absolute right-3.5 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-navy-900 text-[11px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700 font-mono">
                  <Command className="w-3 h-3" /> K
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Experience Level Filter Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap select-none">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1.5 font-mono">
            Level:
          </span>
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.value;
            return (
              <button
                key={lvl.value}
                onClick={() => setSelectedLevel(lvl.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-[0.94] ${
                  isSelected
                    ? 'bg-[#FF5B22] text-white shadow-sm'
                    : 'bg-white dark:bg-navy-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
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
