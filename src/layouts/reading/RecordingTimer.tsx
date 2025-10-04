'use client';

import * as React from 'react';
import { Record } from '@phosphor-icons/react';

import { useEffect, useState } from 'react';
import { mergeClassnames } from '@/components/core/private/utils';
import { Chip } from '@/components/common/chip/Chip';

export default function RecordingTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // let interval: NodeJS.Timeout;
    setSeconds(0);
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (sec: number) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <Chip
      disabled
      className={mergeClassnames('rounded-full border border-primary-80 bg-primary-60 text-sm leading-4 text-neutral-98', 'opacity-100')}
    >
      <Record color="#aa2727" weight="fill" />
      <span>{formatTime(seconds)}</span>
    </Chip>
  );
}
