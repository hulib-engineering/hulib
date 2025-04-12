'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  dayOfWeek: any;
}

const days = {
  0: {
    title: 'MON',
    text: 'Hey, are you really that busy on Monday? 😊',
  },
  1: {
    title: 'TUE',
    text: 'Is setting aside just 30 minutes really that hard? 😢',
  },
  2: {
    title: 'WED',
    text: 'Come on, is 30 minutes that tough to spare? 😢',
  },
  3: {
    title: 'THU',
    text: 'Is setting aside just 30 minutes really that hard? 😢',
  },
  4: {
    title: 'FRI',
    text: 'Come on, is 30 minutes that tough to spare? 😢',
  },
  5: {
    title: 'SAT',
    text: 'Hey, are you really that busy on Saturday? �',
  },
  6: {
    title: 'SUN',
    text: "Wait, you're working on Sunday too? 😆",
  },
};

export default function HeadSlots({ dayOfWeek = 0 }: Props) {
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
            className={`flex items-center justify-center rounded-full px-4 py-2 font-medium transition-colors ${
              Number(key) === selectedDay ? 'bg-primary-90' : ''
            }`}
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
