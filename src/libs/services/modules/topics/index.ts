import { api } from '../../api';
import getTopics from './getTopics';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Topics'],
});

export const topicsApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getTopics: getTopics(build),
  }),
  overrideExisting: false,
});

export const { useGetTopicsQuery }: any = topicsApi;
