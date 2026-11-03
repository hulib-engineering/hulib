import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

/** Viewer-relative counterpart, so the client never has to decide which side of the booking it is on. */
export type UpcomingReadingSessionCounterpart = {
  id: number | string;
  fullName?: string;
  photo?: { id?: string; path?: string } | null;
  role?: { id: number; name?: string };
};

export type UpcomingReadingSession = {
  id: number;
  sessionStatus: string;
  startedAt: string;
  endedAt: string;
  counterpart: UpcomingReadingSessionCounterpart;
};

export type UpcomingReadingSessionsResponse = {
  data: UpcomingReadingSession[];
  meta: {
    count: number;
    /** Authoritative clock used to correct the browser clock when rendering countdowns. */
    serverTime: string;
    withinHours: number;
  };
};

type GetUpcomingReadingSessionsParams = {
  withinHours?: number;
  limit?: number;
};

/**
 * `GET /reading-sessions/upcoming` is owned by hulib-services (see issue #838).
 * Until it ships, `useMeetingAlert` reads the existing list endpoint through
 * `toUpcomingSessions` and this flag stays `false`. Flip it (and delete the
 * fallback) once the endpoint is deployed.
 */
export const USE_UPCOMING_ENDPOINT = false;

const getUpcomingReadingSessions = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<UpcomingReadingSessionsResponse, GetUpcomingReadingSessionsParams | void>({
    query: params => ({
      url: 'reading-sessions/upcoming',
      params: {
        withinHours: params?.withinHours || undefined,
        limit: params?.limit || undefined,
      },
    }),
    providesTags: [{ type: 'ReadingSession' }],
  });

export default getUpcomingReadingSessions;
