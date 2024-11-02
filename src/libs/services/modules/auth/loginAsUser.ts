import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { z } from 'zod';

import type { LoginValidation } from '@/validations/LoginValidation';

import type { EmailLoginResponse } from './index';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<EmailLoginResponse, z.infer<typeof LoginValidation>>({
    query: ({ username, password }) => ({
      url: '/auth/email/login',
      method: 'POST',
      body: { username, password },
    }),
    invalidatesTags: [{ type: 'User' }],
  });
