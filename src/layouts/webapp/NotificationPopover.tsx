'use client';

import { Bell } from '@phosphor-icons/react';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/libs/i18nNavigation';

import { HeaderIconButtonWithBadge } from '@/app/[locale]/(auth)/_components/Header';
import Button from '@/components/core/button/Button';
import { NotificationType, isPendingSessionStatus } from '@/components/notification/private/types';
import NotificationItemRenderer from '@/components/notification/NotificationItemRenderer';
import NotificationSkeleton from '@/components/notification/NotificationSkeleton';
import MeetingDecisionModal from '@/components/notification/styles/MeetingDecisionModal';
import Popover from '@/components/core/popover/Popover';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useGetNotificationsQuery } from '@/libs/services/modules/notifications';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import { StatusEnum } from '@/types/common';

type NotificationButtonProps = {
  unreadNotifCount?: number;
};

type PendingDecision = {
  open: boolean;
  type: 'accept' | 'reject';
  notification: Notification | null;
};

export default function NotificationPopover({
  unreadNotifCount = 0,
}: NotificationButtonProps) {
  const router = useRouter();
  const t = useTranslations('Common');
  const tNotifications = useTranslations('notifications');

  // Content is only fetched once the user actually opens the popover.
  const [hasOpened, setHasOpened] = useState(false);

  const { data, isLoading, refetch } = useGetNotificationsQuery(
    { page: 1, limit: 3 },
    { skip: !hasOpened },
  );

  // Baseline unseen count as of the last successful open/fetch. If the badge count has
  // moved since then (e.g. a new request came in, or another tab acted on one) by the time
  // the user opens the popover again, force a refetch instead of showing the stale cache.
  const lastKnownUnseenCountRef = useRef<number | null>(null);

  // `isOpen` is the popover's state *before* this click is handled, so `!isOpen` means
  // this click is the one opening it (Popover.Button just toggles open/closed on click).
  const handleTriggerClick = (isOpen: boolean) => {
    if (!hasOpened) {
      setHasOpened(true);
      lastKnownUnseenCountRef.current = unreadNotifCount;
      return;
    }
    if (!isOpen && lastKnownUnseenCountRef.current !== unreadNotifCount) {
      refetch();
      lastKnownUnseenCountRef.current = unreadNotifCount;
    }
  };

  const sessionRequestNotifications: Notification[] = useMemo(() => {
    return data?.data.filter((notification: Notification) =>
      notification.type.name === NotificationType.SESSION_REQUEST && isPendingSessionStatus(notification.relatedEntity?.sessionStatus)) || [];
  }, [data]);

  const otherNotifications: Notification[] = useMemo(() => data?.data.filter((notification: Notification) =>
    notification.type.name !== NotificationType.SESSION_REQUEST
    || !isPendingSessionStatus(notification.relatedEntity?.sessionStatus)) || [], [data]);

  // Rendered outside the Popover so it survives the popover panel unmounting on close
  // (headlessui unmounts Popover.Panel's children when it closes).
  const [pendingDecision, setPendingDecision] = useState<PendingDecision>({ open: false, type: 'accept', notification: null });
  const [updateStatus, { isLoading: isDecisionLoading }] = useUpdateReadingSessionMutation();

  const handleRequestDecision = (type: 'accept' | 'reject', notification: Notification) => {
    setPendingDecision({ open: true, type, notification });
  };

  const closeDecisionModal = () => {
    setPendingDecision(prev => ({ ...prev, open: false }));
  };

  const confirmDecision = async (reason?: string) => {
    const session = pendingDecision.notification?.relatedEntity;
    if (!session?.id) {
      return;
    }
    try {
      await updateStatus({
        id: session.id,
        sessionStatus: pendingDecision.type === 'accept' ? StatusEnum.Approved : StatusEnum.Rejected,
        rejectReason: reason,
      }).unwrap();
      pushSuccess(tNotifications('status_updated'));
    } catch {
      pushError(tNotifications('status_update_failed'));
    } finally {
      closeDecisionModal();
    }
  };

  return (
    <>
      <Popover position="bottom-end">
        {({ open, close }) => {
          return (
            <>
              <Popover.Trigger data-testid="notifications-popover-trigger">
                <HeaderIconButtonWithBadge
                  badge={unreadNotifCount}
                  open={open}
                  onClick={() => handleTriggerClick(open ?? false)}
                >
                  <Bell className="text-[28px]" />
                </HeaderIconButtonWithBadge>
              </Popover.Trigger>
              <Popover.Panel className="flex max-h-[80vh] w-[480px] flex-col gap-1 overflow-y-auto px-0 py-4">
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
                                    onRequestDecision={handleRequestDecision}
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
                                      onClick={() => {
                                        router.push('/notifications');
                                        close?.();
                                      }}
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

      <MeetingDecisionModal
        open={pendingDecision.open}
        type={pendingDecision.type}
        session={pendingDecision.notification?.relatedEntity}
        sender={pendingDecision.notification?.sender}
        isLoading={isDecisionLoading}
        onConfirm={confirmDecision}
        onClose={closeDecisionModal}
      />
    </>
  );
};
