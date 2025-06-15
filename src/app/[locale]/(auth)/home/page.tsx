'use client';

import { useEffect, useState } from 'react';

import ExploreStory from '@/components/exploreStory/ExploreStory';
import Banner from '@/components/home/Banner';
import ShortDescription from '@/components/home/ShortDescription';
import Loader from '@/components/loader/Loader';
import AdminLayout from '@/layouts/AdminLayout';
import CommonLayout from '@/layouts/CommonLayout';
import { useAppSelector } from '@/libs/hooks';
import { Role } from '@/types/common';

const Page = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [roleUser, setRoleUser] = useState<Role | null>(null);

  useEffect(() => {
    if (userInfo) {
      setRoleUser(userInfo.role?.id);
    }
  }, [userInfo]);

  if (!roleUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return roleUser === Role.ADMIN ? (
    <AdminLayout className="h-full bg-neutral-98">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 flex justify-center gap-1">
            <span className="text-2xl">💕</span>
          </div>
          <p className="text-lg font-medium text-neutral-20">
            You have a warm heart
          </p>
        </div>
      </div>
    </AdminLayout>
  ) : (
    <CommonLayout className="bg-neutral-98">
      <Banner />
      <ExploreStory topicIds={null} />
      <ShortDescription />
    </CommonLayout>
  );
};

export default Page;
