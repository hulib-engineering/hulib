'use client';

import type { FC } from 'react';
import { useRef, useState } from 'react';
import { PortalSessionCard } from '@/components/schedule/sessionCard/PortalSessionCard';
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

  const handleJoinNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (readingSession?.sessionUrl) {
      window.open(readingSession.sessionUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: navigate to meeting page
      window.location.href = `/meeting/${sessionId}`;
    }
  };

  const handleClosePortal = () => {
    setShowPortalCard(false);
  };

  const handleExploreStories = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '/explore-story';
  };

  const handleSeeRejectedStory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (sessionId) {
      window.location.href = `/story/${sessionId}`;
    } else {
      window.location.href = '/profile';
    }
  };

  const handleShareReason = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to feedback page for meeting absence
    window.location.href = '/feedback/meeting-absence';
  };

  // Render actions based on notification type
  switch (notificationType) {
    case NOTIFICATION_TYPES.SESSION_REQUEST.name:
      return (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            className="hover:bg-gray-50 flex-1 rounded-[100px] border border-neutral-variant-80 !bg-white px-3 py-2 text-center text-sm text-primary-50 transition-colors disabled:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReject();
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Reject'}
          </button>
          <button
            type="button"
            className="flex-1 rounded-[100px] bg-primary-50 px-3 py-2 text-center text-sm text-white transition-colors hover:bg-primary-60 disabled:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAccept();
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Accept'}
          </button>
        </div>
      );

    case NOTIFICATION_TYPES.REJECTED_MEETING.name:
      return (
        <div className="mt-3">
          <button
            type="button"
            className="w-full rounded-full bg-primary-50 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-primary-60 disabled:opacity-50"
            onClick={handleExploreStories}
            disabled={isLoading}
          >
            Explore other stories
          </button>
        </div>
      );

    case NOTIFICATION_TYPES.REJECTED_HUBER.name:
    case NOTIFICATION_TYPES.REJECTED_STORY.name:
      return (
        <div className="mt-3">
          <button
            type="button"
            className="w-full rounded-full bg-primary-50 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-primary-60 disabled:opacity-50"
            onClick={handleSeeRejectedStory}
            disabled={isLoading}
          >
            See the rejected story
          </button>
        </div>
      );

    case NOTIFICATION_TYPES.NOT_ATTENDED.name:
      return (
        <div className="mt-3">
          <button
            type="button"
            className="w-full rounded-full bg-primary-50 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-primary-60 disabled:opacity-50"
            onClick={handleShareReason}
            disabled={isLoading}
          >
            Share the reason
          </button>
        </div>
      );

    case NOTIFICATION_TYPES.OTHER.name:
      return (
        <>
          <div className="mt-2 flex gap-2">
            <button
              ref={cancelButtonRef}
              type="button"
              className=" flex-1 rounded-[100px] border border-neutral-variant-80 !bg-white px-3 py-2 text-center text-sm text-primary-50 transition-colors disabled:opacity-50"
              onClick={handleCancelRequest}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 rounded-[100px] bg-primary-50 px-3 py-2 text-center text-sm text-white transition-colors hover:bg-primary-60 disabled:opacity-50"
              onClick={handleJoinNow}
              disabled={isLoading}
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

    // No actions needed for these types
    case NOTIFICATION_TYPES.ACCEPTED_MEETING.name:
    case NOTIFICATION_TYPES.CANCELED_MEETING.name:
    case NOTIFICATION_TYPES.REVIEW_STORY.name:
    case NOTIFICATION_TYPES.PUBLISH_STORY.name:
    case NOTIFICATION_TYPES.ACCOUNT.name:
    default:
      return null;
  }
};

export default NotificationActions;
