import './bigSchedule.css';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useState } from 'react';

// const listData = [
//   {
//     title: "Meeting with John",
//     start: "2025-03-06T10:00:00", // Thời gian bắt đầu (ISO format)
//     end: "2025-03-06T11:00:00",   // Thời gian kết thúc
//     backgroundColor: "#3b82f6",   // Màu nền (tùy chỉnh)
//     borderColor: "#1e40af",       // Màu viền (tùy chỉnh)
//     textColor: "#ffffff"          // Màu chữ (tùy chỉnh)
//   },
//   {
//     title: "Lunch Break",
//     start: "2025-03-06T12:00:00",
//     end: "2025-03-06T13:00:00",
//     backgroundColor: "#f59e0b",
//     borderColor: "#b45309",
//     textColor: "#ffffff"
//   }
// ]

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
  const [list, setList] = useState([]);
  const currentMonthYear = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function convertToYYYYMMDD(isoString: string) {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        console.error("Lỗi chuyển đổi ngày:", isoString); // Debug lỗi
        return "Invalid Date"; // Trả về giá trị để dễ debug
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng tính từ 0-11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


const formatData = (data: any) => {
  return data?.map((item: any) => {

    return {
      title: item.title,
      partnerName: item.partnerName,
      myRole: item.myRole,
      partnerRole: item.partnerRole,
      followers: 56,
      start: item.from,  // Phải có start
      end: item.to,      // Phải có end
      backgroundColor: item.backgroundColor || "#3b82f6",  // Nếu rỗng thì dùng màu mặc định
      borderColor: item.borderColor || "#1e40af",
      textColor: item.textColor || "#ffffff",
    };
  });
};


const getData = async () => {
  try {
    const response = await fetch('https://aws-seven-self.vercel.app/api/all');
    const result = await response.json();

    if (!result || !result.data) {
      console.error('Không có dữ liệu từ API');
      return;
    }

    console.log('Raw Data:', result.data); // Debug dữ liệu API trả về

    const dataFormat = formatData(result.data);
    console.log('Formatted Data:', dataFormat); // Debug dữ liệu sau khi format

    setList(dataFormat);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
}
useEffect(() => {
  getData();
}, [])
// const fillData = (list : any) => {
//   for (let i = 0; i < list?.length; i++) {
//       renderEventContent(list[i]);
//   }
// }
// useEffect(() => {
//   if (list.length > 0) {
//       const dataFormat = formatData(list);
//       fillData(dataFormat);
//   }
// }, [list])


  return (
    <div className="bg-white p-4">
      <h2 className="rounded-md bg-white p-2 text-[28px] font-[500] leading-[36px] text-[#010D26]">
        Appointment schedule {currentMonthYear}
      </h2>
      <div className="w-full">
      {list.length > 0 && <FullCalendar
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
          eventContent={renderEventContent}
          />
      }
      </div>
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  console.log("eventInfo", eventInfo);
  return (
    <div className="bg-blue-500 text-white p-2 rounded-md overflow-hidden">
      <b>{eventInfo.event.extendedProps.partnerName}</b>
      <p>{eventInfo.event.extendedProps.partnerRole}</p>
    </div>
  );
}
