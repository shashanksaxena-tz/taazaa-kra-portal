import React from 'react';
import { HeroPanel } from './HeroPanel';
import { StatsRow } from './StatsRow';
import { QuickActionsRow } from './QuickActionsRow';
import { ExploreByFunctionGrid } from './ExploreByFunctionGrid';
import { RolePreviewPanel } from './RolePreviewPanel';
import { useKRA } from '../../context/KRAContext';
import type { RoleCharter } from '../../types';

interface HomePageProps {
  onSelectRole: (role: RoleCharter) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectRole }) => {
  const { portalData } = useKRA();

  return (
    <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HeroPanel />
          <StatsRow />
          <QuickActionsRow />
          <ExploreByFunctionGrid />
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-3">
            v{portalData.version} · Last updated {portalData.lastUpdated}
          </div>
          <RolePreviewPanel onSelectRole={onSelectRole} />
        </div>
      </div>
    </div>
  );
};
