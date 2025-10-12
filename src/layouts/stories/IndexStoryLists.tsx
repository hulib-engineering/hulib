'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IndexStoryListSectionLayout } from '@/components/home/IndexStoryListCommonLayout';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';

const NewestStoryList = () => {
  const router = useRouter();

  const { data: stories, isLoading } = useGetStoriesQuery({
    page: 1,
    limit: 6,
    sort: [{ orderBy: 'createdAt', order: 'DESC' }],
  });

  return (
    <IndexStoryListSectionLayout
      title="Newest Stories"
      stories={{ ...stories, data: stories?.data?.slice(0, 5) || [] }}
      isLoading={isLoading}
      onSeeAllClick={() => router.push('/explore-story')}
    />
  );
};

const MostPopularStoryList = () => {
  const router = useRouter();

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
      onSeeAllClick={() => router.push('/explore-story')}
    />
  );
};

const StoryListByMostPopularTopics = () => {
  const router = useRouter();

  const { data: topics } = useGetTopicsQuery({ type: 'most-popular' });
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const { data: stories, isLoading } = useGetStoriesQuery({
    page: 1,
    limit: 9,
    topicsIds: [selectedTopicId],
  }, { skip: !selectedTopicId });

  useEffect(() => {
    if (topics?.data?.length) {
      setSelectedTopicId(topics?.data[0]?.id);
    }
  }, [topics]);

  return (
    <IndexStoryListSectionLayout
      title="Most popular topics"
      stories={{ ...stories, data: stories?.data?.slice(0, 5) || [] }}
      isLoading={isLoading}
      showFilter
      filters={topics?.data ?? []}
      selectedFilterId={selectedTopicId}
      onFilterChange={topicId => setSelectedTopicId(topicId as unknown as number)}
      onSeeAllClick={() => router.push('/explore-story')}
    />

  );
};

export { NewestStoryList, MostPopularStoryList, StoryListByMostPopularTopics };
