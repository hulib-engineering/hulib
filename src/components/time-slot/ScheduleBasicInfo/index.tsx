import {
  ArrowLeft,
  Heart,
  Info,
  Note,
  Timer,
  Users,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';

const ScheduleBasicInfo = () => {
  const { data: currentUser } = useGetPersonalInfoQuery();
  const [message, setMessage] = useState<string>('');
  const huberInfo = {
    fullName: 'Tran Thanh Thao',
    role: 'Huber',
    avatar: '/assets/images/Avatar.png',
    title: 'Professor',
    rating: '4.5',
    topics: '20',
  };

  const renderAttendeesInfo = (source: string, role: string, name: string) => {
    if (!role) return null;

    return (
      <div className="flex items-center gap-x-2">
        <Image
          src={source || '/assets/images/Avatar.png'}
          alt="avatar author"
          width={32}
          height={32}
        />
        <span
          className={clsx(
            'rounded-md px-2 py-0.5 text-sm font-medium',
            role === 'Reader'
              ? 'bg-[#FFE3CC] text-[#FF7301]'
              : 'bg-primary-90 text-primary-50',
          )}
        >
          {role}
        </span>
        <span className="text-sm font-medium text-neutral-10">
          {name || ''}
        </span>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col gap-y-4 rounded-3xl bg-white p-4 xl:w-1/3 xl:p-8">
      <button
        type="button"
        className="flex items-center gap-x-2 text-[#000000]"
        // onClick={handleBackToHome}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="flex items-center gap-x-2 rounded-3xl bg-neutral-98 p-4">
        <Image
          src="/assets/images/Avatar.png"
          alt="avatar author"
          width={76}
          height={76}
        />
        <div className="flex flex-col gap-y-2">
          <h4 className="text-[28px] font-medium text-primary-10">
            {huberInfo?.fullName || ''}
          </h4>
          <p className="text-sm font-normal text-neutral-30">
            {huberInfo?.title || ''}
          </p>
          <div className="flex items-center gap-x-2">
            <span className="text-xs font-medium text-neutral-20">
              {huberInfo?.topics || ''}
            </span>
            <span className="text-[10px] font-medium text-neutral-40">
              Topics
            </span>
            <Heart size={16} color="#F3C00C" weight="fill" />
            <span className="text-xs font-medium text-neutral-20">
              {huberInfo?.rating || ''}
            </span>
            <span className="text-[10px] font-medium text-neutral-40">
              Rating
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-1.5 bg-white">
        <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
          <Users size={16} />
          Attendees
        </div>
        {renderAttendeesInfo(
          currentUser?.avatar,
          currentUser?.role?.name,
          currentUser?.fullName,
        )}
        {renderAttendeesInfo(
          '/assets/images/Avatar.png',
          'Huber',
          'Tran Thanh Thao',
        )}
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <Timer size={16} />
            Duration
          </div>
          <span className="text-sm font-medium text-neutral-40">30 mins</span>
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <Note size={16} />
            Message
          </div>
          <span className="text-base font-normal text-neutral-40">
            Please share anything that will help prepare for the meeting.
          </span>
          <textarea
            aria-multiline
            className="h-[120px] w-full resize-none rounded-3xl border border-neutral-90 bg-neutral-98 p-3"
            placeholder="Enter meeting notes..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <Info size={16} />
            Notice
          </div>
          <p className="text-sm font-normal text-neutral-40">
            Make sure you have selected the correct day, time and time zone.
          </p>
          <p className="text-sm font-normal text-neutral-40">
            In case you do not find an open time slot. Feel free to check with
            the Huber over chat&nbsp;
            <span className="cursor-pointer text-[#009BEE] underline">
              click here
            </span>
          </p>
          <p className="text-sm font-normal text-neutral-40">
            If you need support then&nbsp;
            <span className="cursor-pointer text-[#009BEE] underline">
              click here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBasicInfo;
