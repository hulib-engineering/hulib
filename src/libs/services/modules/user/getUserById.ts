import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { User } from '@/features/users/types';

const getUsersById = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<User, string>({
    query: (id) => ({
      url: `users/${id}`,
    }),
  });

export default getUsersById;
