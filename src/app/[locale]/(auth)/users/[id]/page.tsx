'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';
import HuberProfileContent from '@/layouts/profile/huber/HuberProfileContent';
import LiberProfileContent from '@/layouts/profile/liber/LiberProfileContent';
import ProfileHero from '@/layouts/profile/ProfileHero';
import { redirect } from '@/libs/i18nNavigation';

import Loading from '@/app/[locale]/loading';
import EditImageModal from '@/layouts/profile/EditImageModal';
import ReportModal from '@/layouts/profile/ReportModal';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';
import { openChat } from '@/libs/store/messenger';
import { Role } from '@/types/common';

export default function Index() {
  const { status } = useSession();
  const { id: userId } = useParams();
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
    <div className="mx-auto flex w-full flex-1 flex-col gap-y-4 px-3 pt-3 md:px-0 lg:gap-5 lg:pb-12 xl:max-w-[1216px]">
      <ProfileHero
        userDetail={userDetail}
        notMe={notMe}
        isHuberProfile={isHuberProfile}
        onEditAvatarClick={handleEditAvatarClick}
        onReportClick={() => setReportModalOpen(true)}
        onChatClick={handleOpenChatWindow}
      />

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
