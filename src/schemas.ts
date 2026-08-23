import { z } from 'zod';

export const metricOkrSchema = z.object({
  outcomeArea: z.string().default('Quality & Delivery'),
  metric: z.string().default(''),
  target: z.string().default(''),
  frequency: z.string().optional(),
  sourceData: z.string().optional(),
});

export const roleCharterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  departmentId: z.string().min(1),
  level: z.string().optional().default(''),
  experienceYears: z.string().optional().default(''),
  mission: z.string().optional().default(''),
  summary: z.string().optional().default(''),
  accountabilities: z.array(z.string()).nullish().transform((v) => v ?? []),
  responsibilities: z.array(z.string()).nullish().transform((v) => v ?? []),
  competencies: z
    .object({
      technical: z.array(z.string()).nullish().transform((v) => v ?? []),
      behavioral: z.array(z.string()).nullish().transform((v) => v ?? []),
      domain: z.array(z.string()).nullish().transform((v) => v ?? []),
    })
    .partial()
    .nullish()
    .transform((v) => v ?? {}),
  metricsAndOkrs: z.array(metricOkrSchema).nullish().transform((v) => v ?? []),
  kras: z.array(z.unknown()).nullish().transform((v) => v ?? []),
});

export const departmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  roles: z.array(roleCharterSchema).nullish().transform((v) => v ?? []),
});

export const kraVersionSchema = z.object({
  id: z.string().min(1, 'Version id is required'),
  versionNumber: z.string().min(1),
  name: z.string().min(1, 'Version name is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  notes: z.string().optional(),
  departments: z.array(departmentSchema).nullish().transform((v) => v ?? []),
  raciMatrix: z
    .array(
      z.object({
        activity: z.string(),
        deliveryManager: z.string().optional().default(''),
        programManager: z.string().optional().default(''),
        techLead: z.string().optional().default(''),
        productManager: z.string().optional().default(''),
      })
    )
    .nullish()
    .transform((v) => v ?? []),
});

export const portalDataSchema = z.object({
  organization: z.string().optional(),
  portalTitle: z.string().optional(),
  portalSubtitle: z.string().optional(),
  lastUpdated: z.string().optional(),
  version: z.string().optional(),
  schemaVersion: z.number().optional(),
  activeVersionId: z.string().optional(),
  departments: z.array(departmentSchema).min(1, 'At least one department is required'),
  raciMatrix: z
    .array(
      z.object({
        activity: z.string(),
        deliveryManager: z.string().optional().default(''),
        programManager: z.string().optional().default(''),
        techLead: z.string().optional().default(''),
        productManager: z.string().optional().default(''),
      })
    )
    .nullish()
    .transform((v) => v ?? []),
  versions: z.array(kraVersionSchema).nullish().transform((v) => v ?? []),
});

export type ParsedPortalData = z.infer<typeof portalDataSchema>;
