import { api } from '../../api';
import getTopicById from './getTopicById';
import getTopics from './getTopics';
import postTopics from './postTopic';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Topics'],
});

export const topicsApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getTopics: getTopics(build),
    getTopicById: getTopicById(build),
    postTopics: postTopics(build),
  }),
  overrideExisting: false,
});

export const {
  useGetTopicsQuery,
  useGetTopicByIdQuery,
  usePostTopicsMutation,
}: any = topicsApi;
