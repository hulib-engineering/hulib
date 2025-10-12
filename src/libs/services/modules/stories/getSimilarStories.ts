import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

import type { SimilarStoriesParams, Story } from './storiesType';

const getSimilarStories = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<Story>, SimilarStoriesParams>({
    query: (params) => {
      const searchParams = new URLSearchParams();

      searchParams.set('page', String(params?.page || 1));
      searchParams.set('limit', String(params?.limit || 6));
      if (params?.humanBookId) {
        searchParams.set('humanBookId', String(params.humanBookId));
      }

      if (params?.topicIds?.length) {
        params.topicIds.forEach(id =>
          searchParams.append('topicIds', id.toString()),
        );
      }

      searchParams.set(
        'sort',
        JSON.stringify([{ orderBy: 'title', order: 'ASC' }]),
      );

      return {
        url: `stories?${searchParams.toString()}`,
      };
    },
    providesTags: result =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: 'Stories' as const, id })),
            { type: 'Stories' as const, id: 'LIST' },
          ]
        : [{ type: 'Stories' as const, id: 'LIST' }],
  });

export default getSimilarStories;
