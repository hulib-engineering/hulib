import { HUBER_OWN_TABS, LIBER_OWN_TABS, VIEWER_TABS } from '../constants/profile.contant';
import type { TUserDetail } from '../types';
import type { CardVariant, LearningType } from '../types/profile';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';

export function buildUserData(userDetail: TUserDetail) {
  return {
    journey: (userDetail as any)?.bio,
    learningPath: (userDetail as any)?.educations?.map((e: any) => ({
      id: e.id,
      type: (e.type ?? 'university') as LearningType,
      name: e.major,
      organization: e.institution,
      startedAt: e.startedAt,
      endedAt: e.endedAt,
      isPublic: e.isPublic ?? false,
    })),
    works: (userDetail as any)?.works,
    topics: userDetail.humanBookTopic?.map(h => h.topic),
  };
}

export function buildUserTabs(role: 'huber' | 'viewer' | 'liber') {
  if (role === 'huber') {
    return HUBER_OWN_TABS;
  } else if (role === 'liber') {
    return LIBER_OWN_TABS;
  } else {
    return VIEWER_TABS;
  }
}

export function getCountdown(startedAt: string): string {
  const diff = new Date(startedAt).getTime() - Date.now();
  if (diff <= 0) {
    return '';
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) {
    return `${days}d ${hours}h left`;
  }
  if (hours > 0) {
    return `${hours}h ${mins}m left`;
  }
  return `${mins}m left`;
}

export function getVariant(session: ReadingSession, isLiber: boolean): CardVariant {
  const status = session.sessionStatus?.toLowerCase();
  const now = new Date();
  const startedAt = new Date(session.startedAt);
  const endedAt = new Date(session.endedAt);

  if (status === 'approved') {
    if (now >= startedAt && now <= endedAt) {
      return 'right_now';
    }
    return 'upcoming';
  }
  if (status === 'pending') {
    return isLiber ? 'my_request' : 'invitation';
  }
  if (status === 'finished') {
    return 'done';
  }
  if (status === 'missed') {
    return 'missed';
  }
  return 'upcoming';
}
