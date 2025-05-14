import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { ReadingSession } from './createNewReadingSession';

const updateStatusReadingSession = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<
    PaginatedResponse<ReadingSession>,
    {
      id: number;
      sessionStatus: string;
    }
  >({
    query: ({ id, sessionStatus }) => ({
      url: `reading-sessions/${id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionStatus,
      }),
    }),
    invalidatesTags: [{ type: 'ReadingSession' }],
  });

export default updateStatusReadingSession;
