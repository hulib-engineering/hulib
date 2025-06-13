'use client';

import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import type { FC, ReactNode } from 'react';

import NotificationItem from '@/components/notification/NotificationItem';
import NotificationSkeleton from '@/components/notification/NotificationSkeleton';
import useNotifications from '@/libs/hooks/useNotifications';

import Button from '../button/Button';

interface NotificationPopoverProps {
  children: ReactNode;
}

const NotificationPopover: FC<NotificationPopoverProps> = ({ children }) => {
  const router = useRouter();
  const { notifications, isLoading, error } = useNotifications({
    limit: 10,
    enablePagination: false,
  });

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

              {!isLoading && !error && notifications.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              )}

              {!isLoading &&
                !error &&
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    hideDetails
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
