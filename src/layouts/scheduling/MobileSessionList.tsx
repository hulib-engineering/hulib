'use client';

import { Globe } from '@phosphor-icons/react';
import {
  endOfDay,
  isAfter,
  isSameDay,
} from 'date-fns';
import { useTranslations } from 'next-intl';
import type { FC, ReactNode } from 'react';
import React, { useMemo, useState } from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import SessionDetailCard from '@/layouts/scheduling/SessionDetailCard';
import { useAppSelector } from '@/libs/hooks';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';
import { CURRENT_TZ, formatTimezone } from '@/utils/dateUtils';

type TabType = 'all' | 'liber' | 'huber' | 'waiting';
type TabConfig = {
  key: TabType;
  label: string;
  count: number;
};
type ITabsProps = {
  tabs: TabConfig[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

const Tabs: FC<ITabsProps> = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex items-center justify-between rounded-full bg-neutral-98 p-0.5">
    {tabs.map(tab => (
      <button
        key={tab.key}
        type="button"
        className={mergeClassnames(
          'flex-1 rounded-full px-4 py-2 text-sm leading-4 font-medium transition-colors',
          activeTab === tab.key ? 'bg-primary-90 text-primary-50' : 'text-neutral-10',
        )}
        onClick={() => onTabChange(tab.key)}
      >
        {tab.label}
        {' '}
        (
        {tab.count}
        )
      </button>
    ))}
  </div>
);

const categorizeSessions = (sessions: ReadingSession[]): CategorizedSessions => {
  const now = new Date();
  const todayEnd = endOfDay(now);

  const meetingsToday = sessions.filter((session) => {
    const sessionDate = new Date(session.startedAt);
    return (
      isSameDay(sessionDate, now)
      && (session.sessionStatus === StatusEnum.Approved
        || session.sessionStatus === StatusEnum.Pending)
    );
  });

  const nextMeetings = sessions.filter((session) => {
    const sessionDate = new Date(session.startedAt);
    return (
      isAfter(sessionDate, todayEnd)
      && (session.sessionStatus === StatusEnum.Approved
        || session.sessionStatus === StatusEnum.Pending)
    );
  });

  const doneMeetings = sessions.filter((session) => {
    return session.sessionStatus === StatusEnum.Finished;
  });

  const missedMeetings = sessions.filter((session) => {
    return session.sessionStatus === StatusEnum.Missed;
  });

  return {
    meetingsToday,
    nextMeetings,
    doneMeetings,
    missedMeetings,
  };
};
const filterSessionsByTab = (
  sessions: ReadingSession[],
  activeTab: TabType,
  userId: string | undefined,
): ReadingSession[] => {
  if (!sessions || !Array.isArray(sessions)) {
    return [];
  }

  return sessions.filter((session) => {
    const isCurrentUserReader = Number(userId) === Number(session?.reader?.id);

    switch (activeTab) {
      case 'liber':
        return isCurrentUserReader;
      case 'huber':
        return !isCurrentUserReader;
      case 'waiting':
        return session.sessionStatus === StatusEnum.Pending;
      case 'all':
      default:
        return true;
    }
  });
};
const getTabCount = (
  sessions: ReadingSession[],
  tabType: TabType,
  userId: string | undefined,
): number => {
  const now = new Date();
  const todayEnd = endOfDay(now);

  // Get only next meetings (future meetings)
  const nextMeetingsOnly = sessions.filter((session: ReadingSession) => {
    const sessionDate = new Date(session.startedAt);
    return (
      isAfter(sessionDate, todayEnd)
      && (session.sessionStatus === StatusEnum.Approved
        || session.sessionStatus === StatusEnum.Pending)
    );
  });

  return filterSessionsByTab(nextMeetingsOnly, tabType, userId).length;
};

type CategorizedSessions = {
  meetingsToday: ReadingSession[];
  nextMeetings: ReadingSession[];
  doneMeetings: ReadingSession[];
  missedMeetings: ReadingSession[];
};
type SessionSectionProps = {
  title: string;
  type: 'done' | 'undone' | 'incoming';
  children?: ReactNode;
};

const SessionSection: FC<SessionSectionProps> = ({
  title,
  children,
}) => (
  <div className="flex flex-col gap-2 bg-white px-4 py-5 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium text-[#03191C]">{title}</h3>
      <div className="flex items-center gap-1.5 rounded-full py-1.5 text-sm font-medium leading-4 text-blue-50">
        <Globe weight="bold" />
        {formatTimezone(CURRENT_TZ)}
      </div>
    </div>

    {children}
  </div>
);

const LoadingState = () => (
  <div className="flex h-full items-center justify-center">
    <div className="text-gray-500">Loading...</div>
  </div>
);

// Main component
export default function MobileSessionList() {
  const t = useTranslations('Schedule');

  // User info
  const userId = useAppSelector(state => state.auth.userInfo?.id);

  const { data: readingSessions, isLoading } = useGetReadingSessionsQuery({});

  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Memoized calculations
  const categorizedSessions = useMemo(() => {
    return categorizeSessions(readingSessions || []);
  }, [readingSessions]);
  const filteredNextMeetings = useMemo(() => {
    return filterSessionsByTab(categorizedSessions.nextMeetings, activeTab, userId);
  }, [categorizedSessions.nextMeetings, activeTab, userId]);
  const tabs: TabConfig[] = useMemo(() => [
    { key: 'all', label: t('tabs_all'), count: getTabCount(readingSessions || [], 'all', userId) },
    { key: 'liber', label: 'Liber', count: getTabCount(readingSessions || [], 'liber', userId) },
    { key: 'huber', label: 'Huber', count: getTabCount(readingSessions || [], 'huber', userId) },
    { key: 'waiting', label: t('waiting'), count: getTabCount(readingSessions || [], 'waiting', userId) },
  ], [readingSessions, userId, t]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      {/* Meetings Today */}
      {categorizedSessions.meetingsToday.length > 0 && (
        <SessionSection
          title={t('meeting_status.meetings_today')}
          type="incoming"
        >
          <div className="flex flex-col gap-4">
            {categorizedSessions.meetingsToday.map(session => (
              <SessionDetailCard
                key={session.id}
                session={session}
              />
            ))}
          </div>
        </SessionSection>
      )}

      {/* Next Meetings with Tabs */}
      {categorizedSessions.nextMeetings.length > 0 && (
        <SessionSection
          title={t('meeting_status.next_meetings')}
          type="undone"
        >
          <div className="flex flex-col gap-4">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {filteredNextMeetings.length > 0
            && (
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
                {filteredNextMeetings.map(session => (
                  <SessionDetailCard
                    key={session.id}
                    session={session}
                  />
                ))}
              </div>
            )}
          </div>
        </SessionSection>
      )}

      {/* Done Meetings */}
      {categorizedSessions.doneMeetings.length > 0
      && (
        <SessionSection
          title={t('meeting_status.done_meetings')}
          type="done"
        >
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            {categorizedSessions.doneMeetings.map(session => (
              <SessionDetailCard
                key={session.id}
                session={session}
              />
            ))}
          </div>
        </SessionSection>
      )}
    </>
  );
}
