import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { Search, X, Sparkles, Briefcase, Award, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  const {
    portalData,
    searchQuery,
    setSearchQuery,
    selectedLevel,
    setSelectedLevel,
    activeDepartmentId
  } = useKRA();

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
    { label: 'Director (L6)', value: 'Executive / Director (L6)' },
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-orange-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-amber-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Taazaa Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300 text-xs font-bold tracking-wide uppercase shadow-sm mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          <span>Taazaa Employee Relations & HR Portal</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-5 leading-tight"
        >
          Role Charters, KRAs & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-600 via-taazaa-500 to-amber-500 bg-clip-text text-transparent">
            Performance Competencies
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-8"
        >
          Transparent missions, measurable quarterly OKRs, and clear career ladders across all engineering, design, quality, product, and delivery functions.
        </motion.p>

        {/* Quick Highlights Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8"
        >
          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">{totalRoles}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Role Charters</div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">{totalDepts}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Departments</div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">L1 - L6</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Growth Ladders</div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">OKR & RACI Data</div>
            </div>
          </div>
        </motion.div>

        {/* Global Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, skill, accountability, or metric (e.g. Lead Architect, QA Automation, CSAT)..."
              className="w-full pl-12 pr-10 py-3.5 text-sm sm:text-base rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 shadow-lg shadow-orange-500/5 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Experience Level Filter Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1.5">
            Level:
          </span>
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.value;
            return (
              <button
                key={lvl.value}
                onClick={() => setSelectedLevel(lvl.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-orange-500 dark:text-white shadow-sm'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
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
