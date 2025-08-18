import { z } from 'zod';

export const ReportValidation = z.object({
  reasons: z
    .array(z.string())
    .refine(
      reasons => reasons.some(r => r.trim().length > 0),
      { message: 'At least one reason must be selected' },
    ),
});
