import { api } from '../../api';

import getHuberBookedSessions from './getHuberBookedSessions';
import getHubers from './getHubers';
import getHuberStories from './getHuberStories';
import checkAvailability from './validateHuberSessionAvailability';
import reportHuber from './reportHuber';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Hubers'],
});

const hubersApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getHubers: getHubers(build),
    checkAvailability: checkAvailability(build),
    getHuberBookedSessions: getHuberBookedSessions(build),
    getHuberStories: getHuberStories(build),
    reportHuber: reportHuber(build),
  }),
  overrideExisting: false,
});

export const {
  useGetHubersQuery,
  useGetHuberBookedSessionsQuery,
  useGetHuberStoriesQuery,
  useReportHuberMutation,
}: any = hubersApi;
