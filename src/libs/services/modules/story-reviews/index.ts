import { api } from '../../api';
import createStoryReview from './createStoryReview';
import deleteStoryReview from './deleteStoryReview';
import getStoryReviewsByStoryId from './getStoryReviewsByStoryId';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['StoryReview'],
});

export const storyReviewsApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getStoryReviewsByStoryId: getStoryReviewsByStoryId(build),
    createStoryReview: createStoryReview(build),
    deleteStoryReview: deleteStoryReview(build),
  }),
  overrideExisting: false,
});

export const { useGetStoryReviewsByStoryIdQuery, useCreateStoryReviewMutation, useDeleteStoryReviewMutation }: any = storyReviewsApi;
