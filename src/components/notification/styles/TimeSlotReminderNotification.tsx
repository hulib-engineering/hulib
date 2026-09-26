import { CalendarPlus } from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import { notificationConfig } from '../private/config';
import { NotificationType } from '../private/types';
import { useRouter } from '@/libs/i18nNavigation';

import Button from '@/components/core/button/Button';
import { useAppSelector } from '@/libs/hooks';
import { Role } from '@/types/common';

export default function TimeSlotReminderNotificationCard({ notification, onClick }: INotificationItemRendererProps) {
  const cfg = notificationConfig[notification.type.name as NotificationType] ?? notificationConfig[NotificationType.OTHER];

  const router = useRouter();

  const t = useTranslations('notifications');

  const userInfo = useAppSelector(state => state.auth.userInfo);
  const roleId = userInfo?.role?.id ?? Role.LIBER;

  const handleCtaClick = () => {
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
    <div className="flex w-full items-start gap-3 rounded-lg bg-white px-5 py-4">
      <div className="flex size-14 shrink-0 items-center justify-center xl:size-[72px]">
        <CalendarPlus className="text-primary-60" size="100%" weight="fill" />
      </div>
      <div className="flex flex-1 items-start gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <p className="line-clamp-2 text-sm font-medium leading-5 tracking-[0.015em] text-neutral-10 xl:text-base xl:leading-6 xl:tracking-[0.005em]">
            {cfg.getMessage(t, notification, roleId)}
          </p>
          <Button
            variant="fill"
            size="sm"
            fullWidth
            className="border border-primary-50 text-primary-98"
            onClick={handleCtaClick}
          >
            {t('time_slot_reminder_cta')}
          </Button>
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
    </div>
  );
}
