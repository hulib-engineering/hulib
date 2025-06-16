'use client';

import type { FC } from 'react';

interface NotificationActionsProps {
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

const NotificationActions: FC<NotificationActionsProps> = ({
  onAccept,
  onReject,
  isLoading = false,
}) => {
  return (
    <div className="mt-2 flex gap-2">
      <button
        type="button"
        className="flex-1 rounded-[100px] border border-neutral-variant-80 !bg-white px-3 py-2 text-center text-sm text-primary-50"
        onClick={onReject}
        disabled={isLoading}
      >
        Reject
      </button>
      <button
        type="button"
        className="flex-1 rounded-[100px] bg-primary-50 px-3 py-2 text-center text-sm text-white"
        onClick={onAccept}
        disabled={isLoading}
      >
        Accept
      </button>
    </div>
  );
};

export default NotificationActions;
