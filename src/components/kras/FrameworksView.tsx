import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { BookOpen } from 'lucide-react';

export const FrameworksView: React.FC = () => {
  const { portalData } = useKRA();

  const allFrameworks = portalData.departments.flatMap((d) =>
    (d.frameworks || []).map((f) => ({ ...f, departmentName: d.name }))
  );

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="heading-label-line" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            ORGANIZATIONAL ARCHITECTURE & FRAMEWORKS
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Department Frameworks & Competency Models
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Methodological blueprints, career progression rubrics, and engineering governance documents powering Taazaa's practices.
        </p>
      </div>

      {/* Frameworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allFrameworks.map((fw, idx) => (
          <div
            key={idx}
            className="p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:shadow-lg hover:border-brand-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-3 inline-block">
                {fw.departmentName}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                {fw.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                {fw.summary}
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800 truncate">
              Ref: {fw.source}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
