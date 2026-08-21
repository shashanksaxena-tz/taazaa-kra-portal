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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore by Solution Area
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a practice area or browse all {totalFilteredCount} matching roles
          </p>
        </div>
      </div>

      {/* Responsive Filter Grid (Wraps cleanly, NO horizontal scroll cutoffs!) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 select-none">
        
        {/* All Departments Option */}
        <button
          onClick={() => setActiveDepartmentId('all')}
          className={`flex flex-col sm:flex-row items-center sm:items-center justify-between p-3 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-[0.96] text-left border ${
            activeDepartmentId === 'all'
              ? 'bg-[#FF5B22] text-white border-[#FF5B22] shadow-md shadow-[#FF5B22]/20'
              : 'bg-white dark:bg-[#0D1136] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <LayoutGrid className={`w-4 h-4 ${activeDepartmentId === 'all' ? 'text-white' : 'text-[#FF5B22]'}`} />
            <span>All Areas</span>
          </div>
          <span
            className={`mt-1 sm:mt-0 px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeDepartmentId === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
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
              className={`flex flex-col sm:flex-row items-center sm:items-center justify-between p-3 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-[0.96] text-left border ${
                isSelected
                  ? 'bg-[#FF5B22] text-white border-[#FF5B22] shadow-md shadow-[#FF5B22]/20'
                  : 'bg-white dark:bg-[#0D1136] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {numStr}
                </span>
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#FF5B22]'}`} />
                <span className="truncate">{dept.name.split(' ')[0]}</span>
              </div>
              <span
                className={`mt-1 sm:mt-0 px-2 py-0.5 rounded-full text-[11px] font-black ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
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
