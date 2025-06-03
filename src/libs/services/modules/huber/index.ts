import { api } from '../../api';
import getHuberBookedSessions from './getHuberBookedSessions';
import getHubers from './getHubers';
import checkAvailability from './validateHuberSessionAvailability';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Hubers'],
});

const hubersApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getHubers: getHubers(build),
    checkAvailability: checkAvailability(build),
    getHuberBookedSessions: getHuberBookedSessions(build),
  }),
  overrideExisting: false,
});

export const {
  useGetHubersQuery,
  useCheckAvailabilityMutation,
  useGetHuberBookedSessionsQuery,
}: any = hubersApi;
