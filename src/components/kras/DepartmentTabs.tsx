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
import { motion } from 'framer-motion';

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        
        {/* All Departments Tab */}
        <button
          onClick={() => setActiveDepartmentId('all')}
          className={`relative flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-[0.96] ${
            activeDepartmentId === 'all'
              ? 'text-white'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          {activeDepartmentId === 'all' && (
            <motion.div
              layoutId="activeDepartmentPill"
              className="absolute inset-0 bg-slate-900 dark:bg-orange-600 rounded-2xl shadow-md -z-10"
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            />
          )}
          <LayoutGrid className="w-4 h-4" />
          <span>All Departments</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeDepartmentId === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {totalFilteredCount}
          </span>
        </button>

        {/* Individual Department Tabs */}
        {portalData.departments.map((dept) => {
          const IconComponent = iconMap[dept.icon] || Layers;
          const isSelected = activeDepartmentId === dept.id;
          const count = getFilteredCount(dept.id);

          return (
            <button
              key={dept.id}
              onClick={() => setActiveDepartmentId(dept.id)}
              className={`relative flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-[0.96] ${
                isSelected
                  ? 'text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeDepartmentPill"
                  className="absolute inset-0 bg-orange-500 rounded-2xl shadow-md shadow-orange-500/25 -z-10"
                  transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                />
              )}
              <IconComponent className="w-4 h-4" />
              <span>{dept.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
