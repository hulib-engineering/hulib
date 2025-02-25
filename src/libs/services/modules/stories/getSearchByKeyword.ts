import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import { AppConfig } from '@/utils/AppConfig';

import type { PaginatedResponse } from '../../type';
import type { SearchParams } from './storiesType';

const getSearchByKeyword = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<any>, SearchParams>({
    query: (params) => ({
      url: `${AppConfig.api.endpoint}/search`, // Override baseUrl tại đây
      params: {
        keyword: params?.keyword,
      },
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}(${JSON.stringify(queryArgs?.keyword)})`;
    },
    forceRefetch: ({ currentArg, previousArg }) => {
      return currentArg?.keyword !== previousArg?.keyword;
    },
    providesTags: (result: any) =>
      result && Array.isArray(result)
        ? [
            ...result.map(({ id }) => ({ type: 'Search' as const, id })),
            { type: 'Search' as const, id: 'LIST' },
          ]
        : [{ type: 'Search' as const, id: 'LIST' }],
  });

export default getSearchByKeyword;
