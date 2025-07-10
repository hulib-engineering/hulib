import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { StoriesParams, Story } from './storiesType';

const getStories = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Story>, StoriesParams>({
    query: (params) => ({
      url: 'stories',
      params: {
        humanBookId: params?.humanBookId || undefined,
        page: params?.page || 1,
        limit: params?.limit,
        topicIds: params?.topicIds,
        sortBy: params?.sortBy,
      },
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}(${JSON.stringify(queryArgs?.topicIds)})`;
    },
    forceRefetch: ({ currentArg, previousArg }) => {
      return currentArg?.limit !== previousArg?.limit;
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
