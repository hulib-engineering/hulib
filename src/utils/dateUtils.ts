import { format } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import type { Locale } from 'date-fns/locale';
import { TZ_ABBREVS } from '@/libs/constants'; // in v3, Locale is here

export const toLocaleISO = (dateToConvert: Date) => {
  const offsetMs = dateToConvert.getTimezoneOffset() * 60 * 1000;
  const msLocal = dateToConvert.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  return dateLocal.toISOString();
};

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

export const getGMTOffset = (date: Date = new Date()): string => {
  const offsetMinutes = date.getTimezoneOffset(); // in minutes, opposite sign
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;

  // Flip the sign because getTimezoneOffset returns inverted values
  const sign = offsetMinutes <= 0 ? '+' : '-';

  return `GMT${sign}${offsetHours}${offsetMins ? `:${String(offsetMins).padStart(2, '0')}` : ''}`;
};

export const REFERENCE_MONDAY = new Date('1970-01-05T00:00:00Z'); // neutral anchor Monday UTC

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
export const formatTimezone = (tz: string) => {
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

  return `${city} ${!abbr.startsWith('GMT') ? `(${abbr})` : ''} | ${offset}`;
};

export const CURRENT_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
