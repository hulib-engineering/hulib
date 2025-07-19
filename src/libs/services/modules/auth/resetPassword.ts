import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: { password: string; hash: string }) => ({
      url: 'auth/reset/password',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'User' }],
  });
