'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

import Topic from './Topic';
import TopicsSkeleton from './TopicsSkeleton';
import { useTopicsWithAll } from '@/libs/hooks';
import type { Topic as TopicType } from '@/libs/services/modules/topics/topicType';

type Props = {
  currentPathName?: 'explore-story' | 'home' | 'explore-huber' | 'profile';
};

const ListTopics = (props: Props) => {
  const { currentPathName = 'explore-story' } = props;
  const router = useRouter();
  const { topicIds } = useParams();
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    [],
  );

  const t = useTranslations('ExploreStory');
  const { topics, isLoading } = useTopicsWithAll(t('all'));

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
  }, [selectedCategories, currentPathName, router]);

  return (
    <div className="mt-6 flex flex-row flex-wrap gap-2">
      {isLoading
        ? (
            <TopicsSkeleton />
          )
        : (
            (topics || []).map((topic: TopicType) => (
              <Topic
                key={topic?.name}
                name={topic?.name}
                isActive={
                  topic?.name === t('all')
                    ? null
                    : selectedCategories.includes(topic.id)
                }
                onClick={() => {
                  setSelectedCategories((prev) => {
                    if (topic?.name === t('all')) {
                      return [];
                    }

                    if (prev.includes(topic?.id)) {
                      return prev.filter((item: number) => item !== topic?.id);
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
