import { describe, it, expect } from 'vitest';
import { NAVIGATION } from '../../config/navigation';
import { SECTION_REGISTRY } from './registry';

describe('SECTION_REGISTRY / NAVIGATION consistency', () => {
  it('every registered key corresponds to a real section.subTab pair', () => {
    const validKeys = new Set(
      NAVIGATION.flatMap((section) => section.subTabs.map((subTab) => `${section.id}.${subTab.id}`))
    );
    for (const key of Object.keys(SECTION_REGISTRY)) {
      expect(validKeys.has(key)).toBe(true);
    }
  });

  it('every sub-tab either has a registered component or a non-empty emptyDescription, so App.tsx never renders a title-only EmptyState', () => {
    for (const section of NAVIGATION) {
      for (const subTab of section.subTabs) {
        const key = `${section.id}.${subTab.id}`;
        const isRolesCharters = key === 'roles.charters'; // composed inline in App.tsx, not in the registry
        const hasComponent = key in SECTION_REGISTRY;
        const hasEmptyDescription = subTab.emptyDescription.trim().length > 0;
        expect(isRolesCharters || hasComponent || hasEmptyDescription).toBe(true);
      }
    }
  });

  it('no sub-tab has both a registered component and a non-empty emptyDescription (the description would never be shown, signalling dead config)', () => {
    for (const section of NAVIGATION) {
      for (const subTab of section.subTabs) {
        const key = `${section.id}.${subTab.id}`;
        const hasComponent = key in SECTION_REGISTRY;
        const hasEmptyDescription = subTab.emptyDescription.trim().length > 0;
        expect(hasComponent && hasEmptyDescription).toBe(false);
      }
    }
  });
});
