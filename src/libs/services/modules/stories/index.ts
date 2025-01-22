import { api } from '../../api';
import getStories from './getStories';
import getStoryDetails from './getStoryDetails';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Stories'],
});

const storiesApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getStoryDetail: getStoryDetails(build),
    getStories: getStories(build),
  }),
  overrideExisting: false,
});

export const { useGetStoryDetailQuery, useGetStoriesQuery }: any = storiesApi;
