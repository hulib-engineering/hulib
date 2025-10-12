'use client';

import React, { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

import { Chip } from '@/components/core/chip/Chip';
import IconButton from '@/components/core/iconButton/IconButton';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import { TopicChipsSkeleton } from '@/components/loadingState/Skeletons';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import type { Topic } from '@/libs/services/modules/topics/topicType';

type ITopicChipProps = WithChildren<{
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}>;

export const TopicChip = ({
  children,
  isActive = false,
  className,
  onClick,
}: ITopicChipProps) => (
  <Chip
    as="button"
    type="button"
    className={mergeClassnames(
      'h-8 min-w-0 shrink-0 overflow-visible whitespace-nowrap rounded-2xl py-1 px-2 lg:py-2',
      'text-xs font-medium leading-[14px] lg:text-sm lg:font-normal lg:leading-4',
      'hover:border hover:border-primary-80 hover:bg-primary-90 hover:text-primary-60',
      isActive ? 'border border-primary-80 bg-primary-90 text-primary-60' : 'bg-neutral-90 text-neutral-20',
      className,
    )}
    onClick={onClick}
  >
    {children}
  </Chip>
);

type IChipFilterProps = {
  scrollable?: boolean;
  values?: number[];
  onChange?: (values: number[]) => void;
};

export default function ChipFilter({
  scrollable = true,
  values = [],
  onChange,
}: IChipFilterProps) {
  const { data: topics, isLoading } = useGetTopicsQuery({ limit: 1000 });
  const allTopicIds = topics?.data.map((t: Topic) => t.id) ?? [];

  const isAllActive
    = values.length === 0 || values.length === allTopicIds.length;

  const [expanded, setExpanded] = useState(false);

  const handleItemClick = (id: number) => {
    if (onChange) {
      onChange(
        values.includes(id)
          ? values.filter(eachId => eachId !== id)
          : [...values, id],
      );
    }
  };
  const handleAllClick = () => {
    if (onChange) {
    // If already "all selected" → clear, otherwise select all
      if (values.length === allTopicIds.length) {
        onChange([]);
      } else {
        onChange(allTopicIds);
      }
    }
  };

  if (isLoading) {
    return <TopicChipsSkeleton />;
  }

  return (
    <div className="flex gap-4">
      <div className={mergeClassnames(
        'flex-1 flex w-full items-start content-start gap-2 transition-all duration-300 ease-in-out',
        scrollable
          ? 'flex-nowrap overflow-x-auto scrollbar-hide py-2'
          : expanded
            ? 'flex-wrap'
            : 'flex-wrap max-h-10 overflow-hidden',
      )}
      >
        {/* All tag chip */}
        <TopicChip isActive={isAllActive} className="min-w-[46px]" onClick={handleAllClick}>
          All
        </TopicChip>
        {topics?.data.map((topic: Topic) => (
          <TopicChip key={topic.id} isActive={values.includes(topic.id)} onClick={() => handleItemClick(topic.id)}>
            {topic.name}
          </TopicChip>
        ))}
      </div>
      {!scrollable && topics && topics?.data.length > 0 && (
        <IconButton
          variant="secondary"
          size="lg"
          className="shrink-0"
          onClick={() => setExpanded(prev => !prev)}
        >
          {expanded ? <CaretUp /> : <CaretDown />}
        </IconButton>
      )}
    </div>
  );
};
