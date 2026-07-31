import React, { memo, useState } from 'react';

import {
  ArrowLeft,
  FingerprintIcon,
  TimerIcon,
} from '@phosphor-icons/react';
import TimeslotWarning from './TimeslotWarning';
import Button from '@/components/core/button/Button';

import { useRouter } from '@/libs/i18nNavigation';
import { TimezoneSelect } from '@/components/TimezoneSelect';
import BookingTimetable from '@/layouts/booking/BookingTimetable';
// import { useTranslations } from 'next-intl';
// import { useAppDispatch } from '@/libs/hooks';
// import { openChat } from '@/libs/store/messenger';
import type { AuthorBasicInfoProps } from '@/components/author/private/types';

// import ScheduleBasicInfo from './SessionAttendeesInfo';
import MiniCalendar from '@/layouts/scheduling/MiniCalendar';
import AuthorQuickView from '@/components/author/AuthorQuickView';
// import { useAppSelector } from '@/libs/hooks';

type SelectTimeProps = {
  story: any;
  handleSelectTime: (date: Date) => void;
  currentTz: string;
  setCurrentTz: React.Dispatch<React.SetStateAction<string>>;
};

// TODO: Add translations for the texts.

const MemoizedAuthorQuickView = memo(AuthorQuickView);

function Subtitles() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <TimerIcon color="#0858FA" className="size-4 shrink-0 lg:size-5" />
        <h2 className="text-sm font-normal">
          Các cuộc hẹn có thời gian tối đa 30 phút
        </h2>
      </div>

      <div className="flex gap-2">
        <FingerprintIcon color="#0858FA" className="size-4 shrink-0 lg:size-5" />
        <h2 className="text-sm font-normal">
          Cuộc hẹn diễn ra trên website Hulib và chỉ được ghi âm khi có sự đồng ý từ cả hai bên
        </h2>
      </div>
    </div>
  );
}

const AuthorName = React.memo((props: AuthorBasicInfoProps) => {
  return (
    <>
      {' '}
      <div className="group relative inline-block">
        <span className="text-[#0442BF] max-lg:underline">{props.authorFullName}</span>
        <MemoizedAuthorQuickView
          avatarImageUrl={props.avatarImageUrl}
          authorFullName={props.authorFullName}
        />
      </div>
      {' '}
    </>
  );
});

export default function SelectTime(props: SelectTimeProps) {
  const router = useRouter();
  // const t = useTranslations('Schedule.MainScreen');
  // const dispatch = useAppDispatch();

  const [chosenDay, setChosenDay] = useState<Date>(new Date()); // store day clicked on calendar

  const authorFullName = props.story?.humanBook.fullName;
  const avatarImageUrl = props.story?.humanBook.photo?.path;

  /* const handleOpenHuberChat = () => {
    dispatch(
      openChat({
        id: props.story?.humanBookId,
        name: authorFullName,
        avatarUrl: avatarImageUrl,
        isOpen: true,
        isMinimized: false,
        unread: 0,
      }),
    );
  }; */

  return (
    <div className="flex flex-col gap-5">
      {/* <ScheduleBasicInfo huber={props.story?.humanBook} onOpenHuberConv={handleOpenHuberChat} /> */}

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
            Đặt hẹn trò chuyện với tác giả
            <AuthorName authorFullName={authorFullName} avatarImageUrl={avatarImageUrl} />
          </h1>
          <Subtitles />
        </div>

        {/* | Features' UIs section */}
        <div className="flex w-full flex-col lg:flex-row lg:justify-between">
          <h1 className="text-[18px] font-medium lg:text-xl">Chọn thời gian cho buổi trò chuyện diễn ra</h1>
          <TimezoneSelect value={props.currentTz} onChange={props.setCurrentTz} />
        </div>

        {/* <h5 className="text-2xl font-medium text-neutral-10">format(new Date(), 'MMMM - yyyy')</h5> */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[344px]">
            <div className="max-lg:px-10">
              <MiniCalendar
                onChange={setChosenDay}
                chosenDay={chosenDay}
                huberId={props.story?.humanBookId}
              />
            </div>
            <TimeslotWarning />
          </div>

          <BookingTimetable
            huberId={props.story?.humanBookId}
            tz={props.currentTz}
            onSelectTime={props.handleSelectTime}
            // onOpenHuberConv={handleOpenHuberChat}
            MiniCalendarChosenDay={chosenDay}
            setMiniCalendarChosenDay={setChosenDay}
          />
        </div>
      </div>
    </div>
  );
}
