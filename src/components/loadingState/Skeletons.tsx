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
    <div className="mx-auto w-full py-6 xl:py-8">
      <div className="flex flex-col gap-6 px-4 xl:gap-12 xl:px-0">
        {/* Back button */}
        <div className="size-10 animate-pulse rounded-lg bg-gray-200" />

        <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch xl:gap-8">
          {/* Left: flipbook + reviews — same height as real flipbook */}
          <div className="flex min-w-0 flex-1 flex-col gap-y-8">
            <div className="min-h-[440px] w-full animate-pulse rounded-xl bg-gray-200 xl:min-h-[600px]" />
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200" />
              <div className="h-16 w-full animate-pulse rounded-xl bg-gray-200" />
              <div className="h-24 w-full animate-pulse rounded-xl bg-gray-200" />
            </div>
          </div>

          {/* Right: side panel — 3 cards matching StorySidePanel structure */}
          <div className="flex w-full flex-col gap-y-5 xl:w-auto">
            {/* Card 1: cover + stats + share/like buttons */}
            <div className="flex w-full flex-col items-center gap-y-4 rounded-2xl bg-white px-4 py-6 shadow-sm">
              <div className="h-[340px] w-[226px] animate-pulse rounded-lg bg-gray-200" />
              <div className="flex w-full gap-4">
                <div className="h-4 w-12 animate-pulse rounded-md bg-gray-200" />
                <div className="h-4 w-12 animate-pulse rounded-md bg-gray-200" />
                <div className="h-4 w-12 animate-pulse rounded-md bg-gray-200" />
              </div>
              <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />
            </div>

            {/* Card 2: booking CTA */}
            <div className="flex w-full flex-col items-center gap-y-5 rounded-2xl bg-white p-5 shadow-sm">
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200" />
              <div className="h-3 w-1/2 animate-pulse rounded-md bg-gray-200" />
            </div>

            {/* Card 3: author info */}
            <div className="flex w-full flex-col gap-y-3 rounded-2xl bg-white p-5 shadow-sm">
              <div className="h-4 w-16 animate-pulse rounded-md bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="size-9 shrink-0 animate-pulse rounded-full bg-gray-200" />
                <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200" />
              </div>
              <div className="flex justify-between gap-2">
                <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { StoriesSkeleton, TopicChipsSkeleton, HuberCardListSkeleton, StoryDetailSkeleton };
