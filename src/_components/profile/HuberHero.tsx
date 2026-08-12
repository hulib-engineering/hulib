/* eslint-disable jsx-a11y/aria-role */
'use client';

import { useRouter } from 'next/navigation';
import { GreenTick } from './GreenTick';
import JoinedSince from './JoinedSince';
import ProfileMetrics from './ProfileMetrics';
import RoleBadge from './RoleBadge';
import UserAvatar from './UserAvatar';
import type { TUserDetail } from '@/features/users/types';
import CreateNewStoryButton from '@/components/CreateNewStoryButton';

type ProfileHeroProps = {
  userDetail: TUserDetail;
  isHuberStar?: boolean;
  handleEditAvatarClick?: () => void;
};

export default function HuberHero({ userDetail, isHuberStar = false, handleEditAvatarClick }: ProfileHeroProps) {
  const router = useRouter();

  const handleCreateNewStoryClick = () => {
    router.push('/register-huber/policy');
  };

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm lg:px-4 lg:py-6">
      <div className="flex flex-row items-start gap-2 lg:gap-6">
        <UserAvatar
          photo={userDetail.photo}
          fallbackSeed={userDetail?.fullName ?? String(userDetail?.id ?? 'huber')}
          className="size-16 shrink-0 lg:size-40"
          onClick={handleEditAvatarClick}
        />

        <div className="flex flex-1 flex-col gap-4 lg:gap-5 lg:pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="flex items-center gap-2">
                <RoleBadge role="huber" />
                <h4 className="text-xl font-medium leading-tight text-black lg:text-[28px] lg:leading-9">
                  {userDetail?.fullName}
                </h4>
                {isHuberStar && <GreenTick size={12} />}
              </div>
              <JoinedSince date={userDetail?.createdAt} />
            </div>
            <CreateNewStoryButton onClick={handleCreateNewStoryClick} className="w-fit shrink-0" />
          </div>

          <ProfileMetrics
            storiesCount={userDetail.storiesCount ?? 0}
            conversationsCount={userDetail.conversationsCount ?? 0}
            rating={userDetail.rating}
            ratingCount={userDetail.ratingCount ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
