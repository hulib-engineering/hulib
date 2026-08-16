'use client';

import { useCallback, useMemo, useState } from 'react';
import BecomeHuberStar from './BecomeHuberStar';
import HuberProfile from './HuberHero';
import HuberProfileContent from '@/_components/profile/HuberProfileContent';
import type { TUserDetail } from '@/features/users/types';
import EditImageModal from '@/layouts/profile/EditImageModal';
import { useGetMyFavoritesQuery } from '@/libs/services/modules/user';
import { useGetTimeslotsQuery } from '@/libs/services/modules/time-slots';

type Props = {
  userDetail: TUserDetail;
};

export default function HuberProfileComponent({ userDetail }: Props) {
  const [isEditImageModalOpen, setEditImageModalOpen] = useState(false);
  const [currentEditableImageData, setCurrentEditableImageData] = useState({ type: '', data: '' });

  const { data: timeslotsData } = useGetTimeslotsQuery();
  const { data: favoritesData } = useGetMyFavoritesQuery({ limit: 1 });

  const huberStarProgress = useMemo(() => {
    let count = 0;
    if (userDetail.bio) {
      count++;
    }
    const slots = Array.isArray(timeslotsData) ? timeslotsData : (timeslotsData?.data ?? []);
    if (slots.length > 0) {
      count++;
    }
    if ((userDetail.storiesCount ?? 0) > 0) {
      count++;
    }
    if ((favoritesData?.length ?? 0) > 0) {
      count++;
    }
    if ((userDetail.ratingCount ?? 0) > 0) {
      count++;
    }
    return count;
  }, [userDetail.bio, userDetail.storiesCount, userDetail.ratingCount, timeslotsData, favoritesData]);

  const isHuberStar = huberStarProgress >= 5;

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
      <HuberProfile
        handleEditAvatarClick={handleEditAvatarClick}
        userDetail={userDetail}
        isHuberStar={isHuberStar}
      />
      {!isHuberStar && <BecomeHuberStar current={huberStarProgress} />}
      <HuberProfileContent />
      <EditImageModal
        {...currentEditableImageData}
        open={isEditImageModalOpen}
        onClose={handleCloseEditImageModal}
      />
    </div>
  );
}
