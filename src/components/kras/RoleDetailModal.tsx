import React, { useState } from 'react';
import { RoleCharter, Department } from '../../types';
import { useKRA } from '../../context/KRAContext';
import { 
  X, 
  Printer, 
  GitCompare, 
  Clock, 
  Target, 
  CheckCircle2, 
  Award, 
  Compass, 
  Sparkles, 
  FileText, 
  Edit3,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoleDetailModalProps {
  role: RoleCharter | null;
  department?: Department;
  onClose: () => void;
  onSelectRole: (role: RoleCharter) => void;
  onEditInAdmin?: (role: RoleCharter) => void;
}

export const RoleDetailModal: React.FC<RoleDetailModalProps> = ({
  role,
  department,
  onClose,
  onSelectRole,
  onEditInAdmin,
}) => {
  const { comparisonRoles, toggleCompareRole, adminSession, portalData } = useKRA();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'accountabilities' | 'competencies' | 'okrs'>('overview');

  if (!role) return null;

  const currentDept = department || portalData.departments.find((d) => d.id === role.departmentId);
  const isCompared = comparisonRoles.some((r) => r.id === role.id);

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: 'overview', label: 'Mission & Overview', icon: Compass },
    { id: 'accountabilities', label: 'Accountabilities & Activities', icon: FileText },
    { id: 'competencies', label: 'Competency Framework', icon: Award },
    { id: 'okrs', label: `OKRs & Metrics (${role.metricsAndOkrs?.length || 0})`, icon: Target },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-full print:m-0 print:p-0"
      >
        
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-orange-50/60 via-amber-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-2.5">
                {currentDept && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentDept.badgeColor}`}>
                    {currentDept.name}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {role.level}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>{role.experienceYears}</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {role.title}
              </h2>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 print:hidden">
              {adminSession.isAuthenticated && onEditInAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onEditInAdmin(role);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700 transition-colors active:scale-[0.94]"
                  title="Edit this Role Charter in Admin Panel"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              )}

              <button
                onClick={() => toggleCompareRole(role)}
                className={`p-2.5 rounded-xl border transition-all active:scale-[0.92] ${
                  isCompared
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-400'
                }`}
                title={isCompared ? 'Remove from comparison' : 'Compare with another role'}
              >
                <GitCompare className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-[0.92]"
                title="Print or Save as PDF"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-[0.92]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-Tab Navigation Bar with Animated Pill */}
          <div className="flex items-center gap-1.5 overflow-x-auto mt-6 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 print:hidden scrollbar-none select-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors active:scale-[0.97] z-10 ${
                    isActive
                      ? 'text-white'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSubModalTab"
                      className="absolute inset-0 bg-orange-500 rounded-xl shadow-sm -z-10"
                      transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Tab 1: Overview & Mission */}
          {(activeSubTab === 'overview' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
            <div className="space-y-6">
              {/* Mission Statement Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border-2 border-orange-200 dark:border-orange-500/30">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Core Mission Statement</span>
                </div>
                <blockquote className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed italic">
                  "{role.mission}"
                </blockquote>
              </div>

              {/* Career Ladder Pathway */}
              {(role.careerPath?.previousRoles?.length > 0 || role.careerPath?.nextRoles?.length > 0) && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 print:hidden">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span>Career Progression Pathway</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Previous Role */}
                    <div className="w-full sm:w-1/2">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1">Previous Level:</div>
                      {role.careerPath.previousRoles.length > 0 ? (
                        <div className="space-y-1">
                          {role.careerPath.previousRoles.map((pr) => {
                            const found = currentDept?.roles.find((r) => r.id === pr.id);
                            return (
                              <button
                                key={pr.id}
                                onClick={() => found && onSelectRole(found)}
                                className="w-full text-left px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-orange-400 hover:text-orange-600 transition-colors active:scale-[0.98]"
                              >
                                ← {pr.title}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">Entry Level in this track</div>
                      )}
                    </div>

                    {/* Next Role */}
                    <div className="w-full sm:w-1/2">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1">Next Career Step:</div>
                      {role.careerPath.nextRoles.length > 0 ? (
                        <div className="space-y-1">
                          {role.careerPath.nextRoles.map((nr) => {
                            const found = currentDept?.roles.find((r) => r.id === nr.id);
                            return (
                              <button
                                key={nr.id}
                                onClick={() => found && onSelectRole(found)}
                                className="w-full text-left px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-orange-400 hover:text-orange-600 transition-colors active:scale-[0.98]"
                              >
                                {nr.title} →
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">Senior Executive Leadership</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Summary of sections */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mb-1">
                    {role.accountabilities?.length || 0}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Accountabilities
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                    {role.responsibilities?.length || 0}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Key Activities
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">
                    {role.metricsAndOkrs?.length || 0}
                  </div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Measurable OKRs
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Accountabilities & Responsibilities */}
          {(activeSubTab === 'accountabilities' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
            <div className="space-y-6">
              {/* Accountabilities */}
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span>Primary Accountabilities</span>
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {role.accountabilities?.map((acc, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm text-slate-800 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{acc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Activities / Responsibilities */}
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Key Activities & Daily Responsibilities</span>
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {role.responsibilities?.map((resp, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200"
                    >
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed font-medium">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Competency Framework */}
          {(activeSubTab === 'competencies' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
            <div className="space-y-6">
              {/* Behavioral / Taazaa Culture */}
              <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
                <h3 className="text-lg font-black text-amber-900 dark:text-amber-300 flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Behavioral Competencies (Taazaa Culture – Owner Level)</span>
                </h3>
                <div className="space-y-2">
                  {role.competencies?.behavioral?.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical / Functional Competencies */}
              <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
                <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Technical & Functional Competencies</span>
                </h3>
                <div className="space-y-2">
                  {role.competencies?.technical?.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed font-medium">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Domain & Operational Standards */}
              <div className="p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60">
                <h3 className="text-lg font-black text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>Domain & Delivery Standards</span>
                </h3>
                <div className="space-y-2">
                  {role.competencies?.domain?.map((d, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed font-medium">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: OKRs & Metrics Table */}
          {(activeSubTab === 'okrs' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span>Measurable OKRs, KPIs & Evaluation Criteria</span>
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                  Reviewed Quarterly
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-4">Outcome Area</th>
                      <th className="p-4">Metric & Expectation</th>
                      <th className="p-4">Target Benchmark</th>
                      <th className="p-4">Source of Truth</th>
                      <th className="p-4">Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {role.metricsAndOkrs?.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white align-top">
                          {m.outcomeArea}
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-300 align-top">
                          {m.metric}
                        </td>
                        <td className="p-4 align-top">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {m.target}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-500 dark:text-slate-400 align-top">
                          {m.sourceData}
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600 dark:text-slate-400 align-top">
                          {m.frequency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 print:hidden">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Source Document: <span className="font-semibold">{role.sourceDoc || 'Taazaa ER Database'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors active:scale-[0.96]"
            >
              <Printer className="w-4 h-4" />
              <span>Export / Print</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-orange-600 hover:bg-slate-800 dark:hover:bg-orange-500 shadow-sm transition-all active:scale-[0.96]"
            >
              Close
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
