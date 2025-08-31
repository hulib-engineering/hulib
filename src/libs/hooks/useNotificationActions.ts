'use client';

import { useRouter } from 'next/navigation';

import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useUpdateNotificationMutation } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import type { StatusType } from '@/libs/services/modules/reading-session/createNewReadingSession';

const useNotificationActions = () => {
  const router = useRouter();

  // const role = useAppSelector(state => state.auth.userInfo.role);

  const [updateSessionStatus] = useUpdateReadingSessionMutation();
  const [updateNotification] = useUpdateNotificationMutation();

  const markAsSeen = async (notificationId: string) => {
    await updateNotification({ id: notificationId }).unwrap();
  };

  const handleApproveOrRejectSession = async (
    sessionId: number,
    newStatus: StatusType,
  ) => {
    try {
      await updateSessionStatus({
        id: sessionId,
        sessionStatus: newStatus,
      }).unwrap();
      pushSuccess('Status updated successfully!');
    } catch (error) {
      pushError('Failed to update status. Please try again.');
    }
  };

  // const handleNotificationClick = async (notification: Notification) => {
  //   const cfg = notificationConfig[notification.type];
  //
  //   if (!cfg.route) {
  //     return;
  //   }
  //
  //   if (!notification.seen) {
  //     await markAsSeen(notification.id.toString());
  //   }
  //
  //   router.push(cfg.route(notification.relatedEntityId));
  // };

  const handleSeeDetail = async (notification: Notification) => {
    if (!notification.seen) {
      await markAsSeen(notification.id.toString());
    }
    router.push('/schedule-meeting/weekly-schedule');
  };

  return {
    handleApproveOrRejectSession,
    handleSeeDetail,
    markAsSeen,
  };
};

export default useNotificationActions;
