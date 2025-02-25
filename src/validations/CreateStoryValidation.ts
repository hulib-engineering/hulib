import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 50; // 5MB
// const ACCEPTED_FILE_TYPES = ['image/*'];

export const CreateStoryValidation = z.object({
  topics: z.string().array().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional().nullable(),
  abstract: z.string().trim().min(1),
  uploadFile: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 3MB'),
});
