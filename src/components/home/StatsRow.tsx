import React from 'react';
import { Users, Layers, Target, Building2 } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';
import { computePortalStats } from '../../utils/portalStats';

export const StatsRow: React.FC = () => {
  const { portalData, setActiveTab } = useKRA();
  const stats = computePortalStats(portalData);

  const cards = [
    { icon: Users, value: stats.roleCount, label: 'Roles Defined', onClick: () => setActiveTab('roles', 'charters') },
    { icon: Layers, value: stats.levelCount, label: 'Career Levels', onClick: () => setActiveTab('career', 'levels') },
    { icon: Target, value: `${stats.percentRolesWithKras}%`, label: 'Roles with Defined KRAs', onClick: () => setActiveTab('performance', 'kra-kpi') },
    { icon: Building2, value: stats.departmentCount, label: 'Practice Areas', onClick: () => setActiveTab('roles', 'charters') },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
      {cards.map(({ icon: Icon, value, label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="text-left p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 transition-colors"
        >
          <Icon className="w-5 h-5 text-brand-500 mb-3" />
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
        </button>
      ))}
    </div>
  );
};
