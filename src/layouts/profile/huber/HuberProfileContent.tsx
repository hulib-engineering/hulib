'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { mergeClassnames } from '@/components/core/private/utils';
import AboutPanel from '@/layouts/profile/AboutPanel';
import MyFavoritesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyFavoritesPanel';
import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';

const HUBER_OWN_TABS = [
  { value: 'about', label: 'about' },
  { value: 'stories', label: 'my_stories' },
  { value: 'favorite-list', label: 'my_favorite' },
] as const;

const HUBER_OTHERS_TABS = [
  { value: 'about', label: 'about' },
  { value: 'stories', label: 'my_stories' },
] as const;

type HuberProfileContentProps = {
  userDetail: any;
  notMe: boolean;
};

export default function HuberProfileContent({ userDetail, notMe }: HuberProfileContentProps) {
  const t = useTranslations('MyProfile');
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const tabs = notMe ? HUBER_OTHERS_TABS : HUBER_OWN_TABS;
  const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 'about');

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', currentTab);
    router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
  }, [currentPathname, currentTab, router, searchParams]);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="border-b border-neutral-90">
        <div className="flex items-center gap-6 px-4 lg:px-6">
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCurrentTab(value)}
              className={mergeClassnames(
                'border-b-2 py-3 text-sm font-medium transition-colors',
                currentTab === value
                  ? 'border-primary-60 text-primary-60'
                  : 'border-transparent text-neutral-40 hover:text-neutral-20',
              )}
            >
              {t(label)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {currentTab === 'about' && (
          <AboutPanel data={userDetail} editable={!notMe} />
        )}
        {currentTab === 'stories' && (
          <MyStoriesPanel
            topics={userDetail?.humanBookTopic}
            storyOwnerId={userDetail?.id}
            showOthers={notMe}
          />
        )}
        {currentTab === 'favorite-list' && <MyFavoritesPanel />}
      </div>
    </div>
  );
}
