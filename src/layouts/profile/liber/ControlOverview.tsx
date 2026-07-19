'use client';

import type { ReactNode } from 'react';
import React from 'react';
import { Books, ThumbsUp, UserList } from '@phosphor-icons/react';

import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import type { TabItem } from '@/types/common';

type ControlOverviewProps = {
  className?: string;
  currentTab: string;
  onTabChange: (tab: string) => void;
  tabs: readonly TabItem[];
  children: ReactNode;
};

const TAB_ICONS: Record<string, React.ElementType> = {
  'about': UserList,
  'stories': Books,
  'favorite-list': ThumbsUp,
};

export const ControlOverview = ({
  className,
  currentTab,
  onTabChange,
  tabs,
  children,
}: ControlOverviewProps) => {
  return (
    <div
      className={mergeClassnames(
        'flex flex-col overflow-hidden rounded-xl bg-white shadow-sm lg:flex-row',
        className,
      )}
    >
      {/* Mobile: horizontal tab bar */}
      <nav
        className="flex shrink-0 border-b border-neutral-90 bg-white lg:hidden"
        aria-label="Profile sections"
      >
        {tabs.map(({ value, label }) => {
          const Icon = TAB_ICONS[value];
          const isActive = currentTab === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onTabChange(value)}
              className={mergeClassnames(
                'flex flex-1 flex-col items-center gap-1 border-b-2 px-3 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'border-primary-60 text-primary-60'
                  : 'border-transparent text-neutral-40',
              )}
            >
              {Icon && <Icon className="size-5" />}
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop: vertical sidebar */}
      <nav
        className="hidden w-[264px] shrink-0 flex-col gap-1 border-r border-neutral-90 bg-white px-4 py-5 lg:flex"
        aria-label="Profile sections"
      >
        {tabs.map(({ value, label }) => {
          const Icon = TAB_ICONS[value];
          return (
            <MenuItem
              key={value}
              isSelected={currentTab === value}
              onClick={() => onTabChange(value)}
            >
              {Icon && <Icon className="size-5 shrink-0" />}
              <MenuItem.Title>{label}</MenuItem.Title>
            </MenuItem>
          );
        })}
      </nav>

      <div className="min-w-0 flex-1 pt-4 lg:p-5">
        {children}
      </div>
    </div>
  );
};
