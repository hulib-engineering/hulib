import { api } from '../../api';
import createNewReadingSession from './createNewReadingSession';
import getReadingSessionById from './getReadingSessionById';
import getReadingSessions from './getReadingSessions';
import updateReadingSession from './updateReadingSession';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['ReadingSession'],
});

const readingSessionApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    createNewReadingSession: createNewReadingSession(build),
    getReadingSessions: getReadingSessions(build),
    updateReadingSession: updateReadingSession(build),
    getReadingSessionById: getReadingSessionById(build),
  }),
  overrideExisting: false,
});

export const {
  useCreateNewReadingSessionMutation,
  useGetReadingSessionsQuery,
  useUpdateReadingSessionMutation,
  useGetReadingSessionByIdQuery,
}: any = readingSessionApi;
