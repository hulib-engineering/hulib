'use client';

import { ArrowLeft, ArrowRight, CalendarDots, Note, Timer, Warning } from '@phosphor-icons/react';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import Success from './_components/SuccessScreen';
import SelectTime from './_components/SelectTimeScreen';

import Button from '@/components/core/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/core/private/utils';
import TextArea from '@/components/core/textArea/TextArea';
import Loading from '@/app/[locale]/loading';
import { SessionAttendees } from '@/layouts/scheduling/SessionAttendees';
import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { useAppSelector } from '@/libs/hooks';
import { useCreateNewReadingSessionMutation } from '@/libs/services/modules/reading-session';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';
import { CURRENT_TZ, formatTimezone } from '@/utils/dateUtils';

export default function Index() {
  // TODO: handle the case the user enter URL that doesn't conform to the format of /sID_bID/ (could cause infinite loop)
  const { id } = useParams<{ id: string }>();
  const [storyId, humanBookId] = id.split('_').map(Number);

  const locale = useLocale();
  const t = useTranslations('Schedule.MainScreen');

  const { data: humanBook } = useGetUsersByIdQuery(humanBookId);

  const [placeRequest] = useCreateNewReadingSessionMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

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
        humanBookId: Number(humanBookId),
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
    } catch {
      pushError('Failed to book meeting');
    }
  };

  if (!humanBook) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 lg:px-28">
      {currentStep === 'select-time' && (
        <SelectTime
          humanBook={humanBook}
          handleSelectTime={handleSelectTime}
          currentTz={currentTz}
          setCurrentTz={setCurrentTz}
        />
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
                      huber={humanBook}
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
                        variant="fill"
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
                  <Success />
                )}
          </div>
        </div>
      )}
    </div>
  );
}
