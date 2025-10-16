import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { GetTopicsParams, Topic } from './topicType';

const getTopics = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Topic>, GetTopicsParams>({
    query: params => ({
      url: 'topics',
      params: {
        type: params?.type,
        page: params?.page,
        limit: params?.limit,
        name: params?.name,
      },
    }),
    providesTags: result =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: 'Topics' as const, id })),
            { type: 'Topics' as const, id: 'LIST' },
          ]
        : [{ type: 'Topics' as const, id: 'LIST' }],
  });

export default getTopics;
