import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

const StoriesSkeleton = () => (
  <div className="mx-auto size-full max-w-[1216px] rounded-lg">
    <div
      className={mergeClassnames(
        'grid grid-cols-1 gap-8',
        'md:grid-cols-3',
      )}
    >
      {[1, 2, 3, 4, 5, 6].map(index => (
        <div
          key={index}
          className={mergeClassnames(
            'flex w-full items-center gap-1 py-2 px-0',
            'md:px-2 md:py-2',
          )}
        >
          <div className="relative h-full w-1/2 rounded-2xl bg-neutral-90">
            <div className="absolute left-2 top-2 h-7 w-[5.5rem] rounded-full bg-neutral-80" />
          </div>
          <div className="relative h-full w-1/2 rounded-2xl bg-neutral-90 px-4 py-3">
            <div className="h-10 w-full rounded-sm bg-neutral-80" />
            <div className="mt-1 h-6 w-3/4 rounded-sm bg-neutral-80" />
            <div className="mt-3 h-4 w-1/2 rounded-sm bg-neutral-80" />
            <div className="mt-5 h-5 w-1/3 rounded-sm bg-neutral-80" />
            <div className="mt-2 h-20 w-full rounded-sm bg-neutral-80" />

            <div className="absolute bottom-6 right-0 flex w-full flex-row items-center gap-2 px-3">
              <div className=" mt-2 h-11 flex-[1px] rounded-full bg-neutral-80" />
              <div className=" mt-2 size-11 rounded-full bg-neutral-80" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TopicChipsSkeleton = () => (
  <div className="flex items-center gap-2">
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
      <div key={index} className="h-8 w-16 animate-pulse rounded-2xl bg-neutral-90" />
    ))}
  </div>
);

const HuberCardListSkeleton = () => {
  return (
    <div className="mx-auto size-full max-w-6xl">
      <div
        className={mergeClassnames(
          'grid grid-cols-1 gap-5',
          'sm:grid-cols-2',
          'lg:grid-cols-4',
        )}
      >
        {Array.from({ length: 8 }, (_, i) => i + 1).map(index => (
          <div key={index} className="flex size-full animate-pulse flex-col items-center gap-2 rounded-[32px]">
            <div className="aspect-square h-auto w-full rounded-[32px] bg-gray-300" />
            <div className="flex w-full flex-col gap-1">
              <div className="h-8 w-full rounded bg-gray-200"></div>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="h-4 w-8 rounded bg-gray-200"></div>
                  <div className="h-4 rounded bg-gray-200"></div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-8 rounded bg-gray-200"></div>
                  <div className="h-4 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center gap-2">
              <button
                type="button"
                disabled
                className="flex h-11 flex-1 animate-pulse items-center justify-center gap-2 rounded-full bg-gray-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StoryDetailSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-screen-sm px-4 lg:max-w-screen-2xl lg:px-28">
      <div className="flex flex-col gap-4 rounded-[20px] bg-white p-4 lg:flex-row">
        {/* Left Panel */}
        <div className="flex-1">
          <div className="h-72 w-full animate-pulse rounded-md bg-gray-300" />
        </div>

        {/* Center Panel */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="h-6 w-1/2 animate-pulse rounded-md bg-gray-300" />
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
        </div>

        {/* Right Panel */}
        <div className="flex-1">
          <div className="flex h-full flex-col gap-4 rounded-md bg-white p-4 shadow-md">
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-gray-300" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-gray-300" />
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { StoriesSkeleton, TopicChipsSkeleton, HuberCardListSkeleton, StoryDetailSkeleton };
