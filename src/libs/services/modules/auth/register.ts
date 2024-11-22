import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';
import type { z } from 'zod';

import type {
  RegisterStep1Validation,
  RegisterStep2Validation,
} from '@/validations/RegisterValidation';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (
      body: z.infer<typeof RegisterStep1Validation> &
        z.infer<typeof RegisterStep2Validation>,
    ) => ({
      url: 'auth/email/register',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'User' }, { type: 'OTP' }],
  });
