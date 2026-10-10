'use client';

import { useMemo, useState } from 'react';

import type { MeetingCardModel, ScheduleCounts, ScheduleFilter } from '../types';
import { filterToStatuses } from '../utils/filters';
import { isViewerLiber, resolveCounterpart, resolveVariant } from '../utils/variant';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import { useAppSelector } from '@/libs/hooks';

export const PAGE_SIZE = 12;

export type UseScheduleMeetingsResult = {
  cards: MeetingCardModel[];
  counts: ScheduleCounts;
  isLoading: boolean;
  isFetching: boolean;
  currentPage: number;
  totalPages: number;
  filters: ScheduleFilter[];
  setFilters: (filters: ScheduleFilter[]) => void;
};

const EMPTY_COUNTS: ScheduleCounts = {
  all: 0,
  approved: 0,
  pending: 0,
  finished: 0,
  missed: 0,
};

/**
 * Loads the viewer's bookings, newest first, one page at a time, filtered server-side.
 *
 * One request covers both sides of the product: the backend already scopes the list to
 * sessions where the caller is either the human book or the reader, so a Liber and a Huber
 * see the same payload and differ only in how `resolveVariant` labels each pending session.
 *
 * Both the filtering and the per-option counts come from the backend (`sessionStatuses` and
 * `meta.counts`), so the counts are totals across every page rather than a tally of what
 * happens to be loaded.
 */
export function useScheduleMeetings(): UseScheduleMeetingsResult {
  const viewerId = useAppSelector(state => state.auth.userInfo?.id);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ScheduleFilter[]>([]);

  const sessionStatuses = useMemo(() => filterToStatuses(filters), [filters]);

  const { data, isLoading, isFetching } = useGetReadingSessionsQuery({
    limit: PAGE_SIZE,
    page: currentPage,
    sessionStatuses: sessionStatuses.length ? sessionStatuses : undefined,
  });

  const sessions = data?.data;

  const cards = useMemo<MeetingCardModel[]>(() => {
    if (!Array.isArray(sessions)) {
      return [];
    }

    // Newest booking first. The backend sorts by `createdAt desc`, but re-sorting guards
    // against ties sharing a page in an arbitrary order.
    const sorted = [...sessions].sort(
      (a, b) => new Date(b.createdAt ?? b.startedAt).getTime() - new Date(a.createdAt ?? a.startedAt).getTime(),
    );

    return sorted.reduce<MeetingCardModel[]>((acc, session) => {
      const variant = resolveVariant(session, viewerId);
      if (variant === null) {
        return acc;
      }
      acc.push({
        session,
        variant,
        counterpart: resolveCounterpart(session, viewerId),
        isViewerLiber: isViewerLiber(session, viewerId),
      });
      return acc;
    }, []);
  }, [sessions, viewerId]);

  // While a page change is in flight the previous `meta` still describes the previous
  // filters, so hold the last known counts rather than flashing zeroes.
  const counts = useMemo<ScheduleCounts>(() => {
    if (!data?.meta?.counts) {
      return EMPTY_COUNTS;
    }
    return { ...EMPTY_COUNTS, ...data.meta.counts };
  }, [data]);

  // A new filter invalidates the current page number: page 4 of the old result set may not
  // exist in the new one.
  const handleFiltersChange = (next: ScheduleFilter[]) => {
    setFilters(next);
    setCurrentPage(1);
  };

  return {
    cards,
    counts,
    isLoading,
    isFetching,
    currentPage,
    totalPages: data?.meta?.totalPages ?? 1,
    filters,
    setFilters: handleFiltersChange,
  };
}
