import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

export type SessionStatus =
  | 'finished'
  | 'unInitialized'
  | 'canceled'
  | 'pending'
  | 'rejected'
  | 'approved';

export interface GetReadingSessionParams {
  id: string;
  sessionStatus?: SessionStatus;
  page?: number;
  limit?: number;
}

const getReadingSessionOfUser = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, GetReadingSessionParams>({
    query: ({ id, sessionStatus, page, limit }) => {
      const queryParams = new URLSearchParams();
      if (sessionStatus) {
        queryParams.append('sessionStatus', sessionStatus);
      }
      if (page) {
        queryParams.append('page', page.toString());
      }
      if (limit) {
        queryParams.append('limit', limit.toString());
      }

      const queryString = queryParams.toString();
      return {
        url: `users/${id}/reading-session${
          queryString ? `?${queryString}` : ''
        }`,
      };
    },
    providesTags: [{ type: 'ReadingSession' }],
  });

export default getReadingSessionOfUser;
