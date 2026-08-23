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
  accountabilities: z.array(z.string()).nullish().default([]),
  responsibilities: z.array(z.string()).nullish().default([]),
  competencies: z
    .object({
      technical: z.array(z.string()).nullish().default([]),
      behavioral: z.array(z.string()).nullish().default([]),
      domain: z.array(z.string()).nullish().default([]),
    })
    .partial()
    .nullish()
    .default({}),
  metricsAndOkrs: z.array(metricOkrSchema).nullish().default([]),
  kras: z.array(z.unknown()).nullish().default([]),
});

export const departmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  roles: z.array(roleCharterSchema).nullish().default([]),
});

export const portalDataSchema = z.object({
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
    .default([]),
});

export type ParsedPortalData = z.infer<typeof portalDataSchema>;
