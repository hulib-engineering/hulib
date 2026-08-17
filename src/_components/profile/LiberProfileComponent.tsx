'use client';

import { useCallback, useState } from 'react';
import BecomeHuberBanner from './BecomeHuberBanner';
import LiberProfile from './LiberHero';
import LiberProfileContent from './LiberProfileContent';
import { useGetHuberStoriesQuery } from '@/libs/services/modules/huber';
import type { TUserDetail } from '@/features/users/types';
import EditImageModal from '@/layouts/profile/EditImageModal';

type Props = {
  userDetail: TUserDetail;
};

export default function LiberProfileComponent({ userDetail }: Props) {
  const [isEditImageModalOpen, setEditImageModalOpen] = useState(false);
  const [currentEditableImageData, setCurrentEditableImageData] = useState({ type: '', data: '' });

  const { data, isLoading } = useGetHuberStoriesQuery(
    { huberId: userDetail.id, publishedOnly: false },
    { skip: !userDetail.id },
  );
  const hasNoStory = (data?.data?.length ?? 0) === 0 && !isLoading;

  const handleEditAvatarClick = useCallback(() => {
    setCurrentEditableImageData({ type: 'avatar', data: userDetail?.photo?.path ?? '' });
    setEditImageModalOpen(true);
  }, [userDetail?.photo?.path]);

  const handleCloseEditImageModal = useCallback(() => {
    setEditImageModalOpen(false);
    setCurrentEditableImageData({ type: '', data: '' });
  }, []);

  return (
    <div className="mx-auto flex w-full flex-1 flex-col gap-y-4 px-3 pt-3 md:px-0 lg:gap-5 lg:pb-12 xl:max-w-[1216px]">
      <LiberProfile userDetail={userDetail} handleEditAvatarClick={handleEditAvatarClick} />
      {hasNoStory && <BecomeHuberBanner />}
      <LiberProfileContent userDetail={userDetail} />
      <EditImageModal
        {...currentEditableImageData}
        open={isEditImageModalOpen}
        onClose={handleCloseEditImageModal}
      />
    </div>
  );
}
