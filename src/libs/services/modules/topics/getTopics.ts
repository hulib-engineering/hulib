import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { GetTopicsParams, Topic } from './topicType';

const getTopics = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Topic>, GetTopicsParams>({
    query: params => ({
      url: 'topics',
      params: {
        page: params?.page || 1,
        limit: params?.limit,
        name: params?.name,
      },
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      const { page, limit, name } = queryArgs ?? {};
      return `${endpointName}(${page},${limit},${name})`;
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
        currentArg?.page !== previousArg?.page
        || currentArg?.name !== previousArg?.name
      );
    },
    providesTags: result =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: 'Topics' as const, id })),
            { type: 'Topics' as const, id: 'LIST' },
          ]
        : [{ type: 'Topics' as const, id: 'LIST' }],
  });

export default getTopics;
