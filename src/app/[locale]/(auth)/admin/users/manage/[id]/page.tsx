'use client';

import clsx from 'clsx';
import { useParams } from 'next/navigation';

import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import UserProfile from '@/features/users/components/UserProfile';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';

const UserApprovalPage = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetUsersByIdQuery(Number(id));

  if (isLoading) {
    return (
      <div className="flex h-full w-full justify-center px-[10%]">
        <LoadingSkeleton />
      </div>
    );
  }
  if (!data) {
    return null;
  }

  return (
    <div
      className={clsx(
        'w-full justify-between rounded-md bg-neutral-98 p-0 px-4 py-[-2rem] lg:flex-row lg:px-28',
      )}
    >
      <UserProfile data={data} />;
    </div>
  );
};

export default UserApprovalPage;
