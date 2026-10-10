import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { ReadingSession, StatusType } from './createNewReadingSession';

/** Per-status totals across every page, plus the unfiltered total under `all`. */
export type ReadingSessionCounts = {
  all: number;
  approved: number;
  pending: number;
  finished: number;
  missed: number;
};

export type ReadingSessionMeta = {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  counts?: Partial<ReadingSessionCounts>;
};

export type ReadingSessionListResponse = {
  data: ReadingSession[];
  meta: ReadingSessionMeta;
};

type GetReadingSessionsParams = {
  upcoming?: boolean;
  /**
   * Page size. The backend returns at most `maxItemsPerPage` per response regardless of what
   * is asked for, and reports the real page size in `meta.itemsPerPage` — so a caller that
   * wants "everything" still has to follow `meta.totalPages`.
   */
  limit?: number;
  /** 1-based page number. */
  page?: number;
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
  build.query<ReadingSessionListResponse, GetReadingSessionsParams>({
    query: params => ({
      url: 'reading-sessions',
      params: {
        upcoming: params?.upcoming || undefined,
        limit: params?.limit || 100,
        page: params?.page || 1,
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
