import { CaretDown, CaretUp } from '@phosphor-icons/react';
import React, { useMemo, useState } from 'react';

import { SessionActions } from './SessionActions';
import { SessionAttendees } from './SessionAttendees';
import { SessionDateTime } from './SessionDateTime';
import { SessionStoryDescription } from './SessionStoryDescription';
import { SessionUrl } from './SessionUrl';
import { StatusBadge } from './StatusBadge';
import { UserAvatar } from './UserAvatar';
import { ROLE_NAME, Role, StatusEnum } from '@/types/common';
import type {
  ReadingSession,
  StatusType,
} from '@/libs/services/modules/reading-session/createNewReadingSession';
import { useAppSelector } from '@/libs/hooks';

type SessionCardProps = {
  session: ReadingSession;
  expanded?: boolean;
  showCancelDialogProp?: boolean;
  isMobile?: boolean;
  isMeetingToday?: boolean;
};

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  expanded = false,
  showCancelDialogProp = false,
  isMobile = false,
  isMeetingToday = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const userId = useAppSelector(state => state.auth.userInfo?.id);

  const isVibing = Number(userId) === Number(session?.reader?.id);
  const cardTitle = isVibing ? 'Vibing with Huber' : 'Session with Liber';
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const cardBackgroundColor = isVibing
    ? 'rgba(240, 245, 255, 1)'
    : 'rgba(255, 249, 245, 1)';

  // Get border class based on isMeetingToday and isVibing
  const getBorderClass = () => {
    if (!isMeetingToday) {
      return '';
    }
    return isVibing ? 'border border-primary-60' : 'border border-yellow-98';
  };

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
            {isVibing ? ROLE_NAME[Role.HUBER] : ROLE_NAME[Role.LIBER]}
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
      className={`mb-4 overflow-hidden rounded-2xl p-3 shadow-md ${
        isMobile ? 'w-full' : 'w-[396px]'
      } ${getBorderClass()}`}
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
        {!isExpanded && session.sessionStatus === StatusEnum.Pending && (
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
      {isExpanded && session?.sessionStatus === StatusEnum.Pending && (
        <StatusBadge status={StatusEnum.Pending} isVibing={isVibing} />
      )}
      {isExpanded && (
        <div>
          <span className="text-sm text-black">From: </span>
          <span className="text-sm text-[#0858FA]">{session.story.title}</span>
        </div>
      )}
      <SessionDateTime
        date={session.startedAt}
        startDate={session.startTime}
        endDate={session.endTime}
      />
      {session.sessionUrl && session.sessionStatus !== StatusEnum.Pending && (
        <SessionUrl url={session.sessionUrl} />
      )}
      {isExpanded
        ? (
            <SessionAttendees
              humanBook={session.humanBook}
              reader={session.reader}
              isVibing={isVibing}
            />
          )
        : (
            renderCollapsedUserInfo
          )}
      {isExpanded && (
        <div className="w-full pb-3">
          <SessionStoryDescription note={session.note} />
          <SessionActions
            status={session.sessionStatus}
            isVibing={isVibing}
            sessionId={session.id}
            showCancelDialogProp={showCancelDialogProp}
          />
        </div>
      )}
    </div>
  );
};
