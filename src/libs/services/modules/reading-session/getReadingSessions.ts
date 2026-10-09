import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { StatusType } from './createNewReadingSession';

type GetReadingSessionsParams = {
  upcoming?: boolean;
  /**
   * Page size. The backend only paginates when `limit` **and** `offset` are both present
   * (`reading-sessions.service.ts` derives `page` from `offset / limit`), so omitting
   * `offset` returns the full unpaginated set.
   */
  limit?: number;
  /** Row offset. The backend reads `offset`, not `page`. */
  offset?: number;
  startedAt?: string;
  endedAt?: string;
  sessionStatuses?: StatusType[];
};

/**
 * The backend validates `sessionStatuses` as `@IsArray() @IsEnum(ReadingSessionStatus, { each: true })`,
 * so it has to arrive as repeated keys (`?sessionStatuses=pending&sessionStatuses=approved`).
 * The default `fetchBaseQuery` serializer collapses arrays into one comma-joined value, which
 * arrives as `['pending,approved']` and fails the enum check per element.
 */
const paramsSerializer = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)));
      return;
    }
    searchParams.append(key, String(value));
  });
  return searchParams;
};

const getReadingSessions = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, GetReadingSessionsParams>({
    query: params => ({
      url: 'reading-sessions',
      params: {
        upcoming: params?.upcoming || undefined,
        limit: params?.limit || 100,
        offset: params?.offset || undefined,
        startedAt: params?.startedAt || undefined,
        endedAt: params?.endedAt || undefined,
        sessionStatuses: params?.sessionStatuses?.length
          ? params.sessionStatuses
          : undefined,
      },
      paramsSerializer,
    }),
    providesTags: [{ type: 'ReadingSession' }],
  });

export default getReadingSessions;
