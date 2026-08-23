import React, { useState } from 'react';
import { RoleCharter, Department } from '../../types';
import { useKRA } from '../../context/KRAContext';
import { 
  X, 
  Target, 
  Clock, 
  BookOpen, 
  Award, 
  ArrowRight, 
  GitCompare, 
  Printer, 
  Edit3, 
  CheckCircle2, 
  TrendingUp, 
  ListChecks, 
  ChevronRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { TaazaaLogo } from '../ui/TaazaaLogo';

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
  const { comparisonRoles, toggleCompareRole, adminSession, portalData, activeVersion } = useKRA();
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');

  const isCompared = comparisonRoles.some((r) => r.id === role.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'accountabilities', label: 'Accountabilities', icon: Shield },
    { id: 'responsibilities', label: 'Responsibilities', icon: ListChecks },
    { id: 'okrs', label: 'OKRs & Metrics', icon: Target },
    { id: 'competencies', label: 'Competencies', icon: Award },
    { id: 'growth', label: 'Career Ladder', icon: TrendingUp },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. SCREEN VIEW: Interactive Slide-Over Charter Drawer (Hidden when printing) */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-md flex justify-end print:hidden">
        
        {/* Click outside backdrop to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Full-Height Slide-Over Charter Drawer */}
        <motion.div
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-4xl h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-left"
        >
          
          {/* Drawer Header (Sticky) */}
          <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 backdrop-blur-md flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              
              {/* Title & Metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {department.name}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                    {role.level}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>Exp: {role.experienceYears}</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {role.title}
                </h2>
              </div>

              {/* Quick Utility Actions */}
              <div className="flex items-center gap-2">
                
                {/* Admin Edit Trigger */}
                {adminSession.isAuthenticated && onOpenAdminEdit && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminEdit(role);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.96]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Charter</span>
                  </button>
                )}

                {/* Compare Toggle */}
                <button
                  onClick={() => toggleCompareRole(role)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all active:scale-[0.94] ${
                    isCompared
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500'
                  }`}
                  title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                >
                  <GitCompare className="w-4 h-4" />
                </button>

                {/* PDF Print Export */}
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-sm hover:bg-brand-600 dark:hover:bg-brand-600 dark:hover:text-white transition-colors active:scale-[0.94]"
                  title="Print or Export Formatted PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>

                {/* Close Drawer Button */}
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors active:scale-[0.94]"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>
            </div>

            {/* Segmented Tab Navigation Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto mt-6 p-1 bg-slate-200/60 dark:bg-slate-950/80 rounded-2xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-[0.97] ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
            
            {/* Tab 1: Overview */}
            {activeSubTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Mission Statement Box */}
                <div className="p-6 sm:p-7 rounded-3xl bg-brand-50/50 dark:bg-slate-800/60 border border-brand-500/20 text-left">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Core Mission Statement</span>
                  </div>
                  <p className="text-base sm:text-lg text-slate-900 dark:text-white font-medium leading-relaxed">
                    "{role.mission}"
                  </p>
                </div>

                {/* Summary */}
                {role.summary && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                      Executive Summary
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {role.summary}
                    </p>
                  </div>
                )}

                {/* Highlights Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-400 font-semibold mb-1">Accountabilities</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                      {role.accountabilities?.length || 0} Areas
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-400 font-semibold mb-1">Target OKRs</div>
                    <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
                      {role.metricsAndOkrs?.length || 0} Benchmarks
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-400 font-semibold mb-1">Competency Model</div>
                    <div className="text-2xl font-black text-accent-cyan">
                      {(role.competencies?.technical?.length || 0) + (role.competencies?.behavioral?.length || 0)} Skills
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Accountabilities */}
            {activeSubTab === 'accountabilities' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                  <Shield className="w-4 h-4 text-brand-500" />
                  <span>Primary Accountabilities & Ownership Areas</span>
                </div>
                <p className="text-xs text-slate-500">
                  Non-delegable organizational outcomes owned by this role.
                </p>

                <div className="space-y-3 mt-4">
                  {role.accountabilities?.map((acc, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 hover:border-brand-500/40 transition-colors"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-black text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {acc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Responsibilities */}
            {activeSubTab === 'responsibilities' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                  <ListChecks className="w-4 h-4 text-brand-500" />
                  <span>Operational Day-to-Day Responsibilities</span>
                </div>
                <p className="text-xs text-slate-500">
                  Tactical execution, team collaboration, and technical delivery activities.
                </p>

                <div className="space-y-2.5 mt-4">
                  {role.responsibilities?.map((res, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
                    >
                      <ChevronRight className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-normal">
                        {res}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: OKRs & Metrics */}
            {activeSubTab === 'okrs' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                  <Target className="w-4 h-4 text-brand-500" />
                  <span>Measurable OKRs & Performance Benchmarks</span>
                </div>
                <p className="text-xs text-slate-500">
                  Objective criteria utilized during quarterly appraisal reviews and performance evaluations.
                </p>

                <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <table className="w-full text-left text-xs sm:text-sm min-w-[500px]">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-4">Outcome Area</th>
                        <th className="p-4">Key Metric</th>
                        <th className="p-4">Target Benchmark</th>
                        <th className="p-4">Cadence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {role.metricsAndOkrs?.map((okr, index) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">
                            {okr.outcomeArea}
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300">
                            {okr.metric}
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                              {okr.target}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-xs">
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
            {activeSubTab === 'competencies' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                  <Award className="w-4 h-4 text-brand-500" />
                  <span>Required Competency & Skill Matrix</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Technical & Domain Skills */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>Technical & Domain Skills</span>
                    </h4>
                    <div className="space-y-2">
                      {role.competencies?.technical?.map((t, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-medium">
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Behavioral & Value Skills */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Values & Behavioral Traits</span>
                    </h4>
                    <div className="space-y-2">
                      {role.competencies?.behavioral?.map((b, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-medium">
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Tab 6: Career Growth Ladder */}
            {activeSubTab === 'growth' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                  <TrendingUp className="w-4 h-4 text-brand-500" />
                  <span>Career Progression & Feeder Ladder</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Feeder Roles */}
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                      Feeder / Previous Roles
                    </div>
                    {role.careerPath?.previousRoles && role.careerPath.previousRoles.length > 0 ? (
                      <div className="space-y-2">
                        {role.careerPath.previousRoles.map((prev, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
                            {prev.title}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic p-3">Entry / Lateral Hire</div>
                    )}
                  </div>

                  {/* Elevation Targets */}
                  <div className="p-6 rounded-3xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-500/30 space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
                      Next Elevation Target
                    </div>
                    {role.careerPath?.nextRoles && role.careerPath.nextRoles.length > 0 ? (
                      <div className="space-y-2">
                        {role.careerPath.nextRoles.map((nxt, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-brand-500/40 text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ArrowRight className="w-3.5 h-3.5 text-brand-500" />
                            <span>{nxt.title}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-brand-600 dark:text-brand-400 font-bold p-3">Directorship / Executive Practice Leadership</div>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Drawer Footer (Sticky) */}
          <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex items-center justify-between gap-4 flex-shrink-0">
            <div className="text-xs text-slate-400 font-mono">
              Charter ID: <span className="text-slate-600 dark:text-slate-300 font-bold">{role.id}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="btn-secondary !py-2 !px-4"
              >
                Export PDF
              </button>
              <button
                onClick={onClose}
                className="btn-primary !py-2 !px-5"
              >
                Done
              </button>
            </div>
          </div>

        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRINT-ONLY VIEW: Full Official Multi-Page Executive Charter Specification */}
      {/* ========================================================================= */}
      <div className="hidden print:block w-full text-slate-900 font-sans p-0 m-0 bg-white">
        
        {/* Official Header Banner */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TaazaaLogo variant="print" className="h-8 w-auto" />
              <div className="border-l border-slate-300 pl-4">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  TAAZAA INC.
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Employee Relations & Performance Governance Council
                </p>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-600 space-y-0.5">
              <div><strong>DOC REF:</strong> {role.id.toUpperCase()}</div>
              <div><strong>VERSION:</strong> {activeVersion?.name || activeVersion?.versionNumber || portalData.version}</div>
              <div><strong>EFFECTIVE:</strong> {activeVersion?.effectiveDate || '2026-08'}</div>
              <div><strong>PRINTED:</strong> {new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>

          {/* Role Title Banner */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-start justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                PRACTICE PILLAR: {department.name.toUpperCase()}
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                {role.title}
              </h2>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-3 py-1 border-2 border-slate-900 font-black text-xs uppercase">
                {role.level}
              </span>
              <div className="text-xs font-bold text-slate-700">
                Experience Requirement: {role.experienceYears}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Core Mission & Summary */}
        <div className="mb-6 print-avoid-break">
          <h3 className="text-xs font-extrabold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 mb-3 text-slate-900">
            1. Role Purpose & Core Mission
          </h3>
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 mb-3">
            <p className="text-sm font-semibold italic text-slate-900 leading-relaxed">
              "{role.mission}"
            </p>
          </div>
          {role.summary && (
            <p className="text-xs text-slate-700 leading-relaxed">
              {role.summary}
            </p>
          )}
        </div>

        {/* Section 2: Core Accountabilities */}
        <div className="mb-6 print-avoid-break">
          <h3 className="text-xs font-extrabold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 mb-3 text-slate-900">
            2. Core Accountabilities & Outcome Ownership
          </h3>
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-200">
            {role.accountabilities?.map((acc, idx) => (
              <div key={idx} className="p-3 flex items-start gap-3 text-xs leading-relaxed">
                <span className="font-mono font-bold text-slate-900 w-6">[{idx + 1}]</span>
                <span className="font-semibold text-slate-800">{acc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Day-to-Day Responsibilities */}
        <div className="mb-6 print-avoid-break">
          <h3 className="text-xs font-extrabold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 mb-3 text-slate-900">
            3. Operational & Tactical Responsibilities
          </h3>
          <ul className="grid grid-cols-1 gap-2 pl-2">
            {role.responsibilities?.map((res, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span>{res}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Measurable OKRs & Benchmarks Table */}
        <div className="mb-6 print-avoid-break">
          <h3 className="text-xs font-extrabold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 mb-3 text-slate-900">
            4. Measurable OKRs & Performance Evaluation Benchmarks
          </h3>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2.5 border-r border-slate-300">Outcome Area</th>
                <th className="p-2.5 border-r border-slate-300">Metric Description</th>
                <th className="p-2.5 border-r border-slate-300">Target Benchmark</th>
                <th className="p-2.5 border-r border-slate-300">Frequency</th>
                <th className="p-2.5">Data Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {role.metricsAndOkrs?.map((okr, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 font-bold border-r border-slate-200">{okr.outcomeArea}</td>
                  <td className="p-2.5 border-r border-slate-200">{okr.metric}</td>
                  <td className="p-2.5 font-bold border-r border-slate-200">{okr.target}</td>
                  <td className="p-2.5 border-r border-slate-200">{okr.frequency || 'Quarterly'}</td>
                  <td className="p-2.5 text-slate-600">{okr.sourceData || 'Jira / Audit'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 5: Competencies Matrix */}
        <div className="mb-6 print-avoid-break">
          <h3 className="text-xs font-extrabold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 mb-3 text-slate-900">
            5. Required Competency Matrix
          </h3>
          <div className="grid grid-cols-2 gap-4">
            
            <div className="border border-slate-200 rounded-lg p-3">
              <h4 className="text-[11px] font-bold uppercase text-slate-900 border-b border-slate-200 pb-1.5 mb-2">
                Technical & Domain Capabilities
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {role.competencies?.technical?.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-slate-200 rounded-lg p-3">
              <h4 className="text-[11px] font-bold uppercase text-slate-900 border-b border-slate-200 pb-1.5 mb-2">
                Behavioral Traits & Organizational Values
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {role.competencies?.behavioral?.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Section 6: Career Growth Ladder */}
        <div className="mb-8 print-avoid-break">
          <h3 className="text-xs font-extrabold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 mb-3 text-slate-900">
            6. Career Trajectory & Feeder Roles
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-500 uppercase text-[10px] mb-1">Feeder / Prerequisite Roles</div>
              <div className="font-semibold text-slate-800">
                {role.careerPath?.previousRoles?.map((r) => r.title).join(', ') || 'Direct Hire / Lateral Industry Entry'}
              </div>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-500 uppercase text-[10px] mb-1">Target Elevation Ladder</div>
              <div className="font-semibold text-slate-800">
                {role.careerPath?.nextRoles?.map((r) => r.title).join(', ') || 'Practice Directorship / Executive Leadership'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: Formal Review & Appraisal Sign-Off Box */}
        <div className="border-2 border-slate-900 rounded-lg p-4 print-avoid-break mt-6">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-300">
            7. Official Appraisal Alignment & Acknowledgment
          </div>
          <div className="grid grid-cols-3 gap-6 text-xs text-slate-800 pt-2">
            <div>
              <div className="font-bold mb-8">Employee Name & Signature:</div>
              <div className="border-b border-slate-400 w-full mb-1" />
              <div className="text-[10px] text-slate-500">Date: _______________</div>
            </div>

            <div>
              <div className="font-bold mb-8">Practice Lead / Manager Signature:</div>
              <div className="border-b border-slate-400 w-full mb-1" />
              <div className="text-[10px] text-slate-500">Date: _______________</div>
            </div>

            <div>
              <div className="font-bold mb-8">Employee Relations / HR Sign-off:</div>
              <div className="border-b border-slate-400 w-full mb-1" />
              <div className="text-[10px] text-slate-500">Date: _______________</div>
            </div>
          </div>
        </div>

        {/* Print Footer */}
        <div className="text-center text-[10px] text-slate-400 mt-8 pt-4 border-t border-slate-200 font-mono">
          CONFIDENTIAL • TAAZAA INC. • INTERNAL ORGANIZATIONAL USE ONLY • GENERATED VIA TAAZAA KRA PORTAL
        </div>

      </div>
    </>
  );
};
