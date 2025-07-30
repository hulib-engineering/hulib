'use client';

import { useRouter } from 'next/navigation';

import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import useAppSelector from '@/libs/hooks/useAppSelector';
import { useUpdateNotificationMutation } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import type { StatusType } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { Role } from '@/types/common';
import {
  getAdminNotificationRoute,
  getNotificationConfig,
  getNotificationRoute,
} from '@/utils/notificationUtils';

const useNotificationActions = () => {
  const router = useRouter();

  const role = useAppSelector(state => state.auth.userInfo.role);

  const [updateStatus, { isLoading: isUpdatingStatus }]
    = useUpdateReadingSessionMutation();
  const [updateNotification] = useUpdateNotificationMutation();

  const markAsSeen = async (notificationId: string) => {
    await updateNotification({ id: notificationId }).unwrap();
  };

  const handleStatusChange = async (
    sessionId: number,
    newStatus: StatusType,
    notification: Notification,
  ) => {
    try {
      await updateStatus({
        id: sessionId,
        sessionStatus: newStatus,
      }).unwrap();

      if (
        notification.type.name === NOTIFICATION_TYPES.SESSION_REQUEST.name
        && !notification.seen
      ) {
        await markAsSeen(notification.id.toString());
      }

      pushSuccess('Status updated successfully!');
    } catch (error) {
      pushError('Failed to update status. Please try again.');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    const config = getNotificationConfig(notification.type.name);

    if (!config.isClickable) {
      return;
    }

    if (!notification.seen) {
      await markAsSeen(notification.id.toString());
    }

    const route
      = role.id === Role.ADMIN
        ? getAdminNotificationRoute(notification)
        : getNotificationRoute(notification);
    router.push(route);
  };

  const handleSeeDetail = async (notification: Notification) => {
    if (!notification.seen) {
      await markAsSeen(notification.id.toString());
    }
    router.push('/schedule-meeting/weekly-schedule');
  };

  return {
    handleStatusChange,
    handleNotificationClick,
    handleSeeDetail,
    markAsSeen,
    isUpdatingStatus,
  };
};

export default useNotificationActions;
