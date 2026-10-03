import { z } from 'zod';

export const LoginValidation = (t: any) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t('validation.email_required'))
      .email(t('validation.email_invalid')),
    password: z.string().trim().min(1, t('validation.password_required')),
  });

export type LoginValues = z.infer<ReturnType<typeof LoginValidation>>;
