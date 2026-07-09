'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IndexStoryListSectionLayout } from './IndexStoryListSectionLayout';
import { FilterChip } from './FilterChip';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';

export const StoryListByMostPopularTopics = () => {
  const t = useTranslations('Home');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const { data: stories, isLoading } = useGetStoriesQuery({
    page: 1,
    limit: 9,
    topicsIds: [selectedTopicId],
  }, { skip: !selectedTopicId });

  const onChangeSelectedTopic = useCallback((selectedTopic: number) => {
    setSelectedTopicId(selectedTopic);
  }, []);

  return (
    <IndexStoryListSectionLayout
      title={t('explore_stories.card.text1')}
      stories={{ ...stories, data: stories?.data?.slice(0, 5) || [] }}
      isLoading={isLoading}
      showFilter
      filterComponent={(
        <FilterChip onChange={onChangeSelectedTopic} />
      )}
    />
  );
};
