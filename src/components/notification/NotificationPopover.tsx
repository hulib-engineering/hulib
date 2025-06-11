import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';

import NotificationItem from '@/components/notification/NotificationItem';
import NotificationSkeleton from '@/components/notification/NotificationSkeleton';
import { useGetNotificationsQuery } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';

import Button from '../button/Button';

interface NotificationPopoverProps {
  children: ReactNode;
}

const NotificationPopover: FC<NotificationPopoverProps> = ({ children }) => {
  const router = useRouter();

  const {
    data: notificationsResponse,
    isLoading,
    error,
  } = useGetNotificationsQuery({
    page: 1,
    limit: 10,
  });

  const notifications = useMemo(() => {
    if (!notificationsResponse?.data) return [];
    return notificationsResponse.data.filter(
      (notification: Notification) =>
        notification.type.id !== NOTIFICATION_TYPES.OTHER.id,
    );
  }, [notificationsResponse]);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
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
  }, [notifications]);

  return (
    <Popover className="relative">
      {({ open: _open }) => (
        <>
          <Popover.Button
            as="div"
            className="relative inline-flex items-center"
          >
            {children}
          </Popover.Button>
          <Popover.Panel
            className={clsx(
              'absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg focus:outline-none',
              'right-[-150px] h-[100vh] w-[100vw] md:right-0 md:h-auto md:w-80',
            )}
          >
            <div className="border-b p-3">
              <h2 className="text-lg font-medium">Notifications</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {isLoading && <NotificationSkeleton count={3} />}

              {error && (
                <div className="p-4 text-center text-red-500">
                  Failed to load notifications
                </div>
              )}

              {!isLoading && !error && sortedNotifications.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              )}

              {!isLoading &&
                !error &&
                sortedNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    // onMarkAsRead={() =>
                    //   console.log('Mark as read:', notification.id)
                    // }
                  />
                ))}
            </div>
            <div className="p-2">
              <Button
                className="w-full border-2 border-gray-400 !bg-white py-2 text-center text-sm text-blue-500"
                onClick={() => router.push('/notification')}
              >
                See all
              </Button>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default NotificationPopover;
