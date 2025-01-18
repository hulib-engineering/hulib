import { api } from '@/libs/services/api';
import getAuthorDetail from '@/libs/services/modules/user/getAuthorDetail';

const authenticationApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['User', 'Author'],
});

export interface Author {
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

export const userApi = authenticationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getAuthorDetail: getAuthorDetail(build),
  }),
  overrideExisting: false,
});

export const { useGetAuthorDetailQuery }: any = userApi;
