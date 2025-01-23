'use client';

import { CaretDown, DotsThreeVertical, Heart } from '@phosphor-icons/react';
import Image from 'next/image';
import * as React from 'react';

const ReviewItem = () => {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-x-2">
          <Image
            src="/assets/images/user-avatar.jpeg"
            alt="Avatar"
            width={44}
            height={44}
            priority
            className="rounded-full border-4 border-neutral-98 object-contain object-center"
          />
          <div className="flex flex-col">
            <p className="text-sm font-normal text-[#000000]">Ngo Thanh Nhan</p>
            <div className="flex items-center gap-x-2">
              <div className="flex items-center gap-x-0.5">
                <Heart size={16} color="#F3C00C" weight="fill" />
                <Heart size={16} color="#F3C00C" weight="fill" />
                <Heart size={16} color="#F3C00C" weight="fill" />
                <Heart size={16} color="#F3C00C" weight="fill" />
                <Heart size={16} color="#F3C00C" weight="fill" />
              </div>
              <p className="text-xs text-[#00000080]">25/03/1999</p>
            </div>
          </div>
        </div>
        <DotsThreeVertical size={16} color="#00000080" />
      </div>
      <div className=" flex flex-col gap-y-2">
        <p className="text-base font-normal text-[#000000]">Give it a read</p>
        <p className="text-sm font-normal text-[#000000]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
    </div>
  );
};

const ReaderReview = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border border-solid p-6 shadow-[0px_0px_4px_0px_#0F0F100F]">
      <h6 className="text-xl font-bold text-neutral-20">Reader reviews (40)</h6>
      <div className="flex flex-col gap-y-4">
        <ReviewItem />
        <ReviewItem />
        <ReviewItem />
        <ReviewItem />
      </div>
      <div className="flex w-full items-center justify-center gap-x-2">
        <CaretDown size={16} color="#0442BF" />
        <span className="text-sm font-normal text-primary-50">
          View all reviews
        </span>
      </div>
    </div>
  );
};

export default ReaderReview;
