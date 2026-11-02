import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import type {
  UpcomingReadingSession,
  UpcomingReadingSessionsResponse,
} from '@/libs/services/modules/reading-session/getUpcomingReadingSessions';
import { resolveCounterpart } from '@/features/users/features/schedule/utils/variant';

const isApproved = (status?: string | null) => status?.toLowerCase() === 'approved';

/**
 * Temporary adapter for the period before `GET /reading-sessions/upcoming` is
 * deployed. It reproduces the endpoint's contract (approved + participant
 * scoped, `endedAt >= now`, `startedAt <= now + withinHours`, ascending) from
 * the existing list endpoint.
 */
export function toUpcomingSessions(
  sessions: ReadingSession[] | undefined,
  viewerId: number | string | undefined,
  now: Date,
  withinHours: number,
): UpcomingReadingSessionsResponse {
  const nowMs = now.getTime();
  const windowEndMs = nowMs + withinHours * 60 * 60 * 1000;

  const items = (Array.isArray(sessions) ? sessions : [])
    .filter((session) => {
      if (!isApproved(session.sessionStatus)) {
        return false;
      }
      const startedAtMs = new Date(session.startedAt).getTime();
      const endedAtMs = new Date(session.endedAt).getTime();
      if (Number.isNaN(startedAtMs) || Number.isNaN(endedAtMs)) {
        return false;
      }
      return endedAtMs >= nowMs && startedAtMs <= windowEndMs;
    })
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .map<UpcomingReadingSession>((session) => {
      const counterpart = resolveCounterpart(session, viewerId);

      return {
        id: Number(session.id),
        sessionStatus: session.sessionStatus,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        counterpart: {
          id: counterpart.id,
          fullName: counterpart.fullName,
          photo: counterpart.photo,
          role: counterpart.role,
        },
      };
    });

  return {
    data: items,
    meta: {
      count: items.length,
      serverTime: now.toISOString(),
      withinHours,
    },
  };
}
