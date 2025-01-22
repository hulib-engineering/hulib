import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { User } from './userType';

const getAuthorDetail = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<User, void>({
    query: (id) => `users/author/${id}`,
    providesTags: (result) => (result ? [{ type: 'User', id: result.id }] : []),
  });

export default getAuthorDetail;
