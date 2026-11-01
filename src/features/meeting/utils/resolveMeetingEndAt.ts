type Clock = {
  hours: number;
  minutes: number;
};

type SessionEndFields = {
  startedAt?: string | Date | null;
  startTime?: string | null;
  endTime?: string | null;
  endedAt?: string | Date | null;
};

const CLOCK = /^(\d{1,2}):(\d{2})(?::\d{2})?$/;

const parseClock = (value?: string | null): Clock | null => {
  if (!value) {
    return null;
  }

  const match = CLOCK.exec(value.trim());
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
};

const toDate = (value?: string | Date | null): Date | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Instant the reading room should hang up.
 *
 * Use API `endedAt` (full ISO). Do not build a local Date from `endTime`
 * "HH:mm" — those labels are not the viewer's wall clock. Session 4014 had
 * `endedAt` 05:54Z but `startTime` "06:30"; treating 07:00 as Vietnam local
 * produced 00:00Z and hung up immediately.
 *
 * If `endedAt` is missing, add the `endTime - startTime` duration onto
 * `startedAt` so the deadline stays in the same timezone as the ISO times.
 */
export const resolveMeetingEndAt = (session: SessionEndFields): Date | null => {
  const ended = toDate(session.endedAt);
  if (ended) {
    return ended;
  }

  const started = toDate(session.startedAt);
  const startClock = parseClock(session.startTime);
  const endClock = parseClock(session.endTime);
  if (!started || !startClock || !endClock) {
    return null;
  }

  let durationMin
    = endClock.hours * 60 + endClock.minutes - (startClock.hours * 60 + startClock.minutes);
  if (durationMin <= 0) {
    durationMin += 24 * 60;
  }

  return new Date(started.getTime() + durationMin * 60_000);
};
