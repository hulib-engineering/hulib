// NotificationPopover.tsx
import React, { useState } from 'react';

import Button from '../button/Button';
import NotificationItem from './NotificationItem';

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'meeting' as 'meeting',
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
      type: 'review' as 'review',
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
      type: 'publish' as 'publish',
      title: 'Your book',
      timestamp: new Date(),
      read: true,
      storyTitle: 'Three months in the underworld',
      users: [],
    },
  ]);

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

  const handleViewAllNotifications = () => {
    // Navigate to all notifications page or load more
    console.log('View all notifications');
  };

  return (
    <div>
      <div className="border-b p-3">
        <h2 className="text-[28px] font-bold">Notification</h2>
      </div>
      <div className="overflow-y-auto">
        {notifications.map((notification) => (
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
          className="w-full border-2 border-gray-400 !bg-white py-2 text-center text-sm   text-blue-500"
          onClick={handleViewAllNotifications}
        >
          See previous notifications
        </Button>
      </div>
    </div>
  );
};

export default Notification;
