'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';

import { useGetSimilarStoriesQuery } from '@/libs/services/modules/stories';

import StoriesList from '../stories/StoriesList';

type SimilarStoryProps = {
  humanBookId: string;
  topicIds: string[] | number[];
};

const SimilarStory = ({ humanBookId, topicIds }: SimilarStoryProps) => {
  const t = useTranslations('ExploreStory');
  const {
    data: similarStoriesPages,
    isLoading,
    isFetching,
    // refetch: refetchStories,
  } = useGetSimilarStoriesQuery({
    page: 1,
    limit: 6,
    humanBookId,
    topicIds,
  });

  return (
    <StoriesList
      title={t('similar_stories')}
      stories={similarStoriesPages?.data}
      isLoading={isLoading || isFetching}
      hasNextPage={similarStoriesPages?.hasNextPage}
      // refetchStories={refetchStories}
    />
  );
};

export default SimilarStory;
