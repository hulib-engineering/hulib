import { api } from '@/libs/services/api';
import getAuthorDetail from '@/libs/services/modules/user/getAuthorDetail';

import getReadingSessionOfUser from './getReadingSessionOfUser';
import getUsersById from './getUserById';
import getUsers from './getUsers';
import updateUserStatus from './updateUserStatus';
import upgradeUser from './upgradeUser';

const authenticationApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Users'],
});

export const userApi = authenticationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getUsers: getUsers(build),
    getAuthorDetail: getAuthorDetail(build),
    getUsersById: getUsersById(build),
    updateUserStatus: updateUserStatus(build),
    upgradeUser: upgradeUser(build),
    getReadingSessionOfUser: getReadingSessionOfUser(build),
  }),
  overrideExisting: false,
});

export const {
  useGetAuthorDetailQuery,
  useGetUsersQuery,
  useGetUsersByIdQuery,
  useUpdateUserStatusMutation,
  useUpgradeUserMutation,
  useGetReadingSessionOfUserQuery,
}: any = userApi;
