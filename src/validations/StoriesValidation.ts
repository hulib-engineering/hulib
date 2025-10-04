import { z } from 'zod';

export const StoriesValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  abstract: z.string().min(1, 'Abstract is required'),
  topics: z.array(z.object(
    { id: z.string().min(1) },
  )).min(1, 'Please select at least one topic'),
  cover: z.object({
    id: z.string().optional(),
    // path: z.string().min(1, 'Cover is required'),
  }).optional(),
});
