'use client';

import clsx from 'clsx';
import { useParams } from 'next/navigation';

import ProfileHuber from '@/features/users/components/ProfileHuber';
import ProfileLiber from '@/features/users/components/ProfileLiber';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';
import { Role } from '@/types/common';

const UserApprovalPage = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetUsersByIdQuery(Number(id));

  const renderProfile = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (!data) {
      return null;
    }
    if (data?.role?.id === Role.HUBER) {
      return <ProfileHuber data={data} />;
    }
    return <ProfileLiber data={data} />;
  };

  return (
    <div
      className={clsx(
        'w-full justify-between rounded-md bg-neutral-98 p-0 px-4 py-[-2rem] lg:flex-row lg:px-28',
      )}
    >
      {renderProfile()}
    </div>
  );
};

export default UserApprovalPage;
