import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { StoryReview, StoryReviewParams } from './storyReviewsType';

export const SHOW_LIMIT_REVIEWS = 3;

const getStoryReviewsByStoryId = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<StoryReview>, StoryReviewParams>({
    query: params => ({
      url: 'story-reviews',
      params: {
        page: params?.page || 1,
        limit: params?.limit || SHOW_LIMIT_REVIEWS,
        storyId: params?.storyId,
      },
    }),
    providesTags: result =>
      result
        ? [
            ...result.data.map(({ id }) => ({
              type: 'StoryReview' as const,
              id,
            })),
            { type: 'StoryReview' as const, id: 'LIST' },
          ]
        : [{ type: 'StoryReview' as const, id: 'LIST' }],
  });

export default getStoryReviewsByStoryId;
