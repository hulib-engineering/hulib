import { notFound, redirect } from 'next/navigation';

import StoryPageClient from './StoryPageClient';
import { fetchStoryDetail } from '@/libs/services/server/stories';
import { StoryPublishStatus } from '@/libs/services/modules/stories/storiesType';

export default async function Index({ params }: { params: { id: string; locale: string } }) {
  const storyId = Number(params.id);
  const data = await fetchStoryDetail(storyId);

  if (!data) {
    return notFound();
  }

  if (data.publishStatus === StoryPublishStatus.DELETED) {
    return notFound();
  }

  if (data.publishStatus !== StoryPublishStatus.PUBLISHED) {
    return redirect(`/explore-story/${data.id}/preview`);
  }

  return <StoryPageClient initialData={data} storyId={storyId} />;
}
