import React from 'react';
import { RoleCharter, Department } from '../../types';
import { useKRA } from '../../context/KRAContext';
import { 
  GitCompare, 
  Target, 
  Clock, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleCardProps {
  role: RoleCharter;
  department: Department;
  onSelect: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, department, onSelect }) => {
  const { comparisonRoles, toggleCompareRole } = useKRA();

  const isCompared = comparisonRoles.some((r) => r.id === role.id);

  // Level Badge Color Mapper with Taazaa styling
  const getLevelBadge = (level: string) => {
    if (level.includes('L1') || level.includes('Associate')) {
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800';
    }
    if (level.includes('L2') || level.includes('Mid')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-[#29E8AE] dark:border-emerald-800';
    }
    if (level.includes('L3') || level.includes('Senior')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800';
    }
    if (level.includes('L4') || level.includes('Lead')) {
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
    }
    if (level.includes('L5') || level.includes('Principal') || level.includes('Architect')) {
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    }
    if (level.includes('L6') || level.includes('Director')) {
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-navy-900 dark:text-slate-300 dark:border-slate-700';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] } }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-navy-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-[#FF5B22]/5 hover:border-[#FF5B22]/60 dark:hover:border-[#FF5B22]/60 transition-all select-none"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/10 text-[#FF5B22] border border-[#FF5B22]/20">
            {department.name}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getLevelBadge(role.level)}`}>
            {role.level}
          </span>
        </div>

        {/* Role Title & Experience */}
        <div className="mb-3">
          <h3 
            onClick={onSelect}
            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#FF5B22] dark:group-hover:text-[#FF5B22] cursor-pointer transition-colors leading-snug tracking-tight"
          >
            {role.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            <Clock className="w-3.5 h-3.5 text-[#FF5B22]" />
            <span>Experience: {role.experienceYears}</span>
          </div>
        </div>

        {/* Mission Statement */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4 font-normal">
          {role.mission}
        </p>

        {/* Core Accountabilities */}
        {role.accountabilities && role.accountabilities.length > 0 && (
          <div className="space-y-1.5 mb-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Core Accountabilities
            </div>
            {role.accountabilities.slice(0, 2).map((acc, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#29E8AE] flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1 font-medium">{acc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer & Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
        
        {/* OKRs count */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Target className="w-3.5 h-3.5 text-[#FF5B22]" />
          <span>{role.metricsAndOkrs?.length || 0} Key OKRs</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Compare Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompareRole(role);
            }}
            title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all active:scale-[0.92] ${
              isCompared
                ? 'bg-[#FF5B22] text-white border-[#FF5B22] shadow-sm'
                : 'bg-slate-50 dark:bg-navy-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#FF5B22]/50'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>

          {/* View Details */}
          <button
            onClick={onSelect}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#FF5B22] dark:text-[#FF7A45] text-xs font-bold border border-[#FF5B22]/30 transition-colors active:scale-[0.96]"
          >
            <span>View KRA</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};
