'use client';

import { Books, UserList } from '@phosphor-icons/react';
import * as React from 'react';

import { useState } from 'react';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import { HuberCardListSkeleton, StoriesSkeleton } from '@/components/loadingState/Skeletons';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import { StoryCard } from '@/components/stories/StoryCard';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import { useGetUsersQuery } from '@/libs/services/modules/user';
import { ROLE_NAME, Role } from '@/types/common';
import type { Huber } from '@/libs/services/modules/huber/huberType';
import { HuberCard } from '@/components/hubers/HuberCard';
import { TopicChip } from '@/layouts/webapp/ChipFilter';

const AdminPanels = [
  {
    type: 'storiesToPublish',
    label: 'Awaiting approval stories',
    icon: (
      <Books />
    ),
  },
  {
    type: 'users',
    label: 'User management',
    icon: (
      <UserList />
    ),
  },
] as const;

export default function Index() {
  const [currentSection, setCurrentSection] = useState<'storiesToPublish' | 'users'>('storiesToPublish');
  // const [currentPage, setCurrentPage] = useState(1);
  const [byRole, setByRole] = useState<Role>(Role.HUBER);

  const { data: awaitingStories, isLoading: isAwaitingStoriesLoading } = useGetStoriesQuery({
    page: 1,
    limit: 50,
  });
  const {
    data: users,
    isLoading: isUsersLoading,
  } = useGetUsersQuery({
    page: 1,
    limit: 50,
    role: ROLE_NAME[byRole].toLowerCase() ?? undefined,
  });
  console.log('users', users);
  const isLoading = isAwaitingStoriesLoading || isUsersLoading;

  const renderEmptyState = () => (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <h1 className="text-[2.5rem] font-medium leading-tight">💕</h1>
      <p className="text-sm leading-5 text-neutral-20">You have a warm heart</p>
    </div>
  );
  const renderContent = (type: 'storiesToPublish' | 'users') => {
    if (isLoading) {
      return type === 'storiesToPublish' ? <StoriesSkeleton /> : <HuberCardListSkeleton />;
    }

    const list = type === 'storiesToPublish' ? awaitingStories?.data : users?.data;

    if (awaitingStories?.data?.length === 0 && users?.data?.length === 0) {
      // setCurrentSection('users');
      return renderEmptyState();
    }

    return (
      <div className="flex flex-col gap-6 p-8 pt-0">
        {type === 'storiesToPublish' ? (
          <>
            <div className="flex flex-col gap-2 pt-5">
              <h5 className="text-2xl font-medium leading-8 text-neutral-10">Awaiting approval - Stories</h5>
              <p className="text-sm leading-5 text-neutral-20">List of Stories awaiting approval</p>
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {list?.map((item: TStory) => (
                <StoryCard key={item.id} data={item} showAdminControls />
              ))}
            </div>
            {/* {awaitingStories?.hasNextPage && ( */}
            {/* <StoryPagination */}
            {/*  currentPage={currentPage} */}
            {/*  totalPages={awaitingStories?.data?.totalPages || 0} */}
            {/*  onPageChange={() => {}} */}
            {/* /> */}
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2 pt-5">
              <h5 className="text-2xl font-medium leading-8 text-neutral-10">User management</h5>
              <p className="text-sm leading-5 text-neutral-20">List of Users</p>
            </div>
            <div className="scrollbar-hide flex w-full flex-nowrap items-center gap-2 overflow-x-auto py-2">
              {([Role.HUBER, Role.LIBER] as const).map(chip => (
                <TopicChip
                  key={chip}
                  isActive={byRole === chip}
                  onClick={() => setByRole(chip)}
                >
                  {ROLE_NAME[chip]}
                </TopicChip>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {list?.map((item: Partial<Huber>) => (
                <HuberCard
                  key={item.id}
                  {...item}
                  awaiting={item.role?.id === Role.LIBER && item.approval === 'Pending'}
                  showAdminControls
                  isHuber={byRole === Role.HUBER}
                />
              ))}
            </div>
          </>

        )}
      </div>
    );
  };

  return (
    <div className="flex size-full overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="flex w-1/4 flex-col gap-1 border-r border-neutral-80 bg-white px-4 py-5">
        {AdminPanels.map((section, index) => (
          <div key={index} className="relative">
            <MenuItem
              as="button"
              type="button"
              isSelected={currentSection === section.type}
              onClick={() => setCurrentSection(section.type)}
            >
              {section.icon}
              <MenuItem.Title
                className={mergeClassnames(
                  'text-neutral-10 ',
                  currentSection === section.type && 'text-primary-60',
                )}
              >
                {section.label}
              </MenuItem.Title>
            </MenuItem>
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col rounded-l-xl">
        {renderContent(currentSection)}
      </div>
    </div>
  );
};
