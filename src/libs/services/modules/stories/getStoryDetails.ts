import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Story } from './storiesType';

const getStoryDetails = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<Story, number>({
    query: id => ({
      url: `stories/${id || 0}`,
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}-${queryArgs || 0}`;
    },
    providesTags: (_result, _error, id) => [
      { type: 'Story' as const, id: id || 0 },
    ],
  });

export default getStoryDetails;
