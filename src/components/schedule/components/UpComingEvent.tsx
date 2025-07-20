'use client';

import { CalendarDot, MapPinArea, VideoCamera } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import { ROLE_NAME, Role } from '@/types/common';

type UpComingEventProps = {
  isHuber: boolean;
};
const UpComingEvent: React.FC<UpComingEventProps> = ({ isHuber }) => {
  const t = useTranslations('Schedule');
  const { data: readingSessions, isLoading: isLoadingReadingSessions }
    = useGetReadingSessionsQuery({ upcoming: true });
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (readingSessions && !isLoadingReadingSessions) {
      setData(readingSessions[0]);
    }
  }, [readingSessions, isLoadingReadingSessions]);

  return (
    <div>
      {data && (
        <div className="flex flex-col justify-start gap-1 rounded-[12px] bg-white p-[12px] drop-shadow-md">
          <p className="text-lg font-medium leading-[28px]">
            {t('upcoming.upcoming_event')}
          </p>
          <div className="flex flex-row items-center">
            <div className="inline-flex h-[24px] items-center justify-center rounded-[4px] bg-[#0858FA] p-[2px]">
              <VideoCamera size={16} color="#ffffff" weight="fill" />
            </div>
            <div
              className={`mx-[8px] text-[16px] font-normal leading-[24px] ${
                isHuber ? '' : 'text-primary-50'
              }`}
            >
              {t('upcoming.meeting_with')}
              {' '}
              <span className={isHuber ? 'text-yellow-40' : 'text-primary-50'}>
                {isHuber ? ROLE_NAME[Role.LIBER] : ROLE_NAME[Role.HUBER]}
              </span>
            </div>
            <div>
              <Image
                alt="avatar"
                src="/assets/images/ava-placeholder.png"
                width={24}
                height={24}
                loading="lazy"
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-[4px]">
              <CalendarDot size={13} color="#292D37" />
            </div>
            <div className="text-[14px] font-[400] leading-[16px]">
              {dayjs(data.startedAt).format('ddd, DD/MM/YYYY')}
              {', '}
              <span>
                {dayjs(data.startedAt).format('hh:mm A')}
                {' - '}
                {dayjs(data.endedAt).format('hh:mm A')}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-[4px]">
              <MapPinArea size={13} color="#292D37" />
            </div>
            <div className="max-w-[300px] text-primary-60">
              <Link
                href={`${
                  data.sessionUrl
                    ? data.sessionUrl
                    : '-'
                }`}
                className="block truncate text-[14px] font-[500] leading-[16px] hover:underline"
                title={data.sessionUrl}
              >
                {data.sessionUrl || '-'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpComingEvent;
