import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

const getReadingSessions = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, { upcoming?: boolean }>({
    query: (params) =>
      `reading-sessions?${
        params?.upcoming ? `upcoming=${params?.upcoming}` : ''
      }`,
    providesTags: [{ type: 'ReadingSession' }],
  });

export default getReadingSessions;
