import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { preload } from 'react-dom';
import StoryPageClient from './StoryPageClient';
import { redirect } from '@/libs/i18nNavigation';

import { StoryDetailSkeleton } from '@/components/loadingState/Skeletons';
import { fetchStoryDetail } from '@/libs/services/server/stories';
import { PublishStatusEnum } from '@/libs/services/modules/stories/storiesType';

export const revalidate = 300;

type Props = {
  params: { id: string; locale: string };
};

export default async function StoryPage({ params }: Props) {
  const storyId = Number(params.id);
  const data = await fetchStoryDetail(storyId);

  if (!data) {
    return notFound();
  }

  const publishStatus = data.publishStatus as unknown as number;

  if (publishStatus === PublishStatusEnum.DELETED) {
    return notFound();
  }

  if (publishStatus !== PublishStatusEnum.PUBLISHED) {
    return redirect(`/explore-story/${storyId}/preview`);
  }

  if (data.cover?.path) {
    preload(data.cover.path, { as: 'image' });
  }

  return (
    <Suspense fallback={<StoryDetailSkeleton />}>
      <StoryPageClient initialData={data} storyId={storyId} />
    </Suspense>
  );
}
