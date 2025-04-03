import './bigSchedule.css';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/libs/hooks';

// import StoriesSkeleton from '../../../stories/StoriesSkeleton';
import DetailEventHuber from '../DetailEventHuber';
import DetailEventLiber from '../DetailEventLiber';

const slotLabelContent = (arg: any) => {
  const hour24 = arg.date.getHours();
  return (
    <span className="align-top font-semibold text-black">{hour24}h00</span>
  );
};

const dayHeaderContent = (arg: any) => {
  const date = new Date(arg.date);
  const dayName = date
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase();
  const dayNumber = date.getDate();

  return (
    <div className="flex flex-col items-center">
      <span className="font-bold">
        {dayName} {dayNumber}
      </span>
    </div>
  );
};

export default function BigCalendar() {
  const [list, setList] = useState([]);
  const userInfor = useAppSelector((state) => state.auth.userInfo);
  const currentMonthYear = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const formatData = (data: any) => {
    return data?.map((item: any) => {
      return {
        title: `${item.humanBook?.fullName || 'Unknown'} - ${
          item.reader?.fullName || 'Unknown'
        }`,
        start: item.startedAt,
        end: item.endedAt,
        extendedProps: {
          ...item,
        },
        backgroundColor: item.backgroundColor || '#3b82f6',
        borderColor: item.borderColor || '#1e40af',
        textColor: item.textColor || '#ffffff',
      };
    });
  };

  //   function convertToYYYYMMDD(isoString: string) {
  //     const date = new Date(isoString);
  //     if (isNaN(date.getTime())) {
  //         console.error("Lỗi chuyển đổi ngày:", isoString);
  //         return "Invalid Date";
  //     }

  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     const day = String(date.getDate()).padStart(2, '0');

  //     return `${year}-${month}-${day}`;
  // }
  const getData = async () => {
    try {
      const response = await fetch(
        'https://hulib-services.onrender.com/api/v1/reading-sessions',
      );
      const result = await response.json();
      console.log('Response', result);
      const dataFormat = await formatData(result);
      console.log('dataFormat', dataFormat);
      setList(dataFormat);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };
  const getAllData = (data: boolean) => {
    if (data) {
      getData();
    }
  };
  function renderEventContent(eventInfo: any, user: any) {
    console.log('extendedProps:', eventInfo.event.extendedProps);

    return (
      <div className="group relative z-[50] cursor-pointer overflow-visible">
        <div className="relative min-w-[60px] overflow-visible">
          {user?.id === eventInfo.event.extendedProps.humanBookId ? (
            <>
              <div className="relative flex flex-col justify-start overflow-visible rounded-md border border-[#fff] bg-[#CDDDFE] p-[2px]">
                {/* <p className="clip-auto z-10 absolute -left-[20px] -top-[22px] flex h-[24px] w-[82px] items-center justify-center rounded-[100px] bg-[#FFC745] p-[7px] text-[14px] font-[500] leading-[16px] text-[#000]">
                Pending...
              </p> */}
                <p
                  className={`absolute -left-[20px] -top-[20px] flex h-[24px] w-[82px] items-center justify-center rounded-[100px] border-l-[#fff] bg-[#FFC745] p-[7px] text-[14px] font-[500] leading-[16px] text-[#000] ${
                    eventInfo.event.extendedProps.sessionStatus === 'approved'
                      ? 'hidden'
                      : 'block'
                  }`}
                >
                  {eventInfo.event.extendedProps.sessionStatus === 'approved'
                    ? ''
                    : 'Pending....'}
                </p>
                <div className="flex items-center">
                  <Image
                    alt="avatar"
                    // src={
                    //   eventInfo.event.extendedProps.humanBook.videoUrl
                    //     ? eventInfo.event.extendedProps.humanBook.videoUrl
                    //     : '/assets/images/icons/avatar.svg'
                    // }
                    src="/assets/images/icons/avatar.svg"
                    width={14}
                    height={14}
                    loading="lazy"
                    className="mr-[2px] rounded-full border border-[#fff]"
                  />
                  <p className="h-[20px] w-[80px] truncate text-[#171819]">
                    {eventInfo.event.extendedProps.humanBook.fullName}
                  </p>
                </div>
                <p className="text-[#0442BF]">Huber</p>
              </div>
              <div className="absolute -left-[396px] top-[5px] z-50 hidden group-hover:block">
                <DetailEventHuber
                  data={eventInfo.event.extendedProps}
                  callblack={(data: boolean) => getAllData(data)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="relative flex flex-col justify-start overflow-visible rounded-md border border-[#fff] bg-[#FFE3CC] p-[2px]">
                {/* <p className="absolute -left-[20px] -top-[18px] flex h-[24px] w-[82px] items-center justify-center rounded-[100px] bg-[#FFC745] p-[7px] text-[14px] font-[500] leading-[16px] text-[#000]">
              Pending...
            </p> */}
                <p
                  className={`absolute -left-[20px] -top-[20px] flex h-[24px] w-[82px] items-center justify-center rounded-[100px] border-l-[#fff] bg-[#FFC745] p-[7px] text-[14px] font-[500] leading-[16px] text-[#000] ${
                    eventInfo.event.extendedProps.sessionStatus === 'approved'
                      ? 'hidden'
                      : 'block'
                  }`}
                >
                  {eventInfo.event.extendedProps.sessionStatus === 'approved'
                    ? ''
                    : 'Pending...'}
                </p>
                <div className="flex items-center">
                  <Image
                    alt="avatar"
                    src={
                      eventInfo?.event?.extendedProps?.reader?.videoUrl
                        ? eventInfo?.event?.extendedProps?.reader?.videoUrl
                        : '/assets/images/icons/avatar.svg'
                    }
                    width={14}
                    height={14}
                    loading="lazy"
                    className="mr-[2px] rounded-full border border-[#fff]"
                  />
                  <p className="h-[20px] w-[70px] truncate text-[#171819]">
                    {eventInfo?.event?.extendedProps?.reader?.fullName}
                  </p>
                </div>
                <p className="overflow-hidden text-[#FF7301]">Liber</p>
              </div>
              <div className="absolute -left-[396px] -top-[5px] z-[9999] hidden overflow-visible group-hover:block">
                <DetailEventLiber data={eventInfo.event.extendedProps} />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="bg-white p-4">
      <h2 className="rounded-md bg-white p-2 text-[28px] font-[500] leading-[36px] text-[#010D26]">
        Appointment schedule {currentMonthYear}
      </h2>
      <div className="w-full">
        {list?.length > 0 && (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: '',
              center: '',
              right: '',
            }}
            views={{
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'long' },
              },
            }}
            slotLabelContent={slotLabelContent}
            height="auto"
            contentHeight="auto"
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            dayHeaderContent={dayHeaderContent}
            events={list}
            eventContent={(eventInfo) =>
              renderEventContent(eventInfo, userInfor)
            }
          />
        )}
      </div>
    </div>
  );
}
