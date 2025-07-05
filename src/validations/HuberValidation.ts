import { z } from 'zod';

export const HuberStep1Validation = (t: any) => {
  return z.object({
    bio: z.string().trim().min(1, t('validation.bio_required')),
    videoUrl: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || z.string().url().safeParse(val).success, {
        message: t('validation.invalid_url'),
      }),
    topics: z
      .array(
        z.object({
          id: z.number(),
        }),
      )
      .optional()
      .default([]),
    isConfirmed: z.boolean().refine((val) => val === true, {
      message: t('validation.terms_required'),
    }),
  });
};
