import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: { id: string | number; newEmail: string; otp: string }) => ({
      url: 'auth/otp/verify-new-email',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'OTP' }, { type: 'User', id: 'ME' }],
  });
