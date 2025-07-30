import type { Topic } from '@/libs/services/modules/user/userType';

export type User = {
  id: number;
  email: string | null;
  provider: string | null;
  socialId: string | null;
  fullName: string | null;
  birthday: string | null;
  approval: string | null;
  address: string | null;
  parentPhoneNumber: string | null;
  phoneNumber: string | null;
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
};
