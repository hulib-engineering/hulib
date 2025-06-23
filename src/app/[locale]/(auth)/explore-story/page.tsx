'use client';

import { useSearchParams } from 'next/navigation';

import ExploreStory from '@/components/exploreStory/ExploreStory';

export default function Index() {
  const searchParams = useSearchParams();
  const topicIds = searchParams.get('topicIds'); // Get topicIds from the URL query string

  return (
    <div className="mx-auto w-full max-w-screen-sm px-4 lg:max-w-screen-2xl lg:px-28">
      <ExploreStory topicIds={topicIds} />
    </div>
  );
}
