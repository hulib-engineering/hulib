import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useDeepCompareMemo } from 'use-deep-compare';

import { AFTERNOON_TIME_START, EVENING_TIME_START, MORNING_TIME_START } from '@/libs/constants/date';
import { REFERENCE_MONDAY } from '@/utils/dateUtils';

export type TPeriodLabel = 'morning' | 'afternoon' | 'evening';
export type TDaySlots = Record<TPeriodLabel, string[]>;

type UtcSlot = {
  dayOfWeek: number;
  startTime: string;
};

const getPeriodLabel = (timeslot: string): TPeriodLabel => {
  const [hours, minutes] = timeslot.split(':').map(Number);
  const startTime = (hours ?? 0) + (minutes ?? 0) / 60;

  if (startTime >= MORNING_TIME_START && startTime < AFTERNOON_TIME_START) {
    return 'morning';
  }
  if (startTime >= AFTERNOON_TIME_START && startTime < EVENING_TIME_START) {
    return 'afternoon';
  }
  return 'evening';
};

const convertUtcToLocal = (slot: UtcSlot, localTz?: string) => {
  const tz = localTz ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [hours, minutes] = slot.startTime.split(':').map(Number);

  // adjust weekday offset from reference Monday
  const anchorWeekday = REFERENCE_MONDAY.getUTCDay();
  const diff = (slot.dayOfWeek - anchorWeekday + 7) % 7;

  const utcDate = new Date(Date.UTC(
    REFERENCE_MONDAY.getUTCFullYear(),
    REFERENCE_MONDAY.getUTCMonth(),
    REFERENCE_MONDAY.getUTCDate() + diff,
    hours ?? 0,
    minutes ?? 0,
  ));

  const zoned = toZonedTime(utcDate, tz);

  return {
    weekday: zoned.getDay(),
    timeslot: format(zoned, 'HH:mm'),
  };
};

export const useTimeslotGrouping = (slots?: UtcSlot[], tz?: string) => {
  return useDeepCompareMemo(() => {
    if (!slots) {
      return {};
    }

    const grouped: Record<number, TDaySlots> = {};

    slots.forEach((slot) => {
      const local = convertUtcToLocal(slot, tz);
      const period = getPeriodLabel(local.timeslot);

      if (!grouped[local.weekday]) {
        grouped[local.weekday] = { morning: [], afternoon: [], evening: [] };
      }
      grouped[local.weekday]![period].push(local.timeslot);
    });

    Object.values(grouped).forEach((periods) => {
      (Object.keys(periods) as TPeriodLabel[]).forEach((p) => {
        periods[p]?.sort((a, b) => a.localeCompare(b));
      });
    });

    return grouped;
  }, [slots, tz]);
};
