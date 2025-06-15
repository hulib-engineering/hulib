import Image from 'next/image';
import React, { useState } from 'react';

import Button from '@/components/button/Button';

// Props for the modal component
interface ModalBanningActionProps {
  userImage?: string; // URL for the user's profile image
  userName?: string;
  userRole?: string;
  onConfirm?: (reason: string) => void;
  onCancel?: () => void;
}

/**
 * ModalbanningAction
 * Renders a banning modal for sending a banning to a user account.
 * Apple HIG-inspired, modern, minimal, and accessible.
 */
const ModalBanningAction: React.FC<ModalBanningActionProps> = ({
  userImage = '',
  userName = '',
  userRole = '',
  onConfirm,
  onCancel,
}) => {
  // State for the banning reason textarea
  const [reason, setReason] = useState('');

  // Handle confirm button click
  const handleConfirm = () => {
    if (onConfirm) onConfirm(reason);
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    // Modal overlay: covers the screen, centers modal, adds subtle dark background
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Card container: white, thick red border, rounded corners, shadow, max width, padding */}
      <div
        className="relative flex w-full max-w-md flex-col items-center rounded-3xl border-4 border-red-50 bg-white px-8 pb-8 pt-4 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-banning-title"
      >
        {/* Profile section: avatar, name, role, centered, with red-tint background */}
        <div className="mb-4 flex w-full flex-col items-center rounded-2xl bg-red-98 py-4">
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
              id="modal-banning-title"
            >
              {userName}
            </div>
            <div className="text-base text-gray-500">{userRole}</div>
          </div>
        </div>
        {/* Reason textarea: large, rounded, subtle border, focus ring, Apple style */}
        <textarea
          className="mb-4 w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-gray-800 transition placeholder:text-gray-400 focus:border-red-50 focus:ring-2 focus:ring-red-200"
          placeholder="Reason for banning"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />
        {/* Subtle banning text: muted red, centered, margin for separation */}
        <div className="mb-6 text-center text-sm font-medium text-red-70">
          Are you sure you want to ban this account?
        </div>
        {/* Action buttons: row, full width, spacing, Apple HIG style */}
        <div className="flex w-full justify-between gap-2">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} className="flex-1">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalBanningAction;
