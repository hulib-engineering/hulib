import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import type { CardVariant } from '@/features/users/types/profile';

type StatusComparable = {
  sessionStatus?: string | null;
};

const isPending = (status?: string | null) => status?.toLowerCase() === 'pending';
const isApproved = (status?: string | null) => status?.toLowerCase() === 'approved';
const isFinished = (status?: string | null) => status?.toLowerCase() === 'finished';
const isMissed = (status?: string | null) => status?.toLowerCase() === 'missed';

/**
 * Which side of the booking the viewer is on. The ids are typed as strings on the
 * frontend but are numbers on the wire, so they are compared numerically.
 */
export function isViewerHuber(session: StatusComparable & { humanBookId?: string | number | null }, viewerId?: string | number | null): boolean {
  if (viewerId === undefined || viewerId === null || session.humanBookId === undefined || session.humanBookId === null) {
    return false;
  }
  return Number(session.humanBookId) === Number(viewerId);
}

export function isViewerLiber(session: StatusComparable & { readerId?: string | number | null }, viewerId?: string | number | null): boolean {
  if (viewerId === undefined || viewerId === null || session.readerId === undefined || session.readerId === null) {
    return false;
  }
  return Number(session.readerId) === Number(viewerId);
}

/**
 * Resolve the card variant for one session, for one viewer, at one instant.
 *
 * The order below is the precedence order and is not arbitrary: `approved` splits into
 * `right_now` / `upcoming` purely on the clock, while `pending` splits on *which side of
 * the booking the viewer sits*, because the same status means "someone is waiting on me"
 * for a Huber and "I am waiting on someone" for a Liber.
 *
 * Returns `null` for statuses the grid does not render (`canceled`, `rejected`,
 * `unInitialized`). Those are also absent from the backend's default status filter, so
 * this branch is defensive rather than routinely hit.
 */
export function resolveVariant(
  session: StatusComparable & { humanBookId?: string | number | null; readerId?: string | number | null; startedAt?: string | Date | null; endedAt?: string | Date | null },
  viewerId?: string | number | null,
  now: Date = new Date(),
): CardVariant | null {
  const { sessionStatus } = session;

  if (isApproved(sessionStatus)) {
    const startedAt = session.startedAt ? new Date(session.startedAt).getTime() : Number.NaN;
    const endedAt = session.endedAt ? new Date(session.endedAt).getTime() : Number.NaN;

    // An unparseable or absent window cannot be proven "now", so fall through to upcoming
    // rather than showing a live badge for a meeting we cannot place on the clock.
    if (!Number.isNaN(startedAt) && !Number.isNaN(endedAt) && startedAt <= now.getTime() && now.getTime() < endedAt) {
      return 'right_now';
    }
    return 'upcoming';
  }

  if (isPending(sessionStatus)) {
    return isViewerHuber(session, viewerId) ? 'invitation' : 'my_request';
  }

  if (isFinished(sessionStatus)) {
    return 'done';
  }

  if (isMissed(sessionStatus)) {
    return 'missed';
  }

  return null;
}

/**
 * The counterpart is whoever the viewer is not. Falls back to the reader when the ids
 * do not identify the viewer at all, which can only happen before the auth store hydrates.
 */
export function resolveCounterpart(session: ReadingSession, viewerId?: string | number | null): ReadingSession['reader'] {
  return isViewerHuber(session, viewerId) ? session.reader : session.humanBook;
}

/** Whole days and hours remaining until a session starts, for the "Xd Yh left" badge. */
export function getTimeLeft(startedAt: string | Date | null | undefined, now: Date = new Date()): { days: number; hours: number } {
  const start = startedAt ? new Date(startedAt).getTime() : Number.NaN;
  if (Number.isNaN(start)) {
    return { days: 0, hours: 0 };
  }
  const diffMs = start - now.getTime();
  if (Number.isNaN(diffMs) || diffMs <= 0) {
    return { days: 0, hours: 0 };
  }
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  return { days: Math.floor(totalHours / 24), hours: totalHours % 24 };
}
