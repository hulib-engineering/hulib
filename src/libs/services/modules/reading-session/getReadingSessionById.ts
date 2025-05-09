import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { ReadingSession } from './createNewReadingSession';

const getReadingSessionById = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<ReadingSession>, { id: number }>({
    query: ({ id }) => `reading-sessions/${id}`,
    providesTags: [{ type: 'ReadingSession' }],
  });

export default getReadingSessionById;
