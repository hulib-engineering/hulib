import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Story, StoryDetailsParams } from './storiesType';

const getStoryDetails = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<Story, StoryDetailsParams>({
    query: ({ id }) => ({
      url: `stories/${id || 0}`,
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}-${queryArgs.id || 0}`;
    },
    providesTags: (_result, _error, { id }) => [
      { type: 'Story' as const, id: id || 0 },
    ],
  });

export default getStoryDetails;
