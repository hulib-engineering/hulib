'use client';

import { mergeClassnames } from '@/components/core/private/utils';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import type { Topic } from '@/libs/services/modules/topics/topicType';

type TopicBadgeProps = {
  topic: Pick<Topic, 'name' | 'color' | 'status'>;
  className?: string;
};

const TopicBadge = ({ topic, className }: TopicBadgeProps) => (
  <span
    className={mergeClassnames(
      'inline-flex max-w-full items-center justify-center rounded-full border',
      'px-4 py-3 font-medium leading-5',
      getTopicBadgeClasses(topic.color),
      className,
    )}
  >
    <span className="truncate">{topic.name}</span>
  </span>
);

export default TopicBadge;
