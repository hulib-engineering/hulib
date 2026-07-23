'use client';

import { X } from '@phosphor-icons/react';

import type { Topic } from './type';
import { mergeClassnames } from '@/components/core/private/utils';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';

type TopicChipProps = {
  topic: Topic;
  removable?: boolean;
  onRemove?: (id: number) => void;
};

export type { TopicChipProps };

export default function TopicChip({ topic, removable, onRemove }: TopicChipProps) {
  return (
    <span
      className={mergeClassnames(
        'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium',
        getTopicBadgeClasses(topic.color),
      )}
    >
      {topic.name}
      {removable && (
        <button
          type="button"
          className="flex items-center"
          onClick={() => onRemove?.(topic.id)}
        >
          <X size={14} weight="bold" />
        </button>
      )}
    </span>
  );
}
