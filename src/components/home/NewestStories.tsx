'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import StoriesList from '@/components/stories/StoriesList';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';

const NewestStories = () => {
  const t = useTranslations('Home');

  const {
    data: storiesPages,
    isLoading: loadingStories,
    refetch: refetchStories,
  } = useGetStoriesQuery({
    page: 1,
    limit: 6,
    sortBy: 'createdAt',
  });

  return (
    <StoriesList
      title={t('newest_stories.title')}
      stories={storiesPages?.data}
      isLoading={loadingStories}
      hasNextPage={storiesPages?.hasNextPage}
      refetchStories={refetchStories}
      navigateToExplore
    />
  );
};

export default NewestStories;
