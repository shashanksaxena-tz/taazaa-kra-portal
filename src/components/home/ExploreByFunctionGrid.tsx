import React from 'react';
import { Code2, ShieldCheck, PenTool, ClipboardList, Flag, Layers } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';

const DEPARTMENT_STYLE: Record<string, { icon: typeof Code2; bg: string; fg: string }> = {
  engineering: { icon: Code2, bg: 'bg-emerald-100 dark:bg-emerald-950/60', fg: 'text-emerald-600 dark:text-emerald-400' },
  qa: { icon: ShieldCheck, bg: 'bg-blue-100 dark:bg-blue-950/60', fg: 'text-blue-600 dark:text-blue-400' },
  design: { icon: PenTool, bg: 'bg-purple-100 dark:bg-purple-950/60', fg: 'text-purple-600 dark:text-purple-400' },
  product: { icon: ClipboardList, bg: 'bg-amber-100 dark:bg-amber-950/60', fg: 'text-amber-600 dark:text-amber-400' },
  'program-management': { icon: Flag, bg: 'bg-slate-200 dark:bg-slate-800', fg: 'text-slate-700 dark:text-slate-300' },
};

const FALLBACK_STYLE = { icon: Layers, bg: 'bg-indigo-100 dark:bg-indigo-950/60', fg: 'text-indigo-600 dark:text-indigo-400' };

export const ExploreByFunctionGrid: React.FC = () => {
  const { portalData, setActiveDepartmentId, setActiveTab } = useKRA();

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Explore by Function</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {portalData.departments.map((dept) => {
          const style = DEPARTMENT_STYLE[dept.id] ?? FALLBACK_STYLE;
          const Icon = style.icon;
          return (
            <button
              key={dept.id}
              onClick={() => { setActiveDepartmentId(dept.id); setActiveTab('roles', 'charters'); }}
              className="p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-brand-500/40 hover:shadow-sm transition-all flex flex-col items-center gap-3 text-center"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${style.bg} ${style.fg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{dept.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
