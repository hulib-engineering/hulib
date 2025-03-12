import { useAppSelector } from '@/libs/hooks';
import './bigSchedule.css';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useState } from 'react';
import { useGetAuthorDetailQuery } from '@/libs/services/modules/user';
import Image from 'next/image';

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
  const user = useAppSelector((state) => state.auth.userInfo);
  const [list, setList] = useState([]);
  const currentMonthYear = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
    const { data: authorDetail, isLoading } = useGetAuthorDetailQuery(user?.id);
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
      title: `${item.humanBook?.fullName || "Unknown"} - ${item.userLiber?.fullName || "Unknown"}`, // Thêm tiêu đề
      start: item.startedAt,
      end: item.endedAt,
      extendedProps: {
        ...item,
      },
      backgroundColor: item.backgroundColor || "#3b82f6",  // Nếu rỗng thì dùng màu mặc định
      borderColor: item.borderColor || "#1e40af",
      textColor: item.textColor || "#ffffff",
    };
  });
};


const getData = async () => {
  try {
    const response = await fetch('https://hulib-services.onrender.com/api/schedules');
    const result = await response.json();
    const dataFormat = await formatData(result?.data);
    console.log("dataFormat", dataFormat);
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

  console.log("id", user?.id);
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
          eventContent={(eventInfo, user) => renderEventContent(eventInfo, user)}
          />
      }
      </div>
    </div>
  );
}

function renderEventContent(eventInfo: any, user: any) {
  console.log("eventInfo:", eventInfo.event.extendedProps);
  return (
    <div>
    {user.id === eventInfo.event.extendedProps.humanBookId ? (
      <div className="bg-[#CDDDFE] p-[2px] rounded-md flex flex-col justify-start relative overflow-visible">
      <p className="-top-[18px] -left-[20px] flex justify-center items-center absolute bg-[#FFC745] text-[#000] font-[500] text-[14px] leading-[16px] p-[7px] w-[82px] h-[24px] rounded-[100px] z-[10]">Pending...</p>
      <p className={`-top-[10px] -left-[20px] flex justify-center items-center absolute bg-[#FFC745] text-[#000] font-[500] text-[14px] leading-[16px] p-[7px] w-[82px] h-[24px] rounded-[100px] z-[10] ${eventInfo.event.extendedProps.humanBook.approval === "Approved"? "hidden" : "block"}`}>{eventInfo.event.extendedProps.humanBook.approval === "Approved"? "" : "Pedding...."}</p>
      <div className="flex items-center">
          <Image
            alt="avatar"
            src={eventInfo.event.extendedProps.humanBook.videoUrl ? eventInfo.event.extendedProps.humanBook.videoUrl : "/assets/images/icons/avatar.svg"}
            width={14}
            height={14}
            loading="lazy"
            className="border border-[#fff] rounded-full mr-[2px]"
          /> 
      <p className="overflow-hidden whitespace-nowrap text-ellipsis w-[80px] h-[20px] text-[#171819]">{eventInfo.event.extendedProps.humanBook.fullName}</p>
      </div>
      <p className="text-[#0442BF]">Huber</p>
    </div>) :
    (<div className="bg-[#FFE3CC] p-[2px] rounded-md flex flex-col justify-start relative overflow-visible">
      <p className="-top-[18px] -left-[20px] flex justify-center items-center absolute bg-[#FFC745] text-[#000] font-[500] text-[14px] leading-[16px] p-[7px] w-[82px] h-[24px] rounded-[100px] z-[10]">Pending...</p>
      <p className={`-top-[10px] -left-[20px] flex justify-center items-center absolute bg-[#FFC745] text-[#000] font-[500] text-[14px] leading-[16px] p-[7px] w-[82px] h-[24px] rounded-[100px] z-[10] ${eventInfo.event.extendedProps.humanBook.approval === "Approved"? "hidden" : "block"}`}>{eventInfo.event.extendedProps.humanBook.approval === "Approved"? "" : "Pedding..."}</p>
      <div className="flex items-center">
          <Image
            alt="avatar"
            src={eventInfo.event.extendedProps.userLiber.videoUrl ? eventInfo.event.extendedProps.userLiber.videoUrl : "/assets/images/icons/avatar.svg"}
            width={14}
            height={14}
            loading="lazy"
            className="border border-[#fff] rounded-full mr-[2px]"
          />        
          <p className="overflow-hidden whitespace-nowrap text-ellipsis w-[70px] h-[20px] text-[#171819]">{eventInfo.event.extendedProps.userLiber.fullName}</p>
      </div>
      <p className="text-[#FF7301]">Liber</p>
    </div>)}
    </div>
  );
}
