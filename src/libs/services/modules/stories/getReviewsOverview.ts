import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '../../type';
import type { StoryReviewOverview } from './storiesType';

const getReviewsOverview = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<StoryReviewOverview>, void>({
    query: (id) => ({
      url: `stories/${id}/reviews-overview`,
    }),
    serializeQueryArgs: ({ endpointName }) => {
      return `${endpointName}`;
    },
    providesTags: (result) =>
      result
        ? [
            { type: 'StoryReviewOverview' as const, id: 'LIST' },
            { type: 'StoryReviewOverview', id: 'LIST' },
          ]
        : [],
  });

export default getReviewsOverview;
