'use client';

import { Box } from '@mui/material';
import { useState } from 'react';

import Button from '@/components/button/Button';
import HeadSlots from '@/components/common/HeadSlots';

const Step2 = () => {
  const [selectedDay, setSelectedDay] = useState('TUE');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const timeSlots = {
    morning: [
      '6h00',
      '6h30',
      '7h00',
      '7h30',
      '8h00',
      '8h30',
      '9h00',
      '9h30',
      '10h00',
      '10h30',
      '11h00',
      '11h30',
    ],
    afternoon: [
      '12h00',
      '12h30',
      '13h00',
      '13h30',
      '14h00',
      '14h30',
      '15h00',
      '15h30',
      '16h00',
      '16h30',
      '17h00',
      '17h30',
    ],
    evening: [
      '18h00',
      '18h30',
      '19h00',
      '19h30',
      '20h00',
      '20h30',
      '21h00',
      '21h30',
      '22h00',
      '22h30',
      '23h00',
      '23h30',
    ],
  };

  const handleTimeSelect = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-5">
      <h1 className="mb-6 text-4xl font-bold">Register as a Huber</h1>

      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-2">
          <h2 className="text-xl">My available slots</h2>
          <p className="text-gray-700">When can you make time for Liber?</p>
        </div>

        <div className="flex flex-col gap-[10px]">
          <HeadSlots
            selectedDay={selectedDay}
            onClickDay={(day: string) => setSelectedDay(day)}
          />

          {Object.entries(timeSlots).map(([period, times]) => (
            <div
              key={period}
              className="flex flex-col gap-2 rounded-lg bg-neutral-98 p-2"
            >
              <div className="flex justify-between gap-1">
                {times.slice(0, 6).map((time: string) => (
                  <Box
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`w-[70px] rounded-full px-3 py-1 text-center text-gray-700 ${
                      selectedTimes.includes(time)
                        ? 'bg-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {time}
                  </Box>
                ))}
              </div>
              <div className="flex justify-between gap-1">
                {times.slice(6, 12).map((time: string) => (
                  <Box
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`w-[70px] rounded-full px-3 py-1 text-center text-gray-700 ${
                      selectedTimes.includes(time)
                        ? 'bg-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {time}
                  </Box>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              className="border-neutral-variant-80 w-[180px] rounded-full px-12 py-2 text-primary-50"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between gap-2">
        <Button
          variant="outline"
          className="border-neutral-variant-80 w-1/2 rounded-full px-12 py-2 text-primary-50"
        >
          Back
        </Button>
        <Button className="w-1/2 rounded-full bg-primary-50 px-12 py-2 text-white">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step2;
