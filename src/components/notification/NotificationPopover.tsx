'use client';

import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FC, ReactNode } from 'react';

import Button from '../button/Button';
import NotificationItem from '@/components/notification/NotificationItem';
import NotificationSkeleton from '@/components/notification/NotificationSkeleton';
import useNotifications from '@/libs/hooks/useNotifications';

type NotificationPopoverProps = {
  children: ReactNode;
};

const NotificationPopover: FC<NotificationPopoverProps> = ({ children }) => {
  const router = useRouter();

  const t = useTranslations('notifications');

  const { notifications, isLoading, error } = useNotifications({
    limit: 5,
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
              'absolute z-[9999] mt-2 origin-top-right rounded-md bg-white shadow-lg focus:outline-none',
              'right-[-150px] h-screen w-screen md:right-0 md:h-auto md:w-80',
            )}
          >
            {({ close }) => (
              <>
                <div className="border-b p-3">
                  <h2 className="text-lg font-medium">{t('title')}</h2>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {isLoading && <NotificationSkeleton count={3} />}

                  {error && (
                    <div className="p-4 text-center text-red-500">
                      {t('loadingFailed')}
                    </div>
                  )}

                  {!isLoading && !error && notifications.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      {t('noNotifications')}
                    </div>
                  )}

                  {!isLoading
                  && !error
                  && notifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      hideDetails
                      hideRateNumber
                      onClick={close}
                    />
                  ))}
                </div>

                {!isLoading && !error && notifications.length > 0 && (
                  <div className="p-2">
                    <Popover.Button
                      as={Button}
                      className="w-full border-2 border-gray-400 !bg-white py-2 text-center text-sm text-blue-500"
                      onClick={() => router.push('/notification')}
                    >
                      {t('seeAll')}
                    </Popover.Button>
                  </div>
                )}
              </>
            )}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default NotificationPopover;
