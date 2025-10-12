import { api } from '../../api';

import createStory from './createStory';
import deleteStory from './deleteStory';
import getReviewsOverview from './getReviewsOverview';
import getSearchByKeyword from './getSearchByKeyword';
import getSimilarStories from './getSimilarStories';
import getStories from './getStories';
import getStoryDetails from './getStoryDetails';
import updateStory from './updateStory';
import getRelatedTopics from './getRelatedTopics';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Story', 'FavoriteStory', 'StoryTopic', 'StoryReviewOverview'],
});

export const storyApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getStoryDetail: getStoryDetails(build),
    getStories: getStories(build),
    getReviewsOverview: getReviewsOverview(build),
    getSimilarStories: getSimilarStories(build),
    getSearchByKeyword: getSearchByKeyword(build),
    createStory: createStory(build),
    updateStory: updateStory(build),
    deleteStory: deleteStory(build),
    getRelatedTopics: getRelatedTopics(build),
  }),
  overrideExisting: false,
});

export const {
  useGetStoryDetailQuery,
  useGetStoriesQuery,
  useGetReviewsOverviewQuery,
  useGetSimilarStoriesQuery,
  useGetSearchByKeywordQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
  useGetRelatedTopicsQuery,
}: any = storyApi;
