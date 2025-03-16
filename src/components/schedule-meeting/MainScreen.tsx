'use client';

import {
  ArrowLeft,
  Globe,
  Heart,
  Info,
  Note,
  Timer,
  Users,
} from '@phosphor-icons/react';
import Image from 'next/image';
import * as React from 'react';

import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';

export interface IAttendee {
  icon: string;
  role: string;
  fullName: string;
}

type Props = {
  fullName: string;
  title: string;
  topics: string | number;
  rating: string | number;
  attendees: {
    liber: IAttendee;
    huber: IAttendee;
  };
  duration: string;
  timeZone: string;
  initialSelectedTime: string[];
  onChange: (value: string[]) => void;
  nextStep: () => void;
};
export const MainScreen = (props: Props) => {
  const {
    fullName = 'Tran Thanh Thao',
    title = 'Professor',
    topics = '20',
    rating = '4.5',
    attendees,
    duration = '30',
    timeZone,
    initialSelectedTime,
    onChange,
    nextStep,
  } = props;
  const { liber, huber } = attendees;
  const { icon: liberIcon, role: roleLiber, fullName: liberName } = liber;
  const { icon: huberIcon, role: roleHuber, fullName: huberName } = huber;

  const [selectedTime, setSelectedTime] =
    React.useState<string[]>(initialSelectedTime);

  const items = [];
  for (let hour = 8; hour < 22; hour += 1) {
    items.push([hour, 0]);
    items.push([hour, 30]);
  }

  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const convertToAmPm = (time24hr: string): string => {
    const [hour24, minute] = time24hr.split(':').map(Number);
    const safeHour24 = hour24 ?? 0;
    const period = safeHour24 >= 12 ? 'PM' : 'AM';
    const hour12 = safeHour24 % 12 === 0 ? 12 : safeHour24 % 12;

    return `${hour12}:${minute?.toString().padStart(2, '0')} ${period}`;
  };

  const range = items.map((time) => {
    const [hour, minute] = time;
    date.setHours(hour ?? 6);
    date.setMinutes(minute ?? 0);

    const time24 = formatter.format(date); // this currently outputs "14:00", "14:30", etc.
    return convertToAmPm(time24); // convert to "2:00 PM", "2:30 PM", etc.
  });

  const onClickTime = (time: string) => {
    if (selectedTime?.includes(time)) {
      const newSelectedTime = selectedTime.filter((item) => item !== time);
      setSelectedTime(newSelectedTime);
      onChange(newSelectedTime);
      return;
    }
    const newVal: string[] = [...selectedTime, time];
    setSelectedTime(newVal);
    onChange(newVal);
  };

  const renderRoleTag = (role: string) => {
    switch (role.trim().toLowerCase()) {
      case 'liber': {
        return (
          <span className="rounded-md bg-[#FFE3CC] px-2 py-0.5 text-sm font-medium text-[#FF7301]">
            {role}
          </span>
        );
      }
      case 'huber': {
        return (
          <span className="rounded-md bg-primary-90 px-2 py-0.5 text-sm font-medium text-primary-50">
            {role}
          </span>
        );
      }
      default:
        return null;
    }
  };

  const renderAttendeesInfo = (source: string, role: string, name: string) => {
    return (
      <div className="flex items-center gap-x-2">
        <Image src={source} alt="avatar author" width={32} height={32} />
        {renderRoleTag(role)}
        <span className="text-sm font-medium text-neutral-10">{name}</span>
      </div>
    );
  };

  const timeItem = (value: string) => {
    return (
      <button
        type="button"
        className={mergeClassnames(
          'rounded-full  px-3 py-1 text-sm font-medium border hover:opacity-70',
          selectedTime?.includes(value)
            ? 'bg-primary-50 border-primary-50 text-white'
            : 'bg-white border-neutral-90 text-neutral-10',
        )}
        onClick={() => onClickTime(value)}
      >
        {value}
      </button>
    );
  };

  const timeBlock = (list: string[]) => {
    if (list.length === 0) {
      return null;
    }
    return (
      <div className="grid w-full grid-cols-5 items-center gap-2 p-3 md:grid-cols-6">
        {list.map((item) => (
          <>{timeItem(item)}</>
        ))}
      </div>
    );
  };
  return (
    <div className="flex h-full w-full gap-x-6 bg-neutral-98">
      <div className="flex w-1/3 flex-col gap-y-4 rounded-3xl bg-white p-8">
        <button
          type="button"
          className="flex items-center gap-x-2 text-[#000000]"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="flex items-center gap-x-2 rounded-3xl bg-neutral-98 p-4">
          <Image
            src="/assets/images/Avatar.png"
            alt="avatar author"
            width={76}
            height={76}
          />
          <div className="flex flex-col gap-y-2">
            <h4 className="text-[28px] font-medium text-primary-10">
              {fullName}
            </h4>
            <p className="text-sm font-normal text-neutral-30">{title}</p>
            <div className="flex items-center gap-x-2">
              <span className="text-xs font-medium text-neutral-20">
                {topics}
              </span>
              <span className="text-[10px] font-medium text-neutral-40">
                Topics
              </span>
              <Heart size={16} color="#F3C00C" weight="fill" />
              <span className="text-xs font-medium text-neutral-20">
                {rating}
              </span>
              <span className="text-[10px] font-medium text-neutral-40">
                Rating
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-1.5 bg-white">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <Users size={16} />
            Attendees
          </div>
          {renderAttendeesInfo(liberIcon, roleLiber, liberName)}
          {renderAttendeesInfo(huberIcon, roleHuber, huberName)}
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
              <Timer size={16} />
              Duration
            </div>
            <span className="text-sm font-medium text-neutral-40">
              {duration}mins
            </span>
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
              className="h-[120px] w-full resize-none rounded-3xl border border-neutral-90 bg-neutral-98 p-3"
              placeholder="Enter meeting notes..."
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
              <Info size={16} />
              Notice
            </div>
            <p className="text-sm font-normal text-neutral-40">
              Make sure you have selected the correct day, time and time zone.
            </p>
            <p className="text-sm font-normal text-neutral-40">
              In case you do not find an open time slot. Feel free to check with
              the Huber over chat&nbsp;
              <span className="cursor-pointer text-[#009BEE] underline">
                click here
              </span>
            </p>
            <p className="text-sm font-normal text-neutral-40">
              If you need support then&nbsp;
              <span className="cursor-pointer text-[#009BEE] underline">
                click here
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-2/3 flex-col gap-y-4 rounded-3xl bg-white p-8">
        <h4 className="text-[28px] font-medium">Schedule your meeting</h4>
        <p className="text-[18px] font-normal text-neutral-20">
          Choose your meeting time
        </p>
        <p className="text-base font-normal text-neutral-40">
          Huber’s time zone
        </p>
        <div className="flex items-center gap-x-2 text-sm font-medium text-[#009BEE]">
          <Globe size={16} color="#009BEE" weight="fill" />
          {timeZone}
        </div>
        <div className="flex flex-col gap-y-2 rounded-3xl bg-white p-4 shadow-lg">
          <p className="text-sm font-medium text-neutral-10">
            Tuesday, February 18
          </p>
          <div className="flex flex-col gap-y-2">
            <div className="grid grid-cols-[100px_auto] items-center gap-x-4 gap-y-2">
              <span className="text-base font-normal text-neutral-40">
                Morning
              </span>
              {timeBlock(range.slice(1, 8))}
            </div>
            <div className="grid grid-cols-[100px_auto] items-center gap-x-4 gap-y-2">
              <span className="text-base font-normal text-neutral-40">
                Afternoon
              </span>
              {timeBlock(range.slice(10, 18))}
            </div>
            <div className="grid grid-cols-[100px_auto] items-center gap-x-4 gap-y-2">
              <span className="text-base font-normal text-neutral-40">
                Night
              </span>
              {timeBlock(range.slice(19))}
            </div>
          </div>
        </div>
        <p className="text-xs font-normal text-neutral-60">
          Please choose a time
        </p>
        <Button
          variant="primary"
          className="w-[300px] text-base font-medium text-white"
          onClick={nextStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
