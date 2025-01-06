import { z } from 'zod';

export const HumanBookValidation = (t: any) => {
  return z
    .object({
      about: z.string().trim().min(1, t('validation.required')),
      section: z.array(z.string()).min(1, t('validation.required')),
      education: z.string().trim().min(1, t('validation.required')),
      from: z
        .number()
        .int(t('validation.invalidYear'))
        .min(2024, t('validation.invalidYear'))
        .default(2024),
      to: z
        .number()
        .int(t('validation.invalidYear'))
        .min(2024, t('validation.invalidYear'))
        .default(2024),
    })
    .refine((data) => data.to >= data.from, {
      message: t('validation.invalidYear'),
      path: ['to'],
    });
};
