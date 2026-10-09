/* eslint-disable jsx-a11y/aria-role */
'use client';

import { useRouter } from 'next/navigation';
import JoinedSince from './JoinedSince';
import RoleBadge from './RoleBadge';
import UserAvatar from './UserAvatar';
import type { TUserDetail } from '@/features/users/types';
import CreateNewStoryButton from '@/components/CreateNewStoryButton';

type ProfileHeroProps = {
  userDetail: TUserDetail;
  handleEditAvatarClick: () => void;
};

export default function LiberProfile({
  userDetail,
  handleEditAvatarClick,
}: ProfileHeroProps) {
  const router = useRouter();

  const handleCreateNewStoryClick = () => {
    router.push('/register-huber/policy');
  };

  return (
    <div className="flex items-center justify-between overflow-hidden rounded-xl p-3 shadow-sm lg:p-10">
      <div className="flex flex-row items-center">

        <UserAvatar
          photo={userDetail.photo}
          fallbackSeed={userDetail?.fullName ?? String(userDetail?.id ?? 'huber')}
          className="size-16 lg:size-40"
          onClick={handleEditAvatarClick}
        />

        <div className="ml-3 flex flex-col gap-1 lg:ml-[40px] lg:gap-4 lg:py-6">
          <div className="flex items-center gap-1 lg:gap-4">
            <RoleBadge role="liber" />
            <h4 className="text-xl font-medium leading-tight text-black lg:text-[28px] lg:leading-9">
              {userDetail?.fullName}
            </h4>
          </div>
          <JoinedSince date={userDetail?.createdAt} />
        </div>
      </div>
      <CreateNewStoryButton onClick={handleCreateNewStoryClick} className="w-fit max-w-none" />

    </div>
  );
}
