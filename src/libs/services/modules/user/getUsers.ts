import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { User } from '@/features/users/types';

import type { PaginatedResponse } from '../../type';
import type { GetUsersParams } from './userType';

const getUsers = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<User>, GetUsersParams>({
    query: (params) => ({
      url: 'users',
      params: {
        page: params?.page || 1,
        limit: params?.limit,
        filter: params?.filter || '',
        sort: params?.sort || '',
      },
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}(${queryArgs?.filter})`;
    },
    merge: (currentCache, newItems, { arg }) => {
      if (arg?.page === 1) {
        return newItems;
      }
      return {
        ...newItems,
        data: [...currentCache.data, ...newItems.data],
      };
    },
    forceRefetch: ({ currentArg, previousArg }) => {
      return (
        currentArg?.page !== previousArg?.page ||
        currentArg?.filter !== previousArg?.filter
      );
    },
    providesTags: (result) =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: 'Users' as const, id })),
            { type: 'Users' as const, id: 'LIST' },
          ]
        : [{ type: 'Users' as const, id: 'LIST' }],
  });
export default getUsers;
