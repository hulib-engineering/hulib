'use client';

import { CaretDown, Clock, Note, User } from '@phosphor-icons/react';
import clsx from 'clsx';
import Image from 'next/image';

import Button from '@/components/button/Button';
import { useUpdateStatusReadingSessionMutation } from '@/libs/services/modules/reading-session';

function DetailEventLiber({ data }: any) {
  const [updateStatusReadingSession] = useUpdateStatusReadingSessionMutation();
  const { startedAt, endedAt, reader, humanBook, sessionStatus, note } = data;

  const { fullName: fullNameReader } = reader;
  const { fullName: fullNameHumanBook } = humanBook;
  function formatDateTimeRange(startIso: string, endIso: string) {
    const startDate = new Date(startIso);
    const endDate = new Date(endIso);

    // Lấy thứ trong tuần (viết tắt: Mon, Tue, ...)
    const dayOfWeek = startDate.toLocaleDateString('en-US', {
      weekday: 'short',
    });

    const day = String(startDate.getUTCDate()).padStart(2, '0');
    const month = String(startDate.getUTCMonth() + 1).padStart(2, '0');
    const year = startDate.getUTCFullYear();

    const startHours = String(startDate.getUTCHours()).padStart(2, '0');
    const startMinutes = String(startDate.getUTCMinutes()).padStart(2, '0');

    const endHours = String(endDate.getUTCHours()).padStart(2, '0');
    const endMinutes = String(endDate.getUTCMinutes()).padStart(2, '0');

    return `${dayOfWeek}, ${day}/${month}/${year} | ${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
  }

  const handleCancelSession = async () => {
    try {
      await updateStatusReadingSession({
        id: data?.id,
        sessionStatus: 'canceled',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[396px] overflow-hidden rounded-[16px] bg-[#FFF9F5] px-[20px] py-[16px] pb-[32px] shadow-[#1C1E211A] drop-shadow-sm">
      <div className="flex items-center">
        <h3 className="flex-1 text-[20px] leading-[32px] text-[#171819]">
          Session with Huber
        </h3>
        <CaretDown size={24} color="#000" />
      </div>
      <div
        className={clsx(
          sessionStatus === 'pending'
            ? 'bg-[#FFE3CC] text-[#FF7301]'
            : sessionStatus === 'canceled'
              ? 'bg-red-500'
              : 'bg-green-90 text-[#38AA16]',
          'w-fit rounded-[100px] px-[10px] py-[2px] text-center align-middle text-[14px] font-[500] leading-[16px]',
        )}
      >
        <p>
          {sessionStatus === 'pending'
            ? 'Waiting for approving'
            : sessionStatus === 'canceled'
              ? 'Canceled'
              : 'Done'}
        </p>
      </div>
      <div className="mt-[16px] flex items-center">
        <span className="text-black">From: </span>{' '}
        <span className="text-primary-60">{data?.story?.title}</span>
      </div>
      <div className="mt-[16px] flex items-center">
        <Clock size={16} color="#000" className="-mt-[4px]" />
        <p className="ml-[4px] text-[14px] font-[500] leading-[16px] text-[#2E3032]">
          {formatDateTimeRange(startedAt, endedAt)}
        </p>
      </div>
      <div className="mt-[16px] flex items-center">
        <User size={16} color="#000" className="-mt-[4px]" />
        <p className="ml-[8px] text-[14px] font-[500] leading-[16px] text-[#171819]">
          2 Attendees
        </p>
      </div>
      <div className="flex flex-col">
        <div className="mt-[16px] flex items-center">
          <Image
            src="/assets/images/icons/avatar.svg"
            alt="avatar"
            width={32}
            height={32}
          />
          <p className="py[2px] mx-[8px] flex h-[20px] w-[63] items-center justify-center rounded-[100px] bg-[#FFE3CC] px-[10px] text-[14px] font-[500] leading-[16px] text-[#FF7301]">
            Liber
          </p>
          <p className="ml-[8px] text-[14px] font-[500] leading-[16px] text-[#171819]">
            {fullNameHumanBook} (You)
          </p>
        </div>
        <div className="mt-[8px] flex items-center">
          <Image
            src="/assets/images/icons/avatar.svg"
            alt="avatar"
            width={32}
            height={32}
          />
          <p className="py[2px] mx-[8px] flex h-[20px] w-[63] items-center justify-center rounded-[100px] bg-[#CDDDFE] px-[10px] text-[14px] font-[500] leading-[16px] text-[#0442BF]">
            Huber
          </p>
          <p className="ml-[8px] text-[14px] font-[500] leading-[16px] text-[#171819]">
            {fullNameReader}
          </p>
        </div>
        <div className="mt-[16px] flex items-center">
          <Note size={16} color="#000" className="-mt-[4px]" />
          <p className="ml-[8px] text-[14px] font-[500] leading-[16px] text-[#171819]">
            {note}
          </p>
        </div>
      </div>
      <div className="mt-[16px] flex items-center">
        {sessionStatus === 'pending' && (
          <Button
            className="w-full bg-red-500"
            onClick={() => {
              handleCancelSession();
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

export default DetailEventLiber;
