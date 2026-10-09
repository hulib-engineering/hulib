import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import type { CardVariant } from '@/features/users/types/profile';

/**
 * A session as the schedule grid needs it: the raw record plus the card variant
 * derived for a specific viewer at a specific moment.
 */
export type MeetingCardModel = {
  session: ReadingSession;
  variant: CardVariant;
  /** The other participant — the counterpart in the booking. */
  counterpart: ReadingSession['reader'];
  /** Whether the viewer is the Liber (reader) who sent the request. */
  isViewerLiber: boolean;
};

export const SCHEDULE_FILTERS = [
  'all',
  'right_now',
  'upcoming',
  'requests',
  'done',
  'missed',
] as const;

export type ScheduleFilter = (typeof SCHEDULE_FILTERS)[number];

export type ScheduleCounts = Record<ScheduleFilter, number>;
