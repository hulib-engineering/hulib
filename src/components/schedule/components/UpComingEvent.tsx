'use client';

import { CalendarDot, MapPinArea, VideoCamera } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { isNaN } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';

// import avatar from './assets/images/icons/avatar.svg'

const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '00:00';
    }
    return format(date, 'h:mm');
  } catch (error) {
    return 'Invalid date';
  }
};

interface UpComingEventProps {
  isHuber: boolean;
}
const UpComingEvent: React.FC<UpComingEventProps> = ({ isHuber }) => {
  const t = useTranslations('Schedule');
  const { data: readingSessions, isLoading: isLoadingReadingSessions } =
    useGetReadingSessionsQuery({ upcoming: true });
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (readingSessions && !isLoadingReadingSessions) {
      setData(readingSessions[0]);
    }
  }, [readingSessions, isLoadingReadingSessions]);

  return (
    <div>
      {data && (
        <div className="flex flex-col justify-start rounded-[12px] bg-[#fff] px-[16px] pb-[6px] pt-[16px] drop-shadow-md">
          {/* <div className="font-500 text-[20px]">Upcoming event</div>  */}
          <div className="my-[10px] flex flex-row">
            <div className="inline-flex h-[24px] items-center justify-center rounded-[4px] bg-[#0858FA] p-[2px]">
              <VideoCamera size={20} color="#ffffff" weight="fill" />
            </div>
            <div
              className={`mx-[8px] text-[16px] font-normal leading-[24px] ${
                isHuber ? '' : 'text-primary-50'
              }`}
            >
              {t('upcoming.meeting_with')}{' '}
              <span className={isHuber ? 'text-[#DBAE0A]' : 'text-primary-50'}>
                {isHuber ? 'Reader' : 'Huber'}
              </span>
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
              <CalendarDot size={13} color="#292D37" />
            </div>
            <div className="text-[14px] font-[400] leading-[16px]">
              Today{' '}
              <span>{`${formatTime(data.startedAt)} -> ${formatTime(
                data.endedAt,
              )}`}</span>
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
                    : 'https://shorturl.at/miRK7'
                }`}
                className="block truncate text-[14px] font-[500] leading-[16px] hover:underline"
                title={data.sessionUrl}
              >
                {data.sessionUrl || 'https://shorturl.at/miRK7'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpComingEvent;
