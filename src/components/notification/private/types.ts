import { StatusEnum } from '@/types/common';

// The backend returns sessionStatus casing inconsistently (e.g. "pending" vs "Pending"),
// so compare case-insensitively instead of relying on exact StatusEnum casing.
export function isPendingSessionStatus(sessionStatus?: string | null) {
  return sessionStatus?.toLowerCase() === StatusEnum.Pending.toLowerCase();
}

export function isApprovedSessionStatus(sessionStatus?: string | null) {
  return sessionStatus?.toLowerCase() === StatusEnum.Approved.toLowerCase();
}

export function isRejectedSessionStatus(sessionStatus?: string | null) {
  return sessionStatus?.toLowerCase() === StatusEnum.Rejected.toLowerCase();
}

/**
 * True once a session request has been accepted or declined.
 *
 * The backend reports those decisions on the *same* `sessionRequest` payload — only
 * `relatedEntity.sessionStatus` distinguishes them — so the notification type alone cannot
 * tell a fresh request apart from an accepted or declined one.
 */
export function isDecidedSessionStatus(sessionStatus?: string | null) {
  return isApprovedSessionStatus(sessionStatus) || isRejectedSessionStatus(sessionStatus);
}

export enum NotificationType {
  SESSION_REQUEST = 'sessionRequest',
  ACCOUNT_UPGRADE = 'account',
  STORY_REVIEW = 'reviewStory',
  STORY_REACTION = 'reactStory',
  STORY_SHARE = 'shareStory',
  STORY_PUBLISH = 'publishStory',
  STORY_REJECTION = 'rejectStory',
  HUBER_REPORT = 'huberReported',
  HUBER_WARNING = 'huberWarning',
  HUBER_REJECTION = 'rejectHuber',
  SESSION_REJECTION = 'rejectReadingSession',
  SESSION_APPROVAL = 'approveReadingSession',
  SESSION_CANCELLATION = 'cancelReadingSession',
  SESSION_MISS = 'missReadingSession',
  /**
   * Sent to the *Huber* when the post-meeting cron finds their attendance column still empty.
   * Distinct from SESSION_MISS, which is the reader-facing "you didn't join" message.
   */
  HUBER_NO_SHOW = 'huberNoShowReadingSession',
  /**
   * Sent to the reader when the session was auto-cancelled because the Huber never
   * approved or rejected it. Distinct from SESSION_CANCELLATION, which is a
   * Liber-initiated cancellation carrying a mandatory reason.
   */
  SESSION_AUTO_CANCELLATION = 'autoCancelReadingSession',
  SESSION_COMPLETION = 'sessionFinish',
  USER_APPEAL = 'userAppeal',
  APPEAL_RESPONSE = 'appealResponse',
  OTHER = 'other',
  UPDATE_TIME_SLOT_REMINDER = 'updateTimeSlotReminder',
}
