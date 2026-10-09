import type { MeetingCardModel, ScheduleCounts, ScheduleFilter } from '../types';
import { SCHEDULE_FILTERS } from '../types';
import type { CardVariant } from '@/features/users/types/profile';

/**
 * Which card variants each filter option admits.
 *
 * `requests` deliberately spans both request variants: from the viewer's seat, a pending
 * session is either an invitation they must answer or a request they are waiting on, and
 * the header filter is about "requests" as a category, not about which side you are on.
 */
const FILTER_VARIANTS: Record<ScheduleFilter, readonly CardVariant[] | 'all'> = {
  all: 'all',
  right_now: ['right_now'],
  upcoming: ['upcoming'],
  requests: ['invitation', 'my_request'],
  done: ['done'],
  missed: ['missed'],
};

export function matchesFilter(card: MeetingCardModel, filter: ScheduleFilter): boolean {
  const allowed = FILTER_VARIANTS[filter];
  if (allowed === 'all') {
    return true;
  }
  return allowed.includes(card.variant);
}

/** An empty selection means "no narrowing", matching the existing my-schedule filter. */
export function applyFilters(cards: MeetingCardModel[], filters: readonly ScheduleFilter[]): MeetingCardModel[] {
  const active = filters.filter(filter => filter !== 'all');
  if (active.length === 0) {
    return cards;
  }
  return cards.filter(card => active.some(filter => matchesFilter(card, filter)));
}

export function countByFilter(cards: MeetingCardModel[]): ScheduleCounts {
  const counts = SCHEDULE_FILTERS.reduce((acc, filter) => {
    acc[filter] = 0;
    return acc;
  }, {} as ScheduleCounts);

  cards.forEach((card) => {
    SCHEDULE_FILTERS.forEach((filter) => {
      if (matchesFilter(card, filter)) {
        counts[filter] += 1;
      }
    });
  });

  return counts;
}
