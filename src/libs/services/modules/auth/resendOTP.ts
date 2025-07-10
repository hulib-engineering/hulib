import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: { id: string | number }) => ({
      url: 'auth/otp/resend',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'OTP' }],
  });
