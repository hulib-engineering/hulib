import type { ScheduleFilter } from '../types';
import type { StatusType } from '@/libs/services/modules/reading-session/createNewReadingSession';

/**
 * Translate a UI filter into the backend's `sessionStatuses` query param.
 *
 * `all` means "send nothing" — the backend then applies its own default status set. Every
 * other filter maps to exactly one status, so a multi-select simply unions the results.
 */
export function filterToStatuses(filters: readonly ScheduleFilter[]): StatusType[] {
  const specific = filters.filter(filter => filter !== 'all');
  return Array.from(new Set(specific)) as StatusType[];
}

export const FILTER_TO_STATUS: Record<ScheduleFilter, StatusType | null> = {
  all: null,
  approved: 'approved',
  pending: 'pending',
  finished: 'finished',
  missed: 'missed',
};
