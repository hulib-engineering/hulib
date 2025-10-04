import getReadingSessionOfUser from './getReadingSessionOfUser';
import getUsersById from './getUserById';
import getUsers from './getUsers';
import updateUserStatus from './updateUserStatus';
import upgradeUser from './upgradeUser';
import addStoryToMyFavorites from './addStoryToMyFavorites';
import getAuthorDetail from './getAuthorDetail';
import removeStoryFromMyFavorites from './removeStoryFromMyFavorites';
import getMyFavorites from './getMyFavorites';
import removeMyFavorites from './removeMyFavorites';

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
    addStoryToMyFavorites: addStoryToMyFavorites(build),
    removeStoryFromMyFavorites: removeStoryFromMyFavorites(build),
    getMyFavorites: getMyFavorites(build),
    removeMyFavorites: removeMyFavorites(build),
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
  useAddStoryToMyFavoritesMutation,
  useRemoveStoryFromMyFavoritesMutation,
  useGetMyFavoritesQuery,
  useRemoveMyFavoritesMutation,
}: any = userApi;
