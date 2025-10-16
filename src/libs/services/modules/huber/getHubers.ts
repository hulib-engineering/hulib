import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

import type { Huber, HuberListParams } from './huberType';

const getHubers = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<Huber>, HuberListParams>({
    query: (params) => {
      const searchParams = new URLSearchParams();
      if (params?.type) {
        searchParams.append('type', params.type);
      }
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
    providesTags: result =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: 'Huber' as const, id })),
            { type: 'Huber' as const, id: 'LIST' },
          ]
        : [{ type: 'Huber' as const, id: 'LIST' }],
  });

export default getHubers;
