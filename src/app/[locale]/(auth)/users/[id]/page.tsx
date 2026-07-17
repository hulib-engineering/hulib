'use client';

import { Heart, PencilSimple, TelegramLogo } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import { useTranslations } from 'next-intl';
import HuberProfileContent from '@/layouts/profile/huber/HuberProfileContent';
import LiberProfileContent from '@/layouts/profile/liber/LiberProfileContent';
import { redirect } from '@/libs/i18nNavigation';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import Loading from '@/app/[locale]/loading';
import IconButton from '@/components/core/iconButton/IconButton';
import EditImageModal from '@/layouts/profile/EditImageModal';
import ReportModal from '@/layouts/profile/ReportModal';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';
import { openChat } from '@/libs/store/messenger';
import { Role } from '@/types/common';

export default function Index() {
  const { status } = useSession();
  const { id: userId } = useParams();
  const t = useTranslations('MyProfile');

  const userInfo = useAppSelector(state => state.auth.userInfo);
  const userAvatarId = useAppSelector(state => state.auth.avatarId);
  const userAvatarUrl = useAppSelector(state => state.auth.avatarUrl);
  const notMe = Number(userId) !== Number(userInfo?.id);

  const { data, isLoading } = useGetUsersByIdQuery(userId, { skip: !notMe });

  const userDetail = notMe
    ? data
    : { ...userInfo, photo: { id: userAvatarId, path: userAvatarUrl } };

  const dispatch = useAppDispatch();
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [currentEditableImageData, setCurrentEditableImageData] = useState({ type: '', data: '' });
  const [isEditImageModalOpen, setEditImageModalOpen] = useState(false);

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
        <Loading />
      </div>
    );
  }

  const isHuberProfile = userDetail?.role?.id === Role.HUBER;

  return (
    <div className="mx-auto flex w-full flex-1 flex-col pt-3 lg:gap-5 lg:pb-12 xl:max-w-[1216px]">
      {/* Profile hero */}
      <div className="flex flex-col overflow-hidden shadow-sm lg:rounded-b-xl">
        <div className="border-b border-neutral-90 bg-white px-4 pb-6 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
              <div className="flex flex-row items-center">
                <div className="group relative h-[68px] w-[100px] lg:min-h-[200px] lg:w-40">
                  {userDetail.photo?.path
                    ? (
                        <Avatar
                          imageUrl={userDetail.photo.path}
                          className="absolute left-0 top-8 size-[100px] lg:size-40"
                        />
                      )
                    : (
                        <NiceAvatar
                          className="absolute left-0 top-8 size-[100px] rounded-full lg:size-40"
                          {...genConfig(userDetail?.fullName ?? String(userDetail?.id ?? 'huber'))}
                        />
                      )}
                  {!notMe && (
                    <IconButton
                      variant="soft"
                      size="sm"
                      className="absolute bottom-0 right-0 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
                      onClick={handleEditAvatarClick}
                    >
                      <PencilSimple weight="bold" />
                    </IconButton>
                  )}
                </div>
                <div className="ml-[40px] flex flex-col gap-1 lg:gap-4 lg:py-6">
                  <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
                    <Chip
                      disabled
                      className="h-full w-fit rounded-[8px] border border-[#F9DA6C] bg-[#FDF3CE] px-2 py-1 text-xs font-medium uppercase leading-[14px] text-[#FF7301] opacity-100 lg:px-3 lg:text-xl"
                    >
                      {userDetail?.role?.name}
                    </Chip>
                    <h4 className="text-[28px] font-medium leading-9 text-black">
                      {userDetail?.fullName}
                    </h4>
                  </div>
                  {isHuberProfile && (
                    <div className="flex items-center gap-2">
                      <Heart className="text-pink-50" weight="fill" />
                      <p className="text-sm text-black opacity-80">
                        {userDetail?.rating ?? 0}
                        /5 (
                        {t('hearts')}
                        )
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {notMe && isHuberProfile && (
                <div className="flex gap-2 lg:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[114px]"
                    onClick={() => setReportModalOpen(true)}
                  >
                    {t('report')}
                  </Button>
                  <Button
                    size="sm"
                    iconRight={<TelegramLogo />}
                    className="w-[114px]"
                    onClick={handleOpenChatWindow}
                  >
                    {t('chat')}
                  </Button>
                </div>
              )}
            </div>
            {notMe && isHuberProfile && (
              <div className="hidden gap-2 lg:flex">
                <Button variant="outline" size="lg" onClick={() => setReportModalOpen(true)}>
                  {t('report')}
                </Button>
                <Button size="lg" iconRight={<TelegramLogo />} onClick={handleOpenChatWindow}>
                  {t('chat')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile content — Huber keeps old UI, Liber uses new sidebar layout */}
      {isHuberProfile
        ? <HuberProfileContent userDetail={userDetail} notMe={notMe} />
        : <LiberProfileContent userDetail={userDetail} notMe={notMe} />}

      <ReportModal open={isReportModalOpen} onClose={() => setReportModalOpen(false)} />
      <EditImageModal
        {...currentEditableImageData}
        open={isEditImageModalOpen}
        onClose={handleCloseEditImageModal}
      />
    </div>
  );
}
