import React from 'react';

import { mergeClassnames } from '../private/utils';

const TopicsSkeleton = () => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
    <div key={index} className={mergeClassnames('flex h-10 w-28 items-center')}>
      <div className="animate-pulse relative h-full w-full rounded-2xl bg-neutral-90" />
    </div>
  ));
};

export default TopicsSkeleton;
