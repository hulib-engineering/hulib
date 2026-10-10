'use client';

import { useMemo, useState } from 'react';

import type { MeetingCardModel, ScheduleCounts } from '../types';
import { countByFilter } from '../utils/filters';
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
  setCurrentPage: (page: number) => void;
};

/**
 * Loads the viewer's bookings, newest first, one page at a time.
 *
 * One request covers both sides of the product: the backend already scopes the list to
 * sessions where the caller is either the human book or the reader, so a Liber and a Huber
 * see the same payload and differ only in how `resolveVariant` labels each pending session.
 *
 * Pagination is server-side, driven by `meta.totalPages`. Note that the header's
 * "Type of meeting" filter is still client-side, so both it and the per-option counts
 * describe the current page rather than the whole history.
 */
export function useScheduleMeetings(): UseScheduleMeetingsResult {
  const viewerId = useAppSelector(state => state.auth.userInfo?.id);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useGetReadingSessionsQuery({
    limit: PAGE_SIZE,
    page: currentPage,
  });

  const sessions = data?.data;

  const cards = useMemo<MeetingCardModel[]>(() => {
    if (!Array.isArray(sessions)) {
      return [];
    }

    // Newest booking first. The backend offers no sort, and `createdAt` is the only field
    // that answers "which request is newest" — `startedAt` answers "which meeting is soonest",
    // which is a different question and moves as the calendar does.
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

  const counts = useMemo(() => countByFilter(cards), [cards]);

  return {
    cards,
    counts,
    isLoading,
    isFetching,
    currentPage,
    totalPages: data?.meta?.totalPages ?? 1,
    setCurrentPage,
  };
}
