import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import Button from '@/components/button/Button';

// Props for the modal component
type ModalApprovalHuberProps = {
  userImage?: string; // URL for the user's profile image
  userName?: string;
  userRole?: string;
  onConfirm?: (reason?: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  type: 'approve' | 'decline' | 'approve-success' | 'decline-success';
};

/**
 * ModalApprovalHuber
 * A sleek, modern modal for confirming Huber approval requests.
 * Follows Apple HIG with clean aesthetics and clear actions.
 */
const ModalApprovalHuber: React.FC<ModalApprovalHuberProps> = ({
  userImage = '/assets/images/huber/cover-huber.png',
  userName = '',
  userRole = '',
  onConfirm,
  isLoading,
  onCancel,
  type,
}) => {
  const [reason, setReason] = useState('');
  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const message = (
    value: 'approve' | 'decline' | 'approve-success' | 'decline-success',
  ) => {
    switch (value) {
      case 'approve':
        return 'You are accepting the request to become a Huber.';
      case 'decline':
        return 'You are declining the request to become a Huber.';
      case 'approve-success':
        return 'You have confirmed the request to become a Huber.';
      case 'decline-success':
        return 'You declined the request to become a Huber..';
      default:
        return '';
    }
  };

  return (
    // Modal overlay with blur effect
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal card container */}
      <div
        className={clsx(
          'relative flex w-full max-w-md flex-col items-center rounded-3xl bg-white px-8 pb-8 pt-4 shadow-2xl',
          type === 'decline' && 'border border-red-50',
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-approval-title"
      >
        {/* Profile section with status badge */}
        <div
          className={clsx(
            'mb-4 flex w-full flex-col items-center rounded-lg bg-neutral-98 py-4',
            (type === 'decline' || type === 'decline-success') && 'bg-red-98',
          )}
        >
          {/* Profile image container with status badge */}
          <div className="relative mb-3">
            <Image
              src={userImage}
              alt={userName}
              width={200}
              height={200}
              className="object-cover"
            />
            {/* Status badge */}
            {type === 'approve' && (
              <div className="absolute bottom-2 left-1/2 w-[164px] rounded-lg bg-orange-90 px-2 py-1 text-sm font-medium text-orange-50 -translate-x-1/2">
                Waiting for approval
              </div>
            )}

            {type === 'approve-success' && (
              <div className="absolute bottom-2 left-1/2 rounded-lg bg-green-90 px-2 py-1 text-sm font-medium text-green-30 -translate-x-1/2">
                Approved
              </div>
            )}
          </div>
          <div>
            <div
              className="mb-1 text-xl font-bold text-gray-900"
              id="modal-approval-title"
            >
              {userName}
            </div>
            <div className="text-base text-gray-500">{userRole}</div>
          </div>
        </div>

        {type === 'decline' && (
          <div className="mb-2 w-full text-center text-sm font-medium">
            {/* Reason textarea: large, rounded, subtle border, focus ring, Apple style */}
            <textarea
              className="w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-gray-800 transition placeholder:text-gray-400 focus:border-red-50 focus:ring-2 focus:ring-red-200"
              placeholder="Reason for rejection"
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={4}
            />
          </div>
        )}

        {/* Confirmation message */}
        <div
          className={clsx(
            'mb-2 text-center text-sm font-medium',
            type === 'decline' && 'text-red-70',
          )}
        >
          {message(type)}
        </div>

        {/* Action buttons */}
        {(type === 'approve' || type === 'decline') && (
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
              onClick={() => {
                if (type === 'approve') {
                  onConfirm?.();
                } else {
                  onConfirm?.(reason);
                }
              }}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Approving...' : 'Confirm'}
            </Button>
          </div>
        )}
        {(type === 'approve-success' || type === 'decline-success') && (
          <div className="w-full">
            <Link href="/admin/users">
              <Button variant="primary" className="w-full">
                Homepage
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalApprovalHuber;
