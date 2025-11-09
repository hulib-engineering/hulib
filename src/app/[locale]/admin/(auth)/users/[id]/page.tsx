'use client';

import { ArrowLeft, DotsThreeOutline, Hammer, Heart, UserCheck, Warning } from '@phosphor-icons/react';
import { redirect, useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import IconButton from '@/components/core/iconButton/IconButton';
import MenuItem from '@/components/core/menuItem/MenuItem';
import Popover from '@/components/core/popover/Popover';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushSuccess } from '@/components/CustomToastifyContainer';
import { Spinner } from '@/components/loadingState/Spinner';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ProfileCover } from '@/components/ProfileCover';
import { ActionOnUserModal } from '@/layouts/admin/ActionOnUserModal';
import AboutPanel from '@/layouts/profile/AboutPanel';
import MyStoriesPanel from '@/layouts/profile/MyStoriesPanel';
import UserActivityList from '@/layouts/profile/UserActivityList';
import { useUnbanUserMutation, useUnwarnUserMutation } from '@/libs/services/modules/moderation';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';
import { UserStatusEnum } from '@/libs/services/modules/user/userType';
import { Role } from '@/types/common';

const ProfileTabs = [
  { value: 'about', label: 'About' },
  { value: 'stories', label: 'Stories' },
  { value: 'activities', label: 'Activities' },
];
const ActionsOnUser = [
  {
    name: 'Un-warn this account',
    icon: <UserCheck className="text-xl text-green-40" />,
    type: 'unwarn',
  },
  {
    name: 'Warn this account',
    icon: <Warning className="text-xl text-orange-50" />,
    type: 'warn',
  },
  {
    name: 'Un-ban this account',
    icon: <UserCheck className="text-xl text-green-40" />,
    type: 'unban',
  },
  {
    name: 'Ban this Account',
    icon: <Hammer className="text-xl text-red-50" weight="fill" />,
    type: 'ban',
  },
];

type TProfileTab = 'about' | 'stories' | string;

export default function Index() {
  const { status } = useSession();

  const router = useRouter();
  const currentPathname = usePathname();
  const { id: userId } = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const {
    data,
    isLoading,
  } = useGetUsersByIdQuery(userId, {
    skip: !userId,
  });
  const [unWarnUser] = useUnwarnUserMutation();
  const [unBanUser] = useUnbanUserMutation();

  const isHuber = data?.role?.id === Role.HUBER;
  const isUnderWarning = data?.status?.id === UserStatusEnum.UNDER_WARNING;
  const isBanned = data?.status?.id === UserStatusEnum.INACTIVE;

  const visibleTabs = useMemo(() => {
    // Someone else's profile
    if (!isHuber) {
      return ProfileTabs.filter(tab => tab.value !== 'stories');
    }

    return ProfileTabs;
  }, [isHuber]);
  const visibleDropdownMenuItems = useMemo(() => {
    if (isUnderWarning) {
      return ActionsOnUser.filter(action => action.type !== 'unban');
    }

    if (isBanned) {
      return ActionsOnUser.filter(action => action.type === 'unban');
    }

    return ActionsOnUser.filter(action => action.type === 'ban' || action.type === 'warn');
  }, [isUnderWarning, isBanned]);

  const [currentTab, setCurrentTab] = useState<TProfileTab>(tab || 'about');
  const [isWarnHuberModalOpen, setWarnHuberModalOpen] = useState(false);
  const [isBanHuberModalOpen, setBanHuberModalOpen] = useState(false);

  useEffect(() => {
    // Update the URL query param
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', currentTab); // Ensure the item.type is string
    router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
  }, [currentPathname, currentTab, router, searchParams]);

  if (status === 'unauthenticated') {
    return redirect('/auth/login');
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleActionItemClick = async (actionType: 'ban' | 'unban' | 'warn' | 'unwarn' | string) => {
    switch (actionType) {
      case 'ban':
        return setBanHuberModalOpen(true);
      case 'warn':
        return setWarnHuberModalOpen(true);
      case 'unban':
        await unBanUser({ userId: Number(userId) ?? 0 }).unwrap();
        return pushSuccess('Un-banned successfully!');
      case 'unwarn':
        await unWarnUser({ userId: Number(userId) ?? 0 }).unwrap();
        return pushSuccess('Un-warned successfully!');
    }
  };

  return (
    <div className="-mt-8 flex w-full flex-col xl:gap-5">
      <div className="flex flex-col overflow-hidden shadow-sm lg:rounded-b-xl">
        <ProfileCover imageUrl={data?.cover?.path} className="h-[100px] xl:h-[283px]">
          <div className="relative size-full">
            <Button
              variant="ghost"
              size="lg"
              iconLeft={<ArrowLeft />}
              className="absolute inset-0 w-fit text-black"
              onClick={() => router.push('/admin/home')}
            >
              Back
            </Button>
          </div>
        </ProfileCover>
        <div className="border-b border-neutral-90 bg-white px-4 pb-6 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
              <div className="relative h-[68px] w-[100px] lg:h-[120px] lg:w-40">
                <Avatar
                  imageUrl={data?.photo?.path ?? ''}
                  className="absolute -top-8 left-0 size-[100px] lg:size-40"
                />
              </div>

              <div className="flex flex-col gap-1 lg:gap-4 lg:py-6">
                <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
                  <h4 className="text-[28px] font-medium leading-9 text-black">{data?.fullName}</h4>
                  <Chip
                    disabled
                    className="h-full w-fit rounded-full border border-primary-80 bg-primary-90 px-2 py-1 text-xs font-medium uppercase leading-[14px] text-primary-60 opacity-100 lg:px-3 lg:text-xl"
                  >
                    {data?.role?.name}
                  </Chip>
                </div>
                {isHuber && (
                  <div className="flex items-center gap-2">
                    <Heart className="text-pink-50" weight="fill" />
                    <p className="text-sm text-black opacity-80">/5 (hearts)</p>
                  </div>
                )}
              </div>
            </div>
            <div className="py-6">
              <Popover position="bottom-end" className="size-full">
                <Popover.Trigger data-testid="actions-popover-trigger">
                  <IconButton variant="ghost" size="lg">
                    <DotsThreeOutline />
                  </IconButton>
                </Popover.Trigger>
                <Popover.Panel className="flex w-60 flex-col gap-2 p-2">
                  {({ open = false, close }) => (
                    <div data-testid="actions-popover-content">
                      {visibleDropdownMenuItems.map((item, index) =>
                        (
                          <MenuItem
                            key={index}
                            onClick={async () => {
                              if (open) {
                                close();
                              }
                              await handleActionItemClick(item.type);
                            }}
                          >
                            {item.icon}
                            <MenuItem.Title>{item.name}</MenuItem.Title>
                          </MenuItem>
                        ),
                      )}
                      <LocaleSwitcher className="lg:hidden" />
                    </div>
                  )}
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        </div>
        <div className="border-b-[0.5px] border-neutral-90 bg-white">
          <div className="mx-auto flex w-full items-center gap-6 px-4 pt-6 lg:w-5/6 lg:gap-8 lg:px-0 lg:pt-4">
            {visibleTabs.map(({ value, label }) => (
              <div
                key={value}
                role="button"
                tabIndex={0}
                className={mergeClassnames(
                  'h-full pb-2 pl-2 border-b-2 transition-colors font-medium text-sm',
                  'lg:h-11 lg:px-2 lg:pt-1',
                  currentTab === value ? 'border-primary-60 text-primary-60' : 'text-neutral-20',
                )}
                onClick={() => setCurrentTab(value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setCurrentTab(value);
                  }
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
      {currentTab === 'about' && (<AboutPanel data={data} editable={false} underAdminControls />)}
      {currentTab === 'stories' && (
        <MyStoriesPanel
          topics={data?.humanBookTopic}
          storyOwnerId={data.id}
          showOthers
        />
      )}
      {currentTab === 'activities' && (
        <UserActivityList userInfo={data} />
      )}
      <ActionOnUserModal data={data} type="warn" open={isWarnHuberModalOpen} onClose={() => setWarnHuberModalOpen(false)} />
      <ActionOnUserModal data={data} type="ban" open={isBanHuberModalOpen} onClose={() => setBanHuberModalOpen(false)} />
    </div>
  );
}
