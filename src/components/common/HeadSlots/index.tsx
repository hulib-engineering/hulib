'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  dayOfWeek: any;
  onChangeDayOfWeek: Function;
}

const days = {
  0: {
    title: 'SUN',
    text: "Wait, you're working on Sunday too? 😆",
  },
  1: {
    title: 'MON',
    text: 'Hey, are you really that busy on Monday? 😊',
  },
  2: {
    title: 'TUE',
    text: 'Is setting aside just 30 minutes really that hard? 😢',
  },
  3: {
    title: 'WED',
    text: 'Come on, is 30 minutes that tough to spare? 😢',
  },
  4: {
    title: 'THU',
    text: 'Is setting aside just 30 minutes really that hard? 😢',
  },
  5: {
    title: 'FRI',
    text: 'Come on, is 30 minutes that tough to spare? 😢',
  },
  6: {
    title: 'SAT',
    text: 'Hey, are you really that busy on Saturday? 🤔',
  },
};

export default function HeadSlots({ dayOfWeek = 0, onChangeDayOfWeek }: Props) {
  const [selectedDay, setSelectedDay] = useState<keyof typeof days>(dayOfWeek);

  useEffect(() => {
    setSelectedDay(dayOfWeek);
  }, [dayOfWeek]);

  return (
    <Box className="mt-4">
      {/* Day Selector Row */}
      <Box
        className="mb-1 flex justify-between rounded-full bg-neutral-98 p-1"
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
        sx={{ color: '#e83e8c', fontSize: '1.1rem' }}
      >
        {days[selectedDay].text || ''}
      </Typography>
    </Box>
  );
}
