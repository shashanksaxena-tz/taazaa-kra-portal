import React from 'react';
import { UserSearch, TrendingUp, Compass, ArrowRight } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';

export const QuickActionsRow: React.FC = () => {
  const { setActiveTab } = useKRA();
  const actions = [
    {
      icon: UserSearch,
      title: 'Find My Role',
      description: 'Understand your responsibilities, expectations and success measures.',
      cardBg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40',
      iconBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
      arrowColor: 'text-emerald-600 dark:text-emerald-400',
      onClick: () => setActiveTab('roles', 'charters'),
    },
    {
      icon: TrendingUp,
      title: 'Understand My Performance',
      description: 'See KRAs, KPIs, targets and performance standards.',
      cardBg: 'bg-sky-50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/40',
      iconBg: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
      arrowColor: 'text-sky-600 dark:text-sky-400',
      onClick: () => setActiveTab('performance', 'kra-kpi'),
    },
    {
      icon: Compass,
      title: 'Explore My Career',
      description: 'Discover career levels, competencies and growth opportunities.',
      cardBg: 'bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40',
      iconBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
      arrowColor: 'text-purple-600 dark:text-purple-400',
      onClick: () => setActiveTab('career', 'levels'),
    },
  ];

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">I want to...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map(({ icon: Icon, title, description, cardBg, iconBg, arrowColor, onClick }) => (
          <button
            key={title}
            onClick={onClick}
            className={`relative text-left p-6 rounded-2xl border ${cardBg} hover:shadow-sm transition-shadow`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white pr-6">{title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed pr-2">{description}</div>
            <ArrowRight className={`absolute bottom-6 right-6 w-4 h-4 ${arrowColor}`} />
          </button>
        ))}
      </div>
    </div>
  );
};
