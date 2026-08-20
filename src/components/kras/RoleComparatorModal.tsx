import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { 
  X, 
  GitCompare, 
  Sparkles, 
  Clock, 
  Target, 
  CheckCircle2, 
  Award, 
  Trash2,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleComparatorModal: React.FC<RoleComparatorModalProps> = ({ isOpen, onClose }) => {
  const { comparisonRoles, removeCompareRole, clearComparison, portalData } = useKRA();

  if (!isOpen) return null;

  const role1 = comparisonRoles[0];
  const role2 = comparisonRoles[1];

  const getDept = (deptId: string) => portalData.departments.find((d) => d.id === deptId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
              <GitCompare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Side-by-Side Role Comparator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Compare missions, responsibilities, competencies, and OKR benchmarks across designations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparisonRoles.length > 0 && (
              <button
                onClick={clearComparison}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {comparisonRoles.length === 0 ? (
            <div className="text-center py-16">
              <GitCompare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                No roles selected for comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Click the compare icon on any 2 role cards to compare them side-by-side.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
              >
                Browse Role Charters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role 1 Card */}
              {role1 ? (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border-2 border-orange-200 dark:border-orange-900/50 space-y-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider">
                        {getDept(role1.departmentId)?.name}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {role1.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                          {role1.level}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          Exp: {role1.experienceYears}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCompareRole(role1.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mission */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Core Mission</h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                      "{role1.mission}"
                    </p>
                  </div>

                  {/* Accountabilities */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Accountabilities</h4>
                    <div className="space-y-1.5">
                      {role1.accountabilities?.slice(0, 4).map((a, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top OKRs */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Key Metric Targets</h4>
                    <div className="space-y-2">
                      {role1.metricsAndOkrs?.map((m, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                          <div className="font-bold text-slate-900 dark:text-white">{m.outcomeArea}</div>
                          <div className="text-slate-600 dark:text-slate-300 mt-0.5">{m.metric}</div>
                          <div className="inline-block mt-1 font-bold text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                            Target: {m.target}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Role 2 Card */}
              {role2 ? (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border-2 border-blue-200 dark:border-blue-900/50 space-y-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                        {getDept(role2.departmentId)?.name}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {role2.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {role2.level}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          Exp: {role2.experienceYears}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCompareRole(role2.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mission */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Core Mission</h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                      "{role2.mission}"
                    </p>
                  </div>

                  {/* Accountabilities */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Accountabilities</h4>
                    <div className="space-y-1.5">
                      {role2.accountabilities?.slice(0, 4).map((a, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top OKRs */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Key Metric Targets</h4>
                    <div className="space-y-2">
                      {role2.metricsAndOkrs?.map((m, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                          <div className="font-bold text-slate-900 dark:text-white">{m.outcomeArea}</div>
                          <div className="text-slate-600 dark:text-slate-300 mt-0.5">{m.metric}</div>
                          <div className="inline-block mt-1 font-bold text-[11px] text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                            Target: {m.target}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center">
                  <Plus className="w-10 h-10 text-slate-400 mb-2" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Select a 2nd role to compare
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Close this modal and click the compare icon on another role.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
                  >
                    Select 2nd Role
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
