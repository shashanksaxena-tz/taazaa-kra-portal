import React from 'react';
import { RoleCharter, Department } from '../../types';
import { useKRA } from '../../context/KRAContext';
import { 
  GitCompare, 
  Target, 
  Clock, 
  ArrowRight, 
  CheckCircle2
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-brand-500/60 dark:hover:border-brand-500/60 transition-all select-none text-left"
    >
      <div>
        {/* Top Header: Department Pill & Level Tag */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {department.name}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            {role.level}
          </span>
        </div>

        {/* Role Title */}
        <div className="mb-3">
          <h3 
            onClick={onSelect}
            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 cursor-pointer transition-colors leading-snug tracking-tight"
          >
            {role.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span>Experience: {role.experienceYears}</span>
          </div>
        </div>

        {/* Mission Statement */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4 font-normal">
          {role.mission}
        </p>

        {/* Core Accountabilities Preview */}
        {role.accountabilities && role.accountabilities.length > 0 && (
          <div className="space-y-1.5 mb-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Core Accountabilities
            </div>
            {role.accountabilities.slice(0, 2).map((acc, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 leading-tight">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{acc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        
        {/* Metric Badges */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Target className="w-3.5 h-3.5 text-brand-500" />
          <span>{role.metricsAndOkrs?.length || 0} OKRs</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Quick Compare Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompareRole(role);
            }}
            title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
            className={`p-2 rounded-xl text-xs font-bold transition-all active:scale-[0.92] ${
              isCompared
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-500/50'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>

          {/* View Details Button */}
          <button
            onClick={onSelect}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all hover:bg-brand-600 dark:hover:bg-brand-600 dark:hover:text-white active:scale-[0.96]"
          >
            <span>View KRA</span>
            <ArrowRight className="w-3 h-3" />
          </button>

        </div>
      </div>
    </motion.div>
  );
};
