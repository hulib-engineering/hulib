'use client';

import { CaretDown } from '@phosphor-icons/react';
import Image from 'next/image';
import * as React from 'react';

const ReviewItem = () => {
  return (
    <div className="flex flex-col gap-y-3 py-8">
      <div className="flex items-center gap-x-8 gap-y-5 bg-[#FFFFFF]">
        <Image
          alt="Avatar Icon"
          width={44}
          height={44}
          loading="lazy"
          src="/assets/images/icons/avatar.svg"
        />

        <div className="flex w-full items-center justify-between">
          <div className="flex-col gap-y-2">
            <p>Ngo Thanh Nhan</p>
            <div className="flex items-center gap-x-3">
              <span>Rating</span>
              <span className="text-xs font-normal text-[#00000080] opacity-50">
                July 24, 2024
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
        <p className="text-sm font-normal text-[#000000CC] opacity-80">
          Lorem ipsum dolor sit amet consectetur. Eget magna vel platea pulvinar
          tempor dui massa ut. Egestas nunc mi tristique ornare commodo vitae
          dignissim commodo. Pellentesque nulla nam ante turpis velit amet cras
          ac aliquam. Ut amet nulla lobortis amet. Varius aliquam commodo
          mauris.
        </p>
        <p className="w-fit rounded-full border border-[#FFC9E3] bg-[#FFE4F1] px-3 py-2 text-[#2E3032]">
          Study
        </p>
      </div>
    </div>
  );
};

export const ReviewPanel = () => {
  return (
    <div className="flex flex-col border-b-[0.5px] border-neutral-90 py-8">
      <h6 className="text-xl font-medium text-[#000000] ">What mentee says</h6>
      <div className="mt-3 flex w-full items-center justify-end gap-x-1">
        <p className="text-sm font-medium text-primary-50">Sort by</p>
        <CaretDown size={16} color="#0442BF" />
      </div>
      {/* <div>{listReview.map((review) => {})}</div> */}
      <div className="grid grid-cols-2 gap-2.5">
        <ReviewItem />
        <ReviewItem />
        <ReviewItem />
        <ReviewItem />
      </div>
    </div>
  );
};
