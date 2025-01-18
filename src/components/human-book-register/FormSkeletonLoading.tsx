import React from 'react';

import { mergeClassnames } from '@/components/private/utils';

const FormSkeletonLoading = () => (
  <div
    className={mergeClassnames(
      'relative h-screen w-full mb-[10px] overflow-hidden border-neutral-90 bg-neutral-98 flex min-h-screen flex-col items-center justify-center pb-4 mt-[-5rem]',
      'after:content-[""] after:absolute after:w-full after:h-full after:top-0 after:left-0',
      'after:bg-[linear-gradient(110deg,_#fafafa_0%,_#fafafa_10%,_#fafafa80_50%,_#fafafa_90%,_#fafafa_100%)]',
      'after:animate-gradient-animation',
    )}
  >
    <div
      className={mergeClassnames(
        'relative flex h-full w-full flex-col gap-8 pt-[3.25rem]',
        'sm:w-[600px] sm:min-w-[600px] sm:gap-12',
      )}
    >
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="size-10 min-h-10 min-w-10 rounded-full bg-neutral-80" />
        <div className="h-[1px] w-full bg-neutral-80" />
        <div className="size-6 min-h-6 min-w-6 rounded-full bg-neutral-80" />
      </div>
      <div className="h-full w-full rounded-lg bg-neutral-80" />
    </div>
  </div>
);

export { FormSkeletonLoading };
