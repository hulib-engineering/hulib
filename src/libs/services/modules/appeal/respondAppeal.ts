import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { TAppeal } from './type';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<TAppeal & { id: number }, { id: number; status: 'approved' | 'rejected' }>({
    query: ({ id, ...payload }) => ({
      url: `/appeals/${id}/respond`,
      method: 'PATCH',
      body: payload,
    }),
  });
