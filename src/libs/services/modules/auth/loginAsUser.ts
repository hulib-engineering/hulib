import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { EmailLoginResponse } from './index';
import type { LoginValues } from '@/validations/LoginValidation';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<EmailLoginResponse, LoginValues>({
    query: ({ email, password }) => ({
      url: '/auth/email/login',
      method: 'POST',
      body: { email, password },
    }),
    invalidatesTags: [{ type: 'User' }],
  });
