import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

type AttendReadingSessionRequest = {
  id: number | string;
};

/**
 * POST /reading-sessions/:id/attend — stamps the caller's attendance column on the session.
 *
 * The backend decides a session was missed by checking whether the Huber's column is still
 * empty ~30min after the meeting ends, so this call must fire as soon as the Agora join
 * resolves. It returns 204 and is idempotent: stamping twice is harmless.
 *
 * Auth comes from the shared `fetchBaseQuery` Bearer header, and the backend derives the
 * attendee from the token rather than from the Agora UID (all our tokens use uid 0).
 */
const attendReadingSession = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<void, AttendReadingSessionRequest>({
    query: ({ id }) => ({
      url: `reading-sessions/${id}/attend`,
      method: 'POST',
    }),
  });

export default attendReadingSession;
