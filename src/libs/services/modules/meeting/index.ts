import { api } from '@/libs/services/api';

import getSessions from './getSessions';

const authenticationApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Users'],
});

export const sessionApi = authenticationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getSessions: getSessions(build),
  }),
  overrideExisting: false,
});

export const { useGetSessionsQuery }: any = sessionApi;
