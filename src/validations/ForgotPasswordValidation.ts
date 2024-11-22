import { z } from 'zod';

export const ForgotPasswordValidation = z.object({
  email: z.string().trim().email(),
});
