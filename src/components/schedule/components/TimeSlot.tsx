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

interface TimeSlots {
  morning: any[];
  afternoon: any[];
  evening: any[];
}
function TimeSlot() {
  const [currentDate, setCurrentDate] = useState<any>('');
  const listTime: string[] = [];
  const [listDay, setListDay] = useState<Record<string, TimeSlots>>({});
  const handleUpdateTimeSlot: () => void = () => {
    // router.push('/schedule-meeting/time-slot');
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
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

  // useEffect(() => {
  //   times.forEach((time) => {
  //   const date = new Date(time.replace(' ', 'T'));
  //   const hour = date.getHours();
  //   const min = date.getMinutes();
  //   const result = `${hour} : ${min}`;
  //   if (hour >= MORNING_TIME_START && hour < AFTERNOON_TIME_START) {
  //     morning.push(result);
  //   } else if (hour >= AFTERNOON_TIME_START && hour < EVENING_TIME_START) {
  //     afternoon.push(result);
  //   } else {
  //     evening.push(result);
  //   }
  // });
  // }, []);

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

  // useEffect(() => {
  //   if (morning.length > 0) {
  //     setListMorning(morning);
  //   }
  // }, [morning.length]);
  // useEffect(() => {
  //   if (afternoon.length > 0) {
  //     setListAfternoon(afternoon);
  //   }
  // }, [afternoon.length]);
  // useEffect(() => {
  //   if (evening.length > 0) {
  //     setListEvening(evening);
  //   }
  // }, [evening.length]);

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
  const formatData = (result: any) => {
    const MON: any = {
      morning: [],
      afternoon: [],
      evening: [],
    };
    const TUE: any = {
      morning: [],
      afternoon: [],
      evening: [],
    };
    const WED: any = {
      morning: [],
      afternoon: [],
      evening: [],
    };
    const THU: any = {
      morning: [],
      afternoon: [],
      evening: [],
    };
    const FRI: any = {
      morning: [],
      afternoon: [],
      evening: [],
    };
    const SAT: any = {
      morning: [],
      afternoon: [],
      evening: [],
    };
    const SUN: any = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    result.forEach((element: any) => {
      const stringDate = element?.startTime ?? 0;
      const [hours, minutes] = stringDate.split(':').map(Number);
      const startTime = hours + minutes / 60;
      switch (element.dayOfWeek) {
        case 1:
          if (
            startTime >= MORNING_TIME_START &&
            startTime < AFTERNOON_TIME_START
          ) {
            MON.morning.push(element);
          } else if (
            startTime >= AFTERNOON_TIME_START &&
            startTime < EVENING_TIME_START
          ) {
            MON.afternoon.push(element);
          } else {
            MON.evening.push(element);
          }
          break;
        case 2:
          if (
            startTime >= MORNING_TIME_START &&
            startTime < AFTERNOON_TIME_START
          ) {
            TUE.morning.push(element);
          } else if (
            startTime >= AFTERNOON_TIME_START &&
            startTime < EVENING_TIME_START
          ) {
            TUE.afternoon.push(element);
          } else {
            TUE.evening.push(element);
          }
          break;
        case 3:
          if (
            startTime >= MORNING_TIME_START &&
            startTime < AFTERNOON_TIME_START
          ) {
            WED.morning.push(element);
          } else if (
            startTime >= AFTERNOON_TIME_START &&
            startTime < EVENING_TIME_START
          ) {
            WED.afternoon.push(element);
          } else {
            WED.evening.push(element);
          }
          break;
        case 4:
          if (
            startTime >= MORNING_TIME_START &&
            startTime < AFTERNOON_TIME_START
          ) {
            THU.morning.push(element);
          } else if (
            startTime >= AFTERNOON_TIME_START &&
            startTime < EVENING_TIME_START
          ) {
            THU.afternoon.push(element);
          } else {
            THU.evening.push(element);
          }
          break;
        case 5:
          if (
            startTime >= MORNING_TIME_START &&
            startTime < AFTERNOON_TIME_START
          ) {
            FRI.morning.push(element);
          } else if (
            startTime >= AFTERNOON_TIME_START &&
            startTime < EVENING_TIME_START
          ) {
            FRI.afternoon.push(element);
          } else {
            FRI.evening.push(element);
          }
          break;
        case 6:
          if (
            startTime >= MORNING_TIME_START &&
            startTime < AFTERNOON_TIME_START
          ) {
            SAT.morning.push(element);
          } else if (
            startTime >= AFTERNOON_TIME_START &&
            startTime < EVENING_TIME_START
          ) {
            SAT.afternoon.push(element);
          } else {
            SAT.evening.push(element);
          }
          break;
        case 7:
          if (
            startTime >= MORNING_TIME_START &&
            startTime < AFTERNOON_TIME_START
          ) {
            SUN.morning.push(element);
          } else if (
            startTime >= AFTERNOON_TIME_START &&
            startTime < EVENING_TIME_START
          ) {
            SUN.afternoon.push(element);
          } else {
            SUN.evening.push(element);
          }
          break;
        default:
      }
    });
    const list = {
      ...listDay,
      MON,
      TUE,
      WED,
      THU,
      FRI,
      SAT,
      SUN,
    };
    setListDay(list);
  };
  const getData = async () => {
    try {
      const response = await fetch(
        'https://hulib-services.onrender.com/api/v1/time-slots',
      );
      const result = await response.json();
      formatData(result);
      console.log('time slot', result);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const morningSlots =
    (listDay[currentDate] as { morning: any[] })?.morning?.length || 0;
  const afternoonSlots =
    (listDay[currentDate] as { afternoon: any[] })?.afternoon?.length || 0;
  const eveningSlots =
    (listDay[currentDate] as { evening: any[] })?.evening?.length || 0;
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
        {`Amazing!!! Bạn có thể gặp ${
          morningSlots + afternoonSlots + eveningSlots
        } Liber vào hôm nay 💚`}
      </p>
      <div>
        <div className="mb-[10px] flex flex-wrap items-center justify-start gap-[4px] rounded-[8px] bg-[#F9F9F9] p-[8px]">
          {/* {listDay[currentDate].morning.length > 0 &&
            listDay[currentDate].morning.map((time : any, index :any) => (
              <div
                key={index}
                className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
              >
                {time.startTime}
              </div>
            ))} */}
          {(listDay[currentDate] as { morning: any[] })?.morning?.length > 0 &&
            (listDay[currentDate] as { morning: any[] }).morning.map(
              (time: any, index: any) => (
                <div
                  key={index}
                  className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
                >
                  {time.startTime}
                </div>
              ),
            )}
        </div>
        <div className="mb-[10px] flex flex-wrap items-center justify-start gap-[4px] rounded-[8px] bg-[#F9F9F9] p-[8px]">
          {/* {listDay[currentDate].afternoon.length > 0 &&
            listDay[currentDate].afternoon.map((time : any, index : any) => (
              <div
                key={index}
                className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
              >
                {time.startTime}
                </div>
            ))} */}
          {(listDay[currentDate] as { afternoon: any[] })?.afternoon?.length >
            0 &&
            (listDay[currentDate] as { afternoon: any[] }).afternoon.map(
              (time: any, index: any) => (
                <div
                  key={index}
                  className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
                >
                  {time.startTime}
                </div>
              ),
            )}
        </div>
        <div className="mb-[10px] flex flex-wrap items-center justify-start gap-[4px] rounded-[8px] bg-[#F9F9F9] p-[8px]">
          {/* {listDay[currentDate].evening.length > 0 &&
            listDay[currentDate].evening.map((time : any, index : any) => (
              <div
                key={index}
                className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
              >
                {time.startTime}
                </div>
            ))} */}
          {(listDay[currentDate] as { evening: any[] })?.evening?.length > 0 &&
            (listDay[currentDate] as { evening: any[] }).evening.map(
              (time: any, index: any) => (
                <div
                  key={index}
                  className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]"
                >
                  {time?.startTime}
                </div>
              ),
            )}
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
