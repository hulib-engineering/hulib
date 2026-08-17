import type { TUserDetail } from '../types';
import type { LearningType } from '../types/profile';

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
