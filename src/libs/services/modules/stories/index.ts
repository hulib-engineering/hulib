import { api } from '../../api';
import getReviewsOverview from './getReviewsOverview';
import getSearchByKeyword from './getSearchByKeyword';
import getSimilarStories from './getSimilarStories';
import getStories from './getStories';
import getStoryDetails from './getStoryDetails';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Stories'],
});

const storiesApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getStoryDetail: getStoryDetails(build),
    getStories: getStories(build),
    getReviewsOverview: getReviewsOverview(build),
    getSimilarStories: getSimilarStories(build),
    getSearchByKeyword: getSearchByKeyword(build),
  }),
  overrideExisting: false,
});

export const {
  useGetStoryDetailQuery,
  useGetStoriesQuery,
  useGetReviewsOverviewQuery,
  useGetSimilarStoriesQuery,
  useGetSearchByKeywordQuery,
}: any = storiesApi;
