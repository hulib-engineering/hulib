import { X } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import NotificationRow from '../NotificationRow';
import { NotificationType, isApprovedSessionStatus } from '../private/types';
import Avatar from '@/components/core/avatar/Avatar';
import { useAppSelector } from '@/libs/hooks';
import { useRouter } from '@/libs/i18nNavigation';
import { formatNotificationTimestamp, formatSessionTime, resolveSessionTimeRange, toApiWallClock } from '@/utils/dateUtils';
import { customMessage, strongMessage } from '@/utils/i18NRichTextUtils';

const nameMessage = strongMessage();
// The design renders the "(11:00- 11:30, 05 tháng 2, 202)" span bold as well as blue; the
// parent <p> is only `font-medium`, so the weight has to be set here.
const timeRangeMessage = customMessage('font-bold text-primary-60');

/**
 * SESSION_APPROVAL / SESSION_REJECTION are sent to both the Liber (requester) and the
 * Huber (decider) using the same notification shape, so the copy has to read differently
 * depending on which side of the decision the viewer was on ("you accepted ..." vs
 * "X accepted your request ..."). Viewer side is derived from relatedEntity.humanBook.id
 * (per-session truth) rather than the account-level Role, since a Huber account can still
 * be the Liber/requester on someone else's session.
 */
export default function SessionDecisionNotificationCard({ notification, onClick }: INotificationItemRendererProps) {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const router = useRouter();
  const userId = useAppSelector(state => state.auth.userInfo?.id);

  const session = notification.relatedEntity;
  const isHuberViewer = Boolean(userId) && Number(userId) === Number(session?.humanBook?.id);
  // The backend reports an accept/decline on the `sessionRequest` type, so the outcome has to
  // come from `relatedEntity.sessionStatus` rather than the notification type name alone.
  const isApproval = notification.type.name === NotificationType.SESSION_APPROVAL
    || isApprovedSessionStatus(session?.sessionStatus);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    router.push('/my-schedule');
  };

  const { startedAt, startTime, endTime } = resolveSessionTimeRange(session);
  // `startedAt` arrives pre-validated, so date-fns cannot throw here. The previous
  // `format(new Date(session.startTime), …)` threw a RangeError on the bare "HH:mm"
  // strings the API actually sends, which ItemBoundary swallowed into a blank card.
  // `toApiWallClock` keeps the date on the calendar day the API reported.
  const dateLabel = startedAt
    ? format(toApiWallClock(startedAt), locale === 'vi' ? 'dd \'tháng\' M, yyyy' : 'dd MMMM yyyy', { locale: locale === 'vi' ? vi : enUS })
    : '';

  const messageKey = isHuberViewer
    ? (isApproval ? 'session_approval_by_huber' : 'session_rejection_by_huber')
    : (isApproval ? 'session_approval_by_liber' : 'session_rejection_by_liber');

  return (
    <NotificationRow
      onClick={handleClick}
      seen={notification.seen}
      align="center"
      className={!notification.seen ? 'bg-red-98 xl:bg-white' : undefined}
      avatar={(
        <div className="relative">
          <Avatar
            imageUrl={notification.sender.id === 1
              ? '/assets/images/admin-ava.png'
              : notification.sender.photo?.path}
            name={notification.sender.fullName}
            size="xl"
            className="xl:!size-[72px]"
          />
          <div className="absolute bottom-0 right-0">
            {isApproval
              ? (
                  <Image
                    src="/assets/icons/meeting-icon.svg"
                    width={24}
                    height={24}
                    alt="Accepted"
                    className="size-6 object-cover object-center"
                  />
                )
              : (
                  <div className="relative size-6">
                    <Image
                      src="/assets/icons/meeting-icon.svg"
                      width={24}
                      height={24}
                      alt="Declined"
                      className="size-6 object-cover object-center"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <X weight="bold" className="text-xl text-red-60" />
                    </div>
                  </div>
                )}
          </div>
        </div>
      )}
    >
      <p className="text-base font-medium leading-6 tracking-[0.005em] text-neutral-10">
        {t.rich(messageKey, {
          name: notification.sender.fullName,
          startTime: formatSessionTime(startTime, locale),
          endTime: formatSessionTime(endTime, locale),
          date: dateLabel,
          b: nameMessage,
          hl: timeRangeMessage,
        })}
      </p>

      {!isHuberViewer && !isApproval && session?.rejectReason && (
        <p className="rounded-lg border border-neutral-90 bg-neutral-98 p-3 text-sm text-neutral-10">
          {session.rejectReason}
        </p>
      )}

      <p className="text-sm font-normal leading-[22px] tracking-[0.015em] text-neutral-10">
        {formatNotificationTimestamp(notification.createdAt, locale)}
      </p>
    </NotificationRow>
  );
}
