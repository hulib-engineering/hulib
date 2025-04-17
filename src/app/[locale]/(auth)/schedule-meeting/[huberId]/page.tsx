'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { SuccessScreen } from '@/components/common/SuccessScreen';
import { MainScreen } from '@/components/time-slot/MainScreen';
import { PlaceRequestScreen } from '@/components/time-slot/PlaceRequestScreen';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';

export default function Index() {
  const { data: currentUser } = useGetPersonalInfoQuery();
  const { huberId } = useParams();

  const huberInfo = {
    fullName: 'Tran Thanh Thao',
    role: 'Huber',
    avatar: '/assets/images/Avatar.png',
    title: 'Professor',
    rating: '4.5',
    topics: '20',
  };
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
            huber: huberInfo,
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
            huber: huberInfo,
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
