import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query({
    query: () => 'profile/refresh',
    providesTags: [{ type: 'User' }],
  });
