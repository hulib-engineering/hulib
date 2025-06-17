'use client';

import { useCallback, useMemo, useState } from 'react';

import { useGetNotificationsQuery } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';
import { StatusEnum } from '@/types/common';

interface UseNotificationsProps {
  initialPage?: number;
  limit?: number;
  enablePagination?: boolean;
}

const useNotifications = ({
  initialPage = 1,
  limit = 5,
  enablePagination = false,
}: UseNotificationsProps = {}) => {
  const [page, setPage] = useState(initialPage);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  const {
    data: notificationsResponse,
    isLoading,
    error,
  } = useGetNotificationsQuery({
    page,
    limit,
  });

  // Filter logic extracted to separate function
  const filterNotifications = useCallback((notifications: Notification[]) => {
    return notifications.filter((notification) => {
      if (notification.type.id === NOTIFICATION_TYPES.OTHER.id) {
        return false;
      }

      if (notification.type.name === NOTIFICATION_TYPES.SESSION_REQUEST.name) {
        return notification.relatedEntity?.sessionStatus === StatusEnum.Pending;
      }

      return true;
    });
  }, []);

  // Sort logic extracted to separate function
  const sortNotifications = useCallback((notifications: Notification[]) => {
    return [...notifications].sort((a, b) => {
      if (
        a.type.name === NOTIFICATION_TYPES.SESSION_REQUEST.name &&
        b.type.name !== NOTIFICATION_TYPES.SESSION_REQUEST.name
      ) {
        return -1;
      }
      if (
        a.type.name !== NOTIFICATION_TYPES.SESSION_REQUEST.name &&
        b.type.name === NOTIFICATION_TYPES.SESSION_REQUEST.name
      ) {
        return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, []);

  useMemo(() => {
    if (!notificationsResponse?.data) return;

    const filteredNotifications = filterNotifications(
      notificationsResponse.data,
    );

    if (enablePagination) {
      setAllNotifications((prev) => {
        const newNotifications = filteredNotifications.filter(
          (newNotif) => !prev.some((notif) => notif.id === newNotif.id),
        );
        return [...prev, ...newNotifications];
      });
    } else {
      setAllNotifications(filteredNotifications);
    }
  }, [notificationsResponse, filterNotifications, enablePagination]);

  const notifications = useMemo(() => {
    return sortNotifications(allNotifications);
  }, [allNotifications, sortNotifications]);

  const loadNextPage = useCallback(() => {
    if (notificationsResponse?.hasNextPage && !isLoading) {
      setPage((prev) => prev + 1);
    }
  }, [notificationsResponse?.hasNextPage, isLoading]);

  const resetNotifications = useCallback(() => {
    setAllNotifications([]);
    setPage(initialPage);
  }, [initialPage]);

  return {
    notifications,
    isLoading,
    error,
    hasNextPage: notificationsResponse?.hasNextPage,
    currentPage: page,
    loadNextPage,
    resetNotifications,
    unseenNotificationsCount: notificationsResponse?.unseenCount,
  };
};

export default useNotifications;
