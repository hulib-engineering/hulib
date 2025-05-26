import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

const getReadingSessions = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, { upcoming?: boolean; page?: number; limit?: number }>({
    query: (params) => ({
      url: 'reading-sessions',
      params: {
        upcoming: params?.upcoming || undefined,
        page: params?.page || 1,
        limit: params?.limit || 100,
      },
    }),
    providesTags: [{ type: 'ReadingSession' }],
  });

export default getReadingSessions;
