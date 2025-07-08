import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { StoryReviewsOverview } from './storiesType';

const getReviewsOverview = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<StoryReviewsOverview>, void>({
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
