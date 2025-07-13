import { api } from '../../api';
import createNotification from './createNotification';
import getNotifications from './getNotifications';
import updateNotification from './updateNotification';

const apiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Notification'],
});

export const notificationApi = apiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    createNotification: createNotification(build),
    getNotifications: getNotifications(build),
    updateNotification: updateNotification(build),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
}: any = notificationApi;
