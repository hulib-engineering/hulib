import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: { password: string; hash: string }) => ({
      url: 'auth/change/password',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'User' }],
  });
