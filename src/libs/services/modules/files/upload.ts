import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: FormData) => ({
      url: 'files/upload',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'Files' }],
  });
