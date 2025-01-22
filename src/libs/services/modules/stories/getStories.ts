import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '../../type';
import type { StoriesParams, Story } from './storiesType';

const getStories = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Story>, StoriesParams>({
    query: (params) => ({
      url: 'stories',
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
      },
    }),
    serializeQueryArgs: ({ endpointName }) => {
      return `${endpointName}`;
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
      return currentArg?.page !== previousArg?.page;
    },
    providesTags: (result) =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: 'Stories' as const, id })),
            { type: 'Stories' as const, id: 'LIST' },
          ]
        : [{ type: 'Stories' as const, id: 'LIST' }],
  });

export default getStories;
