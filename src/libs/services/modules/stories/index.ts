import { api } from '../../api';
import getReviewsByStory from './getReviewsByStory';
import getReviewsOverview from './getReviewsOverview';
import getStories from './getStories';
import getStoryDetails from './getStoryDetails';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Stories'],
});

const storiesApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getStoryDetail: getStoryDetails(build),
    getStories: getStories(build),
    getReviewsByStory: getReviewsByStory(build),
    getReviewsOverview: getReviewsOverview(build),
  }),
  overrideExisting: false,
});

export const {
  useGetStoryDetailQuery,
  useGetStoriesQuery,
  useGetReviewsByStoryQuery,
  useGetReviewsOverviewQuery,
}: any = storiesApi;
