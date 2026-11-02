import { api } from '../../api';
import attendReadingSession from './attendReadingSession';
import createNewReadingSession from './createNewReadingSession';
import endReadingSession from './endReadingSession';
import getReadingSessionById from './getReadingSessionById';
import getReadingSessions from './getReadingSessions';
import getUpcomingReadingSessions from './getUpcomingReadingSessions';
import updateReadingSession from './updateReadingSession';

export type {
  ReadingSessionListResponse,
  ReadingSessionMeta,
  ReadingSessionCounts,
} from './getReadingSessions';
export type {
  UpcomingReadingSession,
  UpcomingReadingSessionCounterpart,
  UpcomingReadingSessionsResponse,
} from './getUpcomingReadingSessions';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['ReadingSession'],
});

const readingSessionApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    createNewReadingSession: createNewReadingSession(build),
    getReadingSessions: getReadingSessions(build),
    getUpcomingReadingSessions: getUpcomingReadingSessions(build),
    updateReadingSession: updateReadingSession(build),
    getReadingSessionById: getReadingSessionById(build),
    attendReadingSession: attendReadingSession(build),
    endReadingSession: endReadingSession(build),
  }),
  overrideExisting: false,
});

export const {
  useCreateNewReadingSessionMutation,
  useGetReadingSessionsQuery,
  useGetUpcomingReadingSessionsQuery,
  useUpdateReadingSessionMutation,
  useGetReadingSessionByIdQuery,
  useAttendReadingSessionMutation,
  useEndReadingSessionMutation,
}: any = readingSessionApi;
