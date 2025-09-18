'use client';

import { ArrowLeft, ArrowRight, CalendarDots, Note, Timer, Warning } from '@phosphor-icons/react';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as React from 'react';

import Button from '@/components/button/Button';
import { Spinner } from '@/components/common/Spinner';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/private/utils';
import TextArea from '@/components/textArea/TextArea';
import { TimezoneSelect } from '@/components/TimezoneSelect';

import ScheduleBasicInfo from '@/layouts/ScheduleBasicInfo';
import BookingTimetable from '@/layouts/booking/BookingTimetable';
import { SessionAttendees } from '@/layouts/scheduling/SessionAttendees';
import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useCreateNewReadingSessionMutation } from '@/libs/services/modules/reading-session';
import { useGetStoryDetailQuery } from '@/libs/services/modules/stories';
import { openChat } from '@/libs/store/messenger';
import { CURRENT_TZ, formatTimezone } from '@/utils/dateUtils';

export default function Index() {
  const router = useRouter();

  const { id: storyId } = useParams();

  const locale = useLocale();
  const t = useTranslations('Schedule.MainScreen');

  const { data: story } = useGetStoryDetailQuery(Number(storyId));
  const [placeRequest] = useCreateNewReadingSessionMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const dispatch = useAppDispatch();

  const [currentStep, setCurrentStep] = useState<
    'select-time' | 'confirm' | 'success'
  >('select-time');
  const [selectedTime, setSelectedTime] = useState(fromZonedTime(new Date(), CURRENT_TZ));
  const [displayedTime, setDisplayedTime] = useState(new Date());
  const [note, setNote] = useState('');
  const [currentTz, setCurrentTz] = useState(CURRENT_TZ);

  const handleSelectTime = (date: Date) => {
    setSelectedTime(date);
    setDisplayedTime(toZonedTime(date, CURRENT_TZ));
    setCurrentStep('confirm');
  };
  const handlePlaceRequest = async () => {
    try {
      const endedAt = fromZonedTime(new Date(selectedTime.getTime() + 30 * 60 * 1000), CURRENT_TZ);
      const endTime = format(displayedTime.getTime() + 30 * 60 * 1000, 'HH:mm');
      await placeRequest({
        humanBookId: Number(story?.humanBookId),
        readerId: userInfo?.id,
        storyId: Number(storyId),
        startTime: format(displayedTime, 'HH:mm'),
        endTime,
        startedAt: selectedTime,
        endedAt,
        note,
      }).unwrap();
      pushSuccess('Request sent successfully');
      setCurrentStep('success');
    } catch (error: any) {
      pushError('Failed to book meeting');
    }
  };

  const handleOpenHuberChat = () => {
    dispatch(
      openChat({
        id: story?.humanBookId,
        name: story?.humanBook.fullName,
        avatarUrl: story?.humanBook.photo?.path,
        isOpen: true,
        isMinimized: false,
        unread: 0,
      }),
    );
  };

  if (!story) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="py-8 sm:px-28">
      {currentStep === 'select-time' && (
        <div className="flex size-full gap-6">
          <ScheduleBasicInfo huber={story?.humanBook} onOpenHuberConv={handleOpenHuberChat} />
          <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white p-4 xl:w-2/3 xl:p-8">
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<ArrowLeft size={20} weight="bold" />}
              className="w-fit text-black xl:hidden"
              onClick={() => router.back()}
            >
              {t('back')}
            </Button>
            <div>
              <h4 className="text-[28px] font-medium">{t('title')}</h4>
              <p className="text-[18px] font-normal text-neutral-20">
                {t('subtitle')}
              </p>
            </div>
            <div className="flex w-full flex-col">
              <p className="text-base font-normal text-neutral-40">
                {t('huber_timezone')}
              </p>
              <TimezoneSelect value={currentTz} onChange={setCurrentTz} />
            </div>
            <BookingTimetable
              huberId={story?.humanBookId}
              tz={currentTz}
              onSelectTime={handleSelectTime}
              onOpenHuberConv={handleOpenHuberChat}
            />
          </div>
        </div>
      )}
      {currentStep !== 'select-time' && (
        <div className="flex w-full items-center justify-center rounded-none bg-white p-4 xl:rounded-3xl xl:p-8">
          <div
            className={mergeClassnames('flex w-full flex-col gap-2 xl:max-w-[480px] xl:gap-4', currentStep === 'success' && 'items-center')}
          >
            {currentStep === 'confirm'
              ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconLeft={<ArrowLeft size={20} weight="bold" />}
                      className="w-fit text-black xl:hidden"
                      onClick={() => setCurrentStep('select-time')}
                    >
                      {t('back')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      iconLeft={<ArrowLeft size={20} weight="bold" />}
                      className="hidden w-fit text-black xl:flex"
                      onClick={() => setCurrentStep('select-time')}
                    >
                      {t('back')}
                    </Button>
                    <h4
                      className="text-2xl font-medium text-black xl:text-[28px] xl:leading-9"
                    >
                      {t('confirmation_title')}
                    </h4>
                    <SessionAttendees
                      huber={story?.humanBook}
                      liber={userInfo}
                      isVibing
                    />
                    <ScheduleInfoItemLayout icon={<CalendarDots size={16} />} title={t('time')}>
                      <div className="grid grid-cols-3 place-items-center gap-2 text-primary-50">
                        <span className="w-full text-left">{format(displayedTime, 'HH:mm')}</span>
                        <ArrowRight size={16} weight="bold" color="#2E3032" />
                        <span className="w-full text-right">
                          {format(displayedTime.getTime() + 30 * 60 * 1000, 'HH:mm')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 items-center justify-between gap-2 text-primary-50">
                        <span>
                          {displayedTime?.toLocaleDateString(locale === 'en' ? 'en-GB' : 'vi-VI', {
                            weekday: 'short',
                            month: 'long',
                            day: '2-digit',
                          })}
                        </span>
                        <span className="text-right">{formatTimezone(CURRENT_TZ)}</span>
                      </div>
                    </ScheduleInfoItemLayout>

                    <div className="flex flex-col gap-1 border-l border-red-40 bg-red-98 px-4 py-2 text-sm text-red-40">
                      <div className="flex items-center gap-2 font-medium leading-4">
                        <Warning size={16} color="#BE002D" />
                        {t('warning')}
                      </div>
                      <p>{t('warning_detail')}</p>
                    </div>
                    <ScheduleInfoItemLayout icon={<Timer size={16} />} title={t('duration')}>
                      <p className="text-sm font-medium leading-4 text-neutral-40">{`30 ${t('mins')}`}</p>
                    </ScheduleInfoItemLayout>
                    <ScheduleInfoItemLayout icon={<Note size={16} />} title={t('message')}>
                      <p className="leading-6 text-neutral-40">{t('message_helper_txt')}</p>
                      <TextArea
                        aria-multiline
                        className="h-[240px] text-sm leading-4 placeholder:text-sm placeholder:leading-4 xl:h-[120px]"
                        placeholder={t('message_placeholder')}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                      />
                    </ScheduleInfoItemLayout>
                    <div className="grid grid-cols-2 place-items-center  gap-x-4">
                      <Button variant="outline" className="w-full" onClick={() => setCurrentStep('select-time')}>
                        {t('back')}
                      </Button>
                      <Button
                        variant="primary"
                        className="w-full"
                        disabled={isEmpty(note)}
                        onClick={handlePlaceRequest}
                      >
                        {t('submit')}
                      </Button>
                    </div>
                  </>
                )
              : (
                  <>
                    <Image
                      src="/assets/images/schedule-success.svg"
                      alt="Successful illustration"
                      width={480}
                      height={420}
                      className="w-[398px] object-cover xl:w-[480px]"
                    />
                    <h4 className="text-[28px] font-medium">{t('success_title')}</h4>
                    <p className="text-center text-sm text-neutral-30">{t('success_detail')}</p>
                    <div className="grid grid-cols-2 items-center justify-center gap-x-2 md:gap-x-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push('/my-schedule')}
                      >
                        {t('back_to_schedule')}
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => router.push('/home')}
                      >
                        {t('back_to_home')}
                      </Button>
                    </div>
                  </>
                )}
          </div>
        </div>
      )}
    </div>
  );
}
