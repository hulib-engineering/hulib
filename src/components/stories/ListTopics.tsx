'use client';

import { uniqueId } from 'lodash';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

import { useGetTopicsQuery } from '@/libs/services/modules/topics';

import Topic from './Topic';
import TopicsSkeleton from './TopicsSkeleton';

interface Props {
  currentPathName?: 'explore-story' | 'home' | 'explore-huber';
}

const ListTopics = (props: Props) => {
  const { currentPathName = 'explore-story' } = props;
  const router = useRouter();
  const { topicIds } = useParams();
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    [],
  );

  const { data: topicsPages, isLoading } = useGetTopicsQuery();
  const t = useTranslations('ExporeStory');

  const topics = React.useMemo(() => {
    const all = { id: uniqueId(), name: t('all'), iconName: 'squares-four' };
    if (!topicsPages?.data) {
      return [all];
    }

    return [all, ...topicsPages.data];
  }, [t, topicsPages]);

  useEffect(() => {
    if (topicIds) {
      setSelectedCategories(
        Array.isArray(topicIds)
          ? topicIds.map(Number)
          : topicIds.split(',').map(Number),
      );
    }
  }, [topicIds]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      router.push(currentPathName);
    } else {
      router.push(
        `/${currentPathName}?topicIds=${selectedCategories.join(',')}`,
      );
    }
  }, [selectedCategories]);

  return (
    <div className="mt-6 flex flex-row flex-wrap gap-2">
      {isLoading ? (
        <TopicsSkeleton />
      ) : (
        (topics || []).map((topic) => (
          <Topic
            key={topic?.name}
            name={topic?.name}
            iconName={topic.iconName || 'brain'}
            isActive={
              topic?.name === 'All'
                ? null
                : selectedCategories.includes(topic.id)
            }
            onClick={() => {
              setSelectedCategories((prev) => {
                if (topic?.name === 'All') return prev;

                if (prev.includes(topic?.id)) {
                  return prev.filter((item: any) => item !== topic?.id);
                }
                return [...prev, topic?.id];
              });
            }}
          />
        ))
      )}
    </div>
  );
};

export default ListTopics;
