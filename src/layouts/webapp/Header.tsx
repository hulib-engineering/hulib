'use client';

import {
  CaretDown,
  Gear,
  House,
  Pencil,
  SignOut,
  UserCircle,
} from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { getSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from '@/components/Logo';
import MenuItem from '@/components/menuItem/MenuItem';
import Popover from '@/components/popover/Popover';
import type { WithChildren } from '@/components/private/types';
import SearchInput from '@/components/SearchInput';
import NotificationButton from '@/layouts/webapp/NotificationIcon';
import SkeletonHeader from '@/layouts/webapp/SkeletonHeader';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import {
  notificationApi,
  useGetNotificationsQuery,
} from '@/libs/services/modules/notifications';
import { socket } from '@/libs/services/socket';
import { Role } from '@/types/common';

interface AvatarPopoverMenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface RenderProps {
  open: boolean;
  close: () => void;
}

const AvatarPopoverContent: React.FC<RenderProps> = ({
  open,
  close,
}: RenderProps) => {
  const { role } = useAppSelector((state) => state.auth.userInfo);
  const t = useTranslations('HeaderWebApp');

  const handleClick = (item: AvatarPopoverMenuItem) => {
    if (open) {
      close();
    }
    item.onClick?.();
  };

  const AvatarPopoverMenuItems = useMemo(
    () => [
      {
        label: t('dashboard'),
        icon: <House size={20} color="primary-20" />,
        href: '/home',
        roles: [Role.ADMIN],
      },
      {
        label: t('my_profile'),
        icon: <UserCircle size={20} color="primary-20" />,
        href: '/profile',
        roles: [Role.LIBER, Role.HUBER],
      },
      {
        label: t('change_password'),
        icon: <Gear size={20} color="primary-20" />,
        href: '/change-password',
        roles: [Role.LIBER, Role.HUBER],
      },
      {
        label: t('register_huber'),
        icon: <Pencil size={20} color="primary-20" />,
        href: '/huber-registration',
        roles: [Role.LIBER],
      },
      {
        label: t('sign_out'),
        icon: <SignOut size={20} color="primary-20" />,
        onClick: () => signOut({ callbackUrl: '/auth/login' }),
      },
    ],
    [t],
  );

  const menuItemsByRole = useMemo(() => {
    return (
      AvatarPopoverMenuItems.filter((item) => {
        if (item?.roles) {
          return item.roles.includes(role?.id as Role);
        }
        return true;
      }) || []
    );
  }, [role]);

  return (
    <div data-testid="popover-content">
      {menuItemsByRole.map((item, index) =>
        item.href ? (
          <Link href={item.href} key={index} onClick={close}>
            <MenuItem>
              {item.icon}
              <MenuItem.Title>{item.label}</MenuItem.Title>
            </MenuItem>
          </Link>
        ) : (
          <MenuItem key={index} onClick={() => handleClick(item)}>
            {item.icon}
            <MenuItem.Title>{item.label}</MenuItem.Title>
          </MenuItem>
        ),
      )}
    </div>
  );
};

const AvatarPopover = ({ children }: WithChildren<{}>) => (
  <Popover position="bottom-end" className="h-full w-11">
    <Popover.Trigger
      data-testid="popover-trigger-arrow"
      {...{
        className: 'h-full',
      }}
    >
      {children}
    </Popover.Trigger>
    <Popover.Panel className="flex flex-col gap-1 p-2">
      {({ open = false, close }) => (
        <AvatarPopoverContent close={close} open={open} />
      )}
    </Popover.Panel>
  </Popover>
);

const Header = () => {
  const t = useTranslations('HeaderWebApp');

  const { data, isLoading } = useGetNotificationsQuery({ page: 1, limit: 5 });

  const user = useAppSelector((state) => state.auth.userInfo);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let notificationSocket: ReturnType<typeof socket> | null = null;

    const initializeSocket = async () => {
      const session = await getSession();
      // @ts-ignore
      const accessToken = session?.accessToken as string | undefined;

      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      // const accessToken = (await getSession())?.accessToken;
      notificationSocket = socket('notification', accessToken);
      notificationSocket.connect();

      notificationSocket.on('error', (error: Error) => {
        // Proper error handling
        console.error('Socket error:', error);
      });
      const handleNotifications = (notifications: any) => {
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

      notificationSocket.on('list', (list) => {
        handleNotifications(list);
      });
    };

    initializeSocket().catch((error) => {
      console.error('Failed to initialize socket:', error);
    });

    return () => {
      if (notificationSocket) {
        notificationSocket.off('error');
        notificationSocket.off('message');
        notificationSocket.off('list');
        notificationSocket.disconnect();
      }
    };
  }, [dispatch]);

  const renderNavbar = () => {
    if (!user || user?.role?.id === Role.ADMIN) {
      return null;
    }
    return (
      <div className="flex items-center justify-between gap-x-2">
        {user && user?.id && (
          <Link
            href="/schedule-meeting/weekly-schedule"
            className="mx-2 text-neutral-10"
          >
            {t('my_schedule')}
          </Link>
        )}
        <Link href="/explore-story" className="mx-2 text-neutral-10">
          {t('books')}
        </Link>
        <Link href="/explore-huber" className="mx-2 text-neutral-10">
          {t('mentors')}
        </Link>
      </div>
    );
  };

  return (
    <>
      <header className="flex w-screen flex-col gap-5 bg-white px-4 pb-2 pt-4 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:hidden">
        <div className="flex items-center justify-between">
          <Link href={user?.id ? '/home' : '/'}>
            <Logo size="small" />
          </Link>
          {!user || !user?.id ? (
            <div className="flex gap-3 px-10 ">
              <SkeletonHeader />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* <ButtonWithChip value="10">
                <IconButton
                  variant="ghost"
                  icon={<MessengerLogo size={28} />}
                  className="p-2"
                  data-testid="button-messenger"
                  onClick={() => alert('click')}
                />
              </ButtonWithChip> */}
              <NotificationButton
                notificationCount={!isLoading && data ? data.unseenCount : 0}
                notificationPath="/notification"
              />
              <div className="relative ml-2">
                <AvatarPopover>
                  <Image
                    alt="Avatar Icon"
                    width={44}
                    height={44}
                    loading="lazy"
                    src={user.photo?.path ?? '/assets/images/icons/avatar.svg'}
                    className="h-11 w-11 rounded-full object-contain"
                  />
                </AvatarPopover>
                <div className="absolute left-7 top-7 rounded-full border border-solid border-white bg-neutral-90 p-0.5">
                  <CaretDown size={12} />
                </div>
              </div>
              <LocaleSwitcher className="shrink" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">{renderNavbar()}</div>
      </header>
      <header className="hidden w-[100vw] items-center justify-between bg-white px-28 py-6 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:flex">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Logo size="small" />
          </Link>
          {renderNavbar()}
        </div>
        <div className="w-[300px]">
          <SearchInput />
        </div>
        {!user || !user?.id ? (
          <div className="flex gap-3 px-10 ">
            <SkeletonHeader />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* <ButtonWithChip value="10">
                <IconButton
                  variant="ghost"
                  icon={<MessengerLogo size={28} />}
                  className="p-2"
                  data-testid="button-messenger"
                  onClick={() => alert('click')}
                />
              </ButtonWithChip> */}
            <NotificationButton
              notificationCount={!isLoading && data ? data.unseenCount : 0}
              notificationPath="/notification"
            />
            <div className="relative ml-2 h-11 w-11">
              <AvatarPopover>
                <Image
                  alt="Avatar Icon"
                  layout="fill"
                  className="h-11 w-11 rounded-full object-contain"
                  loading="lazy"
                  src={user.photo?.path ?? '/assets/images/icons/avatar.svg'}
                />
              </AvatarPopover>
              <div className="absolute left-7 top-7 rounded-full border border-solid border-white bg-neutral-90 p-0.5">
                <CaretDown size={12} />
              </div>
            </div>
            <LocaleSwitcher className="shrink" />
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
