'use client';

import { Bell } from '@phosphor-icons/react';
import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/libs/i18nNavigation';

import { HeaderIconButtonWithBadge } from '@/app/[locale]/(auth)/_components/Header';
import Button from '@/components/core/button/Button';
import { isPendingSessionStatus, NotificationType } from '@/components/notification/private/types';
import NotificationItemRenderer from '@/components/notification/NotificationItemRenderer';
import NotificationSkeleton from '@/components/notification/NotificationSkeleton';
import Popover from '@/components/core/popover/Popover';
import { useGetNotificationsQuery } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';

type NotificationButtonProps = {
  unreadNotifCount?: number;
};

export default function NotificationPopover({
  unreadNotifCount = 0,
}: NotificationButtonProps) {
  const router = useRouter();
  const t = useTranslations('Common');

  // Content is only fetched once the user actually opens the popover.
  const [hasOpened, setHasOpened] = useState(false);

  const { data, error, isLoading } = useGetNotificationsQuery(
    { page: 1, limit: 3 },
    { skip: !hasOpened },
  );

  const sessionRequestNotifications: Notification[] = useMemo(() => {
    return data?.data.filter((notification: Notification) =>
      notification.type.name === NotificationType.SESSION_REQUEST && isPendingSessionStatus(notification.relatedEntity?.sessionStatus)) || [];
  }, [data]);

  const otherNotifications: Notification[] = useMemo(() => data?.data.filter((notification: Notification) =>
    notification.type.name !== NotificationType.SESSION_REQUEST) || [], [data]);

  return (
    <Popover position="bottom">
      {({ open, close }) => {
        return (
          <>
            <Popover.Trigger
              data-testid="notifications-popover-trigger"
              onClick={() => setHasOpened(true)}
            >
              <HeaderIconButtonWithBadge
                badge={unreadNotifCount}
                open={open}
              >
                <Bell className="text-[28px]" />
              </HeaderIconButtonWithBadge>
            </Popover.Trigger>
            <Popover.Panel className="flex w-[480px] flex-col gap-1 px-0 py-4">
              <div data-testid="notifications-popover-content" className="flex flex-col gap-2.5">
                <div className="px-2.5">
                  <h4 className="text-[28px] font-bold leading-9 text-black">
                    {t('notification_title')}
                  </h4>
                </div>
                {isLoading || !data
                  ? <NotificationSkeleton count={3} />
                  : (
                      <>
                        {sessionRequestNotifications.length > 0 && (
                          <>
                            <div className="flex flex-col">
                              <div className="px-3">
                                <h6 className="text-xl font-bold leading-9 text-primary-60">{t('meeting_request')}</h6>
                              </div>
                              {sessionRequestNotifications.map(notification => (
                                <NotificationItemRenderer
                                  key={notification.id}
                                  notification={notification}
                                  showExtras={false}
                                  onClick={close || (() => { })}
                                />
                              ))}
                            </div>
                            <div className="h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-90"></div>
                          </>
                        )}
                        {data.data?.length === 0
                          ? (
                              <div className="flex flex-1 items-center justify-center">
                                {t('no_messages')}
                              </div>
                            )
                          : (
                              <>
                                <div className="flex flex-col gap-2.5">
                                  {otherNotifications.map((notification: Notification) => (
                                    <NotificationItemRenderer
                                      key={notification.id}
                                      notification={notification}
                                      showExtras={false}
                                      onClick={close || (() => { })}
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
                                    {t('see_all')}
                                  </Button>
                                </div>
                              </>
                            )}
                      </>
                    )}
              </div>

            </Popover.Panel>
          </>
        );
      }}
    </Popover>
  );
};
