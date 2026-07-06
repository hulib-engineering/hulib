'use client';

import { IndexStoryListSectionLayout } from './IndexStoryListSectionLayout';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';

export const MostPopularStoryList = () => {
  const { data: stories, isLoading } = useGetStoriesQuery({
    page: 1,
    limit: 6,
    type: 'most-popular',
  });

  return (
    <IndexStoryListSectionLayout
      title="Most popular Stories"
      stories={{ ...stories, data: stories?.data?.slice(0, 5) || [] }}
      isLoading={isLoading}
    />
  );
};
