'use client';

import clsx from 'clsx';

import NotificationPage from '@/components/notification/Notification';

const Notification = () => {
  return (
    <div
      className={clsx(
        'w-screen overflow-y-auto bg-white',
        'border border-gray-300 shadow-md shadow-gray-400 lg:mx-auto lg:my-5 lg:w-[728px] lg:rounded-[24px]',
      )}
      style={{ maxHeight: 'calc(100vh - 138px)' }}
    >
      <NotificationPage />
    </div>
  );
};

export default Notification;
