import { z } from 'zod';

export const RegisterStep1Validation = z
  .object({
    email: z.string().trim().min(1).email(),
    password: z
      .string()
      .trim()
      .min(8)
      .refine((password) => /[A-Z]/.test(password))
      .refine((password) => /[a-z]/.test(password))
      .refine((password) => /[0-9]/.test(password))
      .refine((password) => /[!@#$%^&*]/.test(password)),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

export const RegisterStep2Validation = z.object({
  fullname: z.string().trim().min(1),
  gender: z.enum(['male', 'female', 'other']).default('other'),
  birthday: z.string().trim().min(1),
});

export const RegisterStep3Validation = z.object({
  verificationCode: z.string().trim().length(6),
});
