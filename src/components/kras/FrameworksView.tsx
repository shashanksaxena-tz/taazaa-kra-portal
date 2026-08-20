import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { BookOpen, FileText, Layers, ExternalLink, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const FrameworksView: React.FC = () => {
  const { portalData } = useKRA();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-blue-200/80 dark:border-slate-800 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Organizational Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Department Frameworks & Org Design Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
          High-level competency matrices, QA automation benchmarks, design OKR measurement methodologies, and delivery frameworks.
        </p>
      </div>

      {/* Frameworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portalData.departments.map((dept) => (
          <div
            key={dept.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${dept.badgeColor}`}>
                {dept.name}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {dept.roles.length} Associated Charters
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {dept.description}
            </p>

            {dept.frameworks && dept.frameworks.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Governance Guides & Benchmark Docs:
                </div>
                {dept.frameworks.map((fw, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5"
                  >
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {fw.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                      {fw.summary}
                    </p>
                    <div className="text-[11px] text-slate-400 pl-6 font-mono">
                      Source: {fw.source}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
