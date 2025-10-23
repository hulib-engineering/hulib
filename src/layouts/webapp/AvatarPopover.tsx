import {
  Bookmarks,
  Books,
  CalendarDots,
  CaretDown,
  Gear,
  House,
  Pencil,
  SignOut,
  UserCircle,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import MenuItem from '@/components/core/menuItem/MenuItem';
import Popover from '@/components/core/popover/Popover';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { useAppSelector } from '@/libs/hooks';
import { Role } from '@/types/common';
import { Env } from '@/libs/Env.mjs';

export default function AvatarPopover() {
  const currentLocale = useLocale();
  const t = useTranslations('HeaderWebApp');

  const { id, role } = useAppSelector(state => state.auth.userInfo);
  const avatarUrl = useAppSelector(state => state.auth.avatarUrl);

  const AvatarPopoverMenuItems = useMemo(
    () => [
      {
        label: t('dashboard'),
        icon: <House className="text-xl text-primary-60" />,
        href: '/admin/home',
        roles: [Role.ADMIN],
      },
      {
        label: t('my_profile'),
        icon: <UserCircle className="text-xl text-primary-60" />,
        href: `/users/${id}`,
        roles: [Role.LIBER, Role.HUBER],
      },
      {
        label: t('change_password'),
        icon: <Gear className="text-xl text-primary-60" />,
        href: '/me/change-password',
        roles: [Role.LIBER, Role.HUBER],
      },
      {
        label: t('register_huber'),
        icon: <Pencil className="text-xl text-primary-60" />,
        href: '/me/account-upgrade',
        roles: [Role.LIBER],
      },
      {
        label: 'My Favorite',
        icon: <Bookmarks className="text-xl text-primary-60" />,
        href: `/users/${id}?tab=favorite-list`,
        roles: [Role.LIBER],
      },
      {
        label: 'Stories Management',
        icon: <Books className="text-xl text-primary-60" />,
        href: `/users/${id}?tab=stories`,
        roles: [Role.HUBER],
      },
      {
        label: 'My Schedule',
        icon: <CalendarDots className="text-xl text-primary-60" />,
        href: '/my-schedule',
        roles: [Role.HUBER],
      },
      {
        label: t('sign_out'),
        icon: <SignOut className="text-xl text-red-60" />,
        onClick: () => signOut({
          callbackUrl: `${Env.NEXT_PUBLIC_APP_URL}${currentLocale === 'vi' ? '' : '/en'}${role?.id === Role.ADMIN ? '/admin/auth/login' : '/auth/login'}`,
        }),
      },
    ],
    [id, role?.id, t],
  );
  const AvatarPopoverMenuItemsByRole = useMemo(() => {
    return (
      AvatarPopoverMenuItems.filter((item) => {
        if (item?.roles) {
          return item.roles.includes(role?.id as Role);
        }
        return true;
      }) || []
    );
  }, [AvatarPopoverMenuItems, role?.id]);

  return (
    <Popover position="bottom-end" className="h-full w-11">
      <Popover.Trigger
        data-testid="popover-trigger-arrow"
        {...{
          className: 'h-full',
        }}
      >
        <div className="relative size-11">
          <Avatar
            imageUrl={role?.id === Role.ADMIN
              ? '/assets/images/admin-ava.png' : (avatarUrl || '/assets/images/ava-placeholder.png')}
            className="size-11"
          />
          <div className="absolute left-7 top-7 rounded-full border border-solid border-white bg-neutral-90 p-0.5">
            <CaretDown size={12} />
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Panel className="flex flex-col gap-1 p-2">
        {({ open = false, close }) => (
          <div data-testid="popover-content">
            {AvatarPopoverMenuItemsByRole.map((item, index) =>
              item.href
                ? (
                    <Link href={item.href} key={index} onClick={close}>
                      <MenuItem>
                        {item.icon}
                        <MenuItem.Title className="leading-4 text-neutral-10">{item.label}</MenuItem.Title>
                      </MenuItem>
                    </Link>
                  )
                : (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        if (open) {
                          close();
                        }
                        item.onClick?.();
                      }}
                    >
                      {item.icon}
                      <MenuItem.Title className="leading-4 text-red-60">{item.label}</MenuItem.Title>
                    </MenuItem>
                  ),
            )}
            <LocaleSwitcher className="lg:hidden" />
          </div>
        )}
      </Popover.Panel>
    </Popover>
  );
};
