import { parse } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

import { REFERENCE_MONDAY } from '@/utils/dateUtils';

export type Timeslot = {
  dayOfWeek: number;
  startTime: string;
};

export function convertTimeSlotToUtc(slot: Timeslot): Timeslot {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = parse(slot.startTime, 'HH:mm', REFERENCE_MONDAY);
  const anchorWeekday = REFERENCE_MONDAY.getDay();
  const diff = (slot.dayOfWeek - anchorWeekday + 7) % 7;
  localDate.setDate(REFERENCE_MONDAY.getDate() + diff);
  const utcDate = fromZonedTime(localDate, tz);
  return {
    dayOfWeek: utcDate.getUTCDay(),
    startTime: formatInTimeZone(utcDate, 'UTC', 'HH:mm'),
  };
}
