import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { Story } from '../stories/storiesType';
import type { User } from '../user/userType';

export type FeedBack = {
  id: string;
  readingSessionId: string;
  readingSession: string;
  rating: string;
  content: string;
};

export type Message = {
  id: string;
  readingSessionId: string;
  readingSession: string;
  humanBookId: string;
  humanBook: User;
};

export type ReadingSession = {
  id: string;
  humanBookId: string;
  humanBook: User;
  readerId: string;
  reader: User;
  storyId: string;
  story: Story;
  sessionUrl: string;
  note: string;
  review: string;
  recordingUrl: string;
  sessionStatus: string;
  startTime: string;
  endTime: string;
  feedbacks: FeedBack[];
};

const createNewReadingSession = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<
    PaginatedResponse<ReadingSession>,
    {
      humanBookId: number;
      readerId: number;
      storyId: number;
      startTime: string;
      endTime: string;
      startedAt: string;
      endedAt: string;
      note: string;
    }
  >({
    query: ({
      humanBookId,
      readerId,
      storyId,
      startTime,
      endTime,
      startedAt,
      endedAt,
      note,
    }) => ({
      url: 'reading-sessions',
      method: 'POST',
      body: JSON.stringify({
        humanBookId,
        readerId,
        storyId,
        startTime,
        endTime,
        startedAt,
        endedAt,
        note,
      }),
    }),

    invalidatesTags: [{ type: 'ReadingSession' }],
  });

export default createNewReadingSession;
