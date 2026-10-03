import { format } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import type { Locale } from 'date-fns/locale';
import { TZ_ABBREVS } from '@/libs/constants'; // in v3, Locale is here

export const formatRelativeTime = (timestamp: number) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const secondsAgo = Math.floor((timestamp - Date.now()) / 1000);

  if (secondsAgo > -60) {
    return rtf.format(secondsAgo, 'second');
  }
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo > -60) {
    return rtf.format(minutesAgo, 'minute');
  }
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo > -24) {
    return rtf.format(hoursAgo, 'hour');
  }
  const daysAgo = Math.floor(hoursAgo / 24);
  return rtf.format(daysAgo, 'day');
};

export const toLocaleDateString = (dateString: string, locales: string): string => new Date(dateString).toLocaleDateString(locales, {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const toLocaleTimeString = (
  dateString: string,
  locales: string,
): string => {
  const locale: Locale = locales === 'vi' ? vi : enUS;

  return format(new Date(dateString), 'HH:mm', { locale });
};

const toDate = (value: string | number | Date | undefined | null): Date | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Re-labels a timestamp's UTC fields as local wall-clock fields so date-fns patterns render
 * the instant exactly as the API sent it, instead of shifting it into the viewer's timezone.
 *
 * `startedAt` is served as UTC, and the card must read the same calendar day the API
 * reported: `2026-10-02T21:45:00.000Z` is `02/10/2026`, not `03/10/2026` as a GMT+7 browser
 * would otherwise compute. Only the *date* is taken from this field, so the time half of the
 * shift is irrelevant; the meeting's clock time comes from `startTime` instead.
 */
export const toApiWallClock = (date: Date): Date => new Date(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDate(),
  date.getUTCHours(),
  date.getUTCMinutes(),
  date.getUTCSeconds(),
  date.getUTCMilliseconds(),
);

export type SessionTimeRange = {
  /** Calendar day of the meeting. Only the date is meaningful here. */
  startedAt: Date | null;
  /** The meeting's wall-clock start, e.g. "19:11", used verbatim. */
  startTime: string;
  /** The meeting's wall-clock end, e.g. "19:41", used verbatim. */
  endTime: string;
};

/**
 * Splits a reading session's timing out of a notification's `relatedEntity`.
 *
 * The two field pairs answer different halves of the question and are deliberately used for
 * different halves of the answer:
 *
 * - `startedAt` supplies the **date** only. Its time component is redundant — it duplicates
 *   the slot and drifts from it, since the backend writes both pairs once at creation and
 *   never recomputes (hulib-services `reading-sessions.service.ts:83-84`). A real payload
 *   carried `startedAt` `2026-10-02T21:45:00.000Z` beside `startTime` `"19:11"`.
 * - `startTime` / `endTime` supply the **time** only. These are bare `"HH:mm"` wall-clock
 *   strings with no timezone, and they are the times the meeting was actually booked for.
 *
 * Conflating the two is what produced the original bugs: `startTime` was being parsed as a
 * date (`new Date('19:11')` is an Invalid Date), which blanked the date label and threw a
 * `RangeError` on the approval/rejection card.
 */
export const resolveSessionTimeRange = (relatedEntity: unknown): SessionTimeRange => {
  const entity = (relatedEntity ?? {}) as {
    startedAt?: string | null;
    startTime?: string | null;
    endTime?: string | null;
  };
  return {
    startedAt: toDate(entity.startedAt),
    startTime: entity.startTime?.trim() ?? '',
    endTime: entity.endTime?.trim() ?? '',
  };
};

const WALL_CLOCK = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

/**
 * Renders a meeting's wall-clock time. `startTime`/`endTime` already arrive as `"19:11"`,
 * so that form is passed through untouched; a full ISO datetime is also accepted and reduced
 * to `"HH:mm"`. Anything else yields `''` rather than an `Invalid Date`.
 *
 * 24-hour in every language — a 12-hour `h:mm a` variant was tried and reverted, since the
 * "AM"/"PM" suffix has no counterpart in the Vietnamese UI and the design never shows one.
 * Language-dependence lives in `formatMeetingDateLabel` and `formatNotificationTimestamp`,
 * where weekday and month names genuinely differ.
 */
export const formatSessionTime = (value: string | number | Date | undefined | null, locales: string): string => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  const raw = String(value).trim();
  if (WALL_CLOCK.test(raw)) {
    return raw;
  }
  const parsed = toDate(raw);

  return parsed ? format(parsed, 'HH:mm', { locale: locales === 'vi' ? vi : enUS }) : '';
};

/**
 * "Thứ 3, 18/02/2026" style label for meeting date/time cards, taken from `startedAt`'s date
 * component. Vietnamese uses the colloquial numbered weekday ("Thứ 2".."Thứ 7", "Chủ Nhật")
 * rather than date-fns' spelled-out EEEE ("Thứ Ba"), so it's built manually instead of via
 * a format pattern.
 */
export const formatMeetingDateLabel = (value: string | number | Date | undefined | null, locales: string): string => {
  const parsed = toDate(value);
  if (!parsed) {
    return '';
  }
  const date = toApiWallClock(parsed);
  const datePart = format(date, 'dd/MM/yyyy');
  if (locales === 'vi') {
    const day = date.getDay();
    const weekday = day === 0 ? 'Chủ Nhật' : `Thứ ${day + 1}`;
    return `${weekday}, ${datePart}`;
  }
  const weekday = format(date, 'EEE', { locale: enUS });
  return `${weekday}, ${datePart}`;
};

/**
 * Footer timestamp for a notification card — "Mon 3 Feb 12:42" — representing when the
 * notification was created. Deliberately distinct from the meeting time in the card body:
 * the two answer different questions and can be days apart.
 *
 * Rendered on the same UTC basis as `formatMeetingDateLabel`, so the whole card reads exactly
 * as the API returned it.
 */
export const formatNotificationTimestamp = (value: string | number | Date | undefined | null, locales: string): string => {
  const parsed = toDate(value);
  if (!parsed) {
    return '';
  }
  const isVi = locales === 'vi';

  return format(toApiWallClock(parsed), 'EEE d MMM HH:mm', { locale: isVi ? vi : enUS });
};

export const getGMTOffset = (date: Date = new Date()): string => {
  const offsetMinutes = date.getTimezoneOffset(); // in minutes, opposite sign
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;

  // Flip the sign because getTimezoneOffset returns inverted values
  const sign = offsetMinutes <= 0 ? '+' : '-';

  return `GMT${sign}${offsetHours}${offsetMins ? `:${String(offsetMins).padStart(2, '0')}` : ''}`;
};

// Anchor Monday 00:00 UTC of the current week. Weekly slots are converted with today's offsets:
// a 1970 anchor uses historical ones (e.g. Asia/Ho_Chi_Minh was UTC+8), shifting slots by an hour
// against the booking flow, which converts real dates.
// ponytail: in DST zones, slots can be off by 1h during the week a DST switch happens; fix by storing
// slots with an IANA timezone instead of fixed UTC if DST markets matter.
const today = new Date();
export const REFERENCE_MONDAY = new Date(Date.UTC(
  today.getUTCFullYear(),
  today.getUTCMonth(),
  today.getUTCDate() - ((today.getUTCDay() + 6) % 7),
));

const formatOffset = (timeZone: string) => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { timeZone, timeZoneName: 'shortOffset' };
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);

  // Find offset part like "GMT+7"
  const offsetPart = parts.find(p => p.type === 'timeZoneName');
  if (!offsetPart) {
    return '';
  }

  // Clean up: remove "GMT+07:00" → "GMT+7"
  return offsetPart.value.replace(':00', '').replace('0', '');
};
export const formatTimezone = (tz: string, formatName?: string) => {
  const now = new Date();
  const city = tz.split('/').pop()?.replace('_', ' ') ?? tz;
  // Get abbreviation like "ICT"
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'short',
  });
  const parts = formatter.formatToParts(now);
  let abbr = parts.find(p => p.type === 'timeZoneName')?.value ?? '';

  // fallback to a custom map if Intl only gives GMT+X
  if (abbr.startsWith('GMT') && TZ_ABBREVS[tz]) {
    abbr = TZ_ABBREVS[tz];
  }
  // Get offset like "+07"
  const offset = formatOffset(tz);

  // Check if there's a matching formatName -- return default format (bottom line) otherwise
  if (formatName === 'noCity') {
    return `${!abbr.startsWith('GMT') ? `${abbr}` : ''} | ${offset}`;
  }

  return `${city} ${!abbr.startsWith('GMT') ? `(${abbr})` : ''} | ${offset}`;
};

export const CURRENT_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const calculateAge = (birthday: string | Date) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
