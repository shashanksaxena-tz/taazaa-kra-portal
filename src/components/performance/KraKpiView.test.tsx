import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KraKpiView } from './KraKpiView';
import { useKRA } from '../../context/KRAContext';
import type { PortalData } from '../../types';

vi.mock('../../context/KRAContext', () => ({
  useKRA: vi.fn(),
}));

const mockedUseKRA = vi.mocked(useKRA);

const portalData = {
  version: 'v1.0',
  departments: [
    {
      id: 'eng',
      name: 'Engineering',
      roles: [
        {
          id: 'role-sse',
          title: 'Senior Software Engineer (SSE)',
          metricsAndKras: [
            { outcomeArea: 'Quality', metric: 'Escaped defects', weight: '', target: '', sourceData: '', frequency: '' },
          ],
        },
      ],
    },
  ],
  raciMatrix: [],
} as unknown as PortalData;

describe('KraKpiView', () => {
  it('shows a dash instead of a blank cell for undocumented target/source/frequency fields', () => {
    mockedUseKRA.mockReturnValue({ portalData } as never);
    render(<KraKpiView />);
    const row = screen.getByText('Escaped defects').closest('tr')!;
    const cells = [...row.querySelectorAll('td')].map((td) => td.textContent);
    expect(cells).toEqual(['Quality', 'Escaped defects', '—', '—', '—', '—']);
  });
});
