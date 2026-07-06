import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return {
        url: 'files/upload',
        method: 'POST',
        body: formData,
      };
    },
    invalidatesTags: [{ type: 'Files' }],
  });
