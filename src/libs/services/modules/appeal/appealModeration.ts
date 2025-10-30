import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { TAppeal } from './type';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<TAppeal & { id: number }, TAppeal>({
    query: payload => ({
      url: '/appeals',
      method: 'POST',
      body: payload,
    }),
  });
