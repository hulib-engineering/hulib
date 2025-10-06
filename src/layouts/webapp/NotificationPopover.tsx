'use client';

import { Bell } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/core/button/Button';
import { NotificationType } from '@/components/notification/private/types';
import NotificationItemRenderer from '@/components/notification/NotificationItemRenderer';
import Popover from '@/components/core/popover/Popover';
import { HeaderIconButtonWithBadge } from '@/layouts/webapp/Header';
import { useGetNotificationsQuery } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { StatusEnum } from '@/types/common';

type NotificationButtonProps = {
  unreadNotifCount?: number;
};

export default function NotificationPopover({
  unreadNotifCount = 0,
}: NotificationButtonProps) {
  const router = useRouter();
  const t = useTranslations('notifications');
  const { data, error, isLoading } = useGetNotificationsQuery({
    page: 1,
    limit: 5,
  });

  const sessionRequestNotifications: Notification[] = useMemo(() => {
    return data?.data.filter((notification: Notification) =>
      notification.type.name === NotificationType.SESSION_REQUEST && notification.relatedEntity?.sessionStatus === StatusEnum.Pending) || [];
  }, [data]);
  const otherNotifications: Notification[] = useMemo(() => data?.data.filter((notification: Notification) =>
    notification.type.name !== NotificationType.SESSION_REQUEST) || [], [data]);

  if (!data || error) {
    return null;
  }

  return (
    <Popover position="bottom">
      {({ open, close }) => (
        <>
          <Popover.Trigger data-testid="notifications-popover-trigger">
            <HeaderIconButtonWithBadge
              badge={unreadNotifCount}
              open={open}
            >
              <Bell className="text-[28px]" />
            </HeaderIconButtonWithBadge>
          </Popover.Trigger>
          <Popover.Panel className="flex w-[430px] flex-col gap-1 px-0 py-4">
            <div data-testid="notifications-popover-content" className="flex flex-col gap-2.5">
              <div className="px-2.5">
                <h4 className="text-[28px] font-bold leading-9 text-black">
                  {t('title')}
                </h4>
              </div>
              {sessionRequestNotifications.length > 0 && (
                <>
                  <div className="flex flex-col">
                    <div className="px-3">
                      <h6 className="text-xl font-bold leading-9 text-primary-60">Meeting request</h6>
                    </div>
                    {sessionRequestNotifications.map(notification => (
                      <NotificationItemRenderer
                        key={notification.id}
                        notification={notification}
                        showExtras={false}
                        onClick={close || (() => {})}
                      />
                    ))}
                  </div>
                  <div className="h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-90"></div>
                </>
              )}
              {isLoading && data.data?.length === 0
                ? (
                    <div className="flex flex-1 items-center justify-center">
                      You have no conversations yet!
                    </div>
                  )
                : (
                    <>
                      <div className="flex h-[280px] flex-col gap-2.5 overflow-y-auto">
                        {otherNotifications.map((notification: Notification) => (
                          <NotificationItemRenderer
                            key={notification.id}
                            notification={notification}
                            showExtras={false}
                            onClick={close || (() => {})}
                          />
                        ))}
                      </div>
                      <div className="px-2.5">
                        <Button
                          variant="outline"
                          size="lg"
                          fullWidth
                          onClick={() => router.push('/notifications')}
                        >
                          {t('seeAll')}
                        </Button>
                      </div>
                    </>
                  )}
            </div>

          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};
