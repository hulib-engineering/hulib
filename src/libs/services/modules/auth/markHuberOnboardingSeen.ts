import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: { id: string | number }) => ({
      url: 'auth/me/huber-onboarding/seen',
      method: 'PATCH',
      body,
    }),
    invalidatesTags: [{ type: 'User', id: 'ME' }],
  });
