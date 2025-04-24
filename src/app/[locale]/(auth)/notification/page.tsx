'use client';

import clsx from 'clsx';

import Notification from '@/components/notification/Notification';

const NotificationPage = () => {
  return (
    <div
      className={clsx(
        'h-screen bg-white',
        'border border-gray-300 p-4 shadow-md shadow-gray-400 lg:mx-auto lg:my-5 lg:w-[728px] lg:rounded-[24px]',
      )}
    >
      <Notification />
    </div>
  );
};

export default NotificationPage;
