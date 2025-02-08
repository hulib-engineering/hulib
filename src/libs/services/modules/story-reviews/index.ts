import { api } from '../../api';
import getStoryReviewsByStoryId from './getStoryReviewsByStoryId';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['StoryReviews'],
});

const storyReviewsApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getStoryReviewsByStoryId: getStoryReviewsByStoryId(build),
  }),
  overrideExisting: false,
});

export const { useGetStoryReviewsByStoryIdQuery }: any = storyReviewsApi;
