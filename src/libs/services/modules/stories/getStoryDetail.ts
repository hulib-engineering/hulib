import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse, StoriesParams, Story } from '.';

const getStoryDetail = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<Story, StoriesParams>({
    query: (params) => ({
      url: 'stories',
      params: {
        id: params?.id || 0,
      },
    }),
    transformResponse: (response: PaginatedResponse<Story>) => {
      return response.data[0] || ({} as Story);
    },
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}(${queryArgs?.id})`;
    },
  });

export default getStoryDetail;
