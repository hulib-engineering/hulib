import clsx from 'clsx';
import { useMemo, useState } from 'react';

import NotificationItem from '@/components/notification/NotificationItem';
import NotificationSkeleton from '@/components/notification/NotificationSkeleton';
import { useGetNotificationsQuery } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';

import Button from '../button/Button';

const NotificationPage = () => {
  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  const {
    data: notificationsResponse,
    isLoading,
    error,
  } = useGetNotificationsQuery({
    page,
    limit: 10,
  });

  useMemo(() => {
    if (notificationsResponse?.data) {
      const filteredNotifications = notificationsResponse.data.filter(
        (notification: Notification) =>
          notification.type.id !== NOTIFICATION_TYPES.OTHER.id,
      );
      setAllNotifications((prev) => [
        ...prev,
        ...filteredNotifications.filter(
          (newNotif: any) => !prev.some((notif) => notif.id === newNotif.id),
        ),
      ]);
    }
  }, [notificationsResponse]);

  const sortedNotifications = useMemo(() => {
    return [...allNotifications].sort((a, b) => {
      if (
        a.type.name === NOTIFICATION_TYPES.SESSION_REQUEST.name &&
        b.type.name !== NOTIFICATION_TYPES.SESSION_REQUEST.name
      )
        return -1;
      if (
        a.type.name !== NOTIFICATION_TYPES.SESSION_REQUEST.name &&
        b.type.name === NOTIFICATION_TYPES.SESSION_REQUEST.name
      )
        return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allNotifications]);

  const handleViewAllNotifications = () => {
    if (notificationsResponse?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-[100vw]">
      <div className="border-b p-1">
        <h2 className="ml-3 text-[28px] font-bold">Notification</h2>
      </div>
      <div className="overflow-y-auto">
        {isLoading && page === 1 && <NotificationSkeleton count={5} />}

        {error && (
          <div className="p-4 text-center text-red-500">
            Failed to load notifications
          </div>
        )}

        {!isLoading && !error && sortedNotifications.length === 0 && (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        )}

        {!isLoading &&
          !error &&
          sortedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              // onMarkAsRead={handleMarkAsRead}
              // onAction={handleAction}
            />
          ))}

        {/* Loading skeleton for pagination */}
        {isLoading && page > 1 && <NotificationSkeleton count={3} />}
      </div>
      <div className="p-2">
        <Button
          className={clsx(
            'w-full border-2 border-gray-400 !bg-white py-2 text-center text-sm text-blue-500',
            !notificationsResponse?.hasNextPage &&
              'cursor-not-allowed opacity-50',
          )}
          onClick={handleViewAllNotifications}
          disabled={!notificationsResponse?.hasNextPage || isLoading}
        >
          {isLoading && page > 1 ? 'Loading...' : 'See previous notifications'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationPage;
