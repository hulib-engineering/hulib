import { api } from '../../api';
import attendReadingSession from './attendReadingSession';
import createNewReadingSession from './createNewReadingSession';
import getReadingSessionById from './getReadingSessionById';
import getReadingSessions from './getReadingSessions';
import updateReadingSession from './updateReadingSession';

export type {
  ReadingSessionListResponse,
  ReadingSessionMeta,
  ReadingSessionCounts,
} from './getReadingSessions';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['ReadingSession'],
});

const readingSessionApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    createNewReadingSession: createNewReadingSession(build),
    getReadingSessions: getReadingSessions(build),
    updateReadingSession: updateReadingSession(build),
    getReadingSessionById: getReadingSessionById(build),
    attendReadingSession: attendReadingSession(build),
  }),
  overrideExisting: false,
});

export const {
  useCreateNewReadingSessionMutation,
  useGetReadingSessionsQuery,
  useUpdateReadingSessionMutation,
  useGetReadingSessionByIdQuery,
  useAttendReadingSessionMutation,
}: any = readingSessionApi;
