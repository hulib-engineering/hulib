import React from 'react';

import { mergeClassnames } from '@/components/private/utils';

type IStatusBadgeProps = {
  onLine: boolean;
  className?: string;
};

const StatusBadge = ({ onLine, className }: IStatusBadgeProps) => (
  <div
    className={mergeClassnames(
      'flex size-4 items-center justify-center rounded-full ',
      onLine ? 'bg-neutral-90' : 'bg-neutral-80',
      className,
    )}
  >
    <div className="flex size-3.5 items-center justify-center rounded-full bg-white">
      <div
        className={mergeClassnames(
          'rounded-full size-3',
          onLine ? 'bg-green-60' : 'bg-[#D9D9D9]',
        )}
      />
    </div>
  </div>
);

export default StatusBadge;
