import React, { memo, useState } from 'react';

import {
  ArrowLeft,
  FingerprintIcon,
  TimerIcon,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import TimeslotWarning from './TimeslotWarning';
import Button from '@/components/core/button/Button';

import { useRouter } from '@/libs/i18nNavigation';
import { TimezoneSelect } from '@/components/TimezoneSelect';
import BookingTimetable from '@/layouts/booking/BookingTimetable';
// import { useAppDispatch } from '@/libs/hooks';
// import { openChat } from '@/libs/store/messenger';
import type { User } from '@/features/users/types';

// import ScheduleBasicInfo from './SessionAttendeesInfo';
import MiniCalendar from '@/layouts/scheduling/MiniCalendar';
import AuthorQuickView from '@/components/author/AuthorQuickView';
// import { useAppSelector } from '@/libs/hooks';

type SelectTimeProps = {
  humanBook: User;
  handleSelectTime: (date: Date) => void;
  currentTz: string;
  setCurrentTz: React.Dispatch<React.SetStateAction<string>>;
};

const MemoizedAuthorQuickView = memo(AuthorQuickView);

function Subtitles() {
  const t = useTranslations('Schedule.MainScreen');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <TimerIcon color="#0858FA" className="size-4 shrink-0 lg:size-5" />
        <h2 className="text-sm font-normal">
          {t('subtitle1')}
        </h2>
      </div>

      <div className="flex gap-2">
        <FingerprintIcon color="#0858FA" className="size-4 shrink-0 lg:size-5" />
        <h2 className="text-sm font-normal">
          {t('subtitle2')}
        </h2>
      </div>
    </div>
  );
}

const AuthorName = ({ humanBook }: { humanBook: User }) => {
  return (
    <>
      {' '}
      <div className="group relative inline-block">
        <span className="text-[#0442BF] max-lg:underline">{humanBook.fullName}</span>
        <MemoizedAuthorQuickView humanBook={humanBook} />
      </div>
      {' '}
    </>
  );
};

export default function SelectTime({ humanBook, handleSelectTime, currentTz, setCurrentTz }: SelectTimeProps) {
  const router = useRouter();
  const t = useTranslations('Schedule.MainScreen');
  // const dispatch = useAppDispatch();

  const [chosenDay, setChosenDay] = useState<Date>(new Date()); // store day clicked on calendar

  /* const handleOpenHuberChat = () => {
    dispatch(
      openChat({
        id: humanBookId,
        name: humanBook.fullName,
        avatarUrl: humanBook.photo?.path,
        isOpen: true,
        isMinimized: false,
        unread: 0,

    );
  }; */

  return (
    <div className="flex flex-col gap-5">
      {/* <ScheduleBasicInfo huber={humanBook} onOpenHuberConv={handleOpenHuberChat} /> */}

      {/* | Back button */}
      <Button
        variant="ghost"
        iconLeft={<ArrowLeft size={20} weight="bold" />}
        className="size-fit rounded-full p-4 text-black"
        onClick={() => router.back()}
      >
      </Button>

      <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white">
        {/* | Texts section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-medium lg:text-3xl">
            {t('title')}
            <AuthorName humanBook={humanBook} />
          </h1>
          <Subtitles />
        </div>

        {/* | Features' UIs section */}
        <div className="flex w-full flex-col lg:flex-row lg:justify-between">
          <h1 className="text-[18px] font-medium lg:text-xl">{t('choose_time')}</h1>
          <TimezoneSelect value={currentTz} onChange={setCurrentTz} />
        </div>

        {/* <h5 className="text-2xl font-medium text-neutral-10">format(new Date(), 'MMMM - yyyy')</h5> */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[344px]">
            <div className="max-lg:px-10">
              <MiniCalendar
                onChange={setChosenDay}
                chosenDay={chosenDay}
                huberId={humanBook.id}
                type="booking"
              />
            </div>
            <TimeslotWarning />
          </div>

          <BookingTimetable
            huberId={humanBook.id}
            tz={currentTz}
            onSelectTime={handleSelectTime}
            // onOpenHuberConv={handleOpenHuberChat}
            MiniCalendarChosenDay={chosenDay}
            setMiniCalendarChosenDay={setChosenDay}
          />
        </div>
      </div>
    </div>
  );
}
