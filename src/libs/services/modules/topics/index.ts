import { api } from '../../api';

import deleteTopic from './deleteTopic';
import getTopicById from './getTopicById';
import getTopics from './getTopics';
import postTopics from './postTopic';
import updateTopic from './updateTopic';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Topics'],
});

const topicsApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getTopics: getTopics(build),
    getTopicById: getTopicById(build),
    postTopics: postTopics(build),
    updateTopic: updateTopic(build),
    deleteTopic: deleteTopic(build),
  }),
  overrideExisting: false,
});

export const {
  useGetTopicsQuery,
  // useGetTopicByIdQuery,
  usePostTopicsMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
}: any = topicsApi;
