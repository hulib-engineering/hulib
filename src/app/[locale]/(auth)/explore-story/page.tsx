'use client';

import { useSearchParams } from 'next/navigation';

import ExploreStory from '@/components/exploreStory/ExploreStory';

export default function Index() {
  const searchParams = useSearchParams();
  const topicIds = searchParams.get('topicIds'); // Get topicIds from the URL query string

  return <ExploreStory topicIds={topicIds} />;
}
