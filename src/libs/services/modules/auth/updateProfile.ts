import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { z } from 'zod';

import type { ProfileValidation } from '@/validations/ProfileValidation';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (patch: Partial<z.infer<typeof ProfileValidation>>) => ({
      url: 'auth/me',
      method: 'PATCH',
      body: patch,
    }),
    invalidatesTags: [{ type: 'User', id: 'ME' }, { type: 'User', id: 'MY-AVATAR' }],
  });
