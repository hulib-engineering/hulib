'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  dayOfWeek: any;
  onChangeDayOfWeek: Function;
  selectedTimes: any;
}

const days = {
  0: {
    title: 'SUN',
    name: 'Sunday',
    text: "Wait, you're working on Sunday too? 😆",
  },
  1: {
    title: 'MON',
    name: 'Monday',
    text: 'Hey, are you really that busy on Monday? 😊',
  },
  2: {
    title: 'TUE',
    name: 'Tuesday',
    text: 'Is setting aside just 30 minutes really that hard? 😢',
  },
  3: {
    title: 'WED',
    name: 'Wednesday',
    text: 'Come on, is 30 minutes that tough to spare? 😢',
  },
  4: {
    title: 'THU',
    name: 'Thursday',
    text: 'Is setting aside just 30 minutes really that hard? 😢',
  },
  5: {
    title: 'FRI',
    name: 'Friday',
    text: 'Come on, is 30 minutes that tough to spare? 😢',
  },
  6: {
    title: 'SAT',
    name: 'Saturday',
    text: 'Hey, are you really that busy on Saturday? 🤔',
  },
};

export default function HeadSlots({
  dayOfWeek = 0,
  onChangeDayOfWeek,
  selectedTimes,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<keyof typeof days>(dayOfWeek);
  const [numberOfTimeSlots, setNumberOfTimeSlots] = useState<number>(0);

  useEffect(() => {
    setSelectedDay(dayOfWeek);
  }, [dayOfWeek]);

  useEffect(() => {
    const timeSlotsByDay = selectedTimes?.filter(
      (time: any) => time.dayOfWeek === selectedDay,
    );
    setNumberOfTimeSlots(timeSlotsByDay?.length || 0);
  }, [selectedDay, selectedTimes]);

  return (
    <Box className="mt-4">
      {/* Day Selector Row */}
      <Box
        className="mb-1 flex justify-between overflow-x-auto rounded-full bg-neutral-98 p-1"
        sx={{
          borderRadius: '9999px',
        }}
      >
        {Object.entries(days).map(([key, day]) => (
          <Box
            key={key}
            className={`flex cursor-pointer items-center justify-center rounded-full px-4 py-2 font-medium transition-colors ${
              Number(key) === selectedDay ? 'bg-primary-90' : ''
            }`}
            onClick={() => onChangeDayOfWeek(Number(key))}
          >
            {day.title}
          </Box>
        ))}
      </Box>

      {/* Message below the day selector */}
      <Typography
        className="mt-3 text-center"
        sx={{
          color: numberOfTimeSlots > 0 ? '#38AA16' : '#e83e8c',
          fontSize: '1.1rem',
        }}
      >
        {numberOfTimeSlots > 0
          ? `Amazing!!! You can meet ${numberOfTimeSlots} Libers every ${days[selectedDay].name}! 💚`
          : days[selectedDay].text}
      </Typography>
    </Box>
  );
}
