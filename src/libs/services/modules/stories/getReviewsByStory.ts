import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '../../type';
import type { StoryReview } from './storiesType';

const getReviewsByStory = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<StoryReview>, void>({
    query: (id) => ({
      url: `stories/${id}/reviews`,
    }),
    serializeQueryArgs: ({ endpointName }) => {
      return `${endpointName}`;
    },
    providesTags: (result) =>
      result
        ? [
            { type: 'StoryReview' as const, id: 'LIST' },
            { type: 'StoryReview', id: 'LIST' },
          ]
        : [],
  });

export default getReviewsByStory;
