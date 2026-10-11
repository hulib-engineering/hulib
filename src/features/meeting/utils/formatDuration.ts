/** Zero-padded `HH:MM:SS` for the in-call recording badge. Pure — no React, no i18n. */

/**
 * Formats elapsed seconds as `HH:MM:SS`.
 *
 * Deliberately derives the value from a caller-supplied start timestamp rather than
 * counting ticks, so a re-render cannot make the badge drift. Hours are not wrapped at
 * 24 — a long session should keep counting rather than roll over to `00`.
 */
export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Number.isFinite(totalSeconds) && totalSeconds > 0 ? Math.floor(totalSeconds) : 0;

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const pad = (value: number) => String(value).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Whole seconds elapsed between `startedAt` and `now`, floored and never negative. */
export function elapsedSecondsSince(startedAt: number, now: number = Date.now()): number {
  const elapsed = Math.floor((now - startedAt) / 1000);
  return elapsed > 0 ? elapsed : 0;
}