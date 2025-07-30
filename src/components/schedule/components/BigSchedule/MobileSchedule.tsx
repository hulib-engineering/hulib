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
import React, { useState } from 'react';

import { SessionCard } from '@/components/schedule/components/sessionCard/SessionCard';
import { useAppSelector } from '@/libs/hooks';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';

type TabType = 'all' | 'liber' | 'huber' | 'waiting';

export default function MobileSchedule() {
  const t = useTranslations('Schedule');
  // const locale = useLocale();

  // Navigation state
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const currentWeek = startOfWeek(today, { weekStartsOn: 0 });
  const displayedWeek = startOfWeek(currentDate, { weekStartsOn: 0 });

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // User info
  const userId = useAppSelector(state => state.auth.userInfo?.id);

  // Get week range for API
  const getCurrentWeekRange = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
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

  const { startedAt, endedAt } = getCurrentWeekRange(currentDate);
  const { data: readingSessions, isLoading } = useGetReadingSessionsQuery({
    startedAt,
    endedAt,
  });

  // Navigation functions
  const canGoPrevious = () => {
    return !isSameWeek(displayedWeek, currentWeek, { weekStartsOn: 0 });
  };

  const canGoNext = () => {
    const weeksFromCurrent = differenceInWeeks(displayedWeek, currentWeek);
    return weeksFromCurrent < 3;
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

  const getWeekDisplayText = () => {
    if (isSameWeek(displayedWeek, currentWeek, { weekStartsOn: 0 })) {
      return t('this_week');
    }
    return `${format(displayedWeek, 'MMM d')} - ${format(
      addDays(displayedWeek, 6),
      'MMM d, yyyy',
    )}`;
  };

  // Filter sessions by tab
  const getFilteredSessions = (sessions: ReadingSession[]) => {
    if (!sessions || !Array.isArray(sessions)) {
      return [];
    }

    return sessions.filter((session) => {
      const isVibing = Number(userId) === Number(session?.reader?.id);

      switch (activeTab) {
        case 'liber':
          return isVibing;
        case 'huber':
          return !isVibing;
        case 'waiting':
          return session.sessionStatus === StatusEnum.Pending;
        case 'all':
        default:
          return true;
      }
    });
  };

  // Categorize sessions
  const categorizeSessions = (sessions: ReadingSession[]) => {
    const now = new Date();
    // const todayStart = startOfDay(now);
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

  const filteredSessions = getFilteredSessions(readingSessions || []);
  const { meetingsToday, nextMeetings, doneMeetings }
    = categorizeSessions(filteredSessions);

  // Count for tabs
  const getTabCount = (tabType: TabType) => {
    const sessions = getFilteredSessions(readingSessions || []);
    const activeSessions = sessions.filter(
      session =>
        session.sessionStatus === StatusEnum.Approved
        || session.sessionStatus === StatusEnum.Pending,
    );

    switch (tabType) {
      case 'liber':
        return activeSessions.filter(
          session => Number(userId) === Number(session?.reader?.id),
        ).length;
      case 'huber':
        return activeSessions.filter(
          session => Number(userId) !== Number(session?.reader?.id),
        ).length;
      case 'waiting':
        return sessions.filter(
          session => session.sessionStatus === StatusEnum.Pending,
        ).length;
      case 'all':
      default:
        return activeSessions.length;
    }
  };

  const tabs = [
    { key: 'all', label: t('tabs_all'), count: getTabCount('all') },
    { key: 'liber', label: 'Liber', count: getTabCount('liber') },
    { key: 'huber', label: 'Huber', count: getTabCount('huber') },
    { key: 'waiting', label: t('waiting'), count: getTabCount('waiting') },
  ] as const;

  const renderSessionSection = (
    title: string,
    sessions: ReadingSession[],
    isDone = false,
    isMeetingToday = false,
  ) => {
    if (sessions.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {isDone && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              Done
            </span>
          )}
        </div>
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
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header with week navigation */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={handlePrevWeek}
            disabled={!canGoPrevious()}
            className={`${
              !canGoPrevious()
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-100'
            } rounded-full p-2 transition-colors`}
          >
            <CaretLeft className="size-5 text-gray-600" />
          </button>

          <h1 className="text-lg font-semibold text-gray-900">
            {getWeekDisplayText()}
          </h1>

          <button
            type="button"
            onClick={handleNextWeek}
            disabled={!canGoNext()}
            className={`${
              !canGoNext()
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-100'
            } rounded-full p-2 transition-colors`}
          >
            <CaretRight className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              type="button"
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
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

      {/* Content */}
      <div className="p-4">
        {/* Meetings Today */}
        {renderSessionSection(
          t('meeting_status.meetings_today'),
          meetingsToday,
          false,
          true,
        )}

        {/* Next Meetings */}
        {renderSessionSection(t('meeting_status.next_meetings'), nextMeetings)}

        {/* Done Meetings */}
        {renderSessionSection(
          t('meeting_status.done_meetings'),
          doneMeetings,
          true,
        )}

        {/* Empty state */}
        {meetingsToday.length === 0
        && nextMeetings.length === 0
        && doneMeetings.length === 0 && (
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
