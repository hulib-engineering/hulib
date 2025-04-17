import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

const getReadingSessions = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, { type?: string }>({
    query: (params) =>
      `reading-sessions?${params?.type ? `type=${params?.type}` : ''}`,
    providesTags: [{ type: 'ReadingSession' }],
  });

export default getReadingSessions;
