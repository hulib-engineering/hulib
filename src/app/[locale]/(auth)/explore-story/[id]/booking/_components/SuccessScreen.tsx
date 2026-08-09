'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CalendarDotsIcon } from '@phosphor-icons/react';
import { Time } from './ScheduleInfoItems';
import { useRouter } from '@/libs/i18nNavigation';
import Button from '@/components/core/button/Button';
import { SessionAttendees } from '@/layouts/scheduling/SessionAttendees';
import type { ISessionAttendeesProps } from '@/layouts/scheduling/SessionAttendees';

function SuccessIcon() {
  // Fog and two icons
  return (
    <div className="relative max-h-[63px] max-w-[90px] pb-2">
      <div className="absolute left-1/2 h-[48px] w-[90px] rounded-full
      bg-[#92D9FF] blur-[11.4px] -translate-x-1/2"
      />
      <Image
        src="/assets/images/misc/schedule-success-icon1.svg"
        alt="Success Icon1"
        width={64}
        height={46}
        className="relative"
      />
      <Image
        src="/assets/images/misc/schedule-success-icon2.svg"
        alt="Success Icon2"
        width={38}
        height={38}
        className="absolute left-1/2 top-1/2"
      />
    </div>
  );
}

function SuccessMessage() {
  const t = useTranslations('Schedule.MainScreen');
  return (
    <div className="flex flex-col items-center gap-2">
      <SuccessIcon />

      <span className="text-center text-[32px] font-medium leading-[40px] text-[#0442BF]">
        {t('success_title')}
      </span>

      <p className="text-center text-[16px]">
        {t('success_detail')}
      </p>
    </div>
  );
}

function ScheduleInfo(
  { displayedTime, ...props }: { displayedTime: Date } & ISessionAttendeesProps,
) {
  return (
    <div
      className="flex w-full flex-col gap-5 rounded-2xl
      border border-[#0858FA] p-4"
    >
      <Time displayedTime={displayedTime} />
      <SessionAttendees {...props} />
    </div>
  );
}

function Buttons() {
  const router = useRouter();
  const t = useTranslations('Schedule.MainScreen');
  return (
    <div className="grid w-full grid-cols-2 items-center justify-center gap-x-2 md:gap-x-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push('/')}
      >
        {t('back_to_home')}
      </Button>
      <Button
        className="w-full"
        onClick={() => router.push('/my-schedule')}
      >
        <CalendarDotsIcon size={20} className="mb-2" />
        {t('back_to_schedule')}
      </Button>
    </div>
  );
}

export default function Index(
  props: ISessionAttendeesProps & { displayedTime: Date },
) {
  return (
    <>
      <SuccessMessage />
      <ScheduleInfo {...props} />
      <Buttons />
    </>
  );
}
