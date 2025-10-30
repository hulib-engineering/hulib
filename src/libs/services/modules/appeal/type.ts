import type { z } from 'zod';

import type { AppealValidation } from '@/validations/AppealValidation';

export type TAppeal = z.infer<typeof AppealValidation>;
