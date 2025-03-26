'use client';

import { CaretDown, Clock, User } from '@phosphor-icons/react';
import Image from 'next/image';

function DetailEventLiber() {
  return (
    <div className="z-50 max-h-[206px] w-[396px] overflow-hidden rounded-[16px] bg-[#FFF9F5] px-[20px] py-[16px] pb-[32px] shadow-[#1C1E211A] drop-shadow-sm">
      <div className="flex items-center">
        <h3 className="flex-1 text-[20px] leading-[32px] text-[#171819]">
          Session with Huber
        </h3>
        <p className="mx-[8px] h-[32px] w-[107px] rounded-[100px] bg-[#FFC745] px-[10px] py-[2px] text-center align-middle text-[#000000]">
          Pending...
        </p>
        <CaretDown size={24} color="#000" />
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
      <div className="flex flex-col">
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
          <p className="text-[14px] font-[500] leading-[16px] text-[#EE0038]">
            [Flaky]
          </p>
          <p className="text-[Hari Won] ml-[8px] text-[14px] font-[500] leading-[16px] text-[#171819]">
            Persephonee (You)
          </p>
        </div>
        <div className="mt-[8px] flex items-center">
          <Image
            src="/assets/images/icons/avatar.svg"
            alt="avatar"
            width={32}
            height={32}
          />
          <p className="py[2px] mx-[8px] flex h-[20px] w-[63] items-center justify-center rounded-[100px] bg-[#CDDDFE] px-[10px] text-[14px] font-[500] leading-[16px] text-[#0442BF]">
            Huber
          </p>
          <p className="text-[14px] font-[500] leading-[16px] text-[#38AA16]">
            [Solid]
          </p>
          <p className="ml-[8px] text-[14px] font-[500] leading-[16px] text-[#171819]">
            Hades
          </p>
        </div>
      </div>
    </div>
  );
}

export default DetailEventLiber;
