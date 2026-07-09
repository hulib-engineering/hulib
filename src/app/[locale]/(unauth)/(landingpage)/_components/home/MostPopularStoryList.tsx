'use client';

import { useTranslations } from 'next-intl';
import { IndexStoryListSectionLayout } from './IndexStoryListSectionLayout';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';

export const MostPopularStoryList = () => {
  const t = useTranslations('Home');
  const { data: stories, isLoading } = useGetStoriesQuery({
    page: 1,
    limit: 6,
    type: 'most-popular',
  });

  return (
    <IndexStoryListSectionLayout
      title={t('explore_stories.title')}
      stories={{ ...stories, data: stories?.data?.slice(0, 5) || [] }}
      isLoading={isLoading}
    />
  );
};
