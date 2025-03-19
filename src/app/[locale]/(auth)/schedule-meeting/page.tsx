'use client';

import * as React from 'react';

import type { SelectedTimeModel } from '@/components/availableSlot/AvailableSlot';
import {
  DAY_DISPLAY_NAMES,
  TabIndex,
} from '@/components/availableSlot/AvailableSlot';
import { MainScreen } from '@/components/schedule-meeting/MainScreen';
import { PlaceRequestScreen } from '@/components/schedule-meeting/PlaceRequestScreen';
import { ScheduleSuccess } from '@/components/schedule-meeting/ScheduleSuccess';

export default function Index() {
  const [step, setStep] = React.useState<number>(0);

  const selectedIndex = TabIndex.Monday;

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    SelectedTimeModel[]
  >([]);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [selectedTime, setSelectedTime] = React.useState<string[]>();

  const matchDateTimeData = React.useMemo(() => {
    return selectedDateTime.filter(
      (dateTime) => dateTime.day === DAY_DISPLAY_NAMES[selectedIndex],
    );
  }, [selectedDateTime, selectedIndex]);

  const updateSelectedTime = (time: string[]) => {
    setSelectedTime(time);
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const backStep = () => {
    setStep((prev) => prev - 1);
  };

  /* Update later */
  // const updateSelectedDateTime = () => {
  //   const index = findIndex(selectedDateTime, {
  //     day: DAY_DISPLAY_NAMES[selectedIndex],
  //   });
  //   if (index !== -1) {
  //     const newSelectedItems = [...selectedDateTime];
  //     newSelectedItems[index] = {
  //       day: DAY_DISPLAY_NAMES[selectedIndex] ?? '',
  //       time: selectedTime ?? [],
  //     };
  //     setSelectedDateTime(newSelectedItems);
  //     return;
  //   }
  //   const newSelectedItems = [
  //     ...selectedDateTime,
  //     {
  //       day: DAY_DISPLAY_NAMES[selectedIndex] ?? '',
  //       time: selectedTime ?? [],
  //     },
  //   ];
  //   setSelectedDateTime(newSelectedItems);
  // };

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
            initialSelectedTime={matchDateTimeData?.[0]?.time ?? []}
            onChange={updateSelectedTime}
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
            startTime="9:00 AM"
            endTime="10:00 AM"
            timeZone="ICT | GMT-7"
            duration="30"
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
