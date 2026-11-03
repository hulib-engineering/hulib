import type { TUserDetail } from '../types';
import type { LearningType } from '../types/profile';
import { calculateAge } from '@/utils/dateUtils';

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

export type SafetyRequirement = 'birthday' | 'guardian';

/** What a user must still fill in before booking/hosting meetings: a birthday, or an emergency contact if under 18. */
export function getSafetyRequirement(user?: { birthday?: string | null; parentPhoneNumber?: string | null; parentEmail?: string | null } | null): SafetyRequirement | null {
  if (!user?.birthday) {
    return 'birthday';
  }
  if (calculateAge(user.birthday) < 18 && !user.parentPhoneNumber && !user.parentEmail) {
    return 'guardian';
  }
  return null;
}

export const safetyRequirementPath = (userId: number | string) => `/users/${userId}?tab=personal_info&safety=1`;
