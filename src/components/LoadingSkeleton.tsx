import React from 'react';

import { mergeClassnames } from '@/components/private/utils';

const LoadingSkeleton = () => (
  <div
    className={mergeClassnames(
      'relative h-full w-full mb-[10px] overflow-hidden border-neutral-90 bg-neutral-98 p-4',
      'after:content-[""] after:absolute after:w-full after:h-full after:top-0 after:left-0',
      'after:bg-[linear-gradient(110deg,_#fafafa_0%,_#fafafa_10%,_#fafafa80_50%,_#fafafa_90%,_#fafafa_100%)]',
      'after:animate-gradient-animation',
    )}
  >
    <div className="relative size-full">
      <div className="size-12 rounded-full bg-neutral-80" />
      <div className="absolute left-[58px] top-[11px] h-[10px] w-[100px] bg-neutral-80" />
      <div className="absolute left-[58px] top-[34px] h-[10px] w-[150px] bg-neutral-80" />
      <div className="absolute left-0 top-[57px] h-[10px] w-full bg-neutral-80" />
      <div className="absolute left-0 top-[80px] h-[10px] w-11/12 bg-neutral-80" />
    </div>
  </div>
);

export { LoadingSkeleton };
