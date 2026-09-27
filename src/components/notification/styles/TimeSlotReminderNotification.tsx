import { CalendarPlus } from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import { notificationConfig } from '../private/config';
import { NotificationType } from '../private/types';
import { useRouter } from '@/libs/i18nNavigation';

import { mergeClassnames } from '@/components/core/private/utils';
import { useAppSelector } from '@/libs/hooks';
import { Role } from '@/types/common';

export default function TimeSlotReminderNotificationCard({ notification, onClick }: INotificationItemRendererProps) {
  const cfg = notificationConfig[notification.type.name as NotificationType] ?? notificationConfig[NotificationType.OTHER];

  const router = useRouter();

  const t = useTranslations('notifications');

  const userInfo = useAppSelector(state => state.auth.userInfo);
  const roleId = userInfo?.role?.id ?? Role.LIBER;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (cfg.route) {
      const target = cfg.route(notification.relatedEntityId, roleId);
      if (target !== '') {
        router.push(target);
      }
    }
  };

  if (!notification) {
    return undefined;
  }

  return (
    <button
      type="button"
      className={mergeClassnames(
        'flex w-full items-start gap-3 rounded-lg bg-white px-5 py-4 text-left transition-colors delay-300 hover:bg-primary-98',
        !notification.seen && 'bg-primary-90 xl:bg-white',
      )}
      onClick={handleClick}
    >
      <div className="flex size-14 shrink-0 items-center justify-center xl:size-[72px]">
        <CalendarPlus className="text-primary-60" size="100%" weight="fill" />
      </div>
      <div className="flex flex-1 items-start gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <p className="line-clamp-2 text-sm font-medium leading-5 tracking-[0.015em] text-neutral-10 xl:text-base xl:leading-6 xl:tracking-[0.005em]">
            {cfg.getMessage(t, notification, roleId)}
          </p>
          <span className="flex h-8 w-full items-center justify-center rounded-full border border-primary-50 bg-primary-50 px-3 text-sm font-medium text-primary-98">
            {t('time_slot_reminder_cta')}
          </span>
        </div>
        <div className="flex size-4 shrink-0 items-center justify-center xl:size-6">
          {!notification.seen && (
            <Image
              src="/assets/icons/leaf.svg"
              alt="Seen icon"
              width={20}
              height={20}
              className="size-4 object-cover object-center xl:size-5"
            />
          )}
        </div>
      </div>
    </button>
  );
}
