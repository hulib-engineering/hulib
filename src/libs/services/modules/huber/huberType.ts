import type { Topic } from '@/libs/services/modules/topics/topicType';

export type Huber = {
  id: number;
  email: string;
  password: string;
  provider: string;
  socialId: string | null;
  fullName: string;
  birthday: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  genderId: number;
  roleId: number;
  role?: { id: number; path: string };
  statusId: number;
  approval: string;
  photoId: string;
  address: string | null;
  parentPhoneNumber: string | null;
  phoneNumber: string | null;
  bio: string;
  videoUrl: string;
  education: string;
  educationStart: string | null;
  rating: number | null;
  educationEnd: string | null;
  abtract?: string | null;
  photo: {
    id: number;
    path: string;
  };
  humanBookTopic: Array<{
    userId: number;
    topicId: number;
  }>;
  sharingTopics?: Topic[];
};

export type HuberListParams = {
  page: number;
  limit: number;
  topicIds: string[];
  type?: 'recommended' | string;
};
