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
        topicIds: params?.topicIds,
        sortBy: params?.sortBy,
      },
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}(${JSON.stringify(queryArgs?.topicIds)})`;
    },
    merge: (currentCache, newItems, { arg }) => {
      if (arg?.page === 1) {
        return newItems; // Nếu topicIds thay đổi hoặc là trang đầu tiên, làm mới toàn bộ
      }
      return {
        ...newItems,
        data: [...currentCache.data, ...newItems.data],
      };
    },
    forceRefetch: ({ currentArg, previousArg }) => {
      // Trigger lại fetch khi topicIds hoặc page thay đổi
      return (
        currentArg?.page !== previousArg?.page ||
        JSON.stringify(currentArg?.topicIds) !==
          JSON.stringify(previousArg?.topicIds)
      );
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
