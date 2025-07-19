import getReadingSessionOfUser from './getReadingSessionOfUser';
import getUsersById from './getUserById';
import getUsers from './getUsers';
import updateUserStatus from './updateUserStatus';
import upgradeUser from './upgradeUser';
import getAuthorDetail from '@/libs/services/modules/user/getAuthorDetail';
import { api } from '@/libs/services/api';

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
  useGetUsersQuery,
  useGetUsersByIdQuery,
  useLazyGetUsersByIdQuery,
  useUpdateUserStatusMutation,
  useUpgradeUserMutation,
  useGetReadingSessionOfUserQuery,
}: any = userApi;
