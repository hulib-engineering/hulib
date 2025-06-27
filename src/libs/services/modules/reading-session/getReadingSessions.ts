import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

const getReadingSessions = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<
    any,
    {
      upcoming?: boolean;
      page?: number;
      limit?: number;
      startedAt?: string;
      endedAt?: string;
    }
  >({
    query: (params) => ({
      url: 'reading-sessions',
      params: {
        upcoming: params?.upcoming || undefined,
        page: params?.page || 1,
        limit: params?.limit || 100,
        startedAt: params?.startedAt || undefined,
        endedAt: params?.endedAt || undefined,
      },
    }),
    providesTags: [{ type: 'ReadingSession' }],
  });

export default getReadingSessions;
