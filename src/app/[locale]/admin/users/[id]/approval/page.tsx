'use client';

import { ArrowLeft, CheckFat, X } from '@phosphor-icons/react';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';

import { useState } from 'react';
import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { Spinner } from '@/components/loadingState/Spinner';
import { ProfileCover } from '@/components/ProfileCover';
import AboutPanel from '@/layouts/profile/AboutPanel';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';
import HuberConfirmationModal from '@/layouts/admin/HuberConfirmationModal';

export default function Index() {
  const { status } = useSession();

  const router = useRouter();
  const { id: userId } = useParams();

  const {
    data,
    isLoading,
  } = useGetUsersByIdQuery(userId, {
    skip: !userId,
  });

  const [isApproveHuberlModalOpen, setIsApproveHuberModalOpen] = useState(false);
  const [isRejecteHuberlModalOpen, setIsRejectHuberModalOpen] = useState(false);

  if (status === 'unauthenticated') {
    return redirect('/auth/login');
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white px-8 py-6 shadow-sm">
      <HuberConfirmationModal
        user={data}
        type="approve"
        open={isApproveHuberlModalOpen}
        onClose={() => setIsApproveHuberModalOpen(false)}
      />
      <HuberConfirmationModal
        user={data}
        type="reject"
        open={isRejecteHuberlModalOpen}
        onClose={() => setIsRejectHuberModalOpen(false)}
      />
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          size="lg"
          iconLeft={<ArrowLeft />}
          className="w-fit text-black"
          onClick={() => router.push('/home')}
        >
          Back to Awaiting approval - Hubers
        </Button>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col overflow-hidden shadow-sm lg:rounded-xl">
            <ProfileCover imageUrl={data?.cover?.path} className="h-[100px] xl:h-[283px]" />
            <div className="border-b border-neutral-90 bg-white px-4 pb-6 lg:px-10">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
                  <div className="relative h-[68px] w-[100px] lg:h-[120px] lg:w-40">
                    <Avatar
                      imageUrl={data?.photo?.path ?? ''}
                      className="absolute -top-8 left-0 size-[100px] lg:size-40"
                    />
                  </div>

                  <div className="flex flex-col gap-1 lg:gap-4 lg:py-6">
                    <div className="flex flex-col gap-3">
                      <Chip
                        disabled
                        className="h-full w-fit rounded-full bg-orange-90 px-4 py-1 text-xs leading-[14px] text-orange-50 opacity-100"
                      >
                        Waiting for approval
                      </Chip>
                      <h4 className="text-[28px] font-medium leading-9 text-black">{data?.fullName}</h4>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <AboutPanel data={data} editable={false} awaiting />
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            iconLeft={<CheckFat />}
            className="w-60"
            onClick={() => setIsApproveHuberModalOpen(true)}
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            size="lg"
            iconLeft={<X />}
            className="w-60 bg-red-90 text-red-50"
            onClick={() => setIsRejectHuberModalOpen(true)}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
