'use client';

import { useSearchParams } from 'next/navigation';

import ExporeStory from '@/components/exploreStory/ExploreStory';
import { mergeClassnames } from '@/components/private/utils';

const Page = () => {
  const searchParams = useSearchParams();

  const topicIds = searchParams.get('topicIds'); // Get topicIds from the URL query string

  return (
    <div
      className={mergeClassnames(
        `flex min-h-screen flex-col items-center bg-neutral-98 pb-4 mt-[-5rem]`,
      )}
    >
      <div
        className={mergeClassnames(
          'flex flex-col gap-8 pt-[3rem] w-screen relative px-2',
          'md:px-28',
        )}
      >
        <ExporeStory topicIds={topicIds} />
      </div>
    </div>
  );
};

export default Page;
