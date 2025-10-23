'use client';

import { ArrowLeft, Check, X } from '@phosphor-icons/react';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';

import { useState } from 'react';
import Image from 'next/image';
import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Spinner } from '@/components/loadingState/Spinner';
import { ProfileCover } from '@/components/ProfileCover';
import AboutPanel from '@/layouts/profile/AboutPanel';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';
import HuberConfirmationModal from '@/layouts/admin/HuberConfirmationModal';
import { Chip } from '@/components/core/chip/Chip';

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
          onClick={() => router.push('/admin/home')}
        >
          Back
        </Button>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col overflow-hidden shadow-sm lg:rounded-xl">
            <ProfileCover imageUrl={data?.cover?.path} className="h-[100px] xl:h-[283px]" />
            <div className="border-b border-neutral-90 bg-white px-4 pb-6 lg:px-10">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
                  <div className="relative h-[68px] w-[100px] lg:h-[120px] lg:w-48">
                    <Avatar
                      imageUrl={data?.photo?.path ?? ''}
                      className="absolute -top-10 left-[18px] size-[100px] lg:size-40"
                    />
                    <div className="absolute bottom-0 left-0 flex w-full">
                      <span className="flex w-full items-center justify-center rounded-full bg-primary-60 px-4 py-2 text-xs leading-[14px] text-white">Waiting for approval</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <h4 className="text-[28px] font-medium leading-9 text-black">{data?.fullName}</h4>
                    <div className="flex items-center gap-1">
                      <Chip
                        disabled
                        className="w-fit rounded-full border border-yellow-70 bg-yellow-98 px-4 py-1 text-xl font-medium uppercase leading-tight text-yellow-40 opacity-100"
                      >
                        Liber
                      </Chip>
                      <Image src="/assets/icons/gradient-arrow-right.svg" alt="Arrow right" width={32} height={32} />
                      <Chip
                        disabled
                        className="w-fit rounded-full border border-primary-80 bg-primary-90 px-4 py-1 text-xl font-medium uppercase leading-tight text-primary-60 opacity-100"
                      >
                        Huber
                      </Chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AboutPanel data={data} editable={false} awaiting />
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button
            size="lg"
            iconLeft={<Check />}
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
