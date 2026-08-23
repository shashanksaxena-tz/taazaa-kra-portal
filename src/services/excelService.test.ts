import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as XLSX from 'xlsx';
import { excelService } from './excelService';
import type { PortalData } from '../types';

const makeSheetFile = async (rows: unknown[][], sheetName = 'Role Template'): Promise<File> => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  return new File([buf], 'roles.xlsx');
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('parseSpreadsheet', () => {
  it('parses roles from a template workbook with header auto-detection', async () => {
    const file = await makeSheetFile([
      ['TAAZAA IMPORT TEMPLATE'],
      [],
      ['Role Title', 'Department', 'Experience Level', 'Years of Experience', 'Core Mission Statement'],
      ['Data Platform Engineer', 'Engineering', 'Senior (L3)', '4-6 Years', 'Build data pipelines.'],
      [],
    ]);

    const { roles, count } = await excelService.parseSpreadsheet(file);
    expect(count).toBe(1);
    expect(roles[0].title).toBe('Data Platform Engineer');
    expect(roles[0].departmentId).toBe('engineering');
    expect(roles[0].level).toBe('Senior (L3)');
  });

  it('maps department names to canonical dataset ids', async () => {
    const file = await makeSheetFile([
      ['Role Title', 'Department'],
      ['QA Automation Lead', 'Quality Assurance'],
      ['Product Designer', 'UI/UX Design'],
      ['Delivery Manager', 'Program Delivery'],
      ['SDET Platform Lead', 'SDET'],
      ['Backend Engineer', 'Backend'],
    ]);
    const { roles } = await excelService.parseSpreadsheet(file);
    expect(roles.map((r) => r.departmentId)).toEqual(['qa', 'design', 'program-management', 'qa', 'engineering']);
  });

  it('splits pipe-delimited lists and colon-delimited OKRs', async () => {
    const file = await makeSheetFile([
      ['Role Title', 'Department', 'Core Accountabilities (Delimited by |)', 'OKRs (Outcome:Metric:Target:Frequency separated by |)'],
      ['Platform Engineer', 'Engineering', 'Design systems | Review code', 'Quality & Delivery:Sprint velocity:+15%:Quarterly | Security:Critical vulns:0 open:Monthly'],
    ]);

    const { roles } = await excelService.parseSpreadsheet(file);
    expect(roles[0].accountabilities).toEqual(['Design systems', 'Review code']);
    expect(roles[0].metricsAndOkrs).toEqual([
      expect.objectContaining({ outcomeArea: 'Quality & Delivery', metric: 'Sprint velocity', target: '+15%', frequency: 'Quarterly' }),
      expect.objectContaining({ outcomeArea: 'Security', metric: 'Critical vulns', target: '0 open', frequency: 'Monthly' }),
    ]);
  });

  it('rejects an empty spreadsheet with a clear error', async () => {
    const file = await makeSheetFile([], 'Empty');
    await expect(excelService.parseSpreadsheet(file)).rejects.toThrow(/empty/i);
  });

  it('parses the portal\'s OWN downloaded template even with its banner row intact (regression)', async () => {
    // Reproduces live bug: banner "TAAZAA INC. — ROLE CHARTER IMPORT TEMPLATE"
    // contains the word "role" and used to win header detection at index 0.
    const file = await makeSheetFile([
      ['TAAZAA INC. — ROLE CHARTER IMPORT TEMPLATE'],
      ['Instructions: Fill in your role details below.'],
      [],
      ['Role Title', 'Department', 'Experience Level', 'Years of Experience', 'Core Mission Statement'],
      ['Senior Software Engineer (Sample)', 'Software Engineering', 'Senior (L3)', '4-6 Years', 'Design scalable systems.'],
      ['Regression Test Engineer', 'Quality Assurance', 'Mid-Level (L2)', '2-4 Years', 'Verify imports end to end.'],
    ]);
    const { roles, count } = await excelService.parseSpreadsheet(file);
    expect(count).toBe(1);
    expect(roles[0].title).toBe('Regression Test Engineer');
    expect(roles[0].departmentId).toBe('qa');
  });

  it('prefers the real header row over instruction prose mentioning roles', async () => {
    const file = await makeSheetFile([
      ['How to add a new role for your department and team'],
      ['Another prose line about role charters and titles'],
      [],
      ['Role Title', 'Department', 'Experience Level'],
      ['Platform Engineer', 'Software Engineering', 'Senior (L3)'],
    ]);
    const { roles } = await excelService.parseSpreadsheet(file);
    expect(roles.map((r) => r.title)).toEqual(['Platform Engineer']);
  });
});

describe('exportToCSV', () => {
  it('builds a CSV blob and triggers a download without throwing', () => {
    const createdUrls: string[] = [];
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => {
        const u = `blob:mock-${createdUrls.length}`;
        createdUrls.push(u);
        return u;
      }),
      revokeObjectURL: vi.fn(),
    });
    const clickSpy = vi.fn();
    const originalCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreate(tag);
      if (tag === 'a') el.click = clickSpy;
      return el;
    });

    const data = {
      lastUpdated: '2026-08-01',
      departments: [
        {
          id: 'eng',
          name: 'Engineering',
          roles: [
            {
              id: 'role-x',
              title: 'Engine "quote" Test',
              level: 'L2',
              experienceYears: '2-4 Years',
              mission: 'Test mission',
              accountabilities: ['A1', 'A2'],
              metricsAndOkrs: [{ outcomeArea: 'Q', metric: 'M', target: 'T' }],
            },
          ],
        },
      ],
      raciMatrix: [],
    } as unknown as PortalData;

    expect(() => excelService.exportToCSV(data)).not.toThrow();
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(createdUrls).toHaveLength(1);

    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
});
