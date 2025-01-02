import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { User } from './index';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<User, void>({
    query: () => `auth/me`,
    providesTags: [{ type: 'User', id: 'ME' }],
  });
