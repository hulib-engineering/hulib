import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '../../type';
import type { SimilarStoriesParams, Story } from './storiesType';

const getSimilarStories = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<Story>, SimilarStoriesParams>({
    query: (params) => ({
      url: 'stories',
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        humanBookId: params?.humanBookId,
        topicIds: params?.topicIds,
        'sort[orderBy]': 'title',
        'sort[order]': 'ASC',
      },
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}?humanBookId=${queryArgs?.humanBookId}&topicIds=${JSON.stringify(
        queryArgs?.topicIds,
      )}&sort[orderBy]=title&sort[order]=ASC`;
    },
    merge: (currentCache, newItems, { arg }) => {
      if (arg?.page === 1) {
        return newItems; // Nếu page là trang đầu tiên làm mới toàn bộ
      }
      return {
        ...newItems,
        data: [...currentCache.data, ...newItems.data],
      };
    },
    forceRefetch: ({ currentArg, previousArg }) => {
      // Trigger lại fetch khi page thay đổi
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

export default getSimilarStories;
