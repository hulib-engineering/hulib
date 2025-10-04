'use client';

import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import Button from '@/components/core/button/Button';
import { NotificationType } from '@/components/notification/private/types';
import NotificationSkeleton from '@/components/notification/NotificationSkeleton';
import NotificationItemRenderer from '@/components/notification/NotificationItemRenderer';
import { mergeClassnames } from '@/components/core/private/utils';
import { useGetNotificationsQuery } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { StatusEnum } from '@/types/common';

export default function Notifications() {
  const t = useTranslations('notifications');

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useGetNotificationsQuery({
    page: currentPage,
    limit: 10,
  });

  const sessionRequestNotifications: Notification[] = useMemo(() => {
    return data?.data.filter((notification: Notification) =>
      notification.type.name === NotificationType.SESSION_REQUEST && notification.relatedEntity?.sessionStatus === StatusEnum.Pending) || [];
  }, [data]);
  const otherNotifications: Notification[] = useMemo(() => data?.data.filter((notification: Notification) =>
    notification.type.name !== NotificationType.SESSION_REQUEST) || [], [data]);

  const handeLoadNextPage = () => {
    if (data?.hasNextPage && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div
      className={mergeClassnames(
        'flex h-[816px] w-screen py-4 px-0 flex-col gap-4 bg-white shadow-sm',
        'lg:mx-auto lg:my-5 lg:w-[728px] lg:p-6 lg:rounded-[24px]',
      )}
    >
      <div className="px-2.5 xl:px-0">
        <h4 className="text-2xl font-bold xl:text-[28px] xl:leading-9">{t('title')}</h4>
      </div>
      {sessionRequestNotifications.length > 0 && (
        <>
          <div className="flex w-full flex-col">
            <h6 className="text-xl font-bold text-primary-60">Meeting request</h6>
            {sessionRequestNotifications.map(notification => (
              <NotificationItemRenderer
                key={notification.id}
                notification={notification}
                showExtras
              />
            ))}
          </div>
          <div className="h-0 w-full outline outline-1 outline-offset-[-0.50px] outline-neutral-90"></div>
        </>
      )}
      <div
        className={mergeClassnames(
          'flex w-full flex-1 flex-col gap-4 overflow-y-auto',
          (!!error || isLoading) && 'items-center justify-center',
        )}
      >
        {isLoading && <NotificationSkeleton count={5} />}

        {error && (
          <div className="p-4 text-center text-red-500">
            {t('loadingFailed')}
          </div>
        )}

        {data && data?.data?.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            {t('noNotifications')}
          </div>
        )}

        {otherNotifications.map((notification: Notification) => (
          <NotificationItemRenderer
            key={notification.id}
            notification={notification}
            showExtras
          />
        ))}
      </div>
      <Button
        variant="outline"
        size="lg"
        disabled={!data?.hasNextPage || isLoading}
        animation={isLoading && 'progress'}
        onClick={handeLoadNextPage}
      >
        {t('seePreviousNotifications')}
      </Button>
    </div>
  );
};
