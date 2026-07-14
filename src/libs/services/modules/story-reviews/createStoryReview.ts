import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { StoryReview } from './storyReviewsType';

export type CreateStoryReviewPayload = {
  preRating: number;
  rating: number;
  title: string;
  comment: string;
  storyId: number;
  userId: number;
};

const createStoryReview = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<StoryReview, CreateStoryReviewPayload>({
    query: body => ({
      url: 'story-reviews',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'StoryReview', id: 'LIST' }],
  });

export default createStoryReview;
