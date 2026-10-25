'use client';

import { useEffect, useState } from 'react';

import { elapsedSecondsSince, formatDuration } from '../utils/formatDuration';
import { Chip } from '@/components/core/chip/Chip';

export type RecordingBadgeProps = {
  /** Epoch ms at which the recording actually started. */
  startedAt: number;
};

/**
 * The blue recording pill shown left of the meeting topic.
 *
 * The elapsed time is derived from `startedAt` on every tick rather than
 * incremented, so a re-render cannot make the counter drift. The previous
 * implementation counted from the moment the badge mounted, which meant the
 * timer disagreed with the recording whenever the component remounted.
 */
export function RecordingBadge({ startedAt }: RecordingBadgeProps) {
  const [elapsed, setElapsed] = useState(() => elapsedSecondsSince(startedAt));

  useEffect(() => {
    setElapsed(elapsedSecondsSince(startedAt));

    const interval = setInterval(() => {
      setElapsed(elapsedSecondsSince(startedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <Chip
      disabled
      aria-label="recording"
      className="h-9 gap-2 rounded-full border border-primary-80 bg-primary-60 text-sm leading-4 text-neutral-98 opacity-100"
    >
      <span className="size-2.5 rounded-full bg-[#aa2727]" />
      <span className="tabular-nums">{formatDuration(elapsed)}</span>
    </Chip>
  );
}
