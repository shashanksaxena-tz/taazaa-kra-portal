import * as XLSX from 'xlsx';
import { PortalData, RoleCharter, MetricOKR, KRAVersion } from '../types';

export const excelService = {
  /**
   * Export Portal Data to a Professionally Formatted Multi-Sheet Excel Workbook (.xlsx)
   */
  exportToExcel: (
    portalData: PortalData, 
    activeVersion?: KRAVersion, 
    filename: string = 'Taazaa_KRA_Role_Charters.xlsx'
  ) => {
    const wb = XLSX.utils.book_new();

    const verName = activeVersion?.name || activeVersion?.versionNumber || portalData.version || 'v2026.08 (Active)';
    const verDate = activeVersion?.effectiveDate || portalData.lastUpdated || '2026-08';
    const exportTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // ==========================================
    // SHEET 1: ROLE CHARTERS
    // ==========================================
    const rolesHeaderRows = [
      ['TAAZAA INC. — EMPLOYEE RELATIONS & ROLE CHARTER GOVERNANCE SPECIFICATION'],
      [`SNAPSHOT VERSION: ${verName} | EFFECTIVE DATE: ${verDate} | EXPORTED AT: ${exportTime}`],
      [], // Empty row separator
      [
        'Role ID',
        'Role Title',
        'Department',
        'Department ID',
        'Experience Level',
        'Years of Experience',
        'Core Mission Statement',
        'Executive Summary',
        'Core Accountabilities (Delimited by |)',
        'Day-to-Day Responsibilities (Delimited by |)',
        'Technical & Domain Skills (Delimited by |)',
        'Behavioral & Values (Delimited by |)',
        'Feeder / Previous Roles',
        'Next Elevation Target',
      ]
    ];

    const rolesDataRows = portalData.departments.flatMap((dept) =>
      dept.roles.map((role) => [
        role.id,
        role.title,
        dept.name,
        dept.id,
        role.level,
        role.experienceYears,
        role.mission,
        role.summary || '',
        role.accountabilities?.join(' | ') || '',
        role.responsibilities?.join(' | ') || '',
        role.competencies?.technical?.join(' | ') || '',
        role.competencies?.behavioral?.join(' | ') || '',
        role.careerPath?.previousRoles?.map((r) => r.title).join(', ') || '',
        role.careerPath?.nextRoles?.map((r) => r.title).join(', ') || '',
      ])
    );

    const wsRoles = XLSX.utils.aoa_to_sheet([...rolesHeaderRows, ...rolesDataRows]);
    wsRoles['!cols'] = [
      { wch: 18 }, // Role ID
      { wch: 32 }, // Role Title
      { wch: 24 }, // Department
      { wch: 15 }, // Dept ID
      { wch: 24 }, // Level
      { wch: 18 }, // Experience
      { wch: 55 }, // Mission
      { wch: 45 }, // Summary
      { wch: 60 }, // Accountabilities
      { wch: 60 }, // Responsibilities
      { wch: 50 }, // Tech Skills
      { wch: 50 }, // Behavioral Skills
      { wch: 35 }, // Feeder
      { wch: 35 }, // Next
    ];
    XLSX.utils.book_append_sheet(wb, wsRoles, 'Role Charters');

    // ==========================================
    // SHEET 2: OKRs & BENCHMARKS
    // ==========================================
    const okrHeaderRows = [
      ['TAAZAA INC. — MEASURABLE OKRS & PERFORMANCE BENCHMARKS'],
      [`SNAPSHOT VERSION: ${verName} | EFFECTIVE DATE: ${verDate}`],
      [],
      [
        'Role Title',
        'Department',
        'Level',
        'Outcome Area',
        'Key Metric Description',
        'Target Benchmark',
        'Measurement Cadence',
        'Source Data System',
      ]
    ];

    const okrDataRows = portalData.departments.flatMap((dept) =>
      dept.roles.flatMap((role) =>
        (role.metricsAndOkrs || []).map((okr) => [
          role.title,
          dept.name,
          role.level,
          okr.outcomeArea,
          okr.metric,
          okr.target,
          okr.frequency || 'Quarterly',
          okr.sourceData || 'Jira / Direct Audit',
        ])
      )
    );

    const wsOKRs = XLSX.utils.aoa_to_sheet([...okrHeaderRows, ...okrDataRows]);
    wsOKRs['!cols'] = [
      { wch: 32 }, // Role Title
      { wch: 24 }, // Department
      { wch: 24 }, // Level
      { wch: 24 }, // Outcome Area
      { wch: 40 }, // Metric
      { wch: 22 }, // Target
      { wch: 18 }, // Cadence
      { wch: 24 }, // Source Data
    ];
    XLSX.utils.book_append_sheet(wb, wsOKRs, 'OKRs & Benchmarks');

    // ==========================================
    // SHEET 3: RACI MATRIX
    // ==========================================
    if (portalData.raciMatrix && portalData.raciMatrix.length > 0) {
      const raciHeaderRows = [
        ['TAAZAA INC. — CROSS-FUNCTIONAL RACI ACCOUNTABILITY MATRIX'],
        [`SNAPSHOT VERSION: ${verName}`],
        [],
        [
          'Operational Touchpoint / Activity',
          'Delivery Manager (DM)',
          'Program Manager (PgM)',
          'Technical Lead (TL)',
          'Product Manager (PM)',
        ]
      ];

      const raciDataRows = portalData.raciMatrix.map((r) => [
        r.activity,
        r.deliveryManager,
        r.programManager,
        r.techLead,
        r.productManager,
      ]);

      const wsRaci = XLSX.utils.aoa_to_sheet([...raciHeaderRows, ...raciDataRows]);
      wsRaci['!cols'] = [
        { wch: 45 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
      ];
      XLSX.utils.book_append_sheet(wb, wsRaci, 'RACI Matrix');
    }

    // ==========================================
    // SHEET 4: HR LOOKUPS & VALIDATION REFERENCE
    // ==========================================
    const lookupRows = [
      ['TAAZAA HR / ER GOVERNANCE REFERENCE & DATA VALIDATION LOOKUPS'],
      ['Use these standard enumerated values when filling in or updating role charters in Excel.'],
      [],
      ['Valid Departments', 'Valid Career Levels', 'Valid Measurement Cadence', 'Standard Outcome Areas'],
      ['Software Engineering', 'Associate (L1)', 'Per Sprint', 'Delivery & Execution'],
      ['Quality Assurance', 'Mid-Level (L2)', 'Monthly', 'Quality & Defect Governance'],
      ['UI/UX Design', 'Senior (L3)', 'Quarterly', 'Technical Architecture & Code Quality'],
      ['Product Management', 'Lead (L4)', 'Bi-Annual', 'Team Leadership & Mentorship'],
      ['Program & Delivery', 'Management (L4-L5)', 'Annual', 'Stakeholder & Client Alignment'],
      ['', 'Principal / Architect (L5)', '', 'Process Modernization & Innovation'],
      ['', 'Executive / Director (L6)', '', 'Platform Security & Compliance'],
    ];

    const wsLookups = XLSX.utils.aoa_to_sheet(lookupRows);
    wsLookups['!cols'] = [
      { wch: 28 },
      { wch: 30 },
      { wch: 28 },
      { wch: 42 },
    ];
    XLSX.utils.book_append_sheet(wb, wsLookups, 'Reference Lookups');

    // Write and trigger download
    XLSX.writeFile(wb, filename);
  },

  /**
   * Export Role Charters to CSV with Version Headers
   */
  exportToCSV: (
    portalData: PortalData, 
    activeVersion?: KRAVersion, 
    filename: string = 'Taazaa_KRA_Role_Charters.csv'
  ) => {
    const verName = activeVersion?.name || activeVersion?.versionNumber || portalData.version || 'v2026.08 (Active)';
    const verDate = activeVersion?.effectiveDate || portalData.lastUpdated || '2026-08';

    const header = [
      `# TAAZAA INC. ROLE CHARTERS SPECIFICATION`,
      `# VERSION: ${verName} | EFFECTIVE: ${verDate}`,
      `# EXPORTED: ${new Date().toISOString()}`,
      `Role ID,Role Title,Department,Level,Experience,Mission,Accountabilities,Responsibilities,Technical Skills,Behavioral Skills,OKRs`,
    ];

    const rows = portalData.departments.flatMap((dept) =>
      dept.roles.map((role) => {
        const escapeCSV = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
        const okrsStr = role.metricsAndOkrs?.map((m) => `${m.outcomeArea}:${m.metric}:${m.target}`).join(' | ') || '';
        return [
          escapeCSV(role.id),
          escapeCSV(role.title),
          escapeCSV(dept.name),
          escapeCSV(role.level),
          escapeCSV(role.experienceYears),
          escapeCSV(role.mission),
          escapeCSV(role.accountabilities?.join(' | ') || ''),
          escapeCSV(role.responsibilities?.join(' | ') || ''),
          escapeCSV(role.competencies?.technical?.join(' | ') || ''),
          escapeCSV(role.competencies?.behavioral?.join(' | ') || ''),
          escapeCSV(okrsStr),
        ].join(',');
      })
    );

    const csvContent = [...header, ...rows].join('\n');
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
    const templateHeader = [
      ['TAAZAA INC. — ROLE CHARTER IMPORT TEMPLATE'],
      ['Instructions: Fill in your role details below. Use the pipe symbol (|) to separate multiple bullet points.'],
      [],
      [
        'Role Title',
        'Department',
        'Experience Level',
        'Years of Experience',
        'Core Mission Statement',
        'Executive Summary',
        'Core Accountabilities (Delimited by |)',
        'Day-to-Day Responsibilities (Delimited by |)',
        'Technical & Domain Skills (Delimited by |)',
        'Behavioral & Values (Delimited by |)',
        'OKRs (Outcome:Metric:Target:Frequency separated by |)',
      ],
      [
        'Senior Software Engineer (Sample)',
        'Software Engineering',
        'Senior (L3)',
        '4-6 Years',
        'Design, implement, and maintain scalable software solutions with strong focus on code quality.',
        'Core individual contributor leading module delivery and mentoring junior engineers.',
        'Delivery of production-ready microservices | Adherence to code quality standards | Mentoring L1 and L2 engineers',
        'Write unit and integration tests | Conduct peer code reviews | Participate in sprint planning',
        'TypeScript, React, Node.js | Clean Architecture | PostgreSQL, Redis',
        'Proactive Communication | Empathy and Mentorship | Critical Problem Solving',
        'Delivery:On-time release rate:>92%:Quarterly | Quality:SonarQube Grade:A rating:Per Sprint',
      ],
      [
        'Lead QA Automation Engineer (Sample)',
        'Quality Assurance',
        'Lead (L4)',
        '6-8 Years',
        'Lead QA automation architecture and test infrastructure across client projects.',
        'Owns test strategy, CI test automation pipeline, and defect triage governance.',
        'Zero critical defects leaked to production | 85%+ automated test coverage in CI/CD',
        'Build Playwright/Cypress test frameworks | Guide QA team on automation standards',
        'Playwright, TypeScript | CI/CD GitHub Actions | Performance Testing',
        'Technical Leadership | Stakeholder Alignment | Continuous Improvement',
        'Quality:Defect Escape Rate:<2%:Quarterly | Automation:CI Automation Pass Rate:>98%:Per Build',
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateHeader);
    ws['!cols'] = [
      { wch: 32 },
      { wch: 24 },
      { wch: 24 },
      { wch: 18 },
      { wch: 55 },
      { wch: 45 },
      { wch: 60 },
      { wch: 60 },
      { wch: 50 },
      { wch: 50 },
      { wch: 60 },
    ];

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Template');

      // Reference Lookups Sheet
      const lookupRows = [
        ['VALID HR OPTIONS REFERENCE'],
        [],
        ['Valid Departments', 'Valid Levels', 'Valid Cadences'],
        ['Software Engineering', 'Associate (L1)', 'Per Sprint'],
        ['Quality Assurance', 'Mid-Level (L2)', 'Monthly'],
        ['UI/UX Design', 'Senior (L3)', 'Quarterly'],
        ['Product Management', 'Lead (L4)', 'Bi-Annual'],
        ['Program & Delivery', 'Management (L4-L5)', 'Annual'],
        ['', 'Principal / Architect (L5)', ''],
        ['', 'Executive / Director (L6)', ''],
      ];
      const wsRef = XLSX.utils.aoa_to_sheet(lookupRows);
      XLSX.utils.book_append_sheet(wb, wsRef, 'Valid Values');

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

          const sheetName = workbook.SheetNames.find((s) => s.toLowerCase().includes('role') || s.toLowerCase().includes('charter') || s.toLowerCase().includes('template')) || workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Use header row detection
          const rawRows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (!rawRows || rawRows.length === 0) {
            throw new Error('Spreadsheet appears to be empty.');
          }

          // Find the row index that contains column headers (contains 'Title' or 'Role')
          let headerIdx = rawRows.findIndex((row) =>
            Array.isArray(row) && row.some((cell) => typeof cell === 'string' && (cell.toLowerCase().includes('title') || cell.toLowerCase().includes('role')))
          );

          if (headerIdx === -1) headerIdx = 0;

          const headers: string[] = rawRows[headerIdx].map((h) => String(h || '').trim());
          const dataRows = rawRows.slice(headerIdx + 1);

          const parsedRoles: RoleCharter[] = [];

          dataRows.forEach((rowArray, rowIdx: number) => {
            if (!rowArray || rowArray.length === 0) return;

            // Map array into row object using headers
            const row: Record<string, unknown> = {};
            headers.forEach((h, i) => {
              row[h] = rowArray[i];
            });

            const title = row['Role Title'] || row['Title'] || row['role'] || row['Role'] || '';
            if (!title || String(title).trim().length === 0 || String(title).includes('Sample') && rowIdx > 1) {
              // skip empty or guideline rows
              return;
            }

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

            const level = (row['Experience Level'] || row['Level'] || 'Mid-Level (L2)') as string;
            const experienceYears = (row['Years of Experience'] || row['Experience'] || row['Experience Required'] || '2-4 Years') as string;
            const mission = (row['Core Mission Statement'] || row['Mission'] || '') as string;
            const summary = (row['Executive Summary'] || row['Summary'] || '') as string;

            const parseList = (val: unknown): string[] => {
              if (!val) return [];
              if (Array.isArray(val)) return val as string[];
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
              row['Technical & Domain Skills (Delimited by |)'] ||
              row['Technical Skills (pipe | separated)'] ||
              row['Technical Skills']
            );

            const behavioral = parseList(
              row['Behavioral & Values (Delimited by |)'] ||
              row['Behavioral Skills (pipe | separated)'] ||
              row['Behavioral Skills']
            );

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
                    sourceData: parts[4] || 'Jira / Direct Audit',
                  });
                }
              });
            }

            parsedRoles.push({
              id: (row['Role ID'] || `role-${Date.now()}-${rowIdx}`) as string,
              title: String(title).trim(),
              departmentId: deptId,
              level,
              experienceYears,
              mission,
              summary,
              accountabilities: accountabilities.length > 0 ? accountabilities : ['Ensure domain excellence and on-time project delivery'],
              responsibilities: responsibilities.length > 0 ? responsibilities : ['Execute daily domain deliverables'],
              competencies: {
                technical: technical.length > 0 ? technical : ['Core Domain Knowledge'],
                behavioral: behavioral.length > 0 ? behavioral : ['Accountability & Team Collaboration'],
                domain: [],
              },
              metricsAndOkrs: metricsAndOkrs.length > 0 ? metricsAndOkrs : [
                { outcomeArea: 'Delivery', metric: 'On-time milestone delivery', target: '>90%', frequency: 'Quarterly', sourceData: 'Jira' }
              ],
              careerPath: {
                previousRoles: row['Feeder / Previous Roles'] || row['Feeder Roles'] ? String(row['Feeder / Previous Roles'] || row['Feeder Roles']).split(',').map((r: string) => ({ id: r.trim(), title: r.trim() })) : [],
                nextRoles: row['Next Elevation Target'] ? String(row['Next Elevation Target']).split(',').map((r: string) => ({ id: r.trim(), title: r.trim() })) : [],
              },
            });
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
