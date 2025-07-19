'use client';

import Image from 'next/image';
import type { FC } from 'react';

import { useAppSelector } from '@/libs/hooks';
import type { Notification } from '@/libs/services/modules/notifications/notificationType';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';
import { Role } from '@/types/common';

type NotificationAvatarProps = {
  notification: Notification;
  size?: number;
};

const NotificationAvatar: FC<NotificationAvatarProps> = ({
  notification,
  size = 56,
}) => {
  const { role } = useAppSelector(state => state.auth.userInfo);
  if (
    notification.type.name === NOTIFICATION_TYPES.SESSION_REQUEST.name
    || notification.type.name === NOTIFICATION_TYPES.REVIEW_STORY.name
    || role.id === Role.ADMIN
  ) {
    return (
      <div className="relative shrink-0">
        <Image
          src={notification.sender.file ?? '/assets/images/ava-placeholder.png'}
          alt={notification.sender.fullName ?? 'Unknown User'}
          className="rounded-full"
          width={size}
          height={size}
        />
        <Image
          src="/assets/images/meeting-icon.png"
          alt="Meeting icon"
          className="absolute bottom-0 right-0 rounded-sm"
          width={24}
          height={24}
        />
      </div>
    );
  }

  if (notification.type.name === NOTIFICATION_TYPES.OTHER.name) {
    return (
      <div className="relative shrink-0">
        <Image
          src="/assets/images/meeting-icon.png"
          alt="Meeting icon"
          className="rounded-lg"
          width={36}
          height={36}
        />
        <Image
          src="/assets/icons/notification/Alarm.svg"
          alt="Alarm"
          className="absolute -bottom-2 -right-2 rounded-sm"
          width={20}
          height={20}
        />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-100 p-1 text-white"
      style={{ width: size, height: size }}
    >
      <Image
        src="/assets/images/minified-HULIB-logo.png"
        alt="HULIB logo"
        className="size-8 rounded-full"
        width={26}
        height={32}
      />
    </div>
  );
};

export default NotificationAvatar;
