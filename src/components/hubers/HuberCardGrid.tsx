import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import { HuberCard } from '@/components/hubers/HuberCard';
import type { Huber as THuber } from '@/libs/services/modules/huber/huberType';

type THuberCardGridProps = {
  items?: THuber[];
  className?: string;
};

const HuberCardGrid = ({ items, className }: THuberCardGridProps) => (
  <div
    className={mergeClassnames(
      'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4',
      className,
    )}
  >
    {items?.map(huber => (
      <HuberCard key={huber.id} {...huber} />
    ))}
  </div>
);

export { HuberCardGrid };
