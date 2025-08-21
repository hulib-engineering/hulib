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
  // Safe access to userInfo with fallback
  const userInfo = useAppSelector(state => state.auth?.userInfo);
  const role = userInfo?.role;

  // Early return if notification or required data is missing
  if (!notification?.type?.name) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-100"
        style={{ width: size, height: size }}
      >
        <span className="text-gray-500">?</span>
      </div>
    );
  }

  // Safe access to notification type
  const notificationType = notification.type.name;

  if (
    notificationType === NOTIFICATION_TYPES.SESSION_REQUEST.name
    || notificationType === NOTIFICATION_TYPES.REVIEW_STORY.name
    || (role?.id === Role.ADMIN)
  ) {
    // Safe access to sender data with fallbacks
    const senderFile = notification.sender?.file ?? '/assets/images/ava-placeholder.png';
    const senderName = notification.sender?.fullName ?? 'Unknown User';

    return (
      <div className="relative shrink-0">
        <Image
          src={senderFile}
          alt={senderName}
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

  if (notificationType === NOTIFICATION_TYPES.OTHER.name) {
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

  if (notificationType === NOTIFICATION_TYPES.ACCEPTED_MEETING.name || notificationType === NOTIFICATION_TYPES.REJECTED_MEETING.name) {
    return (
      <div className="flex shrink-0 items-center justify-center rounded-full ">
        <Image
          src="/assets/icons/notification/Avatar.svg"
          alt="avatar"
          className="rounded-full"
          width={size}
          height={size}
        />
      </div>
    );
  }

  if (notificationType === NOTIFICATION_TYPES.CANCELED_MEETING.name) {
    return (
      <div className="relative shrink-0">
        <Image
          src="/assets/icons/notification/camera.svg"
          alt="Meeting icon"
          className="rounded-lg"
          width={size}
          height={size}
        />
      </div>
    );
  }

  if (notificationType === NOTIFICATION_TYPES.NOT_ATTENDED.name) {
    return (
      <div className="relative shrink-0">
        <Image
          src="/assets/icons/notification/camera_1.png"
          alt="Meeting icon"
          className="rounded-lg"
          width={size}
          height={size}
        />
      </div>
    );
  }
  // Default case
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
