import { useCallback, useEffect, useState } from 'react';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';

import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import type { Topic } from '@/libs/services/modules/topics/topicType';

type FilterChipProps = {
  onChange: (topicId: number) => void;
};

export function FilterChip({ onChange }: FilterChipProps) {
  const { data: topics } = useGetTopicsQuery({ type: 'most-popular' });

  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  useEffect(() => {
    if (topics?.data?.length) {
      setSelectedTopicId(topics?.data[0]?.id ?? 0);
    }
  }, [topics]);

  const handleClick = useCallback((id: string | number) => {
    const numberId = id as number;
    setSelectedTopicId(numberId);
    onChange(numberId);
  }, [onChange]);

  if (topics?.data?.length === 0) {
    return;
  }
  return (
    <div className="scrollbar-hide flex w-full items-center gap-2 overflow-x-auto py-2">
      {topics?.data?.map((topic: Topic) => {
        const selectedClass = selectedTopicId === topic.id ? 'border border-primary-80 bg-primary-90 text-primary-60' : 'bg-neutral-90 text-neutral-20';
        return (
          <Chip
            key={topic.id}
            onClick={() => handleClick(topic.id)}
            className={mergeClassnames(
              'h-full min-w-0 shrink-0 overflow-visible whitespace-nowrap rounded-2xl py-1 px-2 lg:py-2',
              'text-xs font-medium leading-[14px] lg:text-sm lg:font-normal lg:leading-4',
              'hover:border hover:border-primary-80 hover:bg-primary-90 hover:text-primary-60',
              selectedClass,
            )}
          >
            {topic.name}
          </Chip>
        );
      })}
    </div>
  );
}
