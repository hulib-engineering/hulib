import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation({
    query: payload => ({
      url: '/reports',
      method: 'POST',
      body: payload,
    }),
  });
