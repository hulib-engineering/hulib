import type { Topic } from '@/libs/services/modules/user/userType';

export interface User {
  id: number;
  fullName: string | null;
  birthday: string | null;
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
  photo: {
    id: number;
    path: string;
  };
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  address: string | null;
  phoneNumber: string | null;
  parentPhoneNumber: string | null;
  bio: string | null;
  videoUrl: string | null;
  education: string | null;
  educationStart: string | null;
  educationEnd: string | null;
  email: string | null;
  humanBookTopic: Topic[];
  humanBookTopicId: Topic[];
}
