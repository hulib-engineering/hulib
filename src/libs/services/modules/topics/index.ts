import { api } from '../../api';
import getTopicById from './getTopicById';
import getTopics from './getTopics';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Topics'],
});

export const topicsApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getTopics: getTopics(build),
    getTopicById: getTopicById(build),
  }),
  overrideExisting: false,
});

export const { useGetTopicsQuery, useGetTopicByIdQuery }: any = topicsApi;
