'use client';

import { useTranslations } from 'next-intl';
import { IndexStoryListSectionLayout } from './IndexStoryListSectionLayout';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';

export const NewestStoryList = () => {
  const t = useTranslations('HomeStories');
  const { data: stories, isLoading } = useGetStoriesQuery({
    page: 1,
    limit: 6,
    sort: [{ orderBy: 'createdAt', order: 'DESC' }],
  });

  return (
    <IndexStoryListSectionLayout
      title={t('newest_stories')}
      stories={{ ...stories, data: stories?.data?.slice(0, 5) || [] }}
      isLoading={isLoading}
    />
  );
};
