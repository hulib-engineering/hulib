'use client';

import { CaretUp, Clock, Note, User } from '@phosphor-icons/react';
import Image from 'next/image';

function DetailEventHuber() {
  return (
    <div className=" min-h-[360px] w-[396px] overflow-hidden rounded-[16px] bg-[#F0F5FF] px-[20px] py-[16px] shadow-[#1C1E211A] drop-shadow-sm">
      <div className="flex items-center">
        <h3 className="flex-1 text-[20px] leading-[32px] text-[#171819]">
          Session with Liber
        </h3>
        <p className="mx-[8px] h-[32px] w-[107px] rounded-[100px] bg-[#FFC745] px-[10px] py-[2px] text-center align-middle text-[#000000]">
          Pending...
        </p>
        <CaretUp size={24} color="#000" />
      </div>
      <div className="mt-[16px] flex items-center">
        <Clock size={16} color="#000" />
        <p className="ml-[4px] text-[14px] font-[500] leading-[16px] text-[#2E3032]">
          Tue, 02/02/2025 | 14:00 - 14:30
        </p>
      </div>
      <div className="mt-[16px] flex items-center">
        <User size={16} color="#000" />
        <p className="ml-[8px] text-[14px] font-[500] leading-[16px] text-[#171819]">
          2 Attendees
        </p>
      </div>
      <div className="mt-[16px] flex flex-col">
        <div className="flex items-center">
          <Image
            src="/assets/images/icons/avatar.svg"
            alt="avatar"
            width={32}
            height={32}
          />
          <p className="py[2px] mx-[8px] flex h-[20px] w-[63] items-center justify-center rounded-[100px] bg-[#CDDDFE] px-[10px] text-[14px] font-[500] leading-[16px] text-[#0442BF]">
            Huber
          </p>
          <p className="text-[14px] font-[500] leading-[16px] text-[#EE0038]">
            [Thợ lặn]
          </p>
          <p className="ml-[8px] text-[14px] font-[500] leading-[16px] text-[#171819]">
            Đinh Tiến Đạt (You)
          </p>
        </div>
        <div className="mt-[16px] flex items-center">
          <Image
            src="/assets/images/icons/avatar.svg"
            alt="avatar"
            width={32}
            height={32}
          />
          <p className="py[2px] mx-[8px] flex h-[20px] w-[63] items-center justify-center rounded-[100px] bg-[#FFE3CC] px-[10px] text-[14px] font-[500] leading-[16px] text-[#FF7301]">
            Liber
          </p>
          <p className="text-[14px] font-[500] leading-[16px] text-[#A978D6]">
            [Thần bùm]
          </p>
          <p className="text-[Hari Won] ml-[8px] text-[14px] font-[500] leading-[16px] text-[#171819]">
            Harry won
          </p>
        </div>
      </div>
      <div className="mt-[16px] flex items-start">
        <Note size={40} color="#000" />
        <p className="ml-[8px] text-[14px] font-[400] leading-[20px] text-[#2E3032]">
          Embark on a journey through the vivid tapestry of my life story, where
          each chapter unfolds with a unique blend of triumphs
        </p>
      </div>
      <div className="mt-[16px] flex items-center">
        <button
          type="button"
          className="h-[44px] w-[141px] rounded-full border border-[#C2C6CF] bg-[#fff] text-[16px] font-[500] leading-[20px] text-[#0442BF]"
        >
          Reject
        </button>
        <button
          type="button"
          className="ml-auto h-[44px] min-w-[205px] rounded-full bg-[#0442BF] text-[16px] font-[500] leading-[20px] text-[#fff]"
        >
          Aprove
        </button>
      </div>
    </div>
  );
}

export default DetailEventHuber;
