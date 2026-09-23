import React, { useState } from 'react';
import { RoleCharter, Department } from '../../types';
import { useKRA } from '../../context/KRAContext';
import {
  GitCompare,
  Printer,
  Edit3,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { TaazaaLogo } from '../ui/TaazaaLogo';

interface RoleDetailPageProps {
  role: RoleCharter;
  department: Department;
  onClose: () => void;
  onOpenAdminEdit?: (role: RoleCharter) => void;
}

export const RoleDetailPage: React.FC<RoleDetailPageProps> = ({
  role,
  department,
  onClose,
  onOpenAdminEdit,
}) => {
  const { comparisonRoles, toggleCompareRole, adminSession, portalData, activeVersion } = useKRA();

  const hasAccountabilities = role.accountabilities.length > 0;
  const hasResponsibilities = role.responsibilities.length > 0;
  const hasKras = role.metricsAndKras.length > 0;
  const hasCompetencies =
    (role.competencies?.behavioral?.length || 0) +
      (role.competencies?.technical?.length || 0) +
      (role.competencies?.domain?.length || 0) >
    0;

  const tabs = [
    { id: 'overview', label: 'Overview', has: hasAccountabilities || hasKras },
    { id: 'responsibilities', label: 'Responsibilities', has: hasResponsibilities },
    { id: 'kras', label: 'KRA & KPI', has: hasKras },
    { id: 'competencies', label: 'Competencies', has: hasCompetencies },
  ].filter((t) => t.has);

  const [activeSubTab, setActiveSubTab] = useState<string>(tabs[0]?.id ?? 'overview');

  const isCompared = comparisonRoles.some((r) => r.id === role.id);

  const infoChips = [
    { label: 'Function', value: department.name },
    { label: 'Experience', value: role.experienceYears },
  ].filter((c) => c.value);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. SCREEN VIEW: In-page Role Charter (Hidden when printing) */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 py-8 sm:py-10 print:hidden">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm p-6 sm:p-8">

          {/* Breadcrumb (back to Roles) */}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-4"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="font-semibold">Roles</span>
            <span className="mx-1">›</span>
            <span>{role.title}</span>
          </button>

          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {role.title}
              </h1>
              {role.level && (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300">
                  {role.level}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {adminSession.isAuthenticated && onOpenAdminEdit && (
                <button
                  onClick={() => onOpenAdminEdit(role)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.96]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit Charter</span>
                </button>
              )}
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
              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-[0.94]"
                title="Print or Export as PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          {(role.mission || role.summary) && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed max-w-3xl">
              {role.mission || role.summary}
            </p>
          )}

          {/* Info chips (real fields only) */}
          {infoChips.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {infoChips.map((chip) => (
                <div key={chip.label} className="flex flex-col gap-0.5 px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 min-w-[110px]">
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">{chip.label}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{chip.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          {tabs.length > 0 && (
            <div className="flex items-center gap-6 mt-6 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    activeSubTab === tab.id
                      ? 'text-brand-600 dark:text-brand-400 border-brand-500'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Tab content */}
          <div className="pt-6">
            {tabs.length === 0 && (
              <p className="text-sm text-slate-400">No documented content available for this role yet.</p>
            )}

            {activeSubTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {hasAccountabilities && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">What You Own</h3>
                    <ul className="space-y-2">
                      {role.accountabilities.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2">
                          <span className="text-brand-500 mt-0.5">•</span> <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {hasKras && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">How Success is Measured (KRA &amp; KPI)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs min-w-[420px]">
                        <thead>
                          <tr className="text-left text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <th className="pb-2 pr-3 font-semibold">KRA</th>
                            <th className="pb-2 pr-3 font-semibold">KPI</th>
                            <th className="pb-2 pr-3 font-semibold">Weight</th>
                            <th className="pb-2 font-semibold">Target</th>
                          </tr>
                        </thead>
                        <tbody>
                          {role.metricsAndKras.map((m, i) => (
                            <tr key={i} className="border-b border-slate-50 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 align-top">
                              <td className="py-2.5 pr-3">{m.outcomeArea}</td>
                              <td className="py-2.5 pr-3">{m.metric}</td>
                              <td className="py-2.5 pr-3">{m.weight || '—'}</td>
                              <td className="py-2.5 font-semibold text-slate-900 dark:text-white">{m.target || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'responsibilities' && (
              <div className="space-y-2.5">
                {role.responsibilities.map((res, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
                  >
                    <ChevronRight className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-normal">{res}</p>
                  </div>
                ))}
              </div>
            )}

            {activeSubTab === 'kras' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-4">Outcome Area</th>
                      <th className="p-4">Key Metric</th>
                      <th className="p-4">Weight</th>
                      <th className="p-4">Target Benchmark</th>
                      <th className="p-4">Cadence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {role.metricsAndKras.map((kra, index) => (
                      <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{kra.outcomeArea}</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">{kra.metric}</td>
                        <td className="p-4 text-slate-500 font-mono text-xs">{kra.weight || '—'}</td>
                        <td className="p-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                            {kra.target || '—'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-xs">{kra.frequency || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeSubTab === 'competencies' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                    <span>Technical &amp; Domain Skills</span>
                  </h4>
                  <div className="space-y-2">
                    {role.competencies?.technical?.map((t, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Values &amp; Behavioral Traits</span>
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
            )}
          </div>
        </div>
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
              {role.mission ? `"${role.mission}"` : 'No mission statement documented for this role yet.'}
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

        {/* Section 4: Measurable KRAs & Benchmarks Table */}
        <div className="mb-6 print-avoid-break">
          <h3 className="text-xs font-extrabold uppercase tracking-wider bg-slate-100 p-2 border-l-4 border-slate-900 mb-3 text-slate-900">
            4. Measurable KRAs & Performance Evaluation Benchmarks
          </h3>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="p-2.5 border-r border-slate-300">Outcome Area</th>
                <th className="p-2.5 border-r border-slate-300">Metric Description</th>
                <th className="p-2.5 border-r border-slate-300">Weight</th>
                <th className="p-2.5 border-r border-slate-300">Target Benchmark</th>
                <th className="p-2.5 border-r border-slate-300">Frequency</th>
                <th className="p-2.5">Data Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {role.metricsAndKras?.map((kra, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 font-bold border-r border-slate-200">{kra.outcomeArea}</td>
                  <td className="p-2.5 border-r border-slate-200">{kra.metric}</td>
                  <td className="p-2.5 border-r border-slate-200">{kra.weight || '—'}</td>
                  <td className="p-2.5 font-bold border-r border-slate-200">{kra.target || '—'}</td>
                  <td className="p-2.5 border-r border-slate-200">{kra.frequency || '—'}</td>
                  <td className="p-2.5 text-slate-600">{kra.sourceData || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 5: Competencies Matrix */}
        <div className="mb-8 print-avoid-break">
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

        {/* Section 6: Formal Review & Appraisal Sign-Off Box */}
        <div className="border-2 border-slate-900 rounded-lg p-4 print-avoid-break mt-6">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-300">
            6. Official Appraisal Alignment & Acknowledgment
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
