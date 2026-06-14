import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

import type { StoryReviewsOverview } from './storiesType';

const getReviewsOverview = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<StoryReviewsOverview>, number>({
    query: id => ({
      url: `stories/${id}/reviews-overview`,
    }),
    providesTags: result =>
      result
        ? [{ type: 'StoryReviewOverview' as const, id: 'LIST' }]
        : [],
  });

export default getReviewsOverview;
