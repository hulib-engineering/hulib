import { z } from 'zod';

export const NewsletterValidation = z.object({
  email: z.string().trim().email(),
});
