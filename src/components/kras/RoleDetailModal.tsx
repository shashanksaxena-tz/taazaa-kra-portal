import React, { useState } from 'react';
import { RoleCharter, Department } from '../../types';
import { useKRA } from '../../context/KRAContext';
import { 
  X, 
  Clock, 
  GitCompare, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  ListChecks, 
  Target, 
  Award, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Edit3,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleDetailModalProps {
  role: RoleCharter;
  department: Department;
  onClose: () => void;
  onOpenAdminEdit?: (role: RoleCharter) => void;
}

export const RoleDetailModal: React.FC<RoleDetailModalProps> = ({
  role,
  department,
  onClose,
  onOpenAdminEdit,
}) => {
  const { comparisonRoles, toggleCompareRole, adminSession } = useKRA();
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');

  const isCompared = comparisonRoles.some((r) => r.id === role.id);

  const tabs = [
    { id: 'overview', label: 'Overview & Mission', icon: Sparkles },
    { id: 'accountabilities', label: 'Core Accountabilities', icon: CheckCircle2 },
    { id: 'responsibilities', label: 'Day-to-Day Responsibilities', icon: ListChecks },
    { id: 'okrs', label: 'Quarterly OKRs & Metrics', icon: Target },
    { id: 'competencies', label: 'Competency Framework', icon: Award },
    { id: 'growth', label: 'Career Growth Ladder', icon: TrendingUp },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#07091E] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-none"
      >
        
        {/* Modal Sticky Header */}
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#0D1136]/80 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-[#FF5B22] border border-[#FF5B22]/20">
                  {department.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                  {role.level}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold ml-1">
                  <Clock className="w-3.5 h-3.5 text-[#FF5B22]" />
                  <span>{role.experienceYears}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {role.title}
              </h2>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 print:hidden">
              {adminSession.isAuthenticated && onOpenAdminEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminEdit(role);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-[#29E8AE] text-xs font-bold border border-emerald-500/30 transition-colors active:scale-[0.94]"
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
                    ? 'bg-[#FF5B22] text-white border-[#FF5B22] shadow-sm'
                    : 'bg-white dark:bg-[#0D1136] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-[#FF5B22]'
                }`}
                title={isCompared ? 'Remove from comparison' : 'Compare with another role'}
              >
                <GitCompare className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl bg-white dark:bg-[#0D1136] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors active:scale-[0.92]"
                title="Print or Save as PDF"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white dark:bg-[#0D1136] text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors active:scale-[0.92]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-Tab Navigation Bar with Solid Readable Backgrounds */}
          <div className="flex items-center gap-1.5 overflow-x-auto mt-6 pt-3 border-t border-slate-200 dark:border-white/10 print:hidden scrollbar-none select-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-[0.97] border ${
                    isActive
                      ? 'bg-[#FF5B22] text-white border-[#FF5B22] shadow-sm'
                      : 'bg-white dark:bg-[#07091E] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
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
              <div className="p-6 rounded-2xl bg-orange-500/5 border-2 border-[#FF5B22]/20 text-left">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FF5B22] mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Core Mission Statement</span>
                </div>
                <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                  "{role.mission}"
                </p>
              </div>

              {/* Summary & Practice Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0D1136] border border-slate-200 dark:border-white/10 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                    <BookOpen className="w-4 h-4 text-[#FF5B22]" />
                    <span>Practice Area</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {department.name}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0D1136] border border-slate-200 dark:border-white/10 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                    <Clock className="w-4 h-4 text-[#29E8AE]" />
                    <span>Experience Range</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {role.experienceYears}
                  </div>
                </div>
              </div>

              {/* Role Summary if available */}
              {role.summary && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0D1136] border border-slate-200 dark:border-white/10 text-left space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Role Overview & Scope
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {role.summary}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Core Accountabilities */}
          {(activeSubTab === 'accountabilities' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#29E8AE]" />
                <span>Core Accountabilities (What you own)</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {role.accountabilities?.map((acc, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D1136] border border-slate-200 dark:border-white/10 flex items-start gap-3"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/10 text-[#FF5B22] font-black text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      {acc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Day-to-Day Responsibilities */}
          {(activeSubTab === 'responsibilities' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-[#FF5B22]" />
                <span>Day-to-Day Responsibilities & Execution</span>
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {role.responsibilities?.map((res, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1136] border border-slate-200 dark:border-white/10 flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4 text-[#FF5B22] flex-shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: OKRs & Metrics */}
          {(activeSubTab === 'okrs' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF5B22]" />
                <span>Measurable Performance Metrics & OKRs</span>
              </h3>
              
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-[#0D1136] text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="p-3.5 sm:p-4">Outcome Area</th>
                      <th className="p-3.5 sm:p-4">Performance Metric</th>
                      <th className="p-3.5 sm:p-4">Target Benchmark</th>
                      <th className="p-3.5 sm:p-4">Cadence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:border-white/10">
                    {role.metricsAndOkrs?.map((okr, index) => (
                      <tr key={index} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-3.5 sm:p-4 font-bold text-slate-900 dark:text-white">
                          {okr.outcomeArea}
                        </td>
                        <td className="p-3.5 sm:p-4 text-slate-700 dark:text-slate-300">
                          {okr.metric}
                        </td>
                        <td className="p-3.5 sm:p-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-orange-500/10 text-[#FF5B22] border border-[#FF5B22]/20">
                            {okr.target}
                          </span>
                        </td>
                        <td className="p-3.5 sm:p-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                          {okr.frequency || 'Quarterly'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Competencies */}
          {(activeSubTab === 'competencies' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#29E8AE]" />
                <span>Required Competency Matrix</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Technical Competencies */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Technical & Domain Competencies
                  </h4>
                  <div className="space-y-2">
                    {role.competencies?.technical?.map((t, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0D1136] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Behavioral Competencies */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Behavioral Competencies (Taazaa Values)
                  </h4>
                  <div className="space-y-2">
                    {role.competencies?.behavioral?.map((b, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0D1136] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Growth Ladder */}
          {(activeSubTab === 'growth' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FF5B22]" />
                <span>Career Progression Pathways</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0D1136] border border-slate-200 dark:border-white/10">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 font-mono">
                    Feeder & Preceding Roles
                  </div>
                  {role.careerPath?.previousRoles && role.careerPath.previousRoles.length > 0 ? (
                    <div className="space-y-2">
                      {role.careerPath.previousRoles.map((prev, idx) => (
                        <div key={idx} className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{prev.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 dark:text-slate-400">Entry / Lateral Hire</div>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-orange-500/10 border border-[#FF5B22]/30">
                  <div className="text-xs font-bold text-[#FF5B22] uppercase tracking-wider mb-3 font-mono">
                    Next Career Ladder Steps
                  </div>
                  {role.careerPath?.nextRoles && role.careerPath.nextRoles.length > 0 ? (
                    <div className="space-y-2">
                      {role.careerPath.nextRoles.map((nxt, idx) => (
                        <div key={idx} className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-[#FF5B22]" />
                          <span>{nxt.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 dark:text-slate-400">Executive Leadership / Practice Directorship</div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Print & Footer Bar */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D1136] flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Taazaa ER Governance • Role ID: <code className="font-mono text-slate-700 dark:text-slate-300">{role.id}</code>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-[#FF5B22] dark:hover:bg-[#FF5B22] dark:hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
