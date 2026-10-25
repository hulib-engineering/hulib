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

/**
 * The "Type of meeting" filters. These map one-to-one onto the backend's `sessionStatuses`
 * query param, so filtering is server-side and the counts are exact across every page.
 *
 * These are coarser than `CardVariant` on purpose: `approved` is one status but two card
 * appearances (`right_now` / `upcoming`), because "is it happening now" is a clock question
 * the status cannot answer. The filter picks the status; the card resolves the variant.
 */
export const SCHEDULE_FILTERS = [
  'all',
  'approved',
  'pending',
  'finished',
  'missed',
] as const;

export type ScheduleFilter = (typeof SCHEDULE_FILTERS)[number];

/**
 * Filter value -> i18n key. Two of them differ: the filter speaks the backend's status
 * vocabulary (`pending`, `finished`) while the UI says "Requests" and "Done". Keeping the
 * mapping explicit avoids interpolating `filter.${value}`, which would not type-check.
 */
export const FILTER_LABEL_KEY = {
  all: 'all',
  approved: 'approved',
  pending: 'requests',
  finished: 'done',
  missed: 'missed',
} as const satisfies Record<ScheduleFilter, string>;

export type FilterLabelKey = (typeof FILTER_LABEL_KEY)[ScheduleFilter];

/** A `Combobox` option. The combobox stores these whole objects, not bare strings. */
export type ScheduleFilterOption = {
  /**
   * Required by `Combobox.VisualMultiSelect`: it keys each chip on `id` and hands `id` back
   * to `onClear` when the chip's remove button is pressed. Without it, removal is a no-op.
   */
  id: ScheduleFilter;
  value: ScheduleFilter;
  label: string;
  count: number;
};

/** Per-status totals from `meta.counts`, plus the unfiltered total under `all`. */
export type ScheduleCounts = Record<ScheduleFilter, number>;
