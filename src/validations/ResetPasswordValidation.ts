import { z } from 'zod';

import { passwordSchema } from './PasswordValidation';

export const ResetPasswordValidation = z
  .object({
    password: passwordSchema,
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
