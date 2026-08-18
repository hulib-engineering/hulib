'use client';

import { useCallback, useState } from 'react';
import ViewerHero from './ViewerHero';
import ViewerProfileContent from './ViewerProfileContent';
import ReportModal from '@/layouts/profile/ReportModal';
import type { TUserDetail } from '@/features/users/types';
import { openChat } from '@/libs/store/messenger';
import { useAppDispatch } from '@/libs/hooks';

type Props = {
  userDetail: TUserDetail;
};

export default function ViewerProfileComponent({ userDetail }: Props) {
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleOpenChatWindow = useCallback(() => {
    dispatch(
      openChat({
        id: String(userDetail?.id),
        name: userDetail?.fullName ?? '',
        avatarUrl: userDetail?.photo?.path,
        isOpen: true,
        isMinimized: false,
      }),
    );
  }, [dispatch, userDetail?.id, userDetail?.fullName, userDetail?.photo?.path]);

  const handleOpenReportModal = useCallback(() => setReportModalOpen(true), []);
  const handleCloseReportModal = useCallback(() => setReportModalOpen(false), []);
  return (
    <div className="mx-auto flex w-full flex-1 flex-col gap-y-4 px-3 pt-3 md:px-0 lg:gap-5 lg:pb-12 xl:max-w-[1216px]">
      <ViewerHero
        userDetail={userDetail}
        onChatClick={handleOpenChatWindow}
        onReportClick={handleOpenReportModal}
      />
      <ViewerProfileContent />

      <ReportModal open={isReportModalOpen} onClose={handleCloseReportModal} />
    </div>
  );
}
