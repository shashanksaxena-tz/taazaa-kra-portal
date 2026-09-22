import React from 'react';

/** Key format: `${SectionId}.${subTabId}`. Absent key => caller renders EmptyState. */
export const SECTION_REGISTRY: Record<string, React.ComponentType> = {};
