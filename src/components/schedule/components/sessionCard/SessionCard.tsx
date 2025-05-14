import { CaretDown, CaretUp } from '@phosphor-icons/react';
import React, { useMemo, useState } from 'react';

import { useAppSelector } from '@/libs/hooks';
import type {
  ReadingSession,
  StatusType,
} from '@/libs/services/modules/reading-session/createNewReadingSession';

import { SessionActions } from './SessionActions';
import { SessionAttendees } from './SessionAttendees';
import { SessionDateTime } from './SessionDateTime';
import { SessionStoryDescription } from './SessionStoryDescription';
import { SessionUrl } from './SessionUrl';
import { StatusBadge } from './StatusBadge';
import { UserAvatar } from './UserAvatar';

interface SessionCardProps {
  session: ReadingSession;
  expanded?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  expanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const role = useAppSelector((state) => state.auth.userInfo?.role?.name);

  const isVibing = role !== 'Huber';
  const cardTitle = isVibing ? 'Vibing with Huber' : 'Session with Liber';
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const cardBackgroundColor = isVibing
    ? 'rgba(240, 245, 255, 1)'
    : 'rgba(255, 249, 245, 1)';
  const renderStatusBadge = useMemo(() => {
    const statusMap: Record<ReadingSession['sessionStatus'], StatusType> = {
      finished: 'finished',
      canceled: 'canceled',
      unInitialized: 'pending',
      pending: 'pending',
      rejected: 'rejected',
      approved: 'approved',
    };

    const status = statusMap[session?.sessionStatus as keyof typeof statusMap];
    return status ? <StatusBadge status={status} /> : null;
  }, [session?.sessionStatus]);

  const renderCollapsedUserInfo = useMemo(
    () => (
      <div className="flex items-center">
        <UserAvatar
          user={isVibing ? session?.humanBook : session?.reader}
          role="presentation"
        />
        <div className="ml-2">
          <span
            className="mr-1 rounded-[100px] px-2 py-0.5 text-xs"
            style={{
              backgroundColor: isVibing
                ? 'rgba(205, 221, 254, 1)'
                : 'rgba(253, 243, 206, 1)',
              color: isVibing ? 'rgba(4, 66, 191, 1)' : 'rgba(219, 174, 10, 1)',
            }}
          >
            {isVibing ? 'Huber' : 'Liber'}
          </span>
          <span className="text-sm font-medium text-black">
            {isVibing
              ? session.humanBook?.fullName || 'Unnamed'
              : session.reader?.fullName || 'Unnamed'}
          </span>
        </div>
      </div>
    ),
    [isVibing, session?.humanBook, session?.reader],
  );

  return (
    <div
      className="mb-4 w-[396px] overflow-hidden rounded-2xl p-3 shadow-md"
      style={{ backgroundColor: cardBackgroundColor }}
    >
      <div
        className="flex cursor-pointer items-center justify-between "
        onClick={toggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpand();
          }
        }}
      >
        <div className="flex items-center">
          <h3 className="text-[24px] font-medium text-gray-800">{cardTitle}</h3>
        </div>
        {!isExpanded &&
          (session.sessionStatus === 'pending' ||
            session.sessionStatus === 'unInitialized') && (
            <div
              className="rounded-[100px] p-[10px] text-[14px] text-gray-500"
              style={{ backgroundColor: 'rgba(255, 227, 204, 1)' }}
            >
              waiting...
            </div>
          )}
        <div className="flex gap-2">
          {renderStatusBadge}
          {isExpanded ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </div>
      </div>
      {isExpanded && session?.sessionStatus === 'pending' && (
        <StatusBadge status="pending" isVibing={isVibing} />
      )}
      {isExpanded && (
        <div>
          <span className="text-sm text-black">From: </span>
          <span className="text-sm text-[#0858FA]">{session.story.title}</span>
        </div>
      )}
      <SessionDateTime
        startDate={session.startedAt}
        endDate={session.endedAt}
      />
      {session.sessionUrl && session.sessionStatus !== 'pending' && (
        <SessionUrl url={session.sessionUrl} />
      )}
      {isExpanded ? (
        <SessionAttendees
          humanBook={session.humanBook}
          reader={session.reader}
          isVibing={isVibing}
        />
      ) : (
        renderCollapsedUserInfo
      )}
      {isExpanded && (
        <div className="w-full pb-3">
          <SessionStoryDescription note={session.note} />
          <SessionActions
            status={session.sessionStatus}
            isVibing={isVibing}
            sessionId={session.id}
          />
        </div>
      )}
    </div>
  );
};
