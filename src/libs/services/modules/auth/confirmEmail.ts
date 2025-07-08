import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: { id: string | number }) => ({
      url: 'auth/email/confirm',
      method: 'POST',
      body,
      responseHandler: 'text',
    }),
    invalidatesTags: [{ type: 'User' }, { type: 'OTP' }],
  });
