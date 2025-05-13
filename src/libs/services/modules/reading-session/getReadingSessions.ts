import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

const getReadingSessions = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, { upcoming?: boolean; page?: number; limit?: number }>({
    query: (params) => {
      // Set default values for pagination
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 1000;

      const queryString = new URLSearchParams();
      if (params?.upcoming)
        queryString.append('upcoming', params.upcoming.toString());

      // Always add page and limit with default values
      queryString.append('page', page.toString());
      queryString.append('limit', limit.toString());

      return `reading-sessions?${queryString.toString()}`;
    },
    providesTags: [{ type: 'ReadingSession' }],
  });

export default getReadingSessions;
