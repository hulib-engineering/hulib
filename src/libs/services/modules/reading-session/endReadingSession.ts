import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

type EndReadingSessionRequest = {
  id: number | string;
};

/**
 * POST /reading-sessions/:id/end — marks the session finished and notifies the peer.
 *
 * Idempotent on the backend: calling again after the session is already finished
 * returns 204 without re-firing notifications. Auth is the Bearer header; the
 * backend checks the caller is a participant (liber or huber).
 */
const endReadingSession = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<void, EndReadingSessionRequest>({
    query: ({ id }) => ({
      url: `reading-sessions/${id}/end`,
      method: 'POST',
    }),
    invalidatesTags: [{ type: 'ReadingSession' }, { type: 'Notification', id: 'LIST' }],
  });

export default endReadingSession;
