import { z } from 'zod';

export const AppealValidation = z.object({
  message: z.string().trim().min(1),
  evidences: z.array(z.string()).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});
