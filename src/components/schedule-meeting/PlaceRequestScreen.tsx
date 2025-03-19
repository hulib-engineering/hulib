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
import Image from 'next/image';
import * as React from 'react';

import Button from '@/components/button/Button';
import type { IAttendee } from '@/components/schedule-meeting/MainScreen';

type Props = {
  attendees: {
    liber: IAttendee;
    huber: IAttendee;
  };
  startTime: string;
  endTime: string;
  duration: string;
  timeZone: string;
  nextStep: () => void;
  backStep: () => void;
};
export const PlaceRequestScreen = ({
  attendees,
  startTime,
  endTime,
  timeZone,
  duration,
  nextStep,
  backStep,
}: Props) => {
  const { liber, huber } = attendees;
  const { icon: liberIcon, role: roleLiber, fullName: liberName } = liber;
  const { icon: huberIcon, role: roleHuber, fullName: huberName } = huber;

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

  return (
    <div className="flex w-full flex-col items-center justify-between rounded-3xl bg-white p-8">
      <div className="flex w-[480px] flex-col gap-y-4">
        <button
          type="button"
          className="flex items-center gap-x-2 text-[#000000]"
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
          {renderAttendeesInfo(liberIcon, roleLiber, liberName)}
          {renderAttendeesInfo(huberIcon, roleHuber, huberName)}
        </div>

        <div className="flex flex-col gap-y-1.5">
          <div className="flex items-center gap-x-2 text-sm font-medium text-neutral-10">
            <CalendarDots size={16} />
            Time
          </div>
          <div className="grid grid-cols-3 items-center justify-items-center gap-x-2 text-base font-normal text-primary-50">
            <span className="w-full text-left">{startTime}</span>
            <ArrowRight size={16} />
            <span className="w-full text-right">{endTime}</span>
          </div>
          <div className="grid grid-cols-2 items-center justify-between gap-x-2 text-base font-normal text-primary-50">
            <span>Tuesday, February 18</span>
            <span className="text-right">{timeZone}</span>
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
          <span className="text-base font-normal text-neutral-20">
            Embark on a journey through the vivid tapestry of my life story,
            where each chapter unfolds with a unique blend of triumphs
          </span>
        </div>
        <div className="grid grid-cols-2 items-center  justify-items-center gap-x-4">
          <Button variant="outline" className="w-full" onClick={backStep}>
            Back
          </Button>
          <Button variant="primary" className="w-full" onClick={nextStep}>
            Place request
          </Button>
        </div>
      </div>
    </div>
  );
};
