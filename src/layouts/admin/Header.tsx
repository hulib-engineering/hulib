'use client';

import { Bell } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from '@/components/Logo';
import AdvancedSearch from '@/layouts/webapp/AdvancedSearch';
import AvatarPopover from '@/layouts/webapp/AvatarPopover';
import NotificationPopover from '@/layouts/webapp/NotificationPopover';
import SkeletonHeader from '@/layouts/webapp/SkeletonHeader';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useSocket } from '@/libs/hooks/useSocket';

import {
  notificationApi,
  useGetNotificationsQuery,
} from '@/libs/services/modules/notifications';

export const HeaderIconButtonWithBadge = ({
  children,
  badge,
  open = false,
}: {
  children: ReactNode;
  badge: number;
  open?: boolean;
}) => (
  <div
    className={mergeClassnames(
      'relative w-fit rounded-[100px] p-2 text-[#343330] hover:bg-[#E3E4E5]',
      open && 'bg-[#CDDDFE] text-primary-50',
    )}
  >
    {children}
    {badge > 0 && (
      <div className="absolute right-0 top-1 flex h-4 w-[18px] items-center justify-center rounded-lg border border-white bg-red-50 px-1 py-[0.5px] text-[10px] font-medium leading-3 text-white">
        {badge}
      </div>
    )}
  </div>
);

const Header = () => {
  const router = useRouter();

  const { data, isLoading, error } = useGetNotificationsQuery({ page: 1, limit: 5 });

  const user = useAppSelector(state => state.auth.userInfo);

  const dispatch = useAppDispatch();

  const handleNotificationList = (notifications: any) => {
    dispatch(
      notificationApi.util.updateQueryData(
        'getNotifications',
        { page: 1, limit: 5 },
        (draft) => {
          if (!draft) {
            return;
          }

          Object.assign(draft, notifications);
        },
      ),
    );
  };

  useSocket({
    namespace: 'notification',
    listeners: {
      list: handleNotificationList,
    },
  });

  return (
    <>
      {/* Mobile version */}
      <header className="flex w-screen flex-col gap-5 bg-white px-4 pb-2 pt-4 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:hidden">
        <div className="flex items-center justify-between">
          <Link href={user?.id ? '/home' : '/'}>
            <Logo size="small" />
          </Link>
          {!user || !user?.id
            ? (
                <SkeletonHeader />
              )
            : (
                <div className="flex items-center gap-2">
                  {(!isLoading && !error) && (
                    <button type="button" className="xl:hidden" onClick={() => router.push('/notifications')}>
                      <HeaderIconButtonWithBadge badge={data ? data.unseenCount : 0} open={false}>
                        <Bell className="text-[28px]" />
                      </HeaderIconButtonWithBadge>
                    </button>
                  )}
                  <div className="ml-2">
                    <AvatarPopover />
                  </div>
                </div>
              )}
        </div>
        <AdvancedSearch />
      </header>

      {/* PC version */}
      <header className="hidden w-screen items-center justify-between bg-white px-28 py-6 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:flex">
        <div className="flex items-center gap-6">
          <Link href={user?.id ? '/home' : '/'}>
            <Logo size="small" />
          </Link>
        </div>
        <div className="w-[300px]">
          <AdvancedSearch />
        </div>
        {!user || !user?.id
          ? (
              <div className="flex gap-3 px-10 ">
                <SkeletonHeader />
              </div>
            )
          : (
              <div className="flex items-center gap-2">
                {!isLoading && !error && <NotificationPopover unreadNotifCount={data ? data.unseenCount : 0} />}
                <div className="ml-2">
                  <AvatarPopover />
                </div>
                <LocaleSwitcher className="shrink" />
              </div>
            )}
      </header>
    </>
  );
};

export default Header;
