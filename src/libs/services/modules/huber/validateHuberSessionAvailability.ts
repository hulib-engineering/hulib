import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: ({ id, ...body }: { id: string; startAt: Date }) => ({
      url: `hubers/${id}/validate-availability`,
      method: 'POST',
      body,
    }),
  });
