import { uniqueId } from 'lodash';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useGetTopicsQuery } from '@/libs/services/modules/topics';

import Topic from './Topic';
import TopicsSkeleton from './TopicsSkeleton';

const ListTopics = () => {
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    [],
  );

  const { data: topicsPages, isLoading } = useGetTopicsQuery();
  const t = useTranslations('ExporeBooks');

  const topics = React.useMemo(() => {
    const all = { id: uniqueId(), name: t('all'), iconName: 'squares-four' };
    if (!topicsPages?.data) {
      return [all];
    }

    return [all, ...topicsPages.data];
  }, [t, topicsPages]);

  return (
    <div className="mt-6 flex flex-row flex-wrap gap-2">
      {isLoading ? (
        <TopicsSkeleton />
      ) : (
        topics.map((topic) => (
          <Topic
            key={topic?.id}
            name={topic?.name}
            iconName={topic.iconName || 'brain'}
            isActive={
              topic?.name === 'All'
                ? null
                : selectedCategories.includes(topic.id)
            }
            onClick={() =>
              setSelectedCategories((prev) => {
                if (topic?.name === 'All') return prev;

                if (prev.includes(topic?.id)) {
                  return prev.filter((item: any) => item !== topic?.id);
                }
                return [...prev, topic?.id];
              })
            }
          />
        ))
      )}
    </div>
  );
};

export default ListTopics;
