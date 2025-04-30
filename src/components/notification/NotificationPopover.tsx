// NotificationPopover.tsx
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';

import Button from '../button/Button';
import type { NotificationProps } from './NotificationItem';
import NotificationItem from './NotificationItem';

interface NotificationPopoverProps {
  children: ReactNode;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  children,
}) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationProps[]>([
    {
      id: '1',
      type: 'meeting',
      title: 'Meeting request',
      timestamp: new Date(),
      read: false,
      actionable: true,
      users: [
        {
          id: '1',
          name: 'Persephone',
          avatar: '/assets/images/user-avatar.jpeg',
        },
      ],
    },
    {
      id: '2',
      type: 'review',
      title: '',
      timestamp: new Date(),
      read: false,
      storyTitle: 'Three months in the underworld',
      users: [
        {
          id: '2',
          name: 'Hades',
          avatar: '/assets/images/user-avatar.jpeg',
        },
        {
          id: '1',
          name: 'Persephone',
          avatar: '/assets/images/user-avatar.jpeg',
        },
      ],
    },
    {
      id: '3',
      type: 'publish',
      title: 'Your book',
      timestamp: new Date(),
      read: true,
      storyTitle: 'Three months in the underworld',
      users: [],
    },
  ]);

  // Sort notifications to prioritize meeting requests
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      // First priority: meeting requests
      if (a.type === 'meeting' && b.type !== 'meeting') return -1;
      if (a.type !== 'meeting' && b.type === 'meeting') return 1;

      // Second priority: unread notifications
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;

      // Third priority: timestamp (newer first)
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const handleAction = (
    id: string,
    _action: 'accept' | 'reject' | 'confirm' | 'decline',
  ) => {
    // Handle actions like accepting/rejecting meeting requests
    // For demo purposes, let's remove the notification after action
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

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
              'right-[-150px] h-[100vh] w-[100vw]',
              'md:right-0 md:h-auto md:w-80',
            )}
          >
            <div className="border-b p-3">
              <h2 className="text-lg font-medium">Notification</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {sortedNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onAction={handleAction}
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
