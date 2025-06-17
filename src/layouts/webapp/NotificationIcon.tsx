'use client';

import { Bell } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import IconButton from '@/components/iconButton/IconButton';
import NotificationPopover from '@/components/notification/NotificationPopover';
import type { WithChildren } from '@/components/private/types';
import { useDeviceType } from '@/libs/hooks';

const ButtonWithChip = ({
  children,
  value,
}: WithChildren<{ value: string }>) => (
  <div className="relative">
    <div className="absolute left-6 top-0.5 z-10 rounded-full border border-white bg-red-50 px-1 py-[0.5px] text-[10px] leading-3 text-white">
      {value}
    </div>
    {children}
  </div>
);

interface NotificationButtonProps {
  notificationCount?: number;
  notificationPath?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  notificationCount = 10,
  notificationPath = '/notification',
}) => {
  const { deviceType } = useDeviceType({ mobile: 768, desktop: 1024 });
  const router = useRouter();

  const handleNotificationClick = () => {
    if (deviceType === 'mobile') {
      router.push(notificationPath);
    }
  };

  if (deviceType === 'mobile') {
    return (
      <ButtonWithChip value={`${notificationCount}`}>
        <IconButton
          variant="ghost"
          icon={<Bell size={28} />}
          className="p-2"
          data-testid="button-notif"
          onClick={handleNotificationClick}
        />
      </ButtonWithChip>
    );
  }

  return (
    <NotificationPopover>
      <ButtonWithChip value={`${notificationCount}`}>
        <IconButton
          variant="ghost"
          icon={<Bell size={28} />}
          className="p-2"
          data-testid="button-notif"
        />
      </ButtonWithChip>
    </NotificationPopover>
  );
};

export default NotificationButton;
