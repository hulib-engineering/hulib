import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export type ReadingSessionFeedbackPayload = {
  feelingRating: number;
  satisfactionRating: number;
  sessionContent?: string;
  huber:
    | { skipped: true }
    | { skipped: false; rating: number; content?: string };
};

export type ReadingSessionFeedbackResponse = {
  id: number;
  feedbackSubmittedAt: string;
  feelingRating: number;
  satisfactionRating: number;
  sessionContent?: string | null;
  huberRating?: number | null;
  huberContent?: string | null;
  huberFeedbackSkipped: boolean;
};

const submitReadingSessionFeedback = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<
    ReadingSessionFeedbackResponse,
    ReadingSessionFeedbackPayload & { id: number | string }
  >({
    query: ({ id, ...body }) => ({
      url: `reading-sessions/${id}/feedback`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }),
    invalidatesTags: [{ type: 'ReadingSession' }, { type: 'Notification', id: 'LIST' }],
  });

export default submitReadingSessionFeedback;
