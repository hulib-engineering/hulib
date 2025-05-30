'use client';

import {
  ArrowLeft,
  ArrowRight,
  CalendarDots,
  Note,
  Timer,
  Warning,
} from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useMemo } from 'react';

import Button from '@/components/button/Button';
import { useAppSelector } from '@/libs/hooks';
import { useCreateNewReadingSessionMutation } from '@/libs/services/modules/reading-session';

import { pushError, pushSuccess } from '../CustomToastifyContainer';
import { SessionAttendees } from '../schedule/components/sessionCard/SessionAttendees';

type Props = {
  attendees: {
    liber: any;
    huber: any;
  };
  startTime: string;
  dateTime: string;
  storyId: number;
  nextStep: () => void;
  backStep: () => void;
};

export const PlaceRequestScreen = ({
  attendees: { liber, huber },
  startTime,
  dateTime,
  storyId,
  nextStep,
  backStep,
}: Props) => {
  const { huberId } = useParams();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [placeRequest] = useCreateNewReadingSessionMutation();
  const [note, setNote] = React.useState('');
  const [startedAt] = React.useState<any>(() => {
    const parsed = dayjs(`${dateTime} ${startTime}`, 'ddd, DD MMM HH:mm');
    const currentYear = dayjs().year();
    const parsedWithYear = parsed.year(currentYear);
    return parsedWithYear.toDate();
  });
  const [endedAt] = React.useState<any>(() => {
    const end = dayjs(startedAt).add(30, 'minute');
    return end.toDate();
  });

  const endTimeString = useMemo(() => {
    if (endedAt) {
      return dayjs(endedAt).format('HH:mm');
    }
    return '';
  }, [endedAt]);

  const onPlaceRequest = async () => {
    try {
      await placeRequest({
        humanBookId: Number(huberId),
        readerId: userInfo?.id,
        storyId,
        startTime,
        endTime: endTimeString,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        note,
      }).unwrap();

      pushSuccess('Request sent successfully');
      nextStep();
    } catch (error: any) {
      pushError('Failed to book meeting');
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
        <SessionAttendees
          humanBook={huber}
          reader={liber}
          isVibing={Number(userInfo?.id) === Number(liber?.id)}
        />

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
            <span className="w-full text-right">{endTimeString}</span>
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
