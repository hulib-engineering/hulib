'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import {
  addDays,
  differenceInWeeks,
  endOfDay,
  format,
  isAfter,
  isSameDay,
  isSameWeek,
  startOfWeek,
} from 'date-fns';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import { SessionCard } from '@/components/schedule/components/sessionCard/SessionCard';
import { useAppSelector } from '@/libs/hooks';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';

// Types
type TabType = 'all' | 'liber' | 'huber' | 'waiting';

type WeekRange = {
  startedAt: string;
  endedAt: string;
};

type CategorizedSessions = {
  meetingsToday: ReadingSession[];
  nextMeetings: ReadingSession[];
  doneMeetings: ReadingSession[];
};

type TabConfig = {
  key: TabType;
  label: string;
  count: number;
};

// Constants
const WEEK_STARTS_ON = 0; // Sunday
const MAX_FUTURE_WEEKS = 3;

// Custom hooks
const useWeekNavigation = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const currentWeek = startOfWeek(today, { weekStartsOn: WEEK_STARTS_ON });
  const displayedWeek = startOfWeek(currentDate, { weekStartsOn: WEEK_STARTS_ON });

  const canGoPrevious = () => {
    return !isSameWeek(displayedWeek, currentWeek, { weekStartsOn: WEEK_STARTS_ON });
  };

  const canGoNext = () => {
    const weeksFromCurrent = differenceInWeeks(displayedWeek, currentWeek);
    return weeksFromCurrent < MAX_FUTURE_WEEKS;
  };

  const handlePrevWeek = () => {
    if (canGoPrevious()) {
      setCurrentDate(addDays(currentDate, -7));
    }
  };

  const handleNextWeek = () => {
    if (canGoNext()) {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const getWeekDisplayText = (t: any) => {
    if (isSameWeek(displayedWeek, currentWeek, { weekStartsOn: WEEK_STARTS_ON })) {
      return t('this_week');
    }
    return `${format(displayedWeek, 'MMM d')} - ${format(
      addDays(displayedWeek, 6),
      'MMM d, yyyy',
    )}`;
  };

  return {
    currentDate,
    displayedWeek,
    canGoPrevious,
    canGoNext,
    handlePrevWeek,
    handleNextWeek,
    getWeekDisplayText,
  };
};

// Utility functions
const getCurrentWeekRange = (date: Date): WeekRange => {
  const weekStart = startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });
  const startOfWeekDate = new Date(weekStart);
  startOfWeekDate.setHours(0, 0, 0, 0);

  const endOfWeekDate = new Date(weekStart);
  endOfWeekDate.setDate(weekStart.getDate() + 6);
  endOfWeekDate.setHours(23, 59, 59, 999);

  return {
    startedAt: startOfWeekDate.toISOString(),
    endedAt: endOfWeekDate.toISOString(),
  };
};

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

  return {
    meetingsToday,
    nextMeetings,
    doneMeetings,
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

// Sub-components
type WeekNavigationProps = {
  displayText: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;
};

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  displayText,
  canGoPrevious,
  canGoNext,
  onPrevWeek,
  onNextWeek,
}) => (
  <div className="sticky top-0 z-10 bg-white shadow-sm">
    <div className="flex items-center justify-between px-4 py-3">
      <button
        type="button"
        onClick={onPrevWeek}
        disabled={!canGoPrevious}
        className={`${
          !canGoPrevious
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-gray-100'
        } rounded-full p-2 transition-colors`}
      >
        <CaretLeft className="size-5 text-gray-600" />
      </button>

      <h1 className="text-lg font-semibold text-gray-900">
        {displayText}
      </h1>

      <button
        type="button"
        onClick={onNextWeek}
        disabled={!canGoNext}
        className={`${
          !canGoNext
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-gray-100'
        } rounded-full p-2 transition-colors`}
      >
        <CaretRight className="size-5 text-gray-600" />
      </button>
    </div>
  </div>
);

type TabsProps = {
  tabs: TabConfig[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => (
  <div className="mb-4">
    <div className="flex rounded-full bg-neutral-98 p-1">
      {tabs.map(tab => (
        <button
          type="button"
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 rounded-full px-2 py-1 text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? 'bg-primary-90 text-primary-40 shadow-sm'
              : 'text-neutral-10'
          }`}
        >
          {tab.label}
          {' '}
          (
          {tab.count}
          )
        </button>
      ))}
    </div>
  </div>
);

type SessionSectionProps = {
  title: string;
  sessions: ReadingSession[];
  isDone?: boolean;
  isMeetingToday?: boolean;
  children?: React.ReactNode;
};

const SessionSection: React.FC<SessionSectionProps> = ({
  title,
  sessions,
  isDone = false,
  isMeetingToday = false,
  children,
}) => {
  if (sessions.length === 0 && !children) {
    return null;
  }

  return (
    <div className="-mx-4 mb-6 bg-[#FFFFFF] p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isDone && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Done
          </span>
        )}
      </div>

      {children}

      {sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              isMobile
              isMeetingToday={isMeetingToday}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type EmptyStateProps = {
  message: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="flex h-20 items-center justify-center">
    <div className="text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="text-gray-500">Loading...</div>
  </div>
);

// Main component
export default function MobileSchedule() {
  const t = useTranslations('Schedule');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // User info
  const userId = useAppSelector(state => state.auth.userInfo?.id);

  // Week navigation
  const {
    currentDate,
    canGoPrevious,
    canGoNext,
    handlePrevWeek,
    handleNextWeek,
    getWeekDisplayText,
  } = useWeekNavigation();

  // API call
  const { startedAt, endedAt } = getCurrentWeekRange(currentDate);
  const { data: readingSessions, isLoading } = useGetReadingSessionsQuery({
    startedAt,
    endedAt,
  });

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

  const hasAnyMeetings = useMemo(() => {
    return (
      categorizedSessions.meetingsToday.length > 0
      || categorizedSessions.nextMeetings.length > 0
      || categorizedSessions.doneMeetings.length > 0
    );
  }, [categorizedSessions]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header with week navigation */}
      <WeekNavigation
        displayText={getWeekDisplayText(t)}
        canGoPrevious={canGoPrevious()}
        canGoNext={canGoNext()}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />

      {/* Content */}
      <div className="">
        {/* Meetings Today */}
        <SessionSection
          title={t('meeting_status.meetings_today')}
          sessions={categorizedSessions.meetingsToday}
          isMeetingToday
        />

        {/* Next Meetings with Tabs */}
        <SessionSection
          title={t('meeting_status.next_meetings')}
          sessions={filteredNextMeetings}
        >
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {filteredNextMeetings.length === 0 && (
            <EmptyState message={t('no_meetings.noMeetingsFound')} />
          )}
        </SessionSection>

        {/* Done Meetings */}
        <SessionSection
          title={t('meeting_status.done_meetings')}
          sessions={categorizedSessions.doneMeetings}
          isDone
        />

        {/* Global Empty state */}
        {!hasAnyMeetings && (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">
                {t('no_meetings.noMeetingsFound')}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="h-20" />
    </div>
  );
}
