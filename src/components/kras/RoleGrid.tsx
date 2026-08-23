import React from 'react';
import { useKRA } from '../../context/KRAContext';
import { RoleCard } from './RoleCard';
import { RoleCharter } from '../../types';
import { SearchX, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoleGridProps {
  onSelectRole: (role: RoleCharter) => void;
}

export const RoleGrid: React.FC<RoleGridProps> = ({ onSelectRole }) => {
  const {
    portalData,
    activeDepartmentId,
    searchQuery,
    selectedLevel,
    setSearchQuery,
    setSelectedLevel,
    setActiveDepartmentId
  } = useKRA();

  // Filter logic
  const allRolesWithDept = portalData.departments.flatMap((dept) =>
    dept.roles.map((r) => ({ ...r, departmentObj: dept }))
  );

  const filteredRoles = allRolesWithDept.filter((item) => {
    // 1. Department filter
    if (activeDepartmentId !== 'all' && item.departmentId !== activeDepartmentId) {
      return false;
    }

    // 2. Level filter
    if (selectedLevel !== 'all' && item.level !== selectedLevel) {
      return false;
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchMission = item.mission?.toLowerCase().includes(q);
      const matchDept = item.departmentObj.name.toLowerCase().includes(q);
      const matchAccountabilities = item.accountabilities?.some((a) => a.toLowerCase().includes(q));
      const matchResponsibilities = item.responsibilities?.some((r) => r.toLowerCase().includes(q));
      const matchCompetencies = [
        ...(item.competencies?.behavioral || []),
        ...(item.competencies?.technical || []),
        ...(item.competencies?.domain || []),
      ].some((c) => c.toLowerCase().includes(q));
      const matchMetrics = item.metricsAndOkrs?.some(
        (m) => m.metric?.toLowerCase().includes(q) || m.outcomeArea?.toLowerCase().includes(q)
      );

      if (
        !matchTitle &&
        !matchMission &&
        !matchDept &&
        !matchAccountabilities &&
        !matchResponsibilities &&
        !matchCompetencies &&
        !matchMetrics
      ) {
        return false;
      }
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('all');
    setActiveDepartmentId('all');
  };

  const activeDeptObj = portalData.departments.find((d) => d.id === activeDepartmentId);

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 pb-20">
      {/* Grid Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <span>{activeDeptObj ? activeDeptObj.name : 'All Taazaa Role Charters'}</span>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {filteredRoles.length} Available
            </span>
          </h2>
          {activeDeptObj && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              {activeDeptObj.description}
            </p>
          )}
        </div>

        {(searchQuery || selectedLevel !== 'all' || activeDepartmentId !== 'all') && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-colors shadow-sm active:scale-[0.96]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Roles Cards Grid (4 Columns on Widescreen) */}
      {filteredRoles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredRoles.map((item) => (
              <RoleCard
                key={item.id}
                role={item}
                department={item.departmentObj}
                onSelect={() => onSelectRole(item)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm my-8"
        >
          <div className="p-4 rounded-3xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 mb-4">
            <SearchX className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No matching role charters found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
            We couldn't find any roles matching your current search query "{searchQuery}" or selected level filter.
          </p>
          <button
            onClick={resetFilters}
            className="btn-primary"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Filters & Show All</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
