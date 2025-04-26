export interface Huber {
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
  humanBookTopic: Array<{
    userId: number;
    topicId: number;
  }>;
}

export interface HuberlistParams {
  page: number;
  limit: number;
  topicIds: string[];
}
