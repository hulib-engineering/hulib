import { z } from 'zod';

export const HuberStep1Validation = (t: any) => {
  return z.object({
    bio: z.string().trim().min(1, t('validation.bio_required')),
    videoUrl: z.string().url(t('validation.invalid_url')),
    isConfirmed: z.boolean().refine((val) => val === true, {
      message: t('validation.terms_required'),
    }),
  });
}; 