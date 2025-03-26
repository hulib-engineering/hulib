'use client';

import { useEffect, useState } from 'react';

import {
  AFTERNOON_TIME_START,
  DAY_STRING,
  EVENING_TIME_START,
  FORMAT_WEEK_STRING,
  MONTH_STRING,
  MORNING_TIME_START,
  WEEK_STRING,
  YEAR_STRING,
} from '@/libs/constants/date';

const times = [
  // "2025-02-21 06:30",
  // "2025-02-21 07:30",
  // "2025-02-21 08:30",
  // "2025-02-21 09:30",
  // "2025-02-21 10:30",
  // "2025-02-21 11:00",
  // "2025-02-21 11:30",
  // "2025-02-21 12:30",
  // "2025-02-21 13:30",
  // "2025-02-21 14:30",
  // "2025-02-21 15:30",
  // "2025-02-21 16:30",
  // "2025-02-21 17:30",
  // "2025-02-21 19:30",
  // "2025-02-21 20:30",
  // "2025-02-21 21:30",
  // "2025-02-21 22:30",
  // "2025-02-21 23:30",
  // "2025-02-28 06:30",
  // "2025-02-28 07:30",
  // "2025-02-28 08:30",
  // "2025-02-28 09:30",
  // "2025-02-28 10:30",
  // "2025-02-28 11:00",
  // "2025-02-28 11:30",
  // "2025-02-28 12:30",
  // "2025-02-28 13:30",
  // "2025-02-28 14:30",
  // "2025-02-28 15:30",
  // "2025-02-28 16:30",
  // "2025-02-28 17:30",
  // "2025-02-28 19:30",
  // "2025-02-28 20:30",
  // "2025-02-28 21:30",
  // "2025-02-28 22:30",
  // "2025-02-28 23:30",
  '2025-03-01 06:30',
  '2025-03-01 07:30',
  '2025-03-01 08:30',
  '2025-03-01 09:30',
  '2025-03-01 10:30',
  '2025-03-01 11:00',
  '2025-03-01 11:30',
  '2025-03-01 12:30',
  '2025-03-01 13:30',
  '2025-03-01 14:30',
  '2025-03-01 15:30',
  '2025-03-01 16:30',
  '2025-03-01 17:30',
  '2025-03-01 19:30',
  '2025-03-01 20:30',
  '2025-03-01 21:30',
  '2025-03-01 22:30',
  '2025-03-01 23:30',
  // "2025-03-02 06:30",
  // "2025-03-02 07:30",
  // "2025-03-02 08:30",
  // "2025-03-02 09:30",
  // "2025-03-02 10:30",
  // "2025-03-02 11:00",
  // "2025-03-02 11:30",
  // "2025-03-02 12:30",
  // "2025-03-02 13:30",
  // "2025-03-02 14:30",
  // "2025-03-02 15:30",
  // "2025-03-02 16:30",
  // "2025-03-02 17:30",
  // "2025-03-02 19:30",
  // "2025-03-02 20:30",
  // "2025-03-02 21:30",
  // "2025-03-02 22:30",
  // "2025-03-02 23:30",
];

function TimeSlot() {
  const [currentDate, setCurrentDate] = useState<any>('');
  const listTime: string[] = [];
  const [listMorning, setListMorning] = useState<string[]>([]);
  const [listAfternoon, setListAfternoon] = useState<string[]>([]);
  const [listEvening, setListEvening] = useState<string[]>([]);
  const [list, setList] = useState([]);
  console.log('list', list);
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];
  const handleUpdateTimeSlot = () => {};

  const getCurrentDay = () => {
    const today = new Date().getDay(); // today value from 1 - 7
    console.log('today', today);
    console.log('WEEK_STRING[today]', WEEK_STRING[today]);
    setCurrentDate(WEEK_STRING[today]);
  };

  useEffect(() => {
    getCurrentDay();
  }, []);

  // display time slot depend on day was choosed
  const handleSelectDay = (day: string) => {
    setCurrentDate(day);
  };

  useEffect(() => {
    times.forEach((time) => {
      const date = new Date(time.replace(' ', 'T'));
      const hour = date.getHours();
      const min = date.getMinutes();
      const result = `${hour} : ${min}`;
      if (hour >= MORNING_TIME_START && hour < AFTERNOON_TIME_START) {
        morning.push(result);
      } else if (hour >= AFTERNOON_TIME_START && hour < EVENING_TIME_START) {
        afternoon.push(result);
      } else {
        evening.push(result);
      }
    });
  }, []);

  useEffect(() => {
    if (listTime.length > 0) {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const parts = formatter.formatToParts(date);
      const day = parts.find((p) => p.type === DAY_STRING)?.value;
      const month = parts.find((p) => p.type === MONTH_STRING)?.value;
      const year = parts.find((p) => p.type === YEAR_STRING)?.value;
      setCurrentDate(`${day} ${month}, ${year}`);
    }
  }, []);

  useEffect(() => {
    if (morning.length > 0) {
      setListMorning(morning);
    }
  }, [morning.length]);
  useEffect(() => {
    if (afternoon.length > 0) {
      setListAfternoon(afternoon);
    }
  }, [afternoon.length]);
  useEffect(() => {
    if (evening.length > 0) {
      setListEvening(evening);
    }
  }, [evening.length]);

  // handle get this week
  // const getCurrentWeek = () => {
  //   const today = new Date();
  //   const firstDayOfWeek = new Date(today);
  //   firstDayOfWeek.setDate(today.getDate() - today.getDay());

  //   const lastDayOfWeek = new Date(today);
  //   lastDayOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  //   return {
  //     startOfWeek: firstDayOfWeek.toISOString().split("T")[0],
  //     endOfWeek: lastDayOfWeek.toISOString().split("T")[0]
  //   };
  // };

  // handle get all day in this week
  const getWeekDays = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(
      today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1),
    );

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  useEffect(() => {
    getWeekDays();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(
        'https://hulib-services.onrender.com/api/v1/time-slots',
      );
      const result = await response.json();
      setList(result);
      console.log('time slot', result);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="mb-[20px] flex flex-col justify-center rounded-[12px] bg-[#fff] p-[16px] drop-shadow-md">
      <div className="my-[10px]">
        <p className="text-[18px] font-[500] leading-[28px] text-[#03191C]">
          My available slots
        </p>
        <p className="text-[12px] font-[500] leading-[16px] text-[#03191C]">
          Những khung giờ trong tuần mà bạn đã dành cho Liber
        </p>
      </div>
      <div className="m-[4px] grid h-[32px] grid-cols-7 rounded-[16px] bg-[#F3F4F6]">
        {FORMAT_WEEK_STRING.map((day: string) => (
          <button
            type="button"
            onClick={() => handleSelectDay(day)}
            key={day}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSelectDay(day);
              }
            }}
            className={`flex cursor-pointer items-center justify-center rounded-[16px] p-[4px] text-[14px] font-[400] leading-[16px] hover:bg-[#CDDDFE] hover:text-[#0442BF] ${
              currentDate === day
                ? 'bg-[#CDDDFE] text-[#0442BF]'
                : 'text-[#000000]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      <p className="my-[4px] text-center text-[12px] font-[400] leading-[14px] text-[#38AA16]">
        Amazing!!! Bạn có thể gặp 10 Liber mọi thứ tư 💚
      </p>
      <div>
        <div className="mb-[10px] flex flex-wrap items-center justify-start gap-[4px] rounded-[8px] bg-[#F9F9F9] p-[8px]">
          {listMorning.length > 0 &&
            listMorning.map((time, index) => (
              <div
                key={index}
                className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
              >
                {time}
              </div>
            ))}
        </div>
        <div className="mb-[10px] flex flex-wrap items-center justify-start gap-[4px] rounded-[8px] bg-[#F9F9F9] p-[8px]">
          {listAfternoon.length > 0 &&
            listMorning.map((time, index) => (
              <div
                key={index}
                className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
              >
                {time}
              </div>
            ))}
        </div>
        <div className="mb-[10px] flex flex-wrap items-center justify-start gap-[4px] rounded-[8px] bg-[#F9F9F9] p-[8px]">
          {listEvening.length > 0 &&
            listMorning.map((time, index) => (
              <div
                key={index}
                className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
              >
                {time}
              </div>
            ))}
        </div>
      </div>
      <div className="w-full">
        <button
          type="button"
          onClick={handleUpdateTimeSlot}
          className="hove:opacity-[0.9] mb-[10px] flex min-h-[30px] w-full items-center justify-center rounded-[20px] bg-[#0442BF] p-[8px]"
        >
          {/* <CalendarPlus size={16} color="#ffffff" className="inline-block mt-[-4px]"/> */}
          <span className="ml-[6px] inline-block text-[14px] font-[500] leading-[20px] text-white">
            Update My Slots
          </span>
        </button>
      </div>
    </div>
  );
}

export default TimeSlot;
