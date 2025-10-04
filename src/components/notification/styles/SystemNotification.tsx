import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { notificationConfig } from '../private/config';
import type { INotificationItemRendererProps } from '../NotificationItemRenderer';

import Button from '@/components/core/button/Button';
import { NotificationType } from '@/components/notification/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

export default function SystemNotificationCard({ notification, onClick }: INotificationItemRendererProps) {
  const cfg = notificationConfig[notification.type.name as NotificationType];
  const isUpcomingSession = notification.type.name === NotificationType.OTHER;

  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (cfg.route) {
      router.push(cfg.route(notification.relatedEntity.sessionUrl));
    }
  };

  return (
    <button
      type="button"
      className={mergeClassnames(
        'flex w-full gap-3 rounded-[28px] border bg-white py-2.5 px-4 text-left transition-colors delay-300 hover:bg-primary-98',
        'xl:py-4',
        isUpcomingSession ? 'border-orange-50' : 'border-primary-60',
      )}
      onClick={handleClick}
    >
      <Image
        src="/assets/icons/meeting-alert-icon.svg"
        width={36}
        height={36}
        alt="Meeting system ava"
        className="size-[36px] rounded-lg object-cover object-center"
      />
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="line-clamp-2 font-bold">{cfg.title}</p>
            {notification.type.name === NotificationType.OTHER && (
              <p className="text-sm font-extrabold text-orange-50">Now</p>
            )}
          </div>
          <p className="font-medium">{cfg.getMessage(notification)}</p>
          {isUpcomingSession
            ? <Button size="sm" fullWidth onClick={handleClick}>Join now</Button>
            : <Button size="sm" onClick={handleClick}>Feedback</Button>}
        </div>
      </div>
    </button>
  );
}
