'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { TUserDetail } from '../profile.type';
import { ControlOverview } from '../liber/ControlOverview';
import LiberAboutPanel from '../liber/LiberAboutPanel';
import type { LearningType } from '../liber/type';
import useLiberProfileActions from '../liber/useLiberProfileActions';
import { usePathname, useRouter } from '@/libs/i18nNavigation';

type HuberProfileContentProps = {
  userDetail: TUserDetail;
  notMe: boolean;
};

const HUBER_ABOUT_TABS = [
  { value: 'about', label: 'about' },
] as const;

export default function HuberProfileContent({ userDetail, notMe }: HuberProfileContentProps) {
  const t = useTranslations('MyProfile');
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const tabs = HUBER_ABOUT_TABS;
  const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 'about');
  const canEditOwnProfile = !notMe;
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

  const huberAboutData = {
    journey: (userDetail as any)?.bio,
    learningPath: (userDetail as any)?.educations?.map((education: any) => ({
      id: education.id,
      type: (education.type ?? 'university') as LearningType,
      name: education.major,
      organization: education.institution,
      startedAt: education.startedAt,
      endedAt: education.endedAt,
      isPublic: education.isPublic ?? false,
    })),
    works: (userDetail as any)?.works,
    topics: userDetail.humanBookTopic?.map(humanBookTopic => humanBookTopic.topic),
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
          data={huberAboutData}
          editable={canEditOwnProfile}
          huberFieldsEditable={canEditOwnProfile}
          showTopics
          labels={{
            journeyTitle: t('huber_about.journey_title'),
            journeyPlaceholder: t('huber_about.journey_placeholder'),
            learningPathTitle: t('huber_about.learning_path_title'),
            worksTitle: t('huber_about.works_title'),
            topicsTitle: t('huber_about.topics_title'),
          }}
          onSaveText={handleSaveText}
          onSaveLearningEntry={canEditOwnProfile ? handleSaveLearningEntry : undefined}
          onSaveWorkEntry={canEditOwnProfile ? handleSaveWorkEntry : undefined}
          onSaveTopics={undefined}
        />
      )}
    </ControlOverview>
  );
}
