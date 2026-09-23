import React from 'react';
import { HeroPanel } from './HeroPanel';
import { StatsRow } from './StatsRow';
import { QuickActionsRow } from './QuickActionsRow';
import { ExploreByFunctionGrid } from './ExploreByFunctionGrid';
import { RolePreviewPanel } from './RolePreviewPanel';
import { WhatsNewPanel } from './WhatsNewPanel';
import type { RoleCharter } from '../../types';

interface HomePageProps {
  onSelectRole: (role: RoleCharter) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectRole }) => {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HeroPanel />
        </div>
        <div>
          <WhatsNewPanel />
        </div>
      </div>

      <StatsRow />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        <div>
          <QuickActionsRow />
          <ExploreByFunctionGrid />
        </div>
        <div>
          <RolePreviewPanel onSelectRole={onSelectRole} />
        </div>
      </div>
    </div>
  );
};
