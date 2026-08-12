'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';

type TabDef = { readonly value: string; readonly label: string };

export function useProfileTab<T extends TabDef>(tabs: readonly T[]) {
  const t = useTranslations('MyProfile');
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const [currentTab, setCurrentTab] = useState<T['value']>(
    () => searchParams.get('tab') ?? tabs[0]?.value ?? '',
  );

  const { data: topicsData } = useGetTopicsQuery({ limit: 100 });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', currentTab);
    router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
  }, [currentPathname, currentTab, router, searchParams]);

  const translatedTabs = tabs.map(({ value, label }) => ({ value, label: t(label as any) }));

  return { currentTab, setCurrentTab: setCurrentTab as (tab: string) => void, topicsData, translatedTabs };
}
