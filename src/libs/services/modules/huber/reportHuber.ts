import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: ({ id, ...body }: { id: string; reasons: string }) => ({
      url: `hubers/${id}/reports`,
      method: 'POST',
      body,
    }),
  });
