'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { LIBER_OTHERS_TABS, LIBER_OWN_TABS } from '../profile.contant';
import type { TUserDetail } from '../profile.type';
import { ControlOverview } from './ControlOverview';
import LiberMyFavorite from './LiberMyFavorite';
import LiberAboutPanel from './LiberAboutPanel';
import type { LearningType } from './type';
import useLiberProfileActions from './useLiberProfileActions';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import { Role } from '@/types/common';

type LiberProfileContentProps = {
  userDetail: TUserDetail;
  notMe: boolean;
};

export default function LiberProfileContent({ userDetail, notMe }: LiberProfileContentProps) {
  const t = useTranslations('MyProfile');
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const tabs = notMe ? LIBER_OTHERS_TABS : LIBER_OWN_TABS;
  const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 'about');
  const canEditOwnProfile = !notMe;
  const isHuber = userDetail.role?.id === Role.HUBER;

  const { data: topicsData } = useGetTopicsQuery({ limit: 100 });
  const {
    handleSaveText,
    handleSaveLearningEntry,
    handleSaveWorkEntry,
  } = useLiberProfileActions();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const tabValues = tabs.map(tab => tab.value);
    const nextTab = tabValues.includes(currentTab as any) ? currentTab : 'about';

    if (nextTab !== currentTab) {
      setCurrentTab(nextTab);
      return;
    }

    params.set('tab', nextTab);
    router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
  }, [currentPathname, currentTab, router, searchParams, tabs]);

  const liberData = {
    journey: (userDetail as any)?.bio,
    learningPath: (userDetail as any)?.educations?.map((e: any) => ({
      id: e.id,
      type: (e.type ?? 'university') as LearningType,
      name: e.major,
      organization: e.institution,
      startedAt: e.startedAt,
      endedAt: e.endedAt,
      isPublic: e.isPublic ?? false,
    })),
    works: (userDetail as any)?.works,
    topics: userDetail.humanBookTopic?.map(h => h.topic),
  };

  return (
    <ControlOverview
      className="p-2"
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      tabs={tabs.map(({ value, label }) => ({ value, label: t(label) }))}
    >
      {currentTab === 'about' && (
        <LiberAboutPanel
          data={liberData}
          availableTopics={topicsData?.data}
          editable={canEditOwnProfile}
          huberFieldsEditable={canEditOwnProfile}
          showTopics={isHuber}
          onSaveText={handleSaveText}
          onSaveLearningEntry={canEditOwnProfile ? handleSaveLearningEntry : undefined}
          onSaveWorkEntry={canEditOwnProfile ? handleSaveWorkEntry : undefined}
          onSaveTopics={undefined}
        />
      )}
      {currentTab === 'favorite-list' && <LiberMyFavorite />}
    </ControlOverview>
  );
}
