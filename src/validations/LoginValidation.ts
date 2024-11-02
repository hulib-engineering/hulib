import { z } from 'zod';

export const LoginValidation = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});
