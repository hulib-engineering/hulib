import { api } from '../../api';

import getHuberBookedSessions from './getHuberBookedSessions';
import getHubers from './getHubers';
import getHuberStories from './getHuberStories';
import checkAvailability from './validateHuberSessionAvailability';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Huber'],
});

const hubersApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getHubers: getHubers(build),
    checkAvailability: checkAvailability(build),
    getHuberBookedSessions: getHuberBookedSessions(build),
    getHuberStories: getHuberStories(build),
  }),
  overrideExisting: false,
});

export const {
  useGetHubersQuery,
  useGetHuberBookedSessionsQuery,
  useGetHuberStoriesQuery,
}: any = hubersApi;
