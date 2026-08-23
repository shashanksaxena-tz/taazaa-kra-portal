import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import { excelService } from './excelService';
import defaultData from '../data/kras.json';
import { storageService } from './storageService';
import type { PortalData } from '../types';

const data = defaultData as unknown as PortalData;

describe('buildWorkbook (.xlsx export roundtrip)', () => {
  const wb = excelService.buildWorkbook(data, {
    id: 'v-current',
    versionNumber: 'v1.0',
    name: 'Bundled Baseline',
    effectiveDate: '2026-08',
    createdAt: '',
    createdBy: '',
    departments: [],
    raciMatrix: [],
  });

  it('produces the expected sheet structure', () => {
    expect(wb.SheetNames).toContain('Role Charters');
    expect(wb.SheetNames.length).toBeGreaterThanOrEqual(2);
  });

  it('roundtrips every role title through XLSX.read', () => {
    const ws = wb.Sheets['Role Charters'];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
    const titles = new Set(
      rows.map((r) => (r?.[1] as string)).filter((t) => typeof t === 'string')
    );
    const allRoles = data.departments.flatMap((d) => d.roles);
    for (const role of allRoles) {
      expect(titles.has(role.title)).toBe(true);
    }
  });

  it('stamps the active version name into the header rows', () => {
    const ws = wb.Sheets['Role Charters'];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
    const headerText = JSON.stringify(rows.slice(0, 3));
    expect(headerText).toContain('Bundled Baseline');
  });
});

describe('buildTemplateWorkbook', () => {
  it('contains a Template sheet with the sample rows and a Valid Values sheet', () => {
    const wb = excelService.buildTemplateWorkbook();
    expect(wb.SheetNames).toEqual(['Template', 'Valid Values']);

    const templateRows = XLSX.utils.sheet_to_json<unknown[]>(
      wb.Sheets['Template'], { header: 1 }
    );
    const flat = templateRows.flat().join('|');
    expect(flat).toContain('Role Title');
    expect(flat).toContain('Senior Software Engineer (Sample)');
    expect(flat).toContain('OKRs (Outcome:Metric:Target:Frequency separated by |)');

    const refRows = XLSX.utils.sheet_to_json<unknown[]>(
      wb.Sheets['Valid Values'], { header: 1 }
    );
    expect(refRows.flat()).toContain('Quality Assurance');
  });

  it('is parseable by our own import (roundtrip guarantee)', async () => {
    const wb = excelService.buildTemplateWorkbook();
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
    const file = new File([buf], 'template.xlsx');
    const { count } = await excelService.parseSpreadsheet(file);
    expect(count).toBe(0);
  });
});

describe('RACI matrix integrity (bundled dataset)', () => {
  const validCells = /^(Accountable|Responsible|Consulted|Informed)$/;

  it('every activity is non-empty and every cell is a valid RACI value', () => {
    for (const item of data.raciMatrix ?? []) {
      expect(item.activity.trim().length).toBeGreaterThan(0);
      for (const cell of [
        item.deliveryManager,
        item.programManager,
        item.techLead,
        item.productManager,
      ]) {
        expect(cell).toMatch(validCells);
      }
    }
  });

  it('each activity appears exactly once (no duplicate accountabilities)', () => {
    const activities = (data.raciMatrix ?? []).map((r) => r.activity);
    expect(new Set(activities).size).toBe(activities.length);
  });

  it('every row has exactly one Accountable (classic RACI rule)', () => {
    for (const item of data.raciMatrix ?? []) {
      const cells = [item.deliveryManager, item.programManager, item.techLead, item.productManager];
      const accountableCount = cells.filter((c) => c === 'Accountable').length;
      expect(accountableCount).toBe(1);
    }
  });
});

describe('schema versioning', () => {
  it('saveData stamps the current schema version and getInitialData migrates legacy payloads', () => {
    localStorage.setItem(
      'taazaa_kras_custom_data',
      JSON.stringify({
        departments: [{ id: 'eng', name: 'Engineering', roles: [] }],
        raciMatrix: [],
      })
    );
    const loaded = storageService.getInitialData();
    expect(loaded.schemaVersion).toBeDefined();

    storageService.saveData(loaded);
    const raw = JSON.parse(localStorage.getItem('taazaa_kras_custom_data')!);
    expect(raw.schemaVersion).toBe(loaded.schemaVersion);
    expect(Array.isArray(raw.versions)).toBe(true);
  });
});
