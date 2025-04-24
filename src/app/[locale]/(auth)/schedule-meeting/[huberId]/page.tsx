'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { SuccessScreen } from '@/components/common/SuccessScreen';
import { MainScreen } from '@/components/time-slot/MainScreen';
import { PlaceRequestScreen } from '@/components/time-slot/PlaceRequestScreen';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';

export default function Index() {
  const { huberId } = useParams();
  const { data: currentUser } = useGetPersonalInfoQuery();
  const { data: huberInfo } = useGetUsersByIdQuery(huberId as string);

  const searchParams = useSearchParams();
  const storyId = searchParams.get('storyId');

  const [currentStep, setCurrentStep] = useState<
    'select-time' | 'confirm' | 'success'
  >('select-time');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');

  const onSelectDay = (day: Date) => {
    setSelectedDay(day);
    setSelectedTime('');
  };

  if (!currentStep) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-28 py-8">
      {currentStep === 'select-time' && (
        <MainScreen
          attendees={{
            liber: currentUser,
            huber: {
              fullName: huberInfo?.fullName,
              role: huberInfo?.role?.name,
              avatar: huberInfo?.photo?.path,
              title: huberInfo?.education,
              rating: huberInfo?.rating,
              topics: huberInfo?.topics?.length || 0,
            },
          }}
          selectDate={selectedDay}
          selectTime={selectedTime}
          huberId={Number(huberId)}
          onSelectDay={onSelectDay}
          onSelectTime={setSelectedTime}
          nextStep={() => setCurrentStep('confirm')}
        />
      )}
      {currentStep === 'confirm' && (
        <PlaceRequestScreen
          attendees={{
            liber: currentUser,
            huber: {
              fullName: huberInfo?.fullName,
              role: huberInfo?.role?.name,
              avatar: huberInfo?.photo?.path,
              title: huberInfo?.education,
              rating: huberInfo?.rating,
              topics: huberInfo?.topics?.length || 0,
            },
          }}
          startTime={selectedTime}
          dateTime={
            selectedDay?.toLocaleDateString('en-GB', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
            }) ?? ''
          }
          humanBookId={Number(huberId)}
          storyId={Number(storyId)}
          backStep={() => setCurrentStep('select-time')}
          nextStep={() => setCurrentStep('success')}
        />
      )}
      {currentStep === 'success' && (
        <SuccessScreen
          notification="You have successfully sent a meeting request to Huber"
          nameButton="Your schedule"
          linkButton="/schedule-meeting/weekly-schedule"
        />
      )}
    </div>
  );
}
