import { api } from '@/libs/services/api';
import getAuthorDetail from '@/libs/services/modules/user/getAuthorDetail';

import getUsersById from './getUserById';
import getUsers from './getUsers';

const authenticationApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Users'],
});

export const userApi = authenticationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getUsers: getUsers(build),
    getAuthorDetail: getAuthorDetail(build),
    getUsersById: getUsersById(build),
  }),
  overrideExisting: false,
});

export const {
  useGetAuthorDetailQuery,
  useGetUsersQuery,
  useGetUsersByIdQuery,
}: any = userApi;
