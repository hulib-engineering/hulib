import type { FilterKey } from './types';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import type { Timeslot } from '@/utils/convertTimeSlotToUtc';

export function buildPendingFromGrouped(
  grouped: Record<number, { morning: string[]; afternoon: string[]; evening: string[] }>,
): Timeslot[] {
  return Object.entries(grouped).flatMap(([jsWeekdayStr, periods]) => {
    const jsWeekday = Number(jsWeekdayStr);
    return [...periods.morning, ...periods.afternoon, ...periods.evening]
      .map(time => ({ dayOfWeek: jsWeekday, startTime: time }));
  });
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = (h ?? 0) < 12 ? 'AM' : 'PM';
  const displayHour = (h ?? 0) % 12 === 0 ? 12 : (h ?? 0) % 12;
  return `${displayHour}:${String(m ?? 0).padStart(2, '0')} ${period}`;
}

export function getStatusPriority(s: ReadingSession, userId: number | string | undefined): number {
  const status = s.sessionStatus?.toLowerCase();
  if (status === 'approved') {
    return 0;
  }
  const isLiber = Number(userId) === Number(s.reader?.id);
  if (status === 'pending') {
    return isLiber ? 2 : 1;
  }
  if (status === 'finished') {
    return 3;
  }
  if (status === 'missed') {
    return 4;
  }
  return 5;
}

export function sortSessions(
  sessions: ReadingSession[],
  userId: number | string | undefined,
): ReadingSession[] {
  return [...sessions].sort((a, b) => {
    const pa = getStatusPriority(a, userId);
    const pb = getStatusPriority(b, userId);
    if (pa !== pb) {
      return pa - pb;
    }
    return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
  });
}

export function filterSessions(
  sessions: ReadingSession[],
  filter: FilterKey,
  userId: number | string | undefined,
): ReadingSession[] {
  if (filter === 'all') {
    return sessions;
  }
  return sessions.filter((s) => {
    const status = s.sessionStatus?.toLowerCase();
    const isLiber = Number(userId) === Number(s.reader?.id);
    if (filter === 'invitation') {
      return status === 'pending' && !isLiber;
    }
    if (filter === 'my_request') {
      return status === 'pending' && isLiber;
    }
    if (filter === 'done') {
      return status === 'finished';
    }
    if (filter === 'missed') {
      return status === 'missed';
    }
    return true;
  });
}
