import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '../../type';
import type { Story, StoryDetailsParams } from './storiesType';

const getStoryDetails = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<Story, StoryDetailsParams>({
    query: (params) => ({
      url: `stories`,
      params: {
        id: params?.id || 0,
      },
    }),
    transformResponse: (response: PaginatedResponse<Story>) => {
      return response.data[0] || ({} as Story);
    },
    serializeQueryArgs: (params) => {
      return params;
    },
    providesTags: (result, error, { id }) => [
      { type: 'Story' as const, id: id || 0 },
    ],
  });

export default getStoryDetails;
