import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

import type { StoriesParams, Story } from './storiesType';

const getStories = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Story>, StoriesParams>({
    query: (params) => {
      const searchParams = new URLSearchParams();

      searchParams.append('page', String(params.page ?? 1));
      searchParams.append('limit', String(params.limit ?? 10));

      if (params?.humanBookId) {
        searchParams.append('humanBookId', String(params.humanBookId));
      }

      if (params?.topicIds?.length) {
        params.topicIds.forEach((id) => {
          searchParams.append('topicIds', String(id));
        });
      }

      if (params?.sort) {
        searchParams.append('sort', JSON.stringify(params.sort));
      }

      if (params?.type) {
        searchParams.append('type', params.type);
      }

      return {
        url: `stories?${searchParams.toString()}`,
      };
    },
    providesTags: result =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: 'Story' as const, id })),
            { type: 'Story' as const, id: 'LIST' }, // ✅ always present
          ]
        : [{ type: 'Story' as const, id: 'LIST' }],
  });

export default getStories;
