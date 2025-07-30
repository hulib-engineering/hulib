'use client';

import type { FC } from 'react';
import { useRef, useState } from 'react';

import { PortalSessionCard } from '@/components/schedule/components/sessionCard/PortalSessionCard';
import { NOTIFICATION_TYPES } from '@/libs/services/modules/notifications/notificationType';
import { useGetReadingSessionByIdQuery } from '@/libs/services/modules/reading-session';

type NotificationActionsProps = {
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
  notificationType?: string;
  sessionId?: number;
};

const NotificationActions: FC<NotificationActionsProps> = ({
  onAccept,
  onReject,
  isLoading = false,
  notificationType,
  sessionId,
}) => {
  const [showPortalCard, setShowPortalCard] = useState(false);
  const [portalPosition, setPortalPosition] = useState({ top: 0, left: 0 });
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const shouldFetchReadingSession
    = notificationType === NOTIFICATION_TYPES.OTHER.name && sessionId;

  const { data: readingSession } = useGetReadingSessionByIdQuery(
    {
      id: sessionId || 0,
    },
    {
      skip: !shouldFetchReadingSession,
    },
  );

  const handleCancelRequest = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (cancelButtonRef.current) {
      const rect = cancelButtonRef.current.getBoundingClientRect();
      setPortalPosition({
        top: rect.bottom + 10,
        left: rect.left,
      });
    }
    setShowPortalCard(true);
  };

  const handleJoinNow = () => {
    window.open(readingSession.sessionUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClosePortal = () => {
    setShowPortalCard(false);
  };

  if (notificationType === 'other') {
    return (
      <>
        <div className="mt-2 flex gap-2">
          <button
            ref={cancelButtonRef}
            type="button"
            className="flex-1 rounded-[100px] border border-neutral-variant-80 !bg-white px-3 py-2 text-center text-sm text-primary-50"
            onClick={handleCancelRequest}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 rounded-[100px] bg-primary-50 px-3 py-2 text-center text-sm text-white"
            onClick={handleJoinNow}
          >
            Join Now
          </button>
        </div>

        {showPortalCard && readingSession && (
          <PortalSessionCard
            session={readingSession}
            expanded
            position={portalPosition}
            onClose={handleClosePortal}
            showCancelDialogProp
          />
        )}
      </>
    );
  }

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
