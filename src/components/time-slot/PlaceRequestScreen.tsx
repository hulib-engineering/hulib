'use client';

import {
  ArrowLeft,
  ArrowRight,
  CalendarDots,
  Note,
  Timer,
  Users,
  Warning,
} from '@phosphor-icons/react';
import { isEmpty } from 'lodash';
import * as React from 'react';

import Button from '@/components/button/Button';
import AttendeesInfo from '@/components/time-slot/AttendeesInfo';
import { useAppSelector } from '@/libs/hooks';
import { useCreateNewReadingSessionMutation } from '@/libs/services/modules/reading-session';

import { pushError } from '../CustomToastifyContainer';

type Props = {
  attendees: {
    liber: any;
    huber: any;
  };
  startTime: string;
  dateTime: string;
  humanBookId: number;
  storyId: number;
  nextStep: () => void;
  backStep: () => void;
};

export const PlaceRequestScreen = ({
  attendees: { liber, huber },
  startTime,
  dateTime,
  humanBookId,
  storyId,
  nextStep,
  backStep,
}: Props) => {
  const user = useAppSelector((state) => state.auth.userInfo);

  const [placeRequest] = useCreateNewReadingSessionMutation();
  const [note, setNote] = React.useState('');

  function convertTo24HourFormat(time: string): string {
    // Parse the input time (e.g., "03:45 PM" or "11:30 AM")
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr?.split(':') || ['00', '00'];

    let hour = parseInt(hours || '00', 10);

    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    // Format with leading zeros
    const formattedHour = hour.toString().padStart(2, '0');

    return `${formattedHour}:${minutes}`;
  }

  function add30Minutes(time: string): string {
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr?.split(':') || ['00', '00'];

    let hour = parseInt(hours || '00', 10);
    let minute = parseInt(minutes || '00', 10);

    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    // Add 30 minutes
    minute += 30;
    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }
    if (hour >= 24) {
      hour -= 24;
    }

    // Format with leading zeros
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute}`;
  }

  const convertToAmPm = (time24hr: string): string => {
    const [hour24, minute] = time24hr.split(':').map(Number);
    const safeHour24 = hour24 ?? 0;
    const period = safeHour24 >= 12 ? 'PM' : 'AM';
    const hour12 = safeHour24 % 12 === 0 ? 12 : safeHour24 % 12;

    return `${hour12}:${minute?.toString().padStart(2, '0')} ${period}`;
  };

  const endTime = add30Minutes(startTime);
  const onPlaceRequest = async () => {
    const today = new Date().toISOString();
    try {
      const result = await placeRequest({
        humanBookId,
        readerId: user?.id ?? 0,
        storyId,
        startTime: convertTo24HourFormat(startTime),
        endTime,
        startedAt: today,
        endedAt: today,
        note,
      });

      if (!isEmpty(result?.error)) {
        pushError('Something went wrong');
      } else {
        nextStep();
      }
    } catch (error) {
      pushError('Something went wrong');
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-between rounded-3xl bg-white p-4 md:p-8">
      <div className="flex w-full flex-col gap-y-4 md:w-[480px]">
        <button
          type="button"
          className="flex items-center gap-x-2 text-[#000000]"
          onClick={backStep}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h4 className="text-[28px] font-medium">30 Minutes meeting</h4>
        <div className="flex flex-col gap-y-1.5">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <Users size={16} />
            Attendees
          </div>
          <AttendeesInfo
            source={liber?.avatar}
            role={liber?.role?.name}
            name={liber?.fullName}
          />
          <AttendeesInfo
            source={huber?.avatar}
            role={huber?.role}
            name={huber?.fullName}
          />
        </div>

        <div className="flex flex-col gap-y-1.5">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <CalendarDots size={16} />
            Time
          </div>
          <div className="grid grid-cols-3 items-center justify-items-center gap-x-2 text-base font-normal text-primary-50">
            <span className="w-full text-left">{startTime}</span>
            <div className="flex w-full justify-end">
              <ArrowRight size={16} />
            </div>
            <span className="w-full text-right">{convertToAmPm(endTime)}</span>
          </div>
          <div className="grid grid-cols-2 items-center justify-between gap-x-2 text-base font-normal text-primary-50">
            <span>{dateTime}</span>
            <span className="text-right">ICT | GMT-7</span>
          </div>
        </div>
        <div className="flex flex-col gap-y-1.5 border-l border-[#BE002D] bg-[#FFF5F7] px-4 py-2 text-sm text-[#BE002D]">
          <div className="flex items-center gap-x-2 font-medium">
            <Warning size={16} color="#BE002D" />
            Warning
          </div>
          <span>
            Make sure you have selected the correct day, time and time zone.
          </span>
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <Timer size={16} />
            Duration{' '}
            <span className="text-sm font-medium text-neutral-40">30 mins</span>
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <Note size={16} />
            Message
          </div>
          <span className="text-base font-normal text-neutral-40">
            Please share anything that will help prepare for the meeting.
          </span>
          <textarea
            aria-multiline
            required
            className="h-[120px] w-full resize-none rounded-3xl border border-neutral-90 bg-neutral-98 p-3"
            placeholder="Enter meeting notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 items-center  justify-items-center gap-x-4">
          <Button variant="outline" className="w-full" onClick={backStep}>
            Back
          </Button>
          <Button
            variant="primary"
            className="w-full"
            disabled={isEmpty(note)}
            onClick={onPlaceRequest}
          >
            Place request
          </Button>
        </div>
      </div>
    </div>
  );
};
