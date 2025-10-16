'use client';

import { Heart, PencilSimple, TelegramLogo } from '@phosphor-icons/react';
import { redirect, useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { Spinner } from '@/components/loadingState/Spinner';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import { ProfileCover } from '@/components/ProfileCover';
import AboutPanel from '@/layouts/profile/AboutPanel';
import EditImageModal from '@/layouts/profile/EditImageModal';
import MyStoriesPanel from '@/layouts/profile/MyStoriesPanel';
import MyFavoritesPanel from '@/layouts/profile/MyFavoritesPanel';
import ReportModal from '@/layouts/profile/ReportModal';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';
import { openChat } from '@/libs/store/messenger';
import { Role } from '@/types/common';

const ProfileTabs = [
  { value: 'about', label: 'About' },
  { value: 'stories', label: 'My Stories' },
  { value: 'favorite-list', label: 'My Favorite' },
];

type TProfileTab = 'about' | 'stories' | 'favorite-list' | string;

export default function Index() {
  const { status } = useSession();

  const router = useRouter();
  const currentPathname = usePathname();
  const { id: userId } = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const userInfo = useAppSelector(state => state.auth.userInfo);
  const userAvatarId = useAppSelector(state => state.auth.avatarId);
  const userAvatarUrl = useAppSelector(state => state.auth.avatarUrl);
  const notMe = Number(userId) !== Number(userInfo?.id);
  const isHuber = userInfo?.role?.id === Role.HUBER;

  const visibleTabs = useMemo(() => {
    if (!notMe) {
      // My profile
      if (isHuber) {
        // Huber can see all tabs
        return ProfileTabs;
      }
      // Non-huber: hide "stories"
      return ProfileTabs.filter(tab => tab.value !== 'stories');
    }

    // Someone else's profile
    if (isHuber) {
      return ProfileTabs.filter(tab => ['about', 'stories'].includes(tab.value));
    }

    return ProfileTabs.filter(tab => tab.value === 'about');
  }, [notMe, isHuber]);

  const {
    data,
    isLoading,
  } = useGetUsersByIdQuery(userId, {
    skip: !notMe,
  });
  const userDetail = notMe ? data : { ...userInfo, photo: { id: userAvatarId, path: userAvatarUrl } };

  const dispatch = useAppDispatch();

  const [currentTab, setCurrentTab] = useState<TProfileTab>(tab || 'about');
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [currentEditableImageData, setCurrentEditableImageData] = useState({ type: '', data: '' });
  const [isEditImageModalOpen, setEditImageModalOpen] = useState(false);

  useEffect(() => {
    // Update the URL query param
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', currentTab); // Ensure the item.type is string
    router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
  }, [currentPathname, currentTab, router, searchParams]);

  const handleEditCoverClick = () => {
    setCurrentEditableImageData({ type: 'cover', data: userDetail.cover?.path ?? '' });
    setEditImageModalOpen(true);
  };
  const handleEditAvatarClick = () => {
    setCurrentEditableImageData({ type: 'avatar', data: userDetail.photo?.path ?? '' });
    setEditImageModalOpen(true);
  };
  const handleCloseEditImageModal = () => {
    setEditImageModalOpen(false);
    setCurrentEditableImageData({ type: '', data: '' });
  };
  const handleOpenChatWindow = () => {
    dispatch(
      openChat({
        id: userDetail?.id ?? '',
        name: userDetail?.fullName ?? '',
        avatarUrl: userDetail?.photo?.path,
        isOpen: true,
        isMinimized: false,
      }),
    );
  };

  if (status === 'unauthenticated') {
    return redirect('/auth/login');
  }

  if ((notMe && isLoading) || !userDetail) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-1 flex-col pt-3 lg:w-5/6 lg:gap-5 lg:pb-12">
      <div className="flex flex-col overflow-hidden shadow-sm lg:rounded-b-xl">
        <ProfileCover imageUrl={userDetail?.cover?.path} className="h-[100px] lg:h-[283px]">
          {!notMe && (
            <IconButton variant="secondary" size="sm" className="absolute right-4 top-4" onClick={handleEditCoverClick}>
              <PencilSimple weight="bold" />
            </IconButton>
          )}
        </ProfileCover>
        <div className="border-b border-neutral-90 bg-white px-4 pb-6 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
              <div className="group relative h-[68px] w-[100px] lg:h-[120px] lg:w-40">
                <Avatar imageUrl={userDetail.photo?.path ?? ''} className="absolute -top-8 left-0 size-[100px] lg:size-40" />
                {!notMe && (
                  <IconButton
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-0 right-0 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
                    onClick={handleEditAvatarClick}
                  >
                    <PencilSimple weight="bold" />
                  </IconButton>
                )}
              </div>
              <div className="flex flex-col gap-1 lg:gap-4 lg:py-6">
                <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
                  <h4 className="text-[28px] font-medium leading-9 text-black">{userDetail?.fullName}</h4>
                  <Chip
                    disabled
                    className="h-full w-fit rounded-full border border-primary-80 bg-primary-90 px-2 py-1 text-xs font-medium uppercase leading-[14px] text-primary-60 opacity-100 lg:px-3 lg:text-xl"
                  >
                    {userDetail?.role?.name}
                  </Chip>
                </div>
                {userDetail?.role?.id === Role.HUBER && (
                  <div className="flex items-center gap-2">
                    <Heart className="text-pink-50" weight="fill" />
                    <p className="text-sm text-black opacity-80">/5 (hearts)</p>
                  </div>
                )}
              </div>
              {notMe && userDetail?.role?.id === Role.HUBER && (
                <div className="flex gap-2 lg:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[114px]"
                    onClick={() => setReportModalOpen(true)}
                  >
                    Report
                  </Button>
                  <Button
                    size="sm"
                    iconRight={<TelegramLogo />}
                    className="w-[114px]"
                    onClick={handleOpenChatWindow}
                  >
                    Chat
                  </Button>
                </div>
              )}
            </div>
            {notMe && userDetail?.role?.id === Role.HUBER && (
              <div className="hidden gap-2 lg:flex">
                <Button variant="outline" size="lg" onClick={() => setReportModalOpen(true)}>
                  Report
                </Button>
                <Button
                  size="lg"
                  iconRight={<TelegramLogo />}
                  onClick={handleOpenChatWindow}
                >
                  Chat
                </Button>
              </div>
            )}
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
      {currentTab === 'about' && (<AboutPanel data={userDetail} editable={!notMe} />)}
      {currentTab === 'stories' && (
        <MyStoriesPanel
          topics={userDetail?.humanBookTopic}
          storyOwnerId={userDetail.id}
          showOthers={notMe}
        />
      )}
      {currentTab === 'favorite-list' && (<MyFavoritesPanel />)}
      <ReportModal open={isReportModalOpen} onClose={() => setReportModalOpen(false)} />
      <EditImageModal
        {...currentEditableImageData}
        open={isEditImageModalOpen}
        onClose={handleCloseEditImageModal}
      />
    </div>
  );
}
