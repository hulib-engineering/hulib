'use client';

import { Box, Typography } from '@mui/material';

interface Props {
  selectedDay: string;
  onClickDay: any;
}

export default function HeadSlots({ selectedDay = 'MON', onClickDay }: Props) {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const textBySelectedDay = {
    MON: 'Hey, are you really that busy on Monday? 😊',
    TUE: 'Is setting aside just 30 minutes really that hard? 😢',
    WED: 'Come on, is 30 minutes that tough to spare? 😢',
    THU: 'Is setting aside just 30 minutes really that hard? 😢',
    FRI: 'Come on, is 30 minutes that tough to spare? 😢',
    SAT: 'Hey, are you really that busy on Saturday? 😀',
    SUN: "Wait, you're working on Sunday too? 😆",
  };

  return (
    <Box className="mt-4">
      {/* Day Selector Row */}
      <Box
        className="mb-1 flex justify-between rounded-full bg-neutral-98 p-1"
        sx={{
          borderRadius: '9999px',
        }}
      >
        {days.map((day) => (
          <Box
            key={day}
            className={`flex cursor-pointer items-center justify-center rounded-full px-4 py-2 font-medium transition-colors ${
              day === selectedDay ? 'bg-primary-90' : ''
            }`}
            onClick={() => onClickDay(day)}
          >
            {day}
          </Box>
        ))}
      </Box>

      {/* Message below the day selector */}
      <Typography
        className="mt-3 text-center"
        sx={{ color: '#e83e8c', fontSize: '1.1rem' }}
      >
        {textBySelectedDay[selectedDay as keyof typeof textBySelectedDay]}
      </Typography>
    </Box>
  );
}
