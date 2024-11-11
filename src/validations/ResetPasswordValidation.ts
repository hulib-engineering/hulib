import { z } from 'zod';

export const ResetPasswordValidation = z
  .object({
    password: z.string().trim().min(8),
    confirmPassword: z.string().trim().min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });
