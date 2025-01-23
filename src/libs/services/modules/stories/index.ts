import { api } from '../../api';
import getReviewsByStory from './getReviewsByStory';
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
  }),
  overrideExisting: false,
});

export const {
  useGetStoryDetailQuery,
  useGetStoriesQuery,
  useGetReviewsByStoryQuery,
}: any = storiesApi;
