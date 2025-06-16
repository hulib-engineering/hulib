'use client';

import clsx from 'clsx';

import NotificationItem from '@/components/notification/NotificationItem';
import NotificationSkeleton from '@/components/notification/NotificationSkeleton';
import useNotifications from '@/libs/hooks/useNotifications';

import Button from '../button/Button';

const NotificationPage = () => {
  const {
    notifications,
    isLoading,
    error,
    hasNextPage,
    currentPage,
    loadNextPage,
  } = useNotifications({
    enablePagination: true,
  });

  return (
    <div className="max-w-[100vw]">
      <div className="border-b p-1">
        <h2 className="ml-3 text-[28px] font-bold">Notification</h2>
      </div>

      <div className="overflow-y-auto">
        {isLoading && currentPage === 1 && <NotificationSkeleton count={5} />}

        {error && (
          <div className="p-4 text-center text-red-500">
            Failed to load notifications
          </div>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        )}

        {!isLoading &&
          !error &&
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}

        {isLoading && currentPage > 1 && <NotificationSkeleton count={3} />}
      </div>

      <div className="p-2">
        <Button
          className={clsx(
            'w-full border-2 border-gray-400 !bg-white py-2 text-center text-sm text-blue-500',
            !hasNextPage && 'cursor-not-allowed opacity-50',
          )}
          onClick={loadNextPage}
          disabled={!hasNextPage || isLoading}
        >
          {isLoading && currentPage > 1
            ? 'Loading...'
            : 'See previous notifications'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationPage;
