import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: { email: string }) => ({
      url: 'auth/forgot/password',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'User' }],
  });
