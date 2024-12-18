import type { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query({
    query: () => 'profile/refresh',
    providesTags: [{ type: 'User' }],
  });
