import React from 'react';

import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useUpdateStatusReadingSessionMutation } from '@/libs/services/modules/reading-session';
import type { StatusType } from '@/libs/services/modules/reading-session/createNewReadingSession';

interface SessionActionsProps {
  sessionId: string;
  status: string;
  isVibing?: boolean;
  onStatusChange?: (newStatus: StatusType) => void;
}

export const SessionActions: React.FC<SessionActionsProps> = ({
  sessionId,
  status,
  isVibing,
  onStatusChange,
}) => {
  const [updateStatus, { isLoading }] = useUpdateStatusReadingSessionMutation();

  const handleStatusChange = async (newStatus: StatusType) => {
    try {
      await updateStatus({
        id: sessionId,
        sessionStatus: newStatus,
      }).unwrap();

      if (onStatusChange) {
        onStatusChange(newStatus);
      }

      pushSuccess('Status updated successfully!');
    } catch (error) {
      pushError('Failed to update status. Please try again.');
    }
  };

  const renderActionButtons = () => {
    if (status === 'pending' && isVibing === false) {
      return (
        <div className="flex w-full gap-3">
          <button
            type="button"
            className="flex-1 rounded-[100px] bg-gray-100 px-4 py-1 text-sm font-medium text-blue-700 hover:bg-gray-200"
            onClick={() => handleStatusChange('rejected')}
            disabled={isLoading}
          >
            Reject
          </button>
          <button
            type="button"
            className="flex-1 rounded-[100px] bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => handleStatusChange('approved')}
            disabled={isLoading}
          >
            Accept
          </button>
        </div>
      );
    }

    if (status === 'finished' && isVibing === true) {
      return (
        <button
          type="button"
          className="w-full rounded-[100px] bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700"
        >
          Feedback
        </button>
      );
    }

    if (status === 'finished' && isVibing === false) {
      return null;
    }

    return (
      <button
        type="button"
        className="w-full rounded-[100px] bg-[#FFC9D5] px-4 py-1 text-sm font-medium text-[#EE0038]"
        onClick={() => handleStatusChange('canceled')}
        disabled={isLoading}
      >
        Cancel
      </button>
    );
  };

  return <div className="mt-4">{renderActionButtons()}</div>;
};
