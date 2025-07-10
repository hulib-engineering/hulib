import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: { email: string }) => ({
      url: 'auth/email/validate',
      method: 'POST',
      body,
    }),
  });
