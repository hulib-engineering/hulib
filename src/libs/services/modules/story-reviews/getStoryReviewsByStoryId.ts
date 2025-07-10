import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { StoryReview, StoryReviewParams } from './storyReviewsType';

const getStoryReviewsByStoryId = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<StoryReview>, StoryReviewParams>({
    query: (params) => ({
      url: 'story-reviews',
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        storyId: params?.storyId,
      },
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}(${JSON.stringify(queryArgs?.storyId)})`;
    },
    forceRefetch: ({ currentArg, previousArg }) => {
      return (
        currentArg?.page !== previousArg?.page ||
        JSON.stringify(currentArg?.storyId) !==
          JSON.stringify(previousArg?.storyId)
      );
    },
    providesTags: (result) =>
      result
        ? [
            ...result.data.map(({ id }) => ({
              type: 'StoryReviews' as const,
              id,
            })),
            { type: 'StoryReviews' as const, id: 'LIST' },
          ]
        : [{ type: 'StoryReviews' as const, id: 'LIST' }],
  });

export default getStoryReviewsByStoryId;
