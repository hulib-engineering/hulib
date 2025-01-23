export interface User {
  id: number;
  fullName: string | null;
  birthday: string | null;
  gender: {
    id: number;
    name: string;
    __entity: string;
  };
  role: {
    id: number;
    name: string;
    __entity: string;
  };
  status: {
    id: number;
    name: string;
    __entity: string;
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
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}
