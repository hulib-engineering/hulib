import { ArrowLeft, Heart, Info, Timer } from '@phosphor-icons/react';
import Image from 'next/image';

import { SessionAttendees } from '@/components/schedule/components/sessionCard/SessionAttendees';
import { useAppSelector } from '@/libs/hooks';

const ScheduleBasicInfo = ({ attendees: { liber, huber } }: any) => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);

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
            {huber?.fullName || ''}
          </h4>
          <p className="text-sm font-normal text-neutral-30">
            {huber?.title || ''}
          </p>
          <div className="flex items-center gap-x-2">
            <span className="text-xs font-medium text-neutral-20">
              {huber?.topics || ''}
            </span>
            <span className="text-[10px] font-medium text-neutral-40">
              Topics
            </span>
            <Heart size={16} color="#F3C00C" weight="fill" />
            <span className="text-xs font-medium text-neutral-20">
              {huber?.rating || ''}
            </span>
            <span className="text-[10px] font-medium text-neutral-40">
              Rating
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-1.5 bg-white">
        <SessionAttendees
          humanBook={huber}
          reader={liber}
          isVibing={Number(userInfo?.id) === Number(liber?.id)}
        />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <Timer size={16} />
            Duration{' '}
            <span className="text-sm font-medium text-neutral-40">30 mins</span>
          </div>
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
