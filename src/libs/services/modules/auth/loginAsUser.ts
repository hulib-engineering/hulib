import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { z } from 'zod';

import type { LoginValidation } from '@/validations/LoginValidation';

import type { EmailLoginResponse } from './index';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<EmailLoginResponse, z.infer<typeof LoginValidation>>({
    query: ({ email, password }) => ({
      url: '/auth/email/login',
      method: 'POST',
      body: { email, password },
    }),
    invalidatesTags: [{ type: 'User' }],
  });
