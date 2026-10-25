import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { ReadingSession } from './createNewReadingSession';

type Rating = {
  id?: number;
  rating: number;
  content?: string;
};

type ReadingSessionRequest = {
  id: number;
  sessionStatus: string;
  note?: string;
  rejectReason?: string;
  sessionRating?: Rating;
  storyReview?: Rating;
  huberFeedback?: Rating;
  presurvey?: Rating[];
};

const updateReadingSession = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<PaginatedResponse<ReadingSession>, ReadingSessionRequest>({
    query: ({
      id,
      sessionStatus,
      note,
      rejectReason,
      sessionRating,
      storyReview,
      huberFeedback,
      presurvey,
    }) => ({
      url: `reading-sessions/${id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionStatus,
        note,
        sessionRating,
        storyReview,
        huberFeedback,
        presurvey,
        rejectReason,
      }),
    }),
    // Also invalidates the notifications list: accepting/rejecting a session request
    // must make the now-decided sessionRequest notification disappear for the Huber,
    // since that action never arrives back as a separate push/refetch trigger otherwise.
    invalidatesTags: [{ type: 'ReadingSession' }, { type: 'Notification', id: 'LIST' }],
  });

export default updateReadingSession;
