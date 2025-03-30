'use client';

import type { Dayjs } from 'dayjs';
import * as React from 'react';

import { MainScreen } from '@/components/time-slot/MainScreen';
import { PlaceRequestScreen } from '@/components/time-slot/PlaceRequestScreen';
import { ScheduleSuccess } from '@/components/time-slot/ScheduleSuccess';

export default function Index() {
  const [step, setStep] = React.useState<number>(0);

  const [selectedDay, setSelectedDay] = React.useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string>('');
  const [selectedNextTime, setSelectedNextTime] = React.useState<string>('');

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const backStep = () => {
    setStep((prev) => prev - 1);
  };

  const renderStep = React.useMemo(() => {
    switch (step) {
      case 0: {
        return (
          <MainScreen
            fullName="Tran Thanh Thao"
            title="Professor"
            topics="20"
            rating="4.5"
            duration="30"
            attendees={{
              liber: {
                icon: '/assets/images/Avatar.png',
                role: 'Liber',
                fullName: 'Ngo Thanh Nhan',
              },
              huber: {
                icon: '/assets/images/Avatar.png',
                role: 'Huber',
                fullName: 'Ngo Thanh Bao',
              },
            }}
            timeZone="ICT | GMT-7"
            setSelectedDay={setSelectedDay}
            setSelectedTime={setSelectedTime}
            setNextSelectedTime={setSelectedNextTime}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            nextStep={nextStep}
          />
        );
      }
      case 1: {
        return (
          <PlaceRequestScreen
            attendees={{
              liber: {
                icon: '/assets/images/Avatar.png',
                role: 'Liber',
                fullName: 'Ngo Thanh Nhan',
              },
              huber: {
                icon: '/assets/images/Avatar.png',
                role: 'Huber',
                fullName: 'Ngo Thanh Bao',
              },
            }}
            startTime={selectedTime}
            endTime={selectedNextTime}
            timeZone="ICT | GMT-7"
            duration="30"
            dateTime={selectedDay?.format('dddd, MMMM D') ?? ''}
            backStep={backStep}
            nextStep={nextStep}
          />
        );
      }
      default: {
        return <ScheduleSuccess />;
      }
    }
  }, [step]);
  return <div className="h-full w-full px-2 sm:px-[8%]">{renderStep}</div>;
}
