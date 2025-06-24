import Image from 'next/image';
import React, { useState } from 'react';

import Button from '@/components/button/Button';
import { useUpdateUserStatusMutation } from '@/libs/services/modules/user';

// Props for the modal component
interface ModalWarningActionProps {
  userId: string; // User ID to warn
  userImage?: string; // URL for the user's profile image
  userName?: string;
  userRole?: string;
  onConfirm?: (reason: string) => void;
  onCancel?: () => void;
}

/**
 * ModalWarningAction
 * Renders a warning modal for sending a warning to a user account.
 * Apple HIG-inspired, modern, minimal, and accessible.
 */
const ModalWarningAction: React.FC<ModalWarningActionProps> = ({
  userId,
  userImage = '/assets/images/huber/cover-huber.png',
  userName = '',
  userRole = '',
  onConfirm,
  onCancel,
}) => {
  // State for the warning reason textarea
  const [reason, setReason] = useState('');

  // --- Mutation hook for updating user status (warn) ---
  const [updateUserStatus, { isLoading, error }] =
    useUpdateUserStatusMutation();

  // Handle confirm button click
  const handleConfirm = async () => {
    try {
      // Call mutation to set user status to 'under_warning'
      await updateUserStatus({
        id: userId,
        body: { status: 'under_warning' },
      }).unwrap();
      // Optionally, call onConfirm with reason for extensibility
      if (onConfirm) onConfirm(reason);
    } catch (e) {
      // Error is handled below in UI
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    // Modal overlay: covers the screen, centers modal, adds subtle dark background
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Card container: white, thick orange border, rounded corners, shadow, max width, padding */}
      <div
        className="relative flex w-full max-w-md flex-col items-center rounded-3xl border-4 border-orange-50 bg-white px-8 pb-8 pt-4 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-warning-title"
      >
        {/* Profile section: avatar, name, role, centered, with orange-tint background */}
        <div className="mb-4 flex w-full flex-col items-center rounded-2xl bg-orange-98 py-4">
          {/* Use Next.js Image for optimized avatar rendering */}
          <Image
            src={userImage}
            alt={userName}
            width={112}
            height={112}
            className="mb-3 h-28 w-28 rounded-2xl border-2 border-white object-cover shadow-md"
          />
          <div>
            <div
              className="mb-1 text-xl font-bold text-gray-900"
              id="modal-warning-title"
            >
              {userName}
            </div>
            <div className="text-base text-gray-500">{userRole}</div>
          </div>
        </div>
        {/* Reason textarea: large, rounded, subtle border, focus ring, Apple style */}
        <textarea
          className="mb-4 w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-gray-800 transition placeholder:text-gray-400 focus:border-orange-50 focus:ring-2 focus:ring-orange-50"
          placeholder="Reason for warning"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />
        {/* Subtle warning text: muted orange, centered, margin for separation */}
        <div className="mb-6 text-center text-sm font-medium text-orange-70">
          Are you sure you want to send a warning to this account?
          {/* Show error if mutation fails */}
          {error && (
            <div className="mt-2 text-xs text-red-50">
              {typeof error === 'string'
                ? error
                : 'Failed to warn user. Please try again.'}
            </div>
          )}
        </div>
        {/* Action buttons: row, full width, spacing, Apple HIG style */}
        <div className="flex w-full justify-between gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Warning...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalWarningAction;
