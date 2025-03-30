'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import ExporeStory from '@/components/exploreStory/ExploreStory';
import { mergeClassnames } from '@/components/private/utils';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';

const Page = () => {
  const searchParams = useSearchParams();

  const topicIds = searchParams.get('topicIds'); // Get topicIds from the URL query string

  const {
    data: storiesPages,
    isLoading: loadingStories,
    refetch,
  } = useGetStoriesQuery({
    page: 1,
    limit: 5,
    topicIds: topicIds ? topicIds.split(',').map(Number) : undefined,
  });

  useEffect(() => {
    if (topicIds) {
      refetch();
    }
  }, [topicIds]);

  return (
    <div
      className={mergeClassnames(
        `flex min-h-screen flex-col items-center bg-neutral-98 pb-4 mt-[-5rem]`,
      )}
    >
      <div
        className={mergeClassnames(
          'flex flex-col gap-8 pt-[3rem] w-screen relative px-2',
          'xl:px-28',
        )}
      >
        <ExporeStory
          storiesPages={storiesPages?.data}
          isLoading={loadingStories}
        />
      </div>
    </div>
  );
};

export default Page;
