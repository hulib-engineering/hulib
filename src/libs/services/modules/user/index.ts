import { api } from '@/libs/services/api';
import getAuthorDetail from '@/libs/services/modules/user/getAuthorDetail';

const authenticationApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['User'],
});

export const userApi = authenticationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getAuthorDetail: getAuthorDetail(build),
  }),
  overrideExisting: false,
});

export const { useGetAuthorDetailQuery }: any = userApi;
