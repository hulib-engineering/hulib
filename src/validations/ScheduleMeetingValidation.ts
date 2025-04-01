import { z } from 'zod';

export const ScheduleMeetingValidation = () => {
  return z.object({
    selectedDate: z.string().trim().min(1),
    selectedTime: z.string().trim().min(1),
    message: z.string().trim().nullable().optional(),
  });
};
