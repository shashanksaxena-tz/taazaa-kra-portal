import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoleDetailPage } from './RoleDetailPage';
import { useKRA } from '../../context/KRAContext';
import type { RoleCharter, Department } from '../../types';

vi.mock('../../context/KRAContext', () => ({
  useKRA: vi.fn(),
}));

const mockedUseKRA = vi.mocked(useKRA);

const role = {
  id: 'role-sse',
  title: 'Senior Software Engineer (SSE)',
  departmentId: 'eng',
  level: 'Senior (L3)',
  experienceYears: '4-6 Years',
  mission: 'Design and maintain scalable solutions.',
  summary: 'Technical soundness of features.',
  accountabilities: ['Delivery predictability'],
  responsibilities: ['Code review'],
  competencies: { technical: ['TypeScript'], behavioral: ['Mentoring'] },
  metricsAndKras: [
    { outcomeArea: 'Quality', metric: 'Escaped defects', target: '< 2%', frequency: 'Quarterly' },
  ],
} as unknown as RoleCharter;

const department = { id: 'eng', name: 'Engineering', roles: [] } as unknown as Department;

beforeEach(() => {
  mockedUseKRA.mockReset();
  mockedUseKRA.mockReturnValue({
    toggleCompareRole: vi.fn(),
    comparisonRoles: [],
    activeDepartmentName: 'Engineering',
    updateRole: vi.fn(),
    deleteRole: vi.fn(),
    adminSession: { isAuthenticated: false, username: '', role: 'editor' },
    portalData: { version: 'v1.0', departments: [], raciMatrix: [] },
    activeVersion: { name: 'Bundled Baseline', versionNumber: 'v1.0' },
  } as never);
});

describe('RoleDetailPage', () => {
  it('renders as an in-page section, not a fixed overlay drawer', () => {
    const { container } = render(<RoleDetailPage role={role} department={department} onClose={vi.fn()} />);
    expect(container.querySelector('.fixed')).toBeNull();
  });

  it('renders the print-only charter block with full role content', () => {
    const { container } = render(<RoleDetailPage role={role} department={department} onClose={vi.fn()} />);

    const printBlocks = container.querySelectorAll('[class*="print:block"], [class*="hidden print"]');
    expect(printBlocks.length).toBeGreaterThan(0);
    const printText = [...printBlocks].map((b) => b.textContent).join(' ');
    expect(printText).toContain('Senior Software Engineer (SSE)');
    expect(printText).toContain('Quality');
  });

  it('hides the interactive view when printing (print:hidden)', () => {
    const { container } = render(<RoleDetailPage role={role} department={department} onClose={vi.fn()} />);
    expect(container.querySelector('[class*="print:hidden"]')).not.toBeNull();
  });

  it('Export PDF triggers window.print', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<RoleDetailPage role={role} department={department} onClose={vi.fn()} />);
    const exportBtn = screen.getAllByRole('button', { name: /print/i })[0];
    fireEvent.click(exportBtn);
    expect(printSpy).toHaveBeenCalledOnce();
    printSpy.mockRestore();
  });

  it('calls onClose when the breadcrumb back link is clicked', () => {
    const onClose = vi.fn();
    render(<RoleDetailPage role={role} department={department} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /roles/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders no bare quote marks when the role has no documented mission', () => {
    const roleWithoutMission = { ...role, mission: '', summary: '' } as RoleCharter;
    const { container } = render(<RoleDetailPage role={roleWithoutMission} department={department} onClose={vi.fn()} />);
    expect(container.textContent).not.toContain('""');
  });

  it('does not render a Career Ladder tab (career-path chain is unverified against source docs)', () => {
    render(<RoleDetailPage role={role} department={department} onClose={vi.fn()} />);
    expect(screen.queryByText(/career ladder/i)).toBeNull();
  });
});
