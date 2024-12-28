import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: FormData) => ({
      url: 'files/upload',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'Files' }],
  });
