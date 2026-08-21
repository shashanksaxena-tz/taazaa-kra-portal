import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { 
  Code2, 
  ShieldCheck, 
  Palette, 
  Layers, 
  Kanban, 
  LayoutGrid,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Code2,
  ShieldCheck,
  Palette,
  Layers,
  Kanban,
};

export const DepartmentTabs: React.FC = () => {
  const {
    portalData,
    activeDepartmentId,
    setActiveDepartmentId,
    searchQuery,
    selectedLevel,
  } = useKRA();

  const filterRole = (r: any) => {
    if (selectedLevel !== 'all' && r.level !== selectedLevel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchMission = r.mission?.toLowerCase().includes(q);
      const matchAccountabilities = r.accountabilities?.some((a: string) => a.toLowerCase().includes(q));
      const matchResponsibilities = r.responsibilities?.some((res: string) => res.toLowerCase().includes(q));
      const matchMetrics = r.metricsAndOkrs?.some((m: any) => 
        m.metric?.toLowerCase().includes(q) || m.outcomeArea?.toLowerCase().includes(q)
      );
      if (!matchTitle && !matchMission && !matchAccountabilities && !matchResponsibilities && !matchMetrics) {
        return false;
      }
    }
    return true;
  };

  const getFilteredCount = (deptId: string) => {
    if (deptId === 'all') {
      return portalData.departments.reduce(
        (acc, d) => acc + d.roles.filter(filterRole).length,
        0
      );
    }
    const dept = portalData.departments.find((d) => d.id === deptId);
    return dept ? dept.roles.filter(filterRole).length : 0;
  };

  const totalFilteredCount = getFilteredCount('all');

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 mt-10 mb-8">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore by Solution Area
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select a practice area or browse all {totalFilteredCount} matching roles
          </p>
        </div>
      </div>

      {/* Responsive Filter Grid (Zero orange) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 select-none">
        
        {/* All Departments Option */}
        <button
          onClick={() => setActiveDepartmentId('all')}
          className={`flex items-center justify-between p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-[0.96] text-left border ${
            activeDepartmentId === 'all'
              ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20'
              : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutGrid className={`w-4 h-4 ${activeDepartmentId === 'all' ? 'text-white' : 'text-brand-500'}`} />
            <span>All Areas</span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
              activeDepartmentId === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {totalFilteredCount}
          </span>
        </button>

        {/* Individual Department Pillars */}
        {portalData.departments.map((dept, index) => {
          const IconComponent = iconMap[dept.icon] || Layers;
          const isSelected = activeDepartmentId === dept.id;
          const count = getFilteredCount(dept.id);
          const numStr = `0${index + 1}`;

          return (
            <button
              key={dept.id}
              onClick={() => setActiveDepartmentId(dept.id)}
              className={`flex items-center justify-between p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-[0.96] text-left border ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20'
                  : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {numStr}
                </span>
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-brand-500'}`} />
                <span className="truncate">{dept.name.split(' ')[0]}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
