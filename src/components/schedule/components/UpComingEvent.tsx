'use client';

import { CalendarDot, MapPinArea, VideoCamera } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
// import avatar from './assets/images/icons/avatar.svg'

function UpComingEvent() {
  return (
    <div className="flex flex-col justify-start rounded-[12px] bg-[#fff] px-[16px] pb-[6px] pt-[16px] drop-shadow-md">
      {/* <div className="font-500 text-[20px]">Upcoming event</div>  */}
      <div className="my-[10px] flex flex-row">
        <div className="inline-flex h-[24px] items-center justify-center rounded-[4px] bg-[#0858FA] p-[2px]">
          <VideoCamera size={20} color="#ffffff" weight="fill" />
        </div>
        <div className="mx-[8px] text-[16px] font-normal leading-[24px]">
          Meeting with <span className="text-[#DBAE0A]">Reader</span>
        </div>
        <div>
          <Image
            alt="avatar"
            src="/assets/images/icons/avatar.svg"
            width={32}
            height={32}
            loading="lazy"
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-[4px]">
          <CalendarDot size={13} color="#292D37" className="-mt-[4px]"/>
        </div>
        <div className="text-[14px] font-[400] leading-[16px]">
          Today <span>13:00 -&gt; 13:30</span>
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-[4px]">
          <MapPinArea size={13} color="#292D37"  className="-mt-[4px]"/>
        </div>
        <div className="text-[#4682FB]">
          <Link
            href="https://shorturl.at/miRK7"
            className="text-[14px] font-[500] leading-[16px]"
          >
            https://shorturl.at/miRK7
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UpComingEvent;
