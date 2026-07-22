import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { User } from '.';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<User, { topics: number[] }>({
    query: body => ({
      url: 'auth/me/topics',
      method: 'PATCH',
      body,
    }),
    invalidatesTags: [{ type: 'User', id: 'ME' }],
  });
