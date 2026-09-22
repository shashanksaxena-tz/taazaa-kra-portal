import React from 'react';
import { UserSearch, TrendingUp, Compass } from 'lucide-react';
import { useKRA } from '../../context/KRAContext';

export const QuickActionsRow: React.FC = () => {
  const { setActiveTab } = useKRA();
  const actions = [
    { icon: UserSearch, title: 'Find My Role', description: 'Understand your responsibilities, expectations and success measures.', onClick: () => setActiveTab('roles', 'charters') },
    { icon: TrendingUp, title: 'Understand My Performance', description: 'See KRAs, KPIs, targets and performance standards.', onClick: () => setActiveTab('performance', 'kra-kpi') },
    { icon: Compass, title: 'Explore My Career', description: 'Discover career levels, competencies and growth opportunities.', onClick: () => setActiveTab('career', 'levels') },
  ];

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">I want to...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map(({ icon: Icon, title, description, onClick }) => (
          <button
            key={title}
            onClick={onClick}
            className="text-left p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 transition-colors"
          >
            <Icon className="w-5 h-5 text-brand-500 mb-3" />
            <div className="font-bold text-slate-900 dark:text-white">{title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
