import React from 'react';
import { Users, Layers, Target, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';
import { computePortalStats } from '../../utils/portalStats';

export const StatsRow: React.FC = () => {
  const { portalData, setActiveTab } = useKRA();
  const stats = computePortalStats(portalData);

  const cards = [
    {
      icon: Users,
      value: stats.roleCount,
      label: 'Roles Defined',
      linkLabel: 'Explore Roles',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
      linkColor: 'text-indigo-600 dark:text-indigo-400',
      onClick: () => setActiveTab('roles', 'charters'),
    },
    {
      icon: Layers,
      value: stats.levelCount,
      label: 'Career Levels',
      linkLabel: 'View Career Paths',
      iconBg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
      linkColor: 'text-blue-600 dark:text-blue-400',
      onClick: () => setActiveTab('career', 'levels'),
    },
    {
      icon: Target,
      value: `${stats.percentRolesWithKras}%`,
      label: 'Roles with Defined KRAs',
      linkLabel: 'View KRAs',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
      linkColor: 'text-purple-600 dark:text-purple-400',
      onClick: () => setActiveTab('performance', 'kra-kpi'),
    },
    {
      icon: CheckCircle2,
      value: `${stats.percentRolesWithResponsibilities}%`,
      label: 'Roles with Documented Responsibilities',
      linkLabel: 'View Responsibilities',
      iconBg: 'bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400',
      linkColor: 'text-teal-600 dark:text-teal-400',
      onClick: () => setActiveTab('roles', 'responsibilities'),
    },
    {
      icon: TrendingUp,
      value: stats.departmentCount,
      label: 'Solution Areas',
      linkLabel: 'Explore Areas',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      linkColor: 'text-emerald-600 dark:text-emerald-400',
      onClick: () => setActiveTab('roles', 'charters'),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
      {cards.map(({ icon: Icon, value, label, linkLabel, iconBg, linkColor, onClick }) => (
        <div
          key={label}
          className="text-left p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3 leading-snug">{label}</div>
          <button
            onClick={onClick}
            className={`inline-flex items-center gap-1 text-xs font-semibold ${linkColor} hover:underline`}
          >
            {linkLabel} <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
