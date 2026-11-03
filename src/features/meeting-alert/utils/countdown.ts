export type CountdownState = 'now' | 'upcoming' | 'ended';

export type Countdown = {
  state: CountdownState;
  /** Whole minutes until the start. Zero for `now` / `ended`. */
  totalMinutes: number;
  hours: number;
  minutes: number;
};

const EMPTY: Omit<Countdown, 'state'> = {
  totalMinutes: 0,
  hours: 0,
  minutes: 0,
};

/**
 * Clock-only view of one session. `startedAt`/`endedAt` are ISO strings from the
 * API — never the local `startTime`/`endTime` clock strings, which are in the
 * host's timezone.
 *
 * Returns `null` when the start instant is unusable, so callers can drop the
 * row instead of rendering a countdown for a session that cannot be placed.
 * An unusable end instant still counts as "now" once the start has passed.
 */
export function getCountdown(
  startedAt: string | Date | null | undefined,
  endedAt: string | Date | null | undefined,
  now: Date = new Date(),
): Countdown | null {
  const startMs = startedAt ? new Date(startedAt).getTime() : Number.NaN;
  if (Number.isNaN(startMs)) {
    return null;
  }

  const nowMs = now.getTime();
  const endMs = endedAt ? new Date(endedAt).getTime() : Number.NaN;

  if (!Number.isNaN(endMs) && nowMs >= endMs) {
    return { state: 'ended', ...EMPTY };
  }

  if (nowMs >= startMs) {
    return { state: 'now', ...EMPTY };
  }

  // Floor keeps "4h 5m" from becoming "4h 6m" on a 4h05m30s gap. Clamping to at
  // least one minute avoids a "0m" badge during the final minute.
  const totalMinutes = Math.max(1, Math.floor((startMs - nowMs) / 60_000));

  return {
    state: 'upcoming',
    totalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}
