import { z } from 'zod';

import { HuberStep1Validation } from '@/validations/HuberValidation';

/** Single schema for the upgrade wizard: huber fields + time slots (validated on step 2). */
export const AccountUpgradeValidation = (t: Parameters<typeof HuberStep1Validation>[0]) =>
  HuberStep1Validation(t).extend({
    timeSlots: z
      .array(
        z.object({
          dayOfWeek: z.number(),
          startTime: z.string(),
        }),
      )
      .default([]),
  });

export type AccountUpgradeValidationType = z.infer<ReturnType<typeof AccountUpgradeValidation>>;
