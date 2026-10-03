import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import NotificationRow from '../NotificationRow';
import { notificationConfig } from '../private/config';
import { NotificationType } from '../private/types';
import { formatNotificationTimestamp, formatSessionDateLabel, formatSessionTime, resolveSessionTimeRange } from '@/utils/dateUtils';
import { customMessage, strongMessage } from '@/utils/i18NRichTextUtils';

const nameMessage = strongMessage();
// The design renders the "(11:00–11:30, 05 tháng 2, 2025)" span bold as well as blue; the
// parent <p> is only `font-medium`, so the weight has to be set here.
const timeRangeMessage = customMessage('font-bold text-primary-60');

/**
 * Renders the two session outcomes that carry no follow-up action: the Huber being told we
 * could not confirm they joined, and the reader being told the session was auto-cancelled
 * because the Huber never responded. Both are a single rich-text line — no title, no CTA and
 * no reason box — so they share one card and differ only in message key (see `config.tsx`).
 *
 * The copy is rendered here rather than through `cfg.getMessage` because the session date has
 * to follow the viewer's locale, which `getMessage` is not given.
 *
 * `extraNote` is deliberately ignored: the backend sends a pre-rendered English message there,
 * and rendering it would drop English copy into the Vietnamese card.
 */
export default function SessionOutcomeNotificationCard({ notification, onClick }: INotificationItemRendererProps) {
  const locale = useLocale();
  const t = useTranslations('notifications');

  const cfg = notificationConfig[notification.type.name as NotificationType] ?? notificationConfig[NotificationType.OTHER];
  const session = notification.relatedEntity;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const { startedAt, startTime, endTime } = resolveSessionTimeRange(session);
  // On an auto-cancel the sender is the system/admin account, so the Huber has to be read off
  // the session relation; `sender` is only a fallback for payloads that omit it.
  const huberName = session?.humanBook?.fullName ?? notification.sender?.fullName ?? '';

  return (
    <NotificationRow
      onClick={handleClick}
      seen={notification.seen}
      align="center"
      avatar={(
        <Image
          src="/assets/icons/disabled-meeting-icon.svg"
          alt=""
          width={72}
          height={72}
          className="size-14 object-contain object-center xl:size-[72px]"
        />
      )}
    >
      <p className="text-base font-medium leading-6 tracking-[0.005em] text-neutral-10">
        {t.rich(cfg.messageKey ?? 'session_upcoming', {
          name: huberName,
          startTime: formatSessionTime(startTime, locale),
          endTime: formatSessionTime(endTime, locale),
          date: formatSessionDateLabel(startedAt, locale),
          b: nameMessage,
          hl: timeRangeMessage,
        })}
      </p>

      <p className="text-sm font-normal leading-[22px] tracking-[0.015em] text-neutral-10">
        {formatNotificationTimestamp(notification.createdAt, locale)}
      </p>
    </NotificationRow>
  );
}
