import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { ReadingSession } from './createNewReadingSession';

const getReadingSessionById = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<ReadingSession>, number>({
    query: id => `reading-sessions/${id}`,
    providesTags: (_result, _error, id) => [
      { type: 'ReadingSession', id },
    ],
  });

export default getReadingSessionById;
