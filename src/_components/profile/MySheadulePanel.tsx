'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import MeetingScheduleTab from './MeetingScheduleTab';
import PersonalScheduleTab from './PersonalScheduleTab';
import { mergeClassnames } from '@/components/core/private/utils';
import { useAppSelector } from '@/libs/hooks';
import { useGetReadingSessionsQuery } from '@/libs/services/modules/reading-session';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';

type Tab = 'personal' | 'meeting';

export default function MySchedulePanel() {
  const t = useTranslations('Time_slots');
  const [activeTab, setActiveTab] = useState<Tab>('personal');

  const userId = useAppSelector(state => state.auth.userInfo?.id);
  const { data } = useGetReadingSessionsQuery({});
  const sessions: ReadingSession[] = Array.isArray(data)
    ? data
    : ((data as any)?.data ?? []);

  const invitationCount = sessions.filter(
    s => s.sessionStatus === StatusEnum.Pending && Number(userId) !== Number(s.reader?.id),
  ).length;

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white md:p-5">
      <div className="flex border-b border-neutral-90">
        {(['personal', 'meeting'] as Tab[]).map(tab => (
          <button
            key={tab}
            type="button"
            className={mergeClassnames(
              'relative flex-1 pb-3 text-sm font-medium transition-colors',
              activeTab === tab
                ? 'border-b-2 border-primary-50 text-primary-50'
                : 'text-neutral-40',
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'personal' ? t('personal_time_tab') : t('meeting_tab')}
            {tab === 'meeting' && invitationCount > 0 && (
              <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-red-50 text-[10px] font-bold text-white">
                {invitationCount > 9 ? '9+' : invitationCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'personal' && <PersonalScheduleTab />}
      {activeTab === 'meeting' && <MeetingScheduleTab />}
    </div>
  );
}
