import { CalendarPlus } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';

import type { INotificationItemRendererProps } from '../NotificationItemRenderer';
import NotificationRow from '../NotificationRow';
import Button from '@/components/core/button/Button';
import { useRouter } from '@/libs/i18nNavigation';

export default function UpdateTimeSlotReminderNotificationCard({ notification, onClick }: INotificationItemRendererProps) {
  const t = useTranslations('notifications');
  const router = useRouter();

  if (!notification) {
    return undefined;
  }

  const handleUpdate = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (onClick) {
      onClick();
    }
    router.push('/my-schedule');
  };

  return (
    <NotificationRow
      onClick={() => handleUpdate()}
      seen={notification.seen}
      avatar={(
        <div className="flex size-14 items-center justify-center xl:size-[72px]">
          <CalendarPlus weight="fill" className="size-14 text-primary-60 xl:size-[72px]" />
        </div>
      )}
    >
      <p className="text-sm font-medium leading-6 tracking-[0.005em] text-neutral-10 xl:text-base">
        {t('update_time_slot_reminder_message')}
      </p>
      <Button size="sm" fullWidth onClick={handleUpdate}>
        {t('update_time_slot_reminder_button')}
      </Button>
    </NotificationRow>
  );
}
