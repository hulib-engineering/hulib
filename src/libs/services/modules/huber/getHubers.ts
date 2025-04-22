import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '../../type';
import type { Huber, HuberlistParams } from './huberType';

const getStories = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Huber>, HuberlistParams>({
    query: (params) => ({
      url: 'hubers',
      params: {
        page: params?.page || 1,
        limit: params?.limit,
        topicIds: params?.topicIds,
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
            ...result.data.map(({ id }) => ({ type: 'Hubers' as const, id })),
            { type: 'Hubers' as const, id: 'LIST' },
          ]
        : [{ type: 'Hubers' as const, id: 'LIST' }],
  });

export default getStories;
