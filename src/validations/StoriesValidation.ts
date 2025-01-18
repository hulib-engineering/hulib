import { z } from 'zod';

export const StoriesValidation = z.object({
  id: z.string(),
  title: z.string(),
  abstract: z.string(),
});
