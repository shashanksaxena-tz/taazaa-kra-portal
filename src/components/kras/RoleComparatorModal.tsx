import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { X, GitCompare, ArrowRight, ShieldCheck, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleComparatorModal: React.FC<RoleComparatorModalProps> = ({ isOpen, onClose }) => {
  const { comparisonRoles, toggleCompareRole, clearComparison } = useKRA();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Role Charter Comparative Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Side-by-side progression & accountability analysis ({comparisonRoles.length} roles selected)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparisonRoles.length > 0 && (
              <button
                onClick={clearComparison}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {comparisonRoles.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <GitCompare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No roles selected for comparison
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the "Compare" button on any role charter card to analyze differences in accountabilities, competencies, and targets.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Return to Directory
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-${Math.min(comparisonRoles.length, 3)} gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800`}>
              {comparisonRoles.map((role) => (
                <div key={role.id} className="space-y-6 pt-6 md:pt-0 md:px-4 first:pl-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-black uppercase text-brand-600 dark:text-brand-400 tracking-wider">
                        {role.departmentId.toUpperCase()}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                        {role.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                          {role.level}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {role.experienceYears}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCompareRole(role)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mission */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                      Core Mission
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      "{role.mission}"
                    </p>
                  </div>

                  {/* Accountabilities */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Accountabilities ({role.accountabilities?.length || 0})
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {role.accountabilities?.map((acc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{acc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* OKRs */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Key Benchmark Targets
                    </div>
                    <div className="space-y-2">
                      {role.metricsAndOkrs?.slice(0, 3).map((okr, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                          <div className="font-bold text-slate-900 dark:text-white">{okr.outcomeArea}: {okr.metric}</div>
                          <div className="text-brand-600 dark:text-brand-400 font-extrabold mt-1">Target: {okr.target}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};
