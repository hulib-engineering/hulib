'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ControlOverview } from './ControlOverview';
import LiberMyFavorite from './LiberMyFavorite';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import AboutPanel from '@/layouts/profile/AboutPanel';
import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';

const LIBER_OWN_TABS = [
  { value: 'about', label: 'about' },
  { value: 'stories', label: 'my_stories' },
  { value: 'favorite-list', label: 'my_favorite' },
] as const;

const LIBER_OTHERS_TABS = [
  { value: 'about', label: 'about' },
] as const;

type LiberProfileContentProps = {
  userDetail: any;
  notMe: boolean;
};

export default function LiberProfileContent({ userDetail, notMe }: LiberProfileContentProps) {
  const t = useTranslations('MyProfile');
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const tabs = notMe ? LIBER_OTHERS_TABS : LIBER_OWN_TABS;
  const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 'about');

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', currentTab);
    router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
  }, [currentPathname, currentTab, router, searchParams]);

  return (
    <ControlOverview
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      tabs={tabs.map(({ value, label }) => ({ value, label: t(label) }))}
    >
      {currentTab === 'about' && (
        <AboutPanel data={userDetail} editable={!notMe} />
      )}
      {currentTab === 'stories' && (
        <MyStoriesPanel
          topics={userDetail?.humanBookTopic}
          storyOwnerId={userDetail.id}
        />
      )}
      {currentTab === 'favorite-list' && <LiberMyFavorite />}
    </ControlOverview>
  );
}
