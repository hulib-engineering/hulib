import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { Story, StoryDetailsParams } from './storiesType';

const getStoryDetails = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<Story, StoryDetailsParams>({
    query: ({ id }) => ({
      url: `stories/${id || 0}`,
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}-${queryArgs.id || 0}`;
    },
    providesTags: (result, error, { id }) => [
      { type: 'Story' as const, id: id || 0 },
    ],
  });

export default getStoryDetails;
