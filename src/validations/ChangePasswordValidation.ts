import { z } from 'zod';

import { passwordSchema } from './PasswordValidation';

export const ChangePasswordValidation = z
  .object({
    oldPassword: z.string().trim().min(1),
    newPassword: passwordSchema,
    confirmPassword: z.string().trim().min(8),
  })
  .superRefine(({ confirmPassword, newPassword, oldPassword }, ctx) => {
    if (oldPassword === newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'The new passwords must different the old password',
        path: ['newPassword'],
      });
    }
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });
