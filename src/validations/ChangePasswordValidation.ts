import { z } from 'zod';

export const ChangePasswordValidation = z
  .object({
    oldPassword: z.string().trim().min(8),
    newPassword: z
      .string()
      .trim()
      .min(8, 'The new password is not in the correct format, please re-enter'),
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
