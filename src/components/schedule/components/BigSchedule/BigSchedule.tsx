import './bigSchedule.css';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { ScheduleFilterPopover } from '@/components/schedule/components/ScheduleFilter/ScheduleFilter';
import { PortalSessionCard } from '@/components/schedule/components/sessionCard/PortalSessionCard';
import { useAppSelector } from '@/libs/hooks';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';

export default function BigCalendar() {
  const { data: readingSessions, isLoading } = useGetReadingSessionsQuery();
  const [events, setEvents] = useState<
    { title: string; start: any; end: any; extendedProps: any }[]
  >([]);
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const currentMonthYear = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const [hoveredSession, setHoveredSession] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const formatEvents = (data: any) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data.map((item: any) => {
      return {
        title: `${item.humanBook?.fullName || 'Unknown'} - ${
          item.reader?.fullName || 'Unknown'
        }`,
        start: item.startedAt,
        end: item.endedAt,
        extendedProps: { ...item },
      };
    });
  };

  useEffect(() => {
    if (readingSessions && !isLoading) {
      const formattedEvents = formatEvents(readingSessions);
      setEvents(formattedEvents);
    }
  }, [readingSessions, isLoading]);

  const renderEventContent = (eventInfo: { event: any }) => {
    const { event } = eventInfo;
    const { extendedProps } = event;
    const isHumanBook = userInfo?.id === extendedProps.humanBookId;
    const isPending = extendedProps.sessionStatus !== 'approved';

    const handleMouseEnter = (e: React.MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setPopupPosition({
        top: rect.top + window.scrollY + 30,
        left: rect.left + window.scrollX - 400,
      });
      setHoveredSession(extendedProps);
    };
    const handleMouseLeave = () => {
      setHoveredSession(null);
    };

    return (
      <div
        className="group relative z-[50] cursor-pointer overflow-visible"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative min-w-[60px] overflow-visible">
          <div
            className={`relative flex flex-col justify-start overflow-visible rounded-md border border-[#fff] ${
              isHumanBook ? 'bg-[#CDDDFE]' : 'bg-[#FFE3CC]'
            } p-[2px]`}
          >
            {isPending && (
              <p className="absolute left-[-20px] top-[-20px] flex h-[24px] w-[82px] items-center justify-center rounded-[100px] border-l-[#fff] bg-[#FFC745] p-[7px] text-[14px] font-[500] leading-[16px] text-[#000]">
                Pending...
              </p>
            )}
            <div className="flex items-center">
              <Image
                alt="avatar"
                src="/assets/images/icons/avatar.svg"
                width={14}
                height={14}
                loading="lazy"
                className="mr-[2px] rounded-full border border-[#fff]"
              />
              <p className="h-[20px] w-[80px] truncate text-[#171819]">
                {isHumanBook
                  ? extendedProps.humanBook.fullName
                  : extendedProps.reader?.fullName}
              </p>
            </div>
            <p className={isHumanBook ? 'text-[#0442BF]' : 'text-[#FF7301]'}>
              {isHumanBook ? 'Huber' : 'Liber'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const slotLabelContent = (arg: { date: Date }) => {
    return (
      <span className="align-top font-semibold text-black">
        {arg.date.getHours()}h00
      </span>
    );
  };

  const dayHeaderContent = (arg: { date: Date }) => {
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

  return (
    <div className="bg-white p-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="flex-1 rounded-md bg-white p-2 text-[28px] font-[500] leading-[36px] text-[#010D26]">
          Appointment schedule {currentMonthYear}
        </h2>
        <div className="flex items-center gap-x-2">
          <span>View:</span>
          <ScheduleFilterPopover />
        </div>
      </div>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="calendar-scroll-wrapper">
        {events?.length > 0 && (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{ left: '', center: '', right: '' }}
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
            slotDuration="01:00:00"
            dayHeaderContent={dayHeaderContent}
            events={events}
            eventContent={renderEventContent}
          />
        )}
        {hoveredSession && (
          <PortalSessionCard
            session={hoveredSession}
            expanded
            position={popupPosition}
            onClose={() => setHoveredSession(null)}
          />
        )}
      </div>
    </div>
  );
}
