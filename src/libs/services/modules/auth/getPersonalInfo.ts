import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { User } from './index';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<User, void>({
    query: () => `auth/me`,
    providesTags: [{ type: 'User', id: 'ME' }],
  });
