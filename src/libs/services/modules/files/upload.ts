import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (body: { fileName: string; fileSize: string }) => ({
      url: 'files/upload',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'Files' }],
  });
