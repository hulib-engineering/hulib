'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';

type TabDef = { readonly value: string; readonly label: string };

export function useProfileTab<T extends TabDef>(tabs: readonly T[], withTopics = false) {
  const t = useTranslations('MyProfile');
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab');

  const [currentTab, setCurrentTab] = useState<T['value']>(
    () => (tabParam && tabs.some(tab => tab.value === tabParam) ? tabParam : tabs[0]?.value ?? ''),
  );

  const { data: topicsData } = useGetTopicsQuery({ limit: 100 }, { skip: !withTopics });

  // Last `?tab=` seen, to tell a URL change (follow it) from a tab click (push it to the URL).
  const lastTabParam = useRef(tabParam);

  useEffect(() => {
    // Navigating to another tab of the profile already on screen (e.g. `?tab=personal_info&safety=1`) must switch tabs.
    if (tabParam !== lastTabParam.current) {
      lastTabParam.current = tabParam;
      if (tabParam && tabs.some(tab => tab.value === tabParam)) {
        setCurrentTab(tabParam);
        return;
      }
    }
    if (tabParam === currentTab) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', currentTab);
    router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
  }, [currentPathname, currentTab, router, searchParams, tabParam, tabs]);

  const translatedTabs = tabs.map(({ value, label }) => ({ value, label: t(label as any) }));

  return { currentTab, setCurrentTab: setCurrentTab as (tab: string) => void, topicsData, translatedTabs };
}
