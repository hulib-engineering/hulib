import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useUpdateStatusReadingSessionMutation } from '@/libs/services/modules/reading-session';
import type { StatusType } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';

interface SessionActionsProps {
  sessionId: string;
  status: string;
  isVibing: boolean;
  onStatusChange?: (newStatus: StatusType) => void;
}

export const SessionActions: React.FC<SessionActionsProps> = ({
  sessionId,
  status,
  isVibing,
  onStatusChange,
}) => {
  const [updateStatus, { isLoading }] = useUpdateStatusReadingSessionMutation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const t = useTranslations('Meeting');
  const defaultCancelReason = t('cancel_meeting');
  const [cancelReason, setCancelReason] = useState(defaultCancelReason);

  const handleStatusChange = async (newStatus: StatusType, reason?: string) => {
    try {
      const payload: any = {
        id: sessionId,
        sessionStatus: newStatus,
      };

      if (newStatus === StatusEnum.Canceled) {
        const finalReason = reason || defaultCancelReason;
        payload.note = finalReason;
      }

      await updateStatus(payload).unwrap();

      if (onStatusChange) {
        onStatusChange(newStatus);
      }
      pushSuccess('Status updated successfully!');

      if (newStatus === StatusEnum.Canceled) {
        setShowCancelDialog(false);
        setCancelReason(defaultCancelReason);
      }
    } catch (error) {
      pushError('Failed to update status. Please try again.');
    }
  };
  const handleCancelRequest = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    const reasonToSend = cancelReason.trim() || defaultCancelReason;
    handleStatusChange(StatusEnum.Canceled, reasonToSend);
  };

  const handleCancelAbort = () => {
    setShowCancelDialog(false);
    setCancelReason(defaultCancelReason);
  };

  const renderCancelDialog = () => {
    return (
      <div>
        <div className="mb-3">
          <label
            htmlFor="cancelReason"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Reason:
            <textarea
              id="cancelReason"
              name="cancelReason"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
              placeholder={defaultCancelReason}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </label>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-[100px] border border-gray-100 px-5 py-2 text-sm font-medium text-blue-700 hover:bg-gray-200"
            onClick={handleCancelAbort}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 rounded-[100px] bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={handleCancelConfirm}
            disabled={isLoading}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  };

  const renderActionButtons = () => {
    if (showCancelDialog) {
      return renderCancelDialog();
    }

    if (status === StatusEnum.Pending && isVibing === false) {
      return (
        <div className="flex w-full gap-3">
          <button
            type="button"
            className="flex-1 rounded-[100px] border border-gray-100 px-5 py-2 text-sm font-medium text-blue-700 hover:bg-gray-200"
            onClick={() => handleStatusChange(StatusEnum.Rejected)}
            disabled={isLoading}
          >
            Reject
          </button>
          <button
            type="button"
            className="flex-1 rounded-[100px] bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => handleStatusChange(StatusEnum.Approved)}
            disabled={isLoading}
          >
            Accept
          </button>
        </div>
      );
    }
    if (status === StatusEnum.Finished && isVibing === true) {
      return (
        <button
          type="button"
          className="w-full rounded-[100px] bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Feedback
        </button>
      );
    }
    if (status === StatusEnum.Finished && isVibing === false) {
      return null;
    }
    return (
      <button
        type="button"
        className="w-full rounded-[100px] bg-[#FFC9D5] px-5 py-2 text-sm font-medium text-[#EE0038]"
        onClick={handleCancelRequest}
        disabled={isLoading}
      >
        Cancel
      </button>
    );
  };

  return <div className="mt-4">{renderActionButtons()}</div>;
};
