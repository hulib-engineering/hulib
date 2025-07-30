import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { User } from '@/features/users/types';

const getAuthorDetail = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<User, void>({
    query: id => `users/author/${id}`,
    providesTags: result => (result ? [{ type: 'User', id: result.id }] : []),
    transformResponse: (response: any) => {
      return response;
    },
  });

export default getAuthorDetail;
