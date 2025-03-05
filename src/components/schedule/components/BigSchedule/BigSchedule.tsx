import './bigSchedule.css';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React from 'react';

const slotLabelContent = (arg: any) => {
  const hour24 = arg.date.getHours();
  return <span className="font-semibold text-black">{hour24}h00</span>;
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
  const currentMonthYear = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white p-4">
      <h2 className="rounded-md bg-white p-2 text-[28px] font-[500] leading-[36px] text-[#010D26]">
        Appointment schedule {currentMonthYear}
      </h2>
      <div className="w-full">
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
        />
      </div>
    </div>
  );
}
