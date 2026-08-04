'use client';

import type { IconProps } from '@phosphor-icons/react';
import { BookmarksSimple, Books, UserList } from '@phosphor-icons/react';
import type { ComponentType, ReactNode } from 'react';

import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import { Link, usePathname } from '@/libs/i18nNavigation';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';

type AdminNavSection = 'storiesToPublish' | 'users' | 'nameTags';

type AdminNavItem = {
  type: AdminNavSection;
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
};

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    type: 'storiesToPublish',
    label: 'Story management',
    href: '/admin/awaiting-stories',
    icon: Books,
  },
  {
    type: 'users',
    label: 'User management',
    href: '/admin/users',
    icon: UserList,
  },
  {
    type: 'nameTags',
    label: 'Tag management',
    href: '/admin/tags',
    icon: BookmarksSimple,
  },
];

const isAdminNavActive = (pathname: string, type: AdminNavSection) => {
  if (type === 'storiesToPublish') {
    return pathname.includes('/admin/awaiting-stories');
  }
  if (type === 'users') {
    return /\/admin\/users\/?$/.test(pathname);
  }
  return pathname.includes('/admin/tags');
};

export default function AdminPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data: awaitingStories } = useGetStoriesQuery({ page: 1, limit: 6 });
  const storiesBadgeCount = awaitingStories?.meta?.totalItems ?? 0;

  return (
    <div className="flex size-full overflow-hidden rounded-xl bg-white shadow-sm">
      <nav
        aria-label="Admin sections"
        className="flex w-[320px] shrink-0 flex-col gap-1 border-r border-neutral-80 bg-white px-4 py-5"
      >
        {ADMIN_NAV_ITEMS.map((section) => {
          const isSelected = isAdminNavActive(pathname, section.type);

          return (
            <Link key={section.type} href={section.href} className="relative">
              <MenuItem as="div" isSelected={isSelected}>
                <section.icon className="size-5 shrink-0" />
                <MenuItem.Title
                  className={mergeClassnames(
                    'text-neutral-10',
                    isSelected && 'text-primary-60',
                  )}
                >
                  {section.label}
                </MenuItem.Title>
                {section.type === 'storiesToPublish' && storiesBadgeCount > 0 && (
                  <div className="flex h-4 w-[18px] items-center justify-center rounded-lg border border-white bg-red-50 px-1 py-[0.5px] text-[10px] font-medium leading-3 text-white">
                    {storiesBadgeCount}
                  </div>
                )}
              </MenuItem>
            </Link>
          );
        })}
      </nav>
      <div className="flex min-w-0 flex-1 flex-col rounded-l-xl">
        {children}
      </div>
    </div>
  );
}
