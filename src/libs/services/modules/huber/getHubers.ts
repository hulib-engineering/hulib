import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '../../type';
import type { Huber, HuberlistParams } from './huberType';

const getHubers = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Huber>, HuberlistParams>({
    query: (params) => {
      const searchParams = new URLSearchParams();
      searchParams.set('page', params?.page?.toString() || '1');
      searchParams.set('limit', params?.limit?.toString() || '12');
      if (params?.topicIds) {
        params.topicIds.forEach((id) => {
          searchParams.append('topicIds', id.toString());
        });
      }
      const finalUrl = `hubers?${searchParams.toString()}`;
      return {
        url: finalUrl,
      };
    },
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

export default getHubers;
