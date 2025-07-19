import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

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
        limit: params?.limit,
        humanBookId: params?.humanBookId,
        topicIds: params?.topicIds,
        'sort[orderBy]': 'title',
        'sort[order]': 'ASC',
      },
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}?humanBookId=${queryArgs?.humanBookId}&topicIds=${JSON.stringify(
        queryArgs?.topicIds,
      )}&limit=${queryArgs?.limit}&sort[orderBy]=title&sort[order]=ASC`;
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

export default getSimilarStories;
