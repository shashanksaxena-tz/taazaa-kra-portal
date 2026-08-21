import * as XLSX from 'xlsx';
import { PortalData, RoleCharter, Department, MetricOKR } from '../types';

export const excelService = {
  /**
   * Export Portal Data to a Multi-Sheet Excel Workbook (.xlsx)
   */
  exportToExcel: (portalData: PortalData, filename: string = 'Taazaa_KRA_Role_Charters.xlsx') => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Role Charters Summary
    const rolesRows = portalData.departments.flatMap((dept) =>
      dept.roles.map((role) => ({
        'Role ID': role.id,
        'Role Title': role.title,
        'Department': dept.name,
        'Department ID': dept.id,
        'Experience Level': role.level,
        'Years of Experience': role.experienceYears,
        'Core Mission Statement': role.mission,
        'Executive Summary': role.summary || '',
        'Core Accountabilities (Delimited by |)': role.accountabilities?.join(' | ') || '',
        'Day-to-Day Responsibilities (Delimited by |)': role.responsibilities?.join(' | ') || '',
        'Technical Skills (Delimited by |)': role.competencies?.technical?.join(' | ') || '',
        'Behavioral & Values (Delimited by |)': role.competencies?.behavioral?.join(' | ') || '',
        'Domain Skills (Delimited by |)': role.competencies?.domain?.join(' | ') || '',
        'Feeder Roles': role.careerPath?.previousRoles?.map((r) => r.title).join(', ') || '',
        'Next Elevation Target': role.careerPath?.nextRoles?.map((r) => r.title).join(', ') || '',
      }))
    );
    const wsRoles = XLSX.utils.json_to_sheet(rolesRows);
    XLSX.utils.book_append_sheet(wb, wsRoles, 'Role Charters');

    // Sheet 2: OKRs and Performance Metrics
    const okrRows = portalData.departments.flatMap((dept) =>
      dept.roles.flatMap((role) =>
        (role.metricsAndOkrs || []).map((okr, idx) => ({
          'Role Title': role.title,
          'Department': dept.name,
          'Level': role.level,
          'OKR Index': idx + 1,
          'Outcome Area': okr.outcomeArea,
          'Metric Description': okr.metric,
          'Target Benchmark': okr.target,
          'Measurement Frequency': okr.frequency || 'Quarterly',
          'Source Data System': okr.sourceData || 'Jira / Direct Audit',
        }))
      )
    );
    const wsOKRs = XLSX.utils.json_to_sheet(okrRows);
    XLSX.utils.book_append_sheet(wb, wsOKRs, 'OKRs & Benchmarks');

    // Sheet 3: RACI Matrix
    if (portalData.raciMatrix && portalData.raciMatrix.length > 0) {
      const raciRows = portalData.raciMatrix.map((r, idx) => ({
        'Activity Index': idx + 1,
        'Operational Touchpoint / Activity': r.activity,
        'Delivery Manager (DM)': r.deliveryManager,
        'Program Manager (PgM)': r.programManager,
        'Technical Lead (TL)': r.techLead,
        'Product Manager (PM)': r.productManager,
      }));
      const wsRaci = XLSX.utils.json_to_sheet(raciRows);
      XLSX.utils.book_append_sheet(wb, wsRaci, 'RACI Matrix');
    }

    // Write and trigger download
    XLSX.writeFile(wb, filename);
  },

  /**
   * Export Role Charters to CSV
   */
  exportToCSV: (portalData: PortalData, filename: string = 'Taazaa_KRA_Role_Charters.csv') => {
    const rolesRows = portalData.departments.flatMap((dept) =>
      dept.roles.map((role) => ({
        'Role ID': role.id,
        'Role Title': role.title,
        'Department': dept.name,
        'Level': role.level,
        'Experience': role.experienceYears,
        'Mission': role.mission,
        'Accountabilities': role.accountabilities?.join(' | ') || '',
        'Responsibilities': role.responsibilities?.join(' | ') || '',
        'Technical Skills': role.competencies?.technical?.join(' | ') || '',
        'Behavioral Skills': role.competencies?.behavioral?.join(' | ') || '',
        'OKRs (Outcome:Metric:Target)': role.metricsAndOkrs?.map((m) => `${m.outcomeArea}:${m.metric}:${m.target}`).join(' | ') || '',
      }))
    );

    const ws = XLSX.utils.json_to_sheet(rolesRows);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Download Template for HR/ER to easily fill out and import
   */
  downloadTemplate: (format: 'xlsx' | 'csv' = 'xlsx') => {
    const templateData = [
      {
        'Role Title': 'Senior Software Engineer (Sample)',
        'Department': 'Software Engineering',
        'Level': 'Senior (L3)',
        'Experience': '4-6 Years',
        'Mission': 'Design, implement, and maintain scalable software solutions with strong focus on code quality.',
        'Summary': 'Core individual contributor leading module delivery and mentoring junior engineers.',
        'Accountabilities (pipe | separated)': 'Delivery of production-ready microservices | Adherence to code quality standards | Mentoring L1 and L2 engineers',
        'Responsibilities (pipe | separated)': 'Write unit and integration tests | Conduct peer code reviews | Participate in sprint planning',
        'Technical Skills (pipe | separated)': 'TypeScript, React, Node.js | Clean Architecture | PostgreSQL, Redis',
        'Behavioral Skills (pipe | separated)': 'Proactive Communication | Empathy and Mentorship | Critical Problem Solving',
        'OKRs (Outcome:Metric:Target:Frequency separated by |)': 'Delivery:On-time release rate:>92%:Quarterly | Quality:SonarQube Grade:A rating:Per Sprint',
      },
      {
        'Role Title': 'Lead QA Automation Engineer (Sample)',
        'Department': 'Quality Assurance',
        'Level': 'Lead (L4)',
        'Experience': '6-8 Years',
        'Mission': 'Lead QA automation architecture and test infrastructure across client projects.',
        'Summary': 'Owns test strategy, CI test automation pipeline, and defect triage governance.',
        'Accountabilities (pipe | separated)': 'Zero critical defects leaked to production | 85%+ automated test coverage in CI/CD',
        'Responsibilities (pipe | separated)': 'Build Playwright/Cypress test frameworks | Guide QA team on automation standards',
        'Technical Skills (pipe | separated)': 'Playwright, TypeScript | CI/CD GitHub Actions | Performance Testing',
        'Behavioral Skills (pipe | separated)': 'Technical Leadership | Stakeholder Alignment | Continuous Improvement',
        'OKRs (Outcome:Metric:Target:Frequency separated by |)': 'Quality:Defect Escape Rate:<2%:Quarterly | Automation:CI Automation Pass Rate:>98%:Per Build',
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Template');
      XLSX.writeFile(wb, 'Taazaa_KRA_Import_Template.xlsx');
    } else {
      const csvContent = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Taazaa_KRA_Import_Template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  /**
   * Parse an uploaded Excel (.xlsx, .xls) or CSV file into parsed Role Charters
   */
  parseSpreadsheet: async (file: File): Promise<{ roles: RoleCharter[]; count: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Pick the first sheet or 'Role Charters' sheet if available
          const sheetName = workbook.SheetNames.find((s) => s.toLowerCase().includes('role') || s.toLowerCase().includes('charter')) || workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

          if (!rawRows || rawRows.length === 0) {
            throw new Error('Spreadsheet appears to be empty.');
          }

          const parsedRoles: RoleCharter[] = rawRows.map((row, idx) => {
            const title = row['Role Title'] || row['Title'] || row['role'] || `Imported Role ${idx + 1}`;
            const deptName = row['Department'] || row['Department ID'] || 'engineering';
            const deptId = String(deptName).toLowerCase().includes('qa') || String(deptName).toLowerCase().includes('quality')
              ? 'quality'
              : String(deptName).toLowerCase().includes('product')
              ? 'product'
              : String(deptName).toLowerCase().includes('ux') || String(deptName).toLowerCase().includes('design')
              ? 'ux-ui'
              : String(deptName).toLowerCase().includes('program') || String(deptName).toLowerCase().includes('delivery')
              ? 'program'
              : 'engineering';

            const level = row['Experience Level'] || row['Level'] || 'Mid-Level (L2)';
            const experienceYears = row['Years of Experience'] || row['Experience'] || '2-4 Years';
            const mission = row['Core Mission Statement'] || row['Mission'] || '';
            const summary = row['Executive Summary'] || row['Summary'] || '';

            // Parse pipe-separated lists
            const parseList = (val: any): string[] => {
              if (!val) return [];
              if (Array.isArray(val)) return val;
              return String(val)
                .split('|')
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            };

            const accountabilities = parseList(
              row['Core Accountabilities (Delimited by |)'] ||
              row['Accountabilities (pipe | separated)'] ||
              row['Accountabilities']
            );

            const responsibilities = parseList(
              row['Day-to-Day Responsibilities (Delimited by |)'] ||
              row['Responsibilities (pipe | separated)'] ||
              row['Responsibilities']
            );

            const technical = parseList(
              row['Technical Skills (Delimited by |)'] ||
              row['Technical Skills (pipe | separated)'] ||
              row['Technical Skills']
            );

            const behavioral = parseList(
              row['Behavioral & Values (Delimited by |)'] ||
              row['Behavioral Skills (pipe | separated)'] ||
              row['Behavioral Skills']
            );

            const domain = parseList(row['Domain Skills (Delimited by |)'] || row['Domain Skills']);

            // Parse OKRs
            const rawOkrs = row['OKRs (Outcome:Metric:Target:Frequency separated by |)'] ||
                            row['OKRs (Outcome:Metric:Target)'] ||
                            row['OKRs'];

            const metricsAndOkrs: MetricOKR[] = [];
            if (rawOkrs) {
              const okrItems = parseList(rawOkrs);
              okrItems.forEach((item) => {
                const parts = item.split(':').map((p) => p.trim());
                if (parts.length >= 3) {
                  metricsAndOkrs.push({
                    outcomeArea: parts[0] || 'Quality & Delivery',
                    metric: parts[1] || '',
                    target: parts[2] || '',
                    frequency: parts[3] || 'Quarterly',
                    sourceData: parts[4] || 'Jira',
                  });
                }
              });
            }

            return {
              id: row['Role ID'] || `role-${Date.now()}-${idx}`,
              title,
              departmentId: deptId,
              level,
              experienceYears,
              mission,
              summary,
              accountabilities: accountabilities.length > 0 ? accountabilities : ['Ensure high standards of performance and execution'],
              responsibilities: responsibilities.length > 0 ? responsibilities : ['Execute daily domain deliverables'],
              competencies: {
                technical: technical.length > 0 ? technical : ['Core Domain Knowledge'],
                behavioral: behavioral.length > 0 ? behavioral : ['Accountability & Team Collaboration'],
                domain: domain,
              },
              metricsAndOkrs: metricsAndOkrs.length > 0 ? metricsAndOkrs : [
                { outcomeArea: 'Delivery', metric: 'On-time milestone delivery', target: '>90%', frequency: 'Quarterly', sourceData: 'Jira' }
              ],
              careerPath: {
                previousRoles: row['Feeder Roles'] ? row['Feeder Roles'].split(',').map((r: string) => ({ id: r.trim(), title: r.trim() })) : [],
                nextRoles: row['Next Elevation Target'] ? row['Next Elevation Target'].split(',').map((r: string) => ({ id: r.trim(), title: r.trim() })) : [],
              },
            };
          });

          resolve({ roles: parsedRoles, count: parsedRoles.length });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  },
};
