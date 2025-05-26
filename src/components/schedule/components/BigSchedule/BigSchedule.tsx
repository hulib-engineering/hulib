import './bigSchedule.css';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import { ScheduleFilterPopover } from '@/components/schedule/components/ScheduleFilter/ScheduleFilter';
import { PortalSessionCard } from '@/components/schedule/components/sessionCard/PortalSessionCard';
import { useAppSelector } from '@/libs/hooks';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import { Role, ROLE_NAME, StatusEnum } from '@/types/common';

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

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatEvents = (data: any) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data.map((item: any) => {
      return {
        id: item.id,
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
      const filteredSessions = readingSessions.filter(
        (item: any) =>
          item.sessionStatus !== StatusEnum.Canceled &&
          item.sessionStatus !== StatusEnum.Rejected,
      );
      const formattedEvents = formatEvents(filteredSessions);
      setEvents(formattedEvents);
    }
  }, [readingSessions, isLoading]);

  const handleMouseEnter = (e: React.MouseEvent, session: any) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopupPosition({
      top: rect.top + window.scrollY + 30,
      left: rect.left + window.scrollX - 400,
    });
    setHoveredSession(session);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredSession(null);
    }, 300);
  };
  const handlePopupMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const renderEventContent = (eventInfo: { event: any }) => {
    const { event } = eventInfo;
    const { extendedProps } = event;
    const isHumanBook = userInfo?.id === extendedProps.humanBookId;
    const isPending =
      extendedProps.sessionStatus !==
      (StatusEnum.Approved || StatusEnum.Finished);

    return (
      <div
        className="group relative z-[50] h-[68px] cursor-pointer overflow-visible"
        onMouseEnter={(e) => handleMouseEnter(e, extendedProps)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-full min-w-[60px] overflow-visible">
          <div
            className={`relative flex h-full flex-col  justify-center overflow-visible rounded-xl border  ${
              isHumanBook
                ? 'border-[#FEF3C7] bg-[#FFFBEB]'
                : 'border-[#DBEAFE] bg-[#DBEAFE]'
            } p-[2px]`}
          >
            {isPending && (
              <span className=" inline-block h-[24px] w-[80px] self-end rounded-[100px] border-l-[#fff] bg-[#FFEDD5] p-[7px] text-right text-[12px] font-[500] leading-[16px] text-[#F97316]">
                Waiting...
              </span>
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
              <p className="h-[20px] w-[80px] truncate text-xs text-[#171819]">
                {isHumanBook
                  ? extendedProps.reader.fullName
                  : extendedProps.humanBook?.fullName}
              </p>
            </div>
            <p
              className={`ml-3 text-xs ${
                isHumanBook ? 'text-[#DBAE0A]' : 'text-[#0442BF]'
              }`}
            >
              {isHumanBook ? ROLE_NAME[Role.LIBER] : ROLE_NAME[Role.HUBER]}
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
            slotMinTime="6:00:00"
            slotMaxTime="24:00:00"
            slotDuration="01:00:00"
            dayHeaderContent={dayHeaderContent}
            events={events}
            eventContent={renderEventContent}
          />
        )}
        {hoveredSession && (
          <div onMouseEnter={handlePopupMouseEnter}>
            <PortalSessionCard
              session={hoveredSession}
              expanded
              position={popupPosition}
              onClose={() => setHoveredSession(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
