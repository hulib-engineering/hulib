'use client';

import { useAppSelector } from '@/libs/hooks';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';

import Loading from '@/app/[locale]/loading';
import { Role } from '@/types/common';
import HuberProfileComponent from '@/_components/profile/HuberProfileComponent';
import LiberProfileComponent from '@/_components/profile/LiberProfileComponent';
import ViewerProfileComponent from '@/_components/profile/ViewerProfileComponent';

type Props = {
  userId: string;
};

export default function UserProfileClient({ userId }: Props) {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const userAvatarId = useAppSelector(state => state.auth.avatarId);
  const userAvatarUrl = useAppSelector(state => state.auth.avatarUrl);

  const routeUserId = Number(userId);
  const { data: meData, isLoading: isMeLoading } = useGetPersonalInfoQuery();
  const currentUserId = Number(meData?.id ?? userInfo?.id);
  const hasRouteUserId = Number.isFinite(routeUserId);
  const hasCurrentUserId = Number.isFinite(currentUserId);
  const notMe = hasRouteUserId && hasCurrentUserId ? routeUserId !== currentUserId : true;
  const { data, isLoading } = useGetUsersByIdQuery(userId, { skip: !hasRouteUserId || !notMe });

  const userDetail = notMe
    ? data
    : { ...(meData ?? userInfo), photo: meData?.photo ?? { id: userAvatarId, path: userAvatarUrl } };

  if (!hasRouteUserId || (isMeLoading && !hasCurrentUserId && !data) || (notMe && isLoading) || !userDetail) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  const roleId = userDetail?.role?.id;
  const roleView = notMe ? 'viewer' : roleId === Role.LIBER ? 'liber' : 'huber';

  return (
    <>
      {roleView === 'huber' && <HuberProfileComponent userDetail={userDetail} />}
      {roleView === 'liber' && <LiberProfileComponent userDetail={userDetail} />}
      {roleView === 'viewer' && <ViewerProfileComponent userDetail={userDetail} />}
    </>
  );
}
