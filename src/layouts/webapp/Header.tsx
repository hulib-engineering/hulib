'use client';

import {
  CaretDown,
  Gear,
  Pencil,
  SignOut,
  UserCircle,
} from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import React, { useEffect, useMemo } from 'react';

import Button from '@/components/button/Button';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from '@/components/Logo';
import MenuItem from '@/components/menuItem/MenuItem';
import Popover from '@/components/popover/Popover';
import type { WithChildren } from '@/components/private/types';
import SearchInput from '@/components/SearchInput';
import NotificationButton from '@/layouts/webapp/NotificationIcon';
import SkeletonHeader from '@/layouts/webapp/SkeletonHeader';
import { useAppSelector } from '@/libs/hooks';
import { Role } from '@/types/common';

const AvatarPopoverMenuItems = [
  {
    label: 'My profile',
    icon: <UserCircle size={20} color="primary-20" />,
    href: '/profile',
    roles: [Role.LIBER, Role.HUBER],
  },
  {
    label: 'Change password',
    icon: <Gear size={20} color="primary-20" />,
    href: '/change-password',
    roles: [Role.LIBER, Role.HUBER],
  },
  {
    label: 'Register to become human book',
    icon: <Pencil size={20} color="primary-20" />,
    href: '/huber-registration',
    roles: [Role.LIBER],
  },
  {
    label: 'Sign out',
    icon: <SignOut size={20} color="primary-20" />,
    onClick: () => signOut({ callbackUrl: '/auth/login' }),
  },
];

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

  const handleClick = (item: AvatarPopoverMenuItem) => {
    if (open) {
      close();
    }
    item.onClick?.();
  };

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
  const user = useAppSelector((state) => state.auth.userInfo);

  useEffect(() => {
    // socket('').then((messageSocket) => {
    //   messageSocket.connect();
    //   messageSocket.on('error', (error: any) => {
    //     console.log(error);
    //   });
    //   messageSocket.on('message', (message: any) => {
    //     console.log(message);
    //   });
    // });
    // return () => {
    //   messageSocket.disconnect();
    // };
  }, []);

  const renderNavbar = () => {
    if (!user || user?.role?.id === Role.ADMIN) {
      return null;
    }
    return (
      <div className="flex items-center justify-between gap-x-2">
        {user && user?.id && (
          <Link href="/schedule-meeting/weekly-schedule">
            <Button variant="ghost" size="lg" className="text-neutral-10">
              My schedule
            </Button>
          </Link>
        )}
        <Link href="/explore-story">
          <Button variant="ghost" size="lg" className="text-neutral-10">
            Stories
          </Button>
        </Link>
        <Link href="/explore-huber">
          <Button variant="ghost" size="lg" className="text-neutral-10">
            Hubers
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <>
      <header className="flex w-screen flex-col gap-5 bg-white px-4 pb-2 pt-4 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:hidden">
        <div className="flex items-center justify-between">
          <Logo size="small" />
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
                notificationCount="10"
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
          <Logo size="small" />
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
              notificationCount="10"
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
