import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { User } from './userType';

const getUsersById = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<User, string>({
    query: (id) => ({
      url: `users/${id}`,
    }),
  });

export default getUsersById;
