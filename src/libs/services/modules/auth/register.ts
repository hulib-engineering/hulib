import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { z } from 'zod';

import type {
  RegisterStep1Validation,
  RegisterStep2Values,
} from '@/validations/RegisterValidation';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (
      body: z.infer<typeof RegisterStep1Validation> &
        RegisterStep2Values,
    ) => ({
      url: 'auth/email/register',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'User' }, { type: 'OTP' }],
  });
