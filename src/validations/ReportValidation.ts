import { z } from 'zod';

export const ReportValidation = z.object({
  reasons: z
    .array(z.string())
    .refine(
      reasons => reasons.some(r => r.trim().length > 0),
      { message: 'At least one reason must be selected' },
    ),
  customReason: z.string().optional(),
});

export const EditReportValidation = z.object({
  markAsResolved: z.boolean().default(true),
  rejectedReason: z.string().trim().min(1),
  customRejectedReason: z.string().optional(),
});
