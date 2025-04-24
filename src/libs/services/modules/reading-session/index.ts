import { api } from '../../api';
import createNewReadingSession from './createNewReadingSession';
import getReadingSessions from './getReadingSessions';
import updateStatusReadingSession from './updateStatusReadingSession';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['ReadingSession'],
});

const readingSessionApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    createNewReadingSession: createNewReadingSession(build),
    getReadingSessions: getReadingSessions(build),
    updateStatusReadingSession: updateStatusReadingSession(build),
  }),
  overrideExisting: false,
});

export const {
  useCreateNewReadingSessionMutation,
  useGetReadingSessionsQuery,
  useUpdateStatusReadingSessionMutation,
}: any = readingSessionApi;
