'use client';

import { useMemo } from 'react';

import type { MeetingCardModel, ScheduleCounts } from '../types';
import { countByFilter } from '../utils/filters';
import { isViewerLiber, resolveCounterpart, resolveVariant } from '../utils/variant';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import { useAppSelector } from '@/libs/hooks';

export type UseScheduleMeetingsResult = {
  cards: MeetingCardModel[];
  counts: ScheduleCounts;
  isLoading: boolean;
};

/**
 * Loads every booking the viewer participates in and turns it into card models.
 *
 * One request covers both sides of the product: the backend already scopes the list to
 * sessions where the caller is either the human book or the reader, so a Liber and a Huber
 * see the same payload and differ only in how `resolveVariant` labels each pending session.
 */
export function useScheduleMeetings(): UseScheduleMeetingsResult {
  const viewerId = useAppSelector(state => state.auth.userInfo?.id);

  const { data: sessions, isLoading } = useGetReadingSessionsQuery({});

  const cards = useMemo<MeetingCardModel[]>(() => {
    if (!Array.isArray(sessions)) {
      return [];
    }

    // The backend offers no sort, and the grid must show the soonest meeting first.
    const sorted = [...sessions].sort(
      (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
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

  return { cards, counts, isLoading };
}
