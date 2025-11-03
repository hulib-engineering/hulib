import type { z } from 'zod';

import type { Topic } from '@/libs/services/modules/user/userType';
import type { EducationValidation, WorkExperienceValidation } from '@/validations/ProfileValidation';

export type User = {
  id: number;
  email: string;
  provider: string;
  socialId?: string;
  fullName: string;
  birthday: string;
  approval: string | null;
  address?: string;
  parentFullname?: string;
  parentPhoneNumber?: string;
  phoneNumber?: string;
  bio: string | null;
  videoUrl: string | null;
  education: string | null;
  educationStart: string | null;
  educationEnd: string | null;
  gender: {
    id: number;
    name: string;
  };
  role: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  file: any | null;
  photo?: { id: string; path: string };
  humanBookTopic: {
    userId: number;
    topicId: number;
    topic: Topic;
  }[];
  topicsOfInterest: Topic[];
  sharingTopics: Topic[];
  feedbackBys: {
    id: number;
    content: string;
    rating: number;
    createdAt: string;
    feedbackBy: {
      id: number;
      fullName: string;
      photo?: string;
    };
  }[];
  works: (z.infer<typeof WorkExperienceValidation> & { id: number })[];
  educations: (z.infer<typeof EducationValidation> & { id: number })[];
};
