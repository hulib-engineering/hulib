import React, { useRef } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import NowIndicator from '@/layouts/scheduling/NowIndicator';
import SessionPopover from '@/layouts/scheduling/SessionPopover';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';
import { getGMTOffset } from '@/utils/dateUtils';

type IEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ReadingSession;
};

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function BigCalendar({ dateInWeekView = new Date() }: { dateInWeekView?: Date }) {
  const getCurrentWeekRange = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const startOfWeekDate = new Date(weekStart);
    startOfWeekDate.setHours(0, 0, 0, 0);

    const endOfWeekDate = new Date(weekStart);
    endOfWeekDate.setDate(weekStart.getDate() + 6);
    endOfWeekDate.setHours(23, 59, 59, 999);

    return {
      startedAt: startOfWeekDate.toISOString(),
      endedAt: endOfWeekDate.toISOString(),
    };
  };
  const { startedAt, endedAt } = getCurrentWeekRange(dateInWeekView);

  const { data: readingSessions, isLoading } = useGetReadingSessionsQuery({
    startedAt,
    endedAt,
  });
  const events: IEvent[] = !isLoading && readingSessions && readingSessions.length > 0 ? readingSessions.map((readingSession: ReadingSession) => ({
    id: readingSession.id,
    title: `${readingSession.humanBookId} - ${
      readingSession.readerId
    }`,
    start: new Date(readingSession.startedAt),
    end: new Date (readingSession.endedAt),
    resource: { ...readingSession },
  })) : [];

  const calRef = useRef<HTMLDivElement | null>(null);

  const minTime = new Date(1970, 1, 1, 6, 0); // 06:00
  const maxTime = new Date(1970, 1, 1, 23, 30); // 23:30

  return (
    <div ref={calRef} className="relative size-full">
      <Calendar
        localizer={localizer}
        events={events}
        date={dateInWeekView}
        defaultView={Views.WEEK}
        views={{ week: true }}
        toolbar={false}
        min={minTime}
        max={maxTime}
        step={30}
        timeslots={2}
        scrollToTime={minTime}
        style={{ height: '772px' }}
        components={{
          event: ({ event }) => (
            <div className="size-full">
              <SessionPopover
                isPending={event.resource.sessionStatus === StatusEnum.Pending}
                extendedProps={event.resource}
              />
            </div>
          ),
          timeGutterHeader: () => <span className="text-sm font-medium leading-4">{getGMTOffset()}</span>,
          header: ({ date }: { date: Date }) => (
            <>{format(date, 'EEE dd').toUpperCase()}</>
          ),
        }}
        slotPropGetter={(date) => {
          // Does this specific slot fall inside an event?
          const hasEvent = events.some(
            event =>
              date >= new Date(event.start) && date < new Date(event.end),
          );

          return {
            className: hasEvent ? 'slot-has-event' : 'slot-empty',
          };
        }}
        formats={{
          timeGutterFormat: date => format(date, 'H\'h\'mm'),
          eventTimeRangeFormat: () => '', // 🛑 hides "start–end" label
        }}
      />
      <NowIndicator minTime={minTime} maxTime={maxTime} containerRef={calRef} />
    </div>
  );
};
