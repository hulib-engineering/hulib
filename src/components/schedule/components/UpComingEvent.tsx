'use client';

import { CalendarDot, MapPinArea, VideoCamera } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
// import avatar from './assets/images/icons/avatar.svg'

function UpComingEvent() {
  const [data, setData] = useState<any>({});
  function formatTimeRange(time1: string, time2: string) {
    const formatTime = (isoString: string) => {
      console.log('isoString', isoString);
      if (!isoString) return 'Invalid'; // Kiểm tra giá trị null hoặc undefined
      const date = new Date(isoString);
      if (Number.isNaN(date.getTime())) return 'Invalid'; // Thay isNaN bằng Number.isNaN
      return date.toISOString().substring(11, 16);
    };

    return `${formatTime(time1)} -> ${formatTime(time2)}`;
  }

  const getData = async () => {
    try {
      const response = await fetch(
        'https://hulib-services.onrender.com/api/v1/reading-sessions',
      );
      const result = await response.json();
      console.log('result[0]', result[5]);
      setData(result[0]);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      {data && (
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
              <CalendarDot size={13} color="#292D37" className="-mt-[4px]" />
            </div>
            <div className="text-[14px] font-[400] leading-[16px]">
              Today <span>{formatTimeRange(data.startedAt, data.endedAt)}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-[4px]">
              <MapPinArea size={13} color="#292D37" className="-mt-[4px]" />
            </div>
            <div className="text-[#4682FB]">
              <Link
                href={`${
                  data.sessionUrl
                    ? data.sessionUrl
                    : 'https://shorturl.at/miRK7'
                }`}
                className="text-[14px] font-[500] leading-[16px]"
              >
                {data.sessionUrl}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpComingEvent;
