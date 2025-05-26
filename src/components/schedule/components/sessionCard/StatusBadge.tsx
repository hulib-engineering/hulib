import React from 'react';

import type { StatusType } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';

interface StatusBadgeProps {
  status: StatusType;
  isVibing?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isVibing,
}) => {
  let bgColor = '';
  let displayText = '';

  if (isVibing !== undefined) {
    if (isVibing) {
      bgColor = 'bg-[rgba(255,227,204,1)] text-[rgba(255,115,1,1)]';
      displayText = 'Waiting to be approved';
    } else {
      bgColor = 'bg-[rgba(255,227,204,1)] text-[rgba(255,115,1,1)]';
      displayText = 'Waiting for approving';
    }
  } else if (status === StatusEnum.Finished) {
    bgColor = 'bg-green-100 text-green-600';
    displayText = 'Done';
  } else if (status === StatusEnum.Canceled) {
    bgColor = 'bg-red-100 text-red-600';
    displayText = 'Canceled';
  }

  return (
    <span
      className={`mb-2 inline-block rounded-full px-2 py-1 text-xs ${bgColor}`}
    >
      {displayText}
    </span>
  );
};
