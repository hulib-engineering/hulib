'use client';

import { useSearchParams } from 'next/navigation';

import ExploreStory from '@/components/exploreStory/ExporeStory';

export default function Index() {
  const searchParams = useSearchParams();
  const topicIds = searchParams.get('topicIds'); // Get topicIds from the URL query string

  return (
    <div className="px-28 py-12">
      <ExploreStory topicIds={topicIds} />
    </div>
  );
}
